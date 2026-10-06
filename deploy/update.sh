#!/usr/bin/env bash
# Выкатить свежий main на сервер. Запускать от root: sudo /srv/prom-site/deploy/update.sh
#
# Сайт на время сборки останавливается (3–5 минут, nginx отдаёт 502).
# Собирать «на живую» нельзя: next build первым делом чистит .next, и
# работающий сервер отдавал бы ошибки всё время сборки. Обновлять вечером.
#
# Сборка поднимает Payload и сама прогоняет непримёненные миграции
# (prodMigrations), отдельный шаг migrate не нужен. Поэтому сначала бэкап.

set -euo pipefail

APP_DIR=/srv/prom-site
as_app() { sudo -u prom -H bash -lc "cd $APP_DIR && $*"; }

"$APP_DIR/deploy/backup.sh"

as_app 'git pull --ff-only'
as_app 'pnpm install --frozen-lockfile'

systemctl stop prom-site
as_app 'pnpm build' || {
  echo 'Сборка упала. Сайт остановлен: почини и запусти update.sh снова,'
  echo 'или откати: git checkout <прошлый коммит>, pnpm build, systemctl start prom-site'
  exit 1
}
systemctl start prom-site

sleep 3
curl -fsS -o /dev/null -w 'Главная: %{http_code}\n' http://127.0.0.1:3000/
