import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`reviews\` DROP COLUMN \`role\`;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // DEFAULT дописан руками: NOT NULL без значения по умолчанию SQLite на
  // непустую таблицу не добавит, и откат упал бы
  await db.run(sql`ALTER TABLE \`reviews\` ADD \`role\` text DEFAULT '' NOT NULL;`)
}
