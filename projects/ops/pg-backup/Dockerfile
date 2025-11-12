FROM postgres:16-alpine

RUN apk add --no-cache bash curl ca-certificates tzdata python3 py3-pip \
  && pip install --no-cache-dir awscli \
  && curl -fsSL -o /usr/local/bin/supercronic https://github.com/aptible/supercronic/releases/latest/download/supercronic-linux-amd64 \
  && chmod +x /usr/local/bin/supercronic

ENV TZ=UTC

WORKDIR /backup
COPY backup.sh /backup/backup.sh
COPY pg_backup.cron /backup/pg_backup.cron
RUN chmod +x /backup/backup.sh

ENTRYPOINT ["/usr/local/bin/supercronic", "/backup/pg_backup.cron"]


