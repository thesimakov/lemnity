FROM node:20.19.0-alpine

WORKDIR /collector

RUN npm install -g pnpm@10.21.0

# Workspace files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages ./packages
COPY projects/collector/package*.json projects/collector/

RUN pnpm --filter collector... install --frozen-lockfile

COPY projects/collector ./projects/collector

RUN pnpm --filter collector run build

EXPOSE 4000

CMD ["pnpm", "--filter", "collector", "run", "start"]
