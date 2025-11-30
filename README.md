# Lemnity

## 📦 Установка и настройка

### 1. Базовое ПО
Для работы проекта необходимо установить [Docker](https://docs.docker.com/compose/install/), [pnpm](https://pnpm.io/installation) и [PostgreSQL](https://www.postgresql.org/download/)

### 2. Переменные окружения

За `.env` файлами обращайтесь к коллегам

Содержимое `.env`:

```env
# Docker Configuration
COMPOSE_PROJECT_NAME=app

# Database Configuration
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=db
DATABASE_URL=postgresql://user:password@postgres:5432/db

# Server Configuration
NODE_ENV=development
JWT_SECRET="super-mega-secret-key"
PORT=3000

# Client Configuration
API_URL=http://localhost:3000/api

```

Содержимое `projects/server/.env`:

```env
NODE_ENV=development

# Server congigs
PORT=3000
FRONTEND_URL=http://localhost:5173

# PostgreSQL configs
DATABASE_URL=postgresql://user:password@localhost:5432/db
JWT_SECRET="super-mega-secret-key"

# Mail service configs
MAIL_HOST=smtp.msndr.net
MAIL_PORT=465
#25 или 587 — для соединения без шифрования или с использованием STARTTLS
#465 — в случае защищенного шифрованного соединения SSL/TLS
MAIL_USER=user
MAIL_PASSWORD=password
MAIL_FROM="Lemnity <no-reply@lemnity.ru>"
MAIL_SEND_TIMEOUT_MS=30000
PASSWORD_RESET_TOKEN_TTL_MINUTES=15
PASSWORD_RESET_URL_PATH=/reset-password
```

### 3. Установите зависимости, выполнив команду

```bash
pnpm install
```

### 4. Настройка базы данных

Для автоматического создания и запуска базы выполните
```
pnpm docker:db
```
**Можно развернуть БД локально(ручками), если не хочется каждый раз запускать докер, но тогда впишите реквизиты своей БД в .env файлы**

### 5. Запуск проекта в режиме разработки

```bash
# Запустить и клиент, и сервер
pnpm dev

# Или можно запустить только клиент
pnpm dev:client

# Или только сервер (если, например, хочется запустить в разных терминалах)
pnpm dev:server
```

### Линтинг и форматирование

```bash
# Весь проект
pnpm --recursive run lint
pnpm format                 # Проверка форматирования
pnpm format:fix             # Исправление форматирования

# Только клиент
pnpm --filter client run lint
pnpm --filter client run format:check
pnpm --filter client run format:fix

# Только сервер
pnpm --filter server run lint
pnpm --filter server run format:fix
```

### Сборка проекта для продакшена

```bash
# Собрать все проекты
pnpm build

# Или по отдельности
pnpm build:client
pnpm build:server
```

### Управление зависимостями

```bash
# В клиент
pnpm --filter client add new-package

# В сервер
pnpm --filter server add new-package

# В корень (общая зависимость)
pnpm add -w new-package
```

### Работа с базой

**Примечание:** В проекте реализована разделённая Prisma-схема:

- `projects/server/prisma/schema/schema.prisma` - основная конфигурация
- `projects/server/prisma/schema/models/users.prisma` - модель пользователей
- `projects/server/prisma/schema/models/projects.prisma` - модель проектов
- `etc` - и так далее

Основные команды для работы с Prisma:

```bash
# Открыть Prisma Studio - веб-интерфейс для просмотра и редактирования данных в базе
pnpm --filter server exec npx prisma studio

# Сгенерировать Prisma Client (сгенерируется TypeScript клиент на основе схемы) - обязательно после изменения схемы
pnpm --filter server exec npx prisma generate

# Получить схему из существующей БД (обновятся файлы схемы в проекте)
pnpm --filter server exec npx prisma db pull

# Применить схему к БД (создать/обновить таблицы)
pnpm --filter server exec npx prisma db push

# Создать новую миграцию на основе изменений схемы (рекомендуется для продакшена)
pnpm --filter server exec npx prisma migrate dev --name init

# Применить существующие миграции к БД
pnpm --filter server exec npx prisma migrate deploy

# Сбросить БД и применить все миграции заново
pnpm --filter server exec npx prisma migrate reset
или
docker exec server pnpm --filter @lemnity/database exec prisma migrate reset
```

**Выполнение команд Prisma в Docker:**

Если проект запущен в Docker, команды Prisma нужно выполнять внутри контейнера:

```bash
# Сбросить БД и применить все миграции заново (в Docker)
docker exec server pnpm --filter server exec npx prisma migrate reset

# Другие команды Prisma в Docker (примеры):
docker exec server pnpm --filter server exec npx prisma migrate dev --name migration_name
docker exec server pnpm --filter server exec npx prisma db push
docker exec server pnpm --filter server exec npx prisma generate
docker exec server pnpm --filter server exec npx prisma studio
```

## 🛠️ Технологии

- **Frontend**: React + TypeScript + Vite + Tailwind CSS + Zustand + Axios
- **Backend**: NestJS + TypeScript + Prisma
- **Database**: PostgreSQL
- **Package Manager**: pnpm workspaces
- **Linting**: ESLint + Prettier

## 🛠️ Рекомендуемые плагины для IDE

Для максимального комфорта разработки установите в **Cursor/VS Code**:

- **Prisma** - подсветка синтаксиса и автодополнение для `.prisma`
- **Tailwind CSS** - автодополнение CSS классов
- **ESLint** - проверка кода
- **Prettier** - автоматическое форматирование


## 🚀 Развертывание

**Структура монорепо:**

```
root/
├── projects/
│   ├── client/          # React приложение
│   ├── server/          # NestJS сервер
│   └── nginx/           # Nginx конфигурация
├── packages/             # Общие пакеты
└── docker-compose.yml    # Docker конфигурация
```

### 1. Структура для развертывания

```
dist/
├── client/           # Собранный React (HTML, CSS, JS)
└── server/           # Собранный NestJS (main.js)
```

### 2. Переменные окружения для продакшена

#### Для Docker Compose (.env)

```env
# PostgreSQL
POSTGRES_USER=user
POSTGRES_PASSWORD=strong-production-password
POSTGRES_DB=db

# Примечание: Prisma внутри контейнера не увидит БД через container_name postgres_db, используйте localhost
DATABASE_URL=postgresql://user:strong-production-password@localhost:5432/db

# JWT секрет (минимум 32 символа)
JWT_SECRET=very-long-random-secret-key-change-in-production

# Окружение
NODE_ENV=production

# Порт сервера
PORT=3000

# API URL для клиента
API_URL=http://localhost:3000
```

#### Для ручного запуска

```env
# projects/server/.env.production
NODE_ENV=production
DATABASE_URL="postgresql://user:password@host:5432/db"
JWT_SECRET="your-production-secret"
PORT=3000
```

### 3. Запуск в продакшене

#### Вариант 1: Docker Compose (рекомендуется)

**Для разработки:**

```bash
# Запустить все сервисы в режиме разработки
docker compose up -d

# Проверить статус
docker compose ps

# Посмотреть логи
docker compose logs -f
```

**Для продакшена:**

```bash
# Создать файл .env с продакшн настройками
cp .env.example .env

# Отредактировать .env для продакшена
# NODE_ENV=production
# POSTGRES_PASSWORD=strong-production-password
# JWT_SECRET=very-long-random-secret-key

# Запустить все сервисы в продакшн режиме
docker compose -f docker-compose.prod.yml up -d

# Проверить статус
docker compose -f docker-compose.prod.yml ps

# Посмотреть логи
docker compose -f docker-compose.prod.yml logs -f
```

#### Вариант 2: Ручной запуск

```bash
# Сборка проекта
pnpm build

# Запуск сервера
pnpm start

# Или напрямую Node.js
node projects/server/dist/main.js

# Клиент (статический build)
# Файлы уже готовы в projects/client/dist/
```

### 4. Проверка работоспособности

```bash
# Проверить PostgreSQL
docker exec -it postgres_db psql -U user -d db -c "SELECT version();"

# Проверить API сервер
curl http://localhost:3000/health

# Проверить React приложение
curl http://localhost:5173

# Проверить Nginx
curl -I http://localhost:80
```

### 5. Мониторинг и логирование

```bash
# Посмотреть логи всех сервисов
docker compose logs

# Логи конкретного сервиса
docker compose logs server
docker compose logs postgres
docker compose logs nginx

# Логи в реальном времени
docker compose logs -f

# Статистика контейнеров
docker stats

# Проверить использование ресурсов
docker system df
```

## 📝 Настройка для нового проекта

### Обновление имен пакетов

```bash
# Измените в package.json файлах:
# Корень: "name": "your-project-name"
# Client: "name": "your-project-client"
# Server: "name": "your-project-server"
```

## 📚 Инструкции

- [Добавление нового типа виджета](docs/instructions/adding-widget.md)
- [Добавление нового поля](docs/instructions/add-field-tutorial.md)

## 📊 Доступные скрипты

| Скрипт           | Описание                              |
| ---------------- | ------------------------------------- |
| `dev`            | Запуск клиента и сервера одновременно |
| `dev:client`     | Запуск только клиента                 |
| `dev:server`     | Запуск только сервера                 |
| `build`          | Сборка всех проектов                  |
| `start`          | Запуск сервера                        |
| `install`        | Установка всех зависимостей           |
| `install:client` | Установка зависимостей клиента        |
| `install:server` | Установка зависимостей сервера        |
| `install:clean`  | Полная очистка и переустановка        |
