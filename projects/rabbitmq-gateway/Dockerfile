FROM node:20.19.0-alpine

WORKDIR /gateway

RUN npm install -g pnpm@10.21.0

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY projects/rabbitmq-gateway/package*.json projects/rabbitmq-gateway/

RUN pnpm --filter rabbitmq-gateway install --frozen-lockfile

COPY projects/rabbitmq-gateway ./projects/rabbitmq-gateway

RUN pnpm --filter rabbitmq-gateway run build

EXPOSE 4010

CMD ["pnpm", "--filter", "rabbitmq-gateway", "run", "start"]
