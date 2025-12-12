import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClickHouseClient, createClient } from '@clickhouse/client';
import { CollectedEvent } from '../events/events.types';
import { StatsFilterDto } from '@lemnity/nest-common';

@Injectable()
export class ClickhouseService implements OnModuleInit {
  private client!: ClickHouseClient;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    this.client = createClient({
      // ClickHouse JS client теперь ожидает url (host депрекейтят)
      url: this.configService.get<string>('clickhouse.url'),
      username: this.configService.get<string>('clickhouse.user'),
      password: this.configService.get<string>('clickhouse.password'),
      // Настройки сервера передаются через clickhouse_settings
      clickhouse_settings: {
        // Нужен для типов JSON в ClickHouse
        allow_experimental_json_type: 1,
      },
    });

    const database = this.configService.get<string>('clickhouse.database');
    const table = this.configService.get<string>('clickhouse.eventsTable');

    await this.client.command({
      query: `
        CREATE DATABASE IF NOT EXISTS ${database};
      `,
    });

    await this.client.command({
      query: `
        CREATE TABLE IF NOT EXISTS ${database}.${table} (
          event_time     DateTime DEFAULT now(),
          widget_id      String,
          project_id     String,
          session_id     String,
          event_name     String,
          user_id        String,
          url            String,
          referrer       String,
          user_agent     String,
          ip             String,
          payload        JSON
        )
        ENGINE = MergeTree
        ORDER BY (event_time, widget_id)
      `,
    });
  }

  async insertEvents(events: CollectedEvent[]) {
    const database = this.configService.get<string>('clickhouse.database');
    const table = this.configService.get<string>('clickhouse.eventsTable');

    if (!events.length) return;

    await this.client.insert({
      table: `${database}.${table}`,
      values: events.map((event) => ({
        event_time: event.event_time ?? new Date(),
        widget_id: event.widget_id ?? '',
        project_id: event.project_id ?? '',
        session_id: event.session_id ?? '',
        event_name: event.event_name ?? '',
        user_id: event.user_id ?? '',
        url: event.url ?? '',
        referrer: event.referrer ?? '',
        user_agent: event.user_agent ?? '',
        ip: event.ip ?? '',
        payload: event.payload ?? {},
      })),
      format: 'JSONEachRow',
    });
  }

  async summary(filter: StatsFilterDto) {
    const { query, params } = this.buildFilters(filter);
    const database = this.configService.get<string>('clickhouse.database');
    const table = this.configService.get<string>('clickhouse.eventsTable');

    const summary = await this.client.query({
      query: `
        SELECT count() AS events
        FROM ${database}.${table}
        WHERE ${query}
      `,
      format: 'JSONEachRow',
      query_params: params,
    });
    const rows = await summary.json<{ events: number }[]>();
    return rows[0] ?? { events: 0 };
  }

  async timeseries(filter: StatsFilterDto) {
    const { query, params } = this.buildFilters(filter);
    const granularity = filter.granularity ?? 'day';
    const database = this.configService.get<string>('clickhouse.database');
    const table = this.configService.get<string>('clickhouse.eventsTable');

    const data = await this.client.query({
      query: `
        SELECT date_trunc('${granularity}', event_time) AS bucket, count() AS events
        FROM ${database}.${table}
        WHERE ${query}
        GROUP BY bucket
        ORDER BY bucket
      `,
      format: 'JSONEachRow',
      query_params: params,
    });
    return data.json<{ bucket: string; events: number }[]>();
  }

  async events(filter: StatsFilterDto) {
    const { query, params } = this.buildFilters(filter);
    const database = this.configService.get<string>('clickhouse.database');
    const table = this.configService.get<string>('clickhouse.eventsTable');
    const limit = filter.limit ?? 500;
    const offset = filter.offset ?? 0;

    const result = await this.client.query({
      query: `
        SELECT event_time, widget_id, project_id, session_id, event_name, user_id, url, referrer, user_agent, ip, payload
        FROM ${database}.${table}
        WHERE ${query}
        ORDER BY event_time DESC
        LIMIT ${limit} OFFSET ${offset}
      `,
      format: 'JSONEachRow',
      query_params: params,
    });
    return result.json<CollectedEvent[]>();
  }

  private buildFilters(filter: StatsFilterDto) {
    const clauses = ['1 = 1'];
    const params: Record<string, unknown> = {};

    clauses.push('widget_id = {widget_id:String}');
    params.widget_id = filter.widget_id;
    if (filter.project_id) {
      clauses.push('project_id = {project_id:String}');
      params.project_id = filter.project_id;
    }
    if (filter.event_name) {
      clauses.push('event_name = {event_name:String}');
      params.event_name = filter.event_name;
    }
    if (filter.url) {
      clauses.push('url = {url:String}');
      params.url = filter.url;
    }
    if (filter.referrer) {
      clauses.push('referrer = {referrer:String}');
      params.referrer = filter.referrer;
    }
    if (filter.session_id) {
      clauses.push('session_id = {session_id:String}');
      params.session_id = filter.session_id;
    }
    if (filter.from) {
      clauses.push('event_time >= parseDateTimeBestEffort({from:String})');
      params.from = filter.from;
    }
    if (filter.to) {
      clauses.push('event_time <= parseDateTimeBestEffort({to:String})');
      params.to = filter.to;
    }
    return { query: clauses.join(' AND '), params };
  }
}
