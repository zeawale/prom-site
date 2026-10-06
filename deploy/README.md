# Деплой pm52.ru

Сервер — VPS в Timeweb Cloud, тариф Cloud-40 (2 vCPU, 2 ГБ, 40 ГБ NVMe), Ubuntu 24.04.
Схема: nginx на 80/443 → приложение Next.js + Payload на `127.0.0.1:3000` под systemd → SQLite и `media` в папке приложения.

| Файл | Куда на сервере | Зачем |
|---|---|---|
| `nginx/prom-site-bootstrap.conf` | `/etc/nginx/sites-available/prom-site.conf` | Временный, только http — до сертификатов |
| `nginx/prom-site.conf` | туда же, вместо временного | Боевой: https, сведение доменов, редирект про-м.рф |
| `nginx/prom-site-proxy.conf` | `/etc/nginx/snippets/` | Общие заголовки проксирования |
| `systemd/prom-site.service` | `/etc/systemd/system/` | Автозапуск приложения |
| `systemd/prom-site-backup.*` | `/etc/systemd/system/` | Ежедневный бэкап в 03:30 |
| `backup.sh` | запускается из репозитория | Бэкап базы, `media` и `.env` |
| `update.sh` | запускается из репозитория | Выкатить свежий `main` |

Команды ниже — от `root` на сервере, если не сказано иное.

## 1. Сервер

В панели Timeweb Cloud: Ubuntu 24.04, Cloud-40, регион Москва или Санкт-Петербург, свой SSH-ключ (`~/.ssh/id_ed25519.pub`). Записать IP.

```bash
ssh root@<IP>

apt update && apt -y upgrade
timedatectl set-timezone Europe/Moscow

# Подкачка: next build на 2 ГБ без неё может упасть по памяти
fallocate -l 4G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab

ufw allow OpenSSH && ufw allow 'Nginx Full' && ufw --force enable
```

`ufw allow 'Nginx Full'` сработает после установки nginx — если ругается, повторить после шага 2.

## 2. Пакеты

```bash
apt -y install nginx sqlite3 git curl certbot

curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
apt -y install nodejs
corepack enable
corepack prepare pnpm@11.22.0 --activate

node -v && pnpm -v
```

## 3. Пользователь и код

```bash
useradd --create-home --shell /bin/bash prom
mkdir -p /srv/prom-site && chown prom:prom /srv/prom-site
sudo -u prom git clone https://github.com/zeawale/prom-site.git /srv/prom-site
```

## 4. .env

**До первой сборки:** `NEXT_PUBLIC_*` впекаются в сборку, поменял — пересобирай.

```bash
sudo -u prom tee /srv/prom-site/.env > /dev/null <<'EOF'
DATABASE_URL=file:./prom-site.db
PAYLOAD_SECRET=<openssl rand -hex 32>
NEXT_PUBLIC_SITE_URL=https://www.pm52.ru
NEXT_PUBLIC_YM_ID=62922793
SMTP_HOST=smtp.yandex.ru
SMTP_PORT=465
SMTP_USER=promo@pm52.ru
SMTP_PASS=<пароль приложения>
LEADS_NOTIFY_TO=promo@pm52.ru
EOF
chmod 600 /srv/prom-site/.env
```

- `PAYLOAD_SECRET` — **новый**, сгенерировать на сервере (`openssl rand -hex 32`). Локальный светился в чате.
- `NEXT_PUBLIC_SITE_URL` — строго `https://www.pm52.ru`, с www и без слэша: по нему proxy сводит домены, по нему собираются canonical и sitemap.
- Значения секретов — из `claude-brain-local/_secrets/keys.md`, в репозиторий не попадают.

## 5. База с нуля и сборка

**Локальную базу на прод не копировать** — в ней тестовые заявки. База создаётся миграциями и сидами.

```bash
sudo -u prom -H bash -lc 'cd /srv/prom-site && pnpm install --frozen-lockfile && pnpm migrate'

sudo -u prom -H bash -lc 'cd /srv/prom-site && pnpm seed && pnpm seed:programs && pnpm seed:its \
  && pnpm seed:fresh && pnpm seed:grm && pnpm seed:legal && pnpm seed:home \
  && pnpm seed:reviews && pnpm seed:pages && pnpm seed:cookie'

sudo -u prom -H bash -lc 'cd /srv/prom-site && pnpm build'
```

`pnpm seed` первым: остальные ссылаются на созданный им каталог. **Сиды на проде — только сейчас.** После того как Дмитрий начнёт править тексты в админке, повторный сид их затрёт.

## 6. Автозапуск

```bash
cp /srv/prom-site/deploy/systemd/prom-site.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now prom-site
systemctl status prom-site --no-pager
curl -sI http://127.0.0.1:3000/ | head -1      # HTTP/1.1 200 OK
```

Логи: `journalctl -u prom-site -f`.

## 7. nginx до переключения DNS

```bash
mkdir -p /var/www/certbot
cp /srv/prom-site/deploy/nginx/prom-site-proxy.conf /etc/nginx/snippets/
cp /srv/prom-site/deploy/nginx/prom-site-bootstrap.conf /etc/nginx/sites-available/prom-site.conf
ln -sf /etc/nginx/sites-available/prom-site.conf /etc/nginx/sites-enabled/prom-site.conf
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

Сайт открывается по `http://<IP>/`. Доменом его пока не открыть: proxy увидит `www.pm52.ru` по http и отправит на https, а сертификата ещё нет.

## 8. Админ и фото директора

Пароль по голому http на публичный IP не вводить — через SSH-туннель:

```bash
# на своём компьютере
ssh -L 3000:127.0.0.1:3000 root@<IP>
```

В браузере `http://localhost:3000/admin`:

1. Создать первого пользователя — аккаунт администратора. Пароль в `keys.md`.
2. Media → загрузить фото директора, выбрать его в глобале «О компании» (исходник только на домашнем ПК).
3. Отправить тестовую заявку «Тест сайта, не звонить» — письмо должно прийти в `promo@`.

## 9. Бэкап

```bash
chmod +x /srv/prom-site/deploy/backup.sh /srv/prom-site/deploy/update.sh
cp /srv/prom-site/deploy/systemd/prom-site-backup.service /srv/prom-site/deploy/systemd/prom-site-backup.timer /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now prom-site-backup.timer
/srv/prom-site/deploy/backup.sh          # первый бэкап руками
```

Копии в `/var/backups/prom-site/<дата>/`: `prom-site.db`, `media.tar.gz`, `env`. Хранятся 14 дней. От гибели сервера они не спасают — раз в месяц забирать последнюю к себе:

```bash
# на своём компьютере
scp -r root@<IP>:/var/backups/prom-site/<дата> ./prom-site-backup-<дата>
```

## 10. Переключение домена

**За сутки:** в редакторе DNS Яндекс 360 снизить TTL A-записей `pm52.ru` и `www` до 300. Проверить, что у `www` своя запись, а не wildcard `*.pm52.ru`: если своей нет — завести явную, wildcard не трогать.

**В день переключения:**

1. Поменять A-записи `pm52.ru` и `www.pm52.ru` на IP сервера. **MX, TXT, DKIM, `mail`, wildcard и поддомены `1c`, `wiki`, `vpn`, `bitrix`, `api` не трогать.**
2. То же для `про-м.рф` и `www.про-м.рф`.
3. Дождаться, пока домены смотрят на сервер: `dig +short www.pm52.ru @8.8.8.8`.
4. Сертификаты:

   ```bash
   certbot certonly --webroot -w /var/www/certbot -d pm52.ru -d www.pm52.ru \
     --deploy-hook 'systemctl reload nginx'
   certbot certonly --webroot -w /var/www/certbot -d xn----xtbedf.xn--p1ai -d www.xn----xtbedf.xn--p1ai \
     --deploy-hook 'systemctl reload nginx'
   ```

   Продление certbot делает сам, проверка: `certbot renew --dry-run`.
5. Боевой nginx:

   ```bash
   cp /srv/prom-site/deploy/nginx/prom-site.conf /etc/nginx/sites-available/prom-site.conf
   nginx -t && systemctl reload nginx
   ```

6. Проверки — у каждого адреса **один** 301 сразу на конечный:

   ```bash
   curl -sI http://pm52.ru/kontakty/          | grep -iE '^(HTTP|location)'   # 301 → https://www.pm52.ru/contacts
   curl -sI https://pm52.ru/                  | grep -iE '^(HTTP|location)'   # 301 → https://www.pm52.ru/
   curl -sI http://www.pm52.ru/sitemap.xml    | grep -iE '^(HTTP|location)'   # 301 → https://www.pm52.ru/sitemap.xml
   curl -sI https://www.pm52.ru/uslugi/       | head -1                       # 410
   curl -sI https://xn----xtbedf.xn--p1ai/    | grep -iE '^(HTTP|location)'   # 301 → https://www.pm52.ru/
   curl -sI https://www.pm52.ru/              | head -1                       # 200
   ```

7. Заявка с сайта — письмо в `promo@`. Правка текста в админке — видна на сайте без пересборки.
8. Яндекс.Вебмастер: добавить `https://www.pm52.ru/sitemap.xml`.

**Старый хостинг Timeweb не выключать минимум неделю** — это откат: вернуть A-записи на `92.53.96.120`. Потом скачать архив всех четырёх сайтов с него и не продлевать (оплачен до 28.12.2026).

## Обновление сайта

```bash
sudo /srv/prom-site/deploy/update.sh
```

Бэкап → `git pull` → зависимости → сайт останавливается → сборка (миграции прогоняются сами) → запуск. 3–5 минут простоя, обновлять вечером.
