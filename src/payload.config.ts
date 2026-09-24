import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { Settings } from './globals/Settings'
import { Categories } from './collections/Categories'
import { Services } from './collections/Services'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Leads } from './collections/Leads'
import { Programs } from './collections/Programs'
import { LegalPages } from './collections/LegalPages'
import { Reviews } from './collections/Reviews'
import { ProgramsSection } from './globals/ProgramsSection'
import { ITS } from './globals/ITS'
import { Fresh } from './globals/Fresh'
import { FreshVsGrm } from './globals/FreshVsGrm'
import { GRM } from './globals/GRM'
import { Home } from './globals/Home'
import { About } from './globals/About'
import { Contacts } from './globals/Contacts'
import { CookieBanner } from './globals/CookieBanner'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  collections: [Users, Media, Categories, Services, Leads, Programs, LegalPages, Reviews],
  globals: [
    Settings,
    CookieBanner,
    Home,
    About,
    Contacts,
    ProgramsSection,
    ITS,
    Fresh,
    GRM,
    FreshVsGrm,
  ],
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  /**
   * Схема базы меняется только миграциями, авто-push выключен.
   *
   * По умолчанию адаптер в dev-режиме сам подгоняет таблицы под конфиг
   * (drizzle push). Удобно ровно до первого переименования поля: drizzle не
   * отличает rename от «удалить старую колонку и создать новую» и задаёт
   * вопрос в терминале — а на проде терминала нет, и данные в колонке
   * теряются молча. Поэтому push выключен везде, а не только на проде:
   * dev и прод проходят одну и ту же последовательность миграций, и
   * расхождение схем между машинами исключено.
   *
   * Правишь коллекцию или глобал → `pnpm migrate:create <имя>` →
   * смотришь сгенерированный файл в src/migrations → `pnpm migrate`.
   * Снимок схемы (`*.json`) рядом с миграцией нужен для следующего diff,
   * из репозитория не удалять.
   *
   * prodMigrations: на проде непримёненные миграции прогоняются сами при
   * старте приложения (и при `next build`, он тоже поднимает Payload).
   * Отдельный шаг деплоя «не забыть прогнать migrate» не нужен.
   */
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || '',
    },
    push: false,
    prodMigrations: migrations,
  }),
  sharp,
  plugins: [],
})
