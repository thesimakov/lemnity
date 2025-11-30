# Этап сборки - используем стабильную LTS версию Node 20.19.0
FROM node:20.19.0-alpine AS builder

WORKDIR /client

# Устанавливаем pnpm (версия из проекта)
RUN npm install -g pnpm@10.21.0

# Копируем конфигурации workspace и lockfile
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages ./packages
# Копируем package.json клиента, чтобы pnpm знала о зависимостях
COPY projects/client/package*.json projects/client/

# Устанавливаем зависимости только для клиента с зафиксированным lockfile
RUN pnpm install --filter client --frozen-lockfile

# Копируем исходный код клиента
COPY projects/client ./projects/client

# Собираем клиент
RUN pnpm --filter client run build

# Этап продакшена - используем стабильную версию Nginx 1.25.4
FROM nginx:1.25.4-alpine

# Копируем собранное приложение
COPY --from=builder /client/projects/client/dist /usr/share/nginx/html

# Открываем порт
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]
