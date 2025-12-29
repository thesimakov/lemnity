import * as http from 'node:http';
import type * as amqp from 'amqplib';
import type { GatewayState } from './state';
import { toSubscriptionPublicInfo } from './state';
import type { PublishBody, SubscriptionCreateBody } from './types';
import type { GatewayConfig } from './config';
import { bufferPublish, flushOutbox, sendToRabbit } from './outbox';

function readJson(req: http.IncomingMessage) {
  return new Promise<unknown>((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8').trim();
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function writeJson(res: http.ServerResponse, status: number, body: unknown) {
  const payload = Buffer.from(JSON.stringify(body));
  res.statusCode = status;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('content-length', String(payload.length));
  res.end(payload);
}

export function createHttpServer(opts: {
  config: Pick<GatewayConfig, 'defaultQueue' | 'defaultRoutingKey' | 'maxOutboxSize'>;
  state: Pick<GatewayState, 'channel' | 'outbox' | 'outboxDropped' | 'lastError' | 'subscriptions'>;
  tryConnect: () => Promise<void>;
  safeClose: () => Promise<void>;
  scheduleReconnect: () => Promise<void>;
  onError: (err: unknown) => void;
  subscriptions: {
    create: (body: SubscriptionCreateBody) => Promise<{ id: string }>;
    remove: (id: string) => Promise<boolean>;
  };
}) {
  const { config, state, tryConnect, safeClose, scheduleReconnect, onError, subscriptions } = opts;

  const server = http.createServer(async (req, res) => {
    try {
      if (!req.url) return writeJson(res, 404, { ok: false });
      const url = new URL(req.url, 'http://localhost');

      if (req.method === 'GET' && url.pathname === '/healthz') {
        return writeJson(res, 200, {
          ok: true,
          rabbitmq: {
            connected: Boolean(state.channel),
            outboxSize: state.outbox.length,
            outboxDropped: state.outboxDropped,
            lastError: state.lastError,
          },
          subscriptions: {
            count: Object.keys(state.subscriptions).length,
          },
        });
      }

      if (req.method === 'GET' && url.pathname === '/subscriptions') {
        const items = Object.values(state.subscriptions).map(toSubscriptionPublicInfo);
        return writeJson(res, 200, { ok: true, subscriptions: items });
      }

      if (req.method === 'POST' && url.pathname === '/subscriptions') {
        const body = (await readJson(req)) as Partial<SubscriptionCreateBody>;
        const created = await subscriptions.create(body as SubscriptionCreateBody);
        return writeJson(res, 201, { ok: true, id: created.id });
      }

      if (req.method === 'DELETE' && url.pathname.startsWith('/subscriptions/')) {
        const id = url.pathname.split('/')[2] ?? '';
        if (!id) return writeJson(res, 400, { ok: false, error: 'id is required' });
        const removed = await subscriptions.remove(id);
        return writeJson(res, removed ? 200 : 404, { ok: removed });
      }

      if (req.method === 'POST' && url.pathname === '/publish') {
        const body = (await readJson(req)) as Partial<PublishBody>;
        const message = body?.message;
        if (typeof message === 'undefined') {
          return writeJson(res, 400, { ok: false, error: 'message is required' });
        }

        const publishBody: PublishBody = {
          message,
          queue: body.queue,
          exchange: body.exchange,
          routingKey: body.routingKey,
          persistent: body.persistent,
          bufferWhenUnavailable: body.bufferWhenUnavailable,
        };

        await tryConnect();
        const ch = state.channel;
        if (!ch) {
          if (publishBody.bufferWhenUnavailable) {
            const accepted = bufferPublish({ maxOutboxSize: config.maxOutboxSize }, state, publishBody);
            if (accepted) void scheduleReconnect();
            return writeJson(res, accepted ? 202 : 503, { ok: accepted, buffered: accepted });
          }
          return writeJson(res, 503, { ok: false });
        }

        try {
          const ok = await sendToRabbit(
            { defaultQueue: config.defaultQueue, defaultRoutingKey: config.defaultRoutingKey },
            ch as amqp.Channel,
            publishBody,
          );
          await flushOutbox(
            { defaultQueue: config.defaultQueue, defaultRoutingKey: config.defaultRoutingKey },
            state,
            {
              onError,
              onSendError: async () => {
                await safeClose();
                void scheduleReconnect();
              },
            },
          );
          return writeJson(res, ok ? 202 : 503, { ok });
        } catch (err) {
          onError(err);
          await safeClose();
          if (publishBody.bufferWhenUnavailable) {
            const accepted = bufferPublish({ maxOutboxSize: config.maxOutboxSize }, state, publishBody);
            if (accepted) void scheduleReconnect();
            return writeJson(res, accepted ? 202 : 503, { ok: accepted, buffered: accepted });
          }
          return writeJson(res, 503, { ok: false });
        }
      }

      return writeJson(res, 404, { ok: false });
    } catch (err) {
      onError(err);
      return writeJson(res, 500, { ok: false });
    }
  });

  return server;
}
