#!/usr/bin/env bash
# Бэкап базы и загруженных файлов pm52.ru. Запускается таймером
# prom-site-backup.timer раз в сутки и вручную перед каждым обновлением.
#
# База копируется через sqlite3 .backup, а не cp: приложение в этот момент
# работает, и простое копирование файла посреди записи даёт битую копию.
# WAL-хвосты (-wal, -shm) при этом не нужны — .backup собирает всё в один файл.
#
# Копии лежат на том же сервере, поэтому от гибели сервера не спасают —
# раз в месяц скачивать последнюю к себе (см. deploy/README.md).

set -euo pipefail

# В копии базы заявки с телефонами и почтой — читать её может только root
umask 077

APP_DIR=/srv/prom-site
BACKUP_DIR=/var/backups/prom-site
KEEP_DAYS=14

stamp=$(date +%Y-%m-%d_%H%M)
target="$BACKUP_DIR/$stamp"
mkdir -p "$target"
chmod 700 "$BACKUP_DIR"

sqlite3 "$APP_DIR/prom-site.db" ".backup '$target/prom-site.db'"
sqlite3 "$target/prom-site.db" 'PRAGMA integrity_check;' | grep -qx ok

tar -czf "$target/media.tar.gz" -C "$APP_DIR" media

# .env — в нём PAYLOAD_SECRET: без того же секрета пароли админов из копии
# базы не подойдут. Права только у root
install -m 600 "$APP_DIR/.env" "$target/env"

find "$BACKUP_DIR" -mindepth 1 -maxdepth 1 -type d -mtime +"$KEEP_DAYS" -exec rm -rf {} +

echo "Бэкап готов: $target ($(du -sh "$target" | cut -f1))"
