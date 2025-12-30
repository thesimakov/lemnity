# Production Dockerfile для NestJS сервера
FROM node:20.19.0-alpine

# Устанавливаем рабочую директорию
WORKDIR /server

# Устанавливаем pnpm глобально
RUN npm install -g pnpm@10.21.0

# Копируем конфигурацию workspace и lockfile
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages ./packages
# Копируем package.json самого сервера, чтобы pnpm знала о зависимостях
COPY projects/server/package*.json projects/server/

# Устанавливаем зависимости для server и его workspace-зависимостей
RUN pnpm --filter server... install --frozen-lockfile

# Копируем исходный код сервера
COPY projects/server ./projects/server

# Собираем приложение
RUN pnpm --filter server run build

# Открываем порт
EXPOSE 3000

# Запускаем приложение
CMD ["pnpm", "--filter", "server", "run", "start:prod"]
