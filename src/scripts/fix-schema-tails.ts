/**
 * Чистит хвосты после упавшего pushDevSchema.
 * Запуск из корня: pnpm exec tsx src/scripts/fix-schema-tails.ts
 *
 * Что сносит:
 *  - таблицы __new_* — недокопированные заготовки, drizzle оставляет их при падении
 *  - payload_locked_documents и payload_locked_documents_rels — служебные таблицы
 *    блокировок в админке. Данных не содержат, Payload пересоздаёт их при старте.
 *
 * Чинить по частям (удалить только индекс) бесполезно: push повторит всю
 * последовательность и споткнётся о следующий уцелевший объект.
 */

import { DatabaseSync } from 'node:sqlite'
import { readdirSync } from 'node:fs'

const dbFile = readdirSync('.').find((f) => f.endsWith('.db'))

if (!dbFile) {
  console.error('Файл базы (*.db) не найден в корне проекта')
  process.exit(1)
}

console.log(`База: ${dbFile}`)
const db = new DatabaseSync(dbFile)

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table'").all() as {
  name: string
}[]

const doomed = tables
  .map((t) => t.name)
  .filter(
    (name) =>
      name.startsWith('__new_') ||
      name === 'payload_locked_documents' ||
      name === 'payload_locked_documents_rels',
  )

if (!doomed.length) {
  console.log('Хвостов не найдено')
  db.close()
  process.exit(0)
}

// Порядок важен: сначала таблица со связями, потом та, на которую она ссылается
doomed.sort((a, b) => (a.endsWith('_rels') ? -1 : b.endsWith('_rels') ? 1 : 0))

db.exec('PRAGMA foreign_keys = OFF')

for (const name of doomed) {
  // Индексы уезжают вместе с таблицей, отдельно дропать не нужно
  db.exec(`DROP TABLE IF EXISTS \`${name}\``)
  console.log(`  снесено: ${name}`)
}

db.exec('PRAGMA foreign_keys = ON')
db.close()

console.log('\nГотово. Дальше: pnpm dev (даст Payload пересоздать схему), затем сид.')
