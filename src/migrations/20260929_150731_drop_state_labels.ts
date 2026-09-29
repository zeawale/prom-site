import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`home\` DROP COLUMN \`states_open_label\`;`)
  await db.run(sql`ALTER TABLE \`home\` DROP COLUMN \`states_close_label\`;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`home\` ADD \`states_open_label\` text DEFAULT 'Это про меня';`)
  await db.run(sql`ALTER TABLE \`home\` ADD \`states_close_label\` text DEFAULT 'Свернуть';`)
}
