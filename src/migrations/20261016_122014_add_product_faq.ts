import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`programs_faq_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`question\` text NOT NULL,
  	\`answer\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`programs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`programs_faq_items_order_idx\` ON \`programs_faq_items\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`programs_faq_items_parent_id_idx\` ON \`programs_faq_items\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`its_faq_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`question\` text NOT NULL,
  	\`answer\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`its\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`its_faq_items_order_idx\` ON \`its_faq_items\` (\`_order\`);`)
  await db.run(
    sql`CREATE INDEX \`its_faq_items_parent_id_idx\` ON \`its_faq_items\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`fresh_faq_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`question\` text NOT NULL,
  	\`answer\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`fresh\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`fresh_faq_items_order_idx\` ON \`fresh_faq_items\` (\`_order\`);`)
  await db.run(
    sql`CREATE INDEX \`fresh_faq_items_parent_id_idx\` ON \`fresh_faq_items\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`grm_faq_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`question\` text NOT NULL,
  	\`answer\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`grm\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`grm_faq_items_order_idx\` ON \`grm_faq_items\` (\`_order\`);`)
  await db.run(
    sql`CREATE INDEX \`grm_faq_items_parent_id_idx\` ON \`grm_faq_items\` (\`_parent_id\`);`,
  )
  await db.run(sql`ALTER TABLE \`programs\` ADD \`faq_title\` text DEFAULT 'Вопросы и ответы';`)
  await db.run(sql`ALTER TABLE \`its\` ADD \`faq_title\` text DEFAULT 'Вопросы и ответы';`)
  await db.run(sql`ALTER TABLE \`fresh\` ADD \`faq_title\` text DEFAULT 'Вопросы и ответы';`)
  await db.run(sql`ALTER TABLE \`grm\` ADD \`faq_title\` text DEFAULT 'Вопросы и ответы';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`programs_faq_items\`;`)
  await db.run(sql`DROP TABLE \`its_faq_items\`;`)
  await db.run(sql`DROP TABLE \`fresh_faq_items\`;`)
  await db.run(sql`DROP TABLE \`grm_faq_items\`;`)
  await db.run(sql`ALTER TABLE \`programs\` DROP COLUMN \`faq_title\`;`)
  await db.run(sql`ALTER TABLE \`its\` DROP COLUMN \`faq_title\`;`)
  await db.run(sql`ALTER TABLE \`fresh\` DROP COLUMN \`faq_title\`;`)
  await db.run(sql`ALTER TABLE \`grm\` DROP COLUMN \`faq_title\`;`)
}
