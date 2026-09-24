import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`users_sessions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`created_at\` text,
  	\`expires_at\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_sessions_order_idx\` ON \`users_sessions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`users_sessions_parent_id_idx\` ON \`users_sessions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`users\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`users_created_at_idx\` ON \`users\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`users_email_idx\` ON \`users\` (\`email\`);`)
  await db.run(sql`CREATE TABLE \`media\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`alt\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric
  );
  `)
  await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(sql`CREATE TABLE \`categories\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`icon\` text DEFAULT 'gear' NOT NULL,
  	\`order\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`categories_slug_idx\` ON \`categories\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`categories_updated_at_idx\` ON \`categories\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`categories_created_at_idx\` ON \`categories\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`services_popup_who_needs_it\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`services_popup_who_needs_it_order_idx\` ON \`services_popup_who_needs_it\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`services_popup_who_needs_it_parent_id_idx\` ON \`services_popup_who_needs_it\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`services_popup_how_it_works\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`description\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`services_popup_how_it_works_order_idx\` ON \`services_popup_how_it_works\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`services_popup_how_it_works_parent_id_idx\` ON \`services_popup_how_it_works\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`services_popup_requirements\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`services_popup_requirements_order_idx\` ON \`services_popup_requirements\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`services_popup_requirements_parent_id_idx\` ON \`services_popup_requirements\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`services_source_urls\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`url\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`services_source_urls_order_idx\` ON \`services_source_urls\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`services_source_urls_parent_id_idx\` ON \`services_source_urls\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`services\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`headline\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`category_id\` integer NOT NULL,
  	\`icon\` text DEFAULT 'gear' NOT NULL,
  	\`is_popular\` integer DEFAULT false,
  	\`is_new\` integer DEFAULT false,
  	\`is_hidden\` integer DEFAULT false,
  	\`popup_cta_text\` text DEFAULT 'Подключить сервис',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`services_slug_idx\` ON \`services\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`services_category_idx\` ON \`services\` (\`category_id\`);`)
  await db.run(sql`CREATE INDEX \`services_updated_at_idx\` ON \`services\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`services_created_at_idx\` ON \`services\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`services_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`services_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`services_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`services_rels_order_idx\` ON \`services_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`services_rels_parent_idx\` ON \`services_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`services_rels_path_idx\` ON \`services_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`services_rels_services_id_idx\` ON \`services_rels\` (\`services_id\`);`)
  await db.run(sql`CREATE TABLE \`leads\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`phone\` text NOT NULL,
  	\`email\` text NOT NULL,
  	\`comment\` text,
  	\`status\` text DEFAULT 'new' NOT NULL,
  	\`page\` text,
  	\`consent_at\` text,
  	\`consent_ip\` text,
  	\`consent_version\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`leads_updated_at_idx\` ON \`leads\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`leads_created_at_idx\` ON \`leads\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`programs_short_facts_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`fact\` text NOT NULL,
  	\`caption\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`programs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`programs_short_facts_items_order_idx\` ON \`programs_short_facts_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`programs_short_facts_items_parent_id_idx\` ON \`programs_short_facts_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`programs_cards_list\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`programs_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`programs_cards_list_order_idx\` ON \`programs_cards_list\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`programs_cards_list_parent_id_idx\` ON \`programs_cards_list\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`programs_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text,
  	\`title\` text,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`programs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`programs_cards_order_idx\` ON \`programs_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`programs_cards_parent_id_idx\` ON \`programs_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`programs_table_rows\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`col1\` text DEFAULT 'no',
  	\`col2\` text DEFAULT 'no',
  	\`col3\` text DEFAULT 'no',
  	\`col1_text\` text,
  	\`col2_text\` text,
  	\`col3_text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`programs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`programs_table_rows_order_idx\` ON \`programs_table_rows\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`programs_table_rows_parent_id_idx\` ON \`programs_table_rows\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`programs_table_details_rows\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`col1\` text DEFAULT 'no',
  	\`col2\` text DEFAULT 'no',
  	\`col3\` text DEFAULT 'no',
  	\`col1_text\` text,
  	\`col2_text\` text,
  	\`col3_text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`programs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`programs_table_details_rows_order_idx\` ON \`programs_table_details_rows\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`programs_table_details_rows_parent_id_idx\` ON \`programs_table_details_rows\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`programs\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`tab_label\` text NOT NULL,
  	\`order\` numeric NOT NULL,
  	\`lead\` text NOT NULL,
  	\`body_strong\` text NOT NULL,
  	\`body_intro\` text NOT NULL,
  	\`body\` text NOT NULL,
  	\`cta_text\` text DEFAULT 'Оставить заявку',
  	\`short_facts_suits\` text,
  	\`cards_title\` text,
  	\`cards_layout\` text DEFAULT 'icon',
  	\`has_table\` integer DEFAULT false,
  	\`table_title\` text,
  	\`table_first_column_label\` text,
  	\`table_col1_label\` text,
  	\`table_col2_label\` text,
  	\`table_col3_label\` text,
  	\`table_has_details\` integer DEFAULT false,
  	\`table_details_label\` text DEFAULT 'Детально',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`programs_slug_idx\` ON \`programs\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`programs_updated_at_idx\` ON \`programs\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`programs_created_at_idx\` ON \`programs\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`legal_pages_sections_paragraphs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`legal_pages_sections\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`legal_pages_sections_paragraphs_order_idx\` ON \`legal_pages_sections_paragraphs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`legal_pages_sections_paragraphs_parent_id_idx\` ON \`legal_pages_sections_paragraphs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`legal_pages_sections_list\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`legal_pages_sections\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`legal_pages_sections_list_order_idx\` ON \`legal_pages_sections_list\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`legal_pages_sections_list_parent_id_idx\` ON \`legal_pages_sections_list\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`legal_pages_sections\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	\`list_type\` text DEFAULT 'unordered',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`legal_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`legal_pages_sections_order_idx\` ON \`legal_pages_sections\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`legal_pages_sections_parent_id_idx\` ON \`legal_pages_sections\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`legal_pages\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`slug\` text NOT NULL,
  	\`title\` text NOT NULL,
  	\`lead\` text,
  	\`effective_date\` text NOT NULL,
  	\`version\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`legal_pages_slug_idx\` ON \`legal_pages\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`legal_pages_updated_at_idx\` ON \`legal_pages\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`legal_pages_created_at_idx\` ON \`legal_pages\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`reviews\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`author\` text NOT NULL,
  	\`role\` text NOT NULL,
  	\`text\` text NOT NULL,
  	\`show_on_home\` integer DEFAULT true,
  	\`order\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`reviews_updated_at_idx\` ON \`reviews\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`reviews_created_at_idx\` ON \`reviews\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_kv\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`global_slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_global_slug_idx\` ON \`payload_locked_documents\` (\`global_slug\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_updated_at_idx\` ON \`payload_locked_documents\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_created_at_idx\` ON \`payload_locked_documents\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	\`categories_id\` integer,
  	\`services_id\` integer,
  	\`leads_id\` integer,
  	\`programs_id\` integer,
  	\`legal_pages_id\` integer,
  	\`reviews_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`categories_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`services_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`leads_id\`) REFERENCES \`leads\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`programs_id\`) REFERENCES \`programs\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`legal_pages_id\`) REFERENCES \`legal_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`reviews_id\`) REFERENCES \`reviews\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_categories_id_idx\` ON \`payload_locked_documents_rels\` (\`categories_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_services_id_idx\` ON \`payload_locked_documents_rels\` (\`services_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_leads_id_idx\` ON \`payload_locked_documents_rels\` (\`leads_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_programs_id_idx\` ON \`payload_locked_documents_rels\` (\`programs_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_legal_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`legal_pages_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_reviews_id_idx\` ON \`payload_locked_documents_rels\` (\`reviews_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`value\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_key_idx\` ON \`payload_preferences\` (\`key\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_updated_at_idx\` ON \`payload_preferences\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_created_at_idx\` ON \`payload_preferences\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_migrations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`batch\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_migrations_updated_at_idx\` ON \`payload_migrations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_migrations_created_at_idx\` ON \`payload_migrations\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`settings_counters\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text NOT NULL,
  	\`caption\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`settings_counters_order_idx\` ON \`settings_counters\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`settings_counters_parent_id_idx\` ON \`settings_counters\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`phone\` text DEFAULT '+7 (831) 282-31-99' NOT NULL,
  	\`phone_raw\` text,
  	\`email\` text DEFAULT 'info@pm52.ru' NOT NULL,
  	\`address\` text DEFAULT 'Нижний Новгород, Казанское шоссе, д.12 к.1 оф.311' NOT NULL,
  	\`work_hours\` text DEFAULT 'Пн–Пт 09:00–18:00' NOT NULL,
  	\`legal_name\` text DEFAULT 'ООО «НПП ПРО-М»' NOT NULL,
  	\`inn\` text DEFAULT '5260165194' NOT NULL,
  	\`ogrn\` text,
  	\`tariff_disclaimer\` text DEFAULT 'Условия тарифов приведены по данным фирмы «1С» и могут меняться. Актуальный состав приложений и стоимость уточняйте в заявке.' NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`cookie_banner\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version\` text DEFAULT '2026-09-10' NOT NULL,
  	\`title\` text NOT NULL,
  	\`text\` text NOT NULL,
  	\`policy_label\` text DEFAULT 'Политика использования cookie' NOT NULL,
  	\`accept_all_label\` text DEFAULT 'Принять все' NOT NULL,
  	\`necessary_only_label\` text DEFAULT 'Только необходимые' NOT NULL,
  	\`settings_label\` text DEFAULT 'Настроить' NOT NULL,
  	\`settings_title\` text DEFAULT 'Настройки cookie' NOT NULL,
  	\`settings_necessary_label\` text DEFAULT 'Необходимые' NOT NULL,
  	\`settings_necessary_text\` text DEFAULT 'Обеспечивают работу сайта и отправку форм. Отключить нельзя.' NOT NULL,
  	\`settings_analytics_label\` text DEFAULT 'Аналитические' NOT NULL,
  	\`settings_analytics_text\` text DEFAULT 'Яндекс.Метрика: обезличенная статистика посещений.' NOT NULL,
  	\`settings_functional_label\` text DEFAULT 'Функциональные' NOT NULL,
  	\`settings_functional_text\` text DEFAULT 'Запоминают ваши настройки и разрешают встроенные виджеты — например карту проезда на странице «Контакты».' NOT NULL,
  	\`settings_save_label\` text DEFAULT 'Сохранить выбор' NOT NULL,
  	\`settings_accept_all_label\` text DEFAULT 'Принять все' NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`home_states_items_criteria\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_states_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_states_items_criteria_order_idx\` ON \`home_states_items_criteria\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_states_items_criteria_parent_id_idx\` ON \`home_states_items_criteria\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_states_items_solutions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`eyebrow\` text NOT NULL,
  	\`title\` text NOT NULL,
  	\`text\` text NOT NULL,
  	\`href\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_states_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_states_items_solutions_order_idx\` ON \`home_states_items_solutions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_states_items_solutions_parent_id_idx\` ON \`home_states_items_solutions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_states_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`description\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_states_items_order_idx\` ON \`home_states_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_states_items_parent_id_idx\` ON \`home_states_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_directions_items_list\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_directions_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_directions_items_list_order_idx\` ON \`home_directions_items_list\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_directions_items_list_parent_id_idx\` ON \`home_directions_items_list\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_directions_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text,
  	\`title\` text NOT NULL,
  	\`lead\` text NOT NULL,
  	\`href\` text NOT NULL,
  	\`button_label\` text DEFAULT 'Подробнее',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_directions_items_order_idx\` ON \`home_directions_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_directions_items_parent_id_idx\` ON \`home_directions_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_after_payment_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_after_payment_items_order_idx\` ON \`home_after_payment_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_after_payment_items_parent_id_idx\` ON \`home_after_payment_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_faq_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`question\` text NOT NULL,
  	\`answer\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_faq_items_order_idx\` ON \`home_faq_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_faq_items_parent_id_idx\` ON \`home_faq_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_title\` text NOT NULL,
  	\`hero_lead\` text NOT NULL,
  	\`hero_cta_text\` text DEFAULT 'Получить консультацию',
  	\`states_title\` text NOT NULL,
  	\`states_lead\` text,
  	\`states_open_label\` text DEFAULT 'Это про меня',
  	\`states_close_label\` text DEFAULT 'Свернуть',
  	\`states_criteria_title\` text DEFAULT 'Это про вас, если',
  	\`states_solution_label\` text DEFAULT 'Перейти',
  	\`states_footer_text\` text NOT NULL,
  	\`states_footer_button_label\` text DEFAULT 'Заказать звонок',
  	\`directions_title\` text NOT NULL,
  	\`services_preview_title\` text NOT NULL,
  	\`services_preview_button_label\` text DEFAULT 'Подробнее',
  	\`services_preview_all_label\` text DEFAULT 'Все сервисы',
  	\`company_title\` text NOT NULL,
  	\`company_lead\` text,
  	\`company_button_label\` text DEFAULT 'Подробнее о компании',
  	\`company_button_href\` text DEFAULT '/about',
  	\`after_payment_title\` text NOT NULL,
  	\`after_payment_lead\` text,
  	\`faq_title\` text NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`about\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`body\` text NOT NULL,
  	\`photo_id\` integer,
  	\`reviews_title\` text DEFAULT 'Отзывы клиентов',
  	\`reviews_lead\` text,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`photo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`about_photo_idx\` ON \`about\` (\`photo_id\`);`)
  await db.run(sql`CREATE TABLE \`contacts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`lead\` text NOT NULL,
  	\`phone_label\` text DEFAULT 'Телефон' NOT NULL,
  	\`phone_caption\` text,
  	\`email_label\` text DEFAULT 'Почта' NOT NULL,
  	\`email_caption\` text,
  	\`hours_label\` text DEFAULT 'Часы работы' NOT NULL,
  	\`hours_caption\` text,
  	\`address_label\` text DEFAULT 'Адрес офиса' NOT NULL,
  	\`address_caption\` text,
  	\`legal_label\` text DEFAULT 'Юридическое лицо' NOT NULL,
  	\`legal_caption\` text,
  	\`inn_label\` text DEFAULT 'ИНН' NOT NULL,
  	\`inn_caption\` text,
  	\`map_url\` text DEFAULT 'https://yandex.ru/map-widget/v1/?text=%D0%9D%D0%B8%D0%B6%D0%BD%D0%B8%D0%B9%20%D0%9D%D0%BE%D0%B2%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%2C%20%D0%9A%D0%B0%D0%B7%D0%B0%D0%BD%D1%81%D0%BA%D0%BE%D0%B5%20%D1%88%D0%BE%D1%81%D1%81%D0%B5%2C%2012%20%D0%BA.1&z=17&lang=ru_RU' NOT NULL,
  	\`map_plaque\` text,
  	\`map_button_label\` text DEFAULT 'Показать карту',
  	\`map_note\` text DEFAULT 'Карта загружается с серверов Яндекса и ставит свои cookie. Нажмите, чтобы открыть её.',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`programs_section_cloud_banner_buttons\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`href\` text NOT NULL,
  	\`style\` text DEFAULT 'primary',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`programs_section\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`programs_section_cloud_banner_buttons_order_idx\` ON \`programs_section_cloud_banner_buttons\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`programs_section_cloud_banner_buttons_parent_id_idx\` ON \`programs_section_cloud_banner_buttons\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`programs_section\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`lead\` text NOT NULL,
  	\`cloud_banner_title\` text NOT NULL,
  	\`cloud_banner_text\` text NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`its_short_facts_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`fact\` text NOT NULL,
  	\`caption\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`its\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`its_short_facts_items_order_idx\` ON \`its_short_facts_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`its_short_facts_items_parent_id_idx\` ON \`its_short_facts_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`its_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text DEFAULT 'gear' NOT NULL,
  	\`title\` text NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`its\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`its_cards_order_idx\` ON \`its_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`its_cards_parent_id_idx\` ON \`its_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`its_included_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`its\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`its_included_items_order_idx\` ON \`its_included_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`its_included_items_parent_id_idx\` ON \`its_included_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`its_table_rows\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`service_id\` integer,
  	\`href\` text,
  	\`col1\` text DEFAULT 'no',
  	\`col2\` text DEFAULT 'no',
  	\`col3\` text DEFAULT 'no',
  	\`col1_text\` text,
  	\`col2_text\` text,
  	\`col3_text\` text,
  	FOREIGN KEY (\`service_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`its\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`its_table_rows_order_idx\` ON \`its_table_rows\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`its_table_rows_parent_id_idx\` ON \`its_table_rows\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`its_table_rows_service_idx\` ON \`its_table_rows\` (\`service_id\`);`)
  await db.run(sql`CREATE TABLE \`its\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`lead\` text NOT NULL,
  	\`body_strong\` text NOT NULL,
  	\`body_intro\` text NOT NULL,
  	\`body\` text NOT NULL,
  	\`cta_text\` text DEFAULT 'Заказать',
  	\`short_facts_suits\` text,
  	\`cards_title\` text,
  	\`included_title\` text NOT NULL,
  	\`table_title\` text,
  	\`table_first_column_label\` text DEFAULT 'Сервисы ИТС',
  	\`table_col1_label\` text,
  	\`table_col2_label\` text,
  	\`cta_banner_title\` text NOT NULL,
  	\`cta_banner_text\` text NOT NULL,
  	\`cta_banner_button_label\` text DEFAULT 'Смотреть все сервисы' NOT NULL,
  	\`cta_banner_button_href\` text DEFAULT '/services' NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`fresh_short_facts_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`fact\` text NOT NULL,
  	\`caption\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`fresh\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`fresh_short_facts_items_order_idx\` ON \`fresh_short_facts_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`fresh_short_facts_items_parent_id_idx\` ON \`fresh_short_facts_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`fresh_cards_list\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`fresh_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`fresh_cards_list_order_idx\` ON \`fresh_cards_list\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`fresh_cards_list_parent_id_idx\` ON \`fresh_cards_list\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`fresh_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`fresh\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`fresh_cards_order_idx\` ON \`fresh_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`fresh_cards_parent_id_idx\` ON \`fresh_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`fresh_tariffs_cards_items_list\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`fresh_tariffs_cards_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`fresh_tariffs_cards_items_list_order_idx\` ON \`fresh_tariffs_cards_items_list\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`fresh_tariffs_cards_items_list_parent_id_idx\` ON \`fresh_tariffs_cards_items_list\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`fresh_tariffs_cards_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`kind\` text DEFAULT 'check' NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`fresh_tariffs_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`fresh_tariffs_cards_items_order_idx\` ON \`fresh_tariffs_cards_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`fresh_tariffs_cards_items_parent_id_idx\` ON \`fresh_tariffs_cards_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`fresh_tariffs_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`badge\` text,
  	\`who_fits\` text NOT NULL,
  	\`seats\` text NOT NULL,
  	\`seats_label\` text NOT NULL,
  	\`bases\` text NOT NULL,
  	\`bases_label\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`fresh\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`fresh_tariffs_cards_order_idx\` ON \`fresh_tariffs_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`fresh_tariffs_cards_parent_id_idx\` ON \`fresh_tariffs_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`fresh_tariffs_extra_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`specs\` text NOT NULL,
  	\`text\` text NOT NULL,
  	\`note\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`fresh\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`fresh_tariffs_extra_items_order_idx\` ON \`fresh_tariffs_extra_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`fresh_tariffs_extra_items_parent_id_idx\` ON \`fresh_tariffs_extra_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`fresh_tariffs_common_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text,
  	\`title\` text NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`fresh\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`fresh_tariffs_common_items_order_idx\` ON \`fresh_tariffs_common_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`fresh_tariffs_common_items_parent_id_idx\` ON \`fresh_tariffs_common_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`fresh\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`lead\` text NOT NULL,
  	\`body_strong\` text NOT NULL,
  	\`body_intro\` text NOT NULL,
  	\`body\` text NOT NULL,
  	\`cta_text\` text DEFAULT 'Оставить заявку',
  	\`short_facts_suits\` text,
  	\`cards_title\` text,
  	\`tariffs_title\` text NOT NULL,
  	\`tariffs_lead\` text NOT NULL,
  	\`tariffs_extra_title\` text NOT NULL,
  	\`tariffs_extra_banner_text\` text NOT NULL,
  	\`tariffs_extra_banner_button_label\` text DEFAULT 'Оставить заявку' NOT NULL,
  	\`tariffs_common_title\` text NOT NULL,
  	\`tariffs_switch_note_title\` text NOT NULL,
  	\`tariffs_switch_note_text\` text NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`grm_short_facts_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`fact\` text NOT NULL,
  	\`caption\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`grm\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`grm_short_facts_items_order_idx\` ON \`grm_short_facts_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`grm_short_facts_items_parent_id_idx\` ON \`grm_short_facts_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`grm_cards_list\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`grm_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`grm_cards_list_order_idx\` ON \`grm_cards_list\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`grm_cards_list_parent_id_idx\` ON \`grm_cards_list\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`grm_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`grm\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`grm_cards_order_idx\` ON \`grm_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`grm_cards_parent_id_idx\` ON \`grm_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`grm\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`lead\` text NOT NULL,
  	\`body_strong\` text NOT NULL,
  	\`body_intro\` text NOT NULL,
  	\`body\` text,
  	\`cta_text\` text DEFAULT 'Заказать',
  	\`short_facts_suits\` text,
  	\`cards_title\` text,
  	\`cards_lead\` text,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`fresh_vs_grm_fresh_rows\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`value\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`fresh_vs_grm\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`fresh_vs_grm_fresh_rows_order_idx\` ON \`fresh_vs_grm_fresh_rows\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`fresh_vs_grm_fresh_rows_parent_id_idx\` ON \`fresh_vs_grm_fresh_rows\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`fresh_vs_grm_grm_rows\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`value\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`fresh_vs_grm\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`fresh_vs_grm_grm_rows_order_idx\` ON \`fresh_vs_grm_grm_rows\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`fresh_vs_grm_grm_rows_parent_id_idx\` ON \`fresh_vs_grm_grm_rows\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`fresh_vs_grm\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`lead\` text NOT NULL,
  	\`fresh_title\` text NOT NULL,
  	\`fresh_badge\` text,
  	\`fresh_description\` text NOT NULL,
  	\`fresh_note\` text,
  	\`fresh_href\` text NOT NULL,
  	\`grm_title\` text NOT NULL,
  	\`grm_badge\` text,
  	\`grm_description\` text NOT NULL,
  	\`grm_note\` text,
  	\`grm_href\` text NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`users_sessions\`;`)
  await db.run(sql`DROP TABLE \`users\`;`)
  await db.run(sql`DROP TABLE \`media\`;`)
  await db.run(sql`DROP TABLE \`categories\`;`)
  await db.run(sql`DROP TABLE \`services_popup_who_needs_it\`;`)
  await db.run(sql`DROP TABLE \`services_popup_how_it_works\`;`)
  await db.run(sql`DROP TABLE \`services_popup_requirements\`;`)
  await db.run(sql`DROP TABLE \`services_source_urls\`;`)
  await db.run(sql`DROP TABLE \`services\`;`)
  await db.run(sql`DROP TABLE \`services_rels\`;`)
  await db.run(sql`DROP TABLE \`leads\`;`)
  await db.run(sql`DROP TABLE \`programs_short_facts_items\`;`)
  await db.run(sql`DROP TABLE \`programs_cards_list\`;`)
  await db.run(sql`DROP TABLE \`programs_cards\`;`)
  await db.run(sql`DROP TABLE \`programs_table_rows\`;`)
  await db.run(sql`DROP TABLE \`programs_table_details_rows\`;`)
  await db.run(sql`DROP TABLE \`programs\`;`)
  await db.run(sql`DROP TABLE \`legal_pages_sections_paragraphs\`;`)
  await db.run(sql`DROP TABLE \`legal_pages_sections_list\`;`)
  await db.run(sql`DROP TABLE \`legal_pages_sections\`;`)
  await db.run(sql`DROP TABLE \`legal_pages\`;`)
  await db.run(sql`DROP TABLE \`reviews\`;`)
  await db.run(sql`DROP TABLE \`payload_kv\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_migrations\`;`)
  await db.run(sql`DROP TABLE \`settings_counters\`;`)
  await db.run(sql`DROP TABLE \`settings\`;`)
  await db.run(sql`DROP TABLE \`cookie_banner\`;`)
  await db.run(sql`DROP TABLE \`home_states_items_criteria\`;`)
  await db.run(sql`DROP TABLE \`home_states_items_solutions\`;`)
  await db.run(sql`DROP TABLE \`home_states_items\`;`)
  await db.run(sql`DROP TABLE \`home_directions_items_list\`;`)
  await db.run(sql`DROP TABLE \`home_directions_items\`;`)
  await db.run(sql`DROP TABLE \`home_after_payment_items\`;`)
  await db.run(sql`DROP TABLE \`home_faq_items\`;`)
  await db.run(sql`DROP TABLE \`home\`;`)
  await db.run(sql`DROP TABLE \`about\`;`)
  await db.run(sql`DROP TABLE \`contacts\`;`)
  await db.run(sql`DROP TABLE \`programs_section_cloud_banner_buttons\`;`)
  await db.run(sql`DROP TABLE \`programs_section\`;`)
  await db.run(sql`DROP TABLE \`its_short_facts_items\`;`)
  await db.run(sql`DROP TABLE \`its_cards\`;`)
  await db.run(sql`DROP TABLE \`its_included_items\`;`)
  await db.run(sql`DROP TABLE \`its_table_rows\`;`)
  await db.run(sql`DROP TABLE \`its\`;`)
  await db.run(sql`DROP TABLE \`fresh_short_facts_items\`;`)
  await db.run(sql`DROP TABLE \`fresh_cards_list\`;`)
  await db.run(sql`DROP TABLE \`fresh_cards\`;`)
  await db.run(sql`DROP TABLE \`fresh_tariffs_cards_items_list\`;`)
  await db.run(sql`DROP TABLE \`fresh_tariffs_cards_items\`;`)
  await db.run(sql`DROP TABLE \`fresh_tariffs_cards\`;`)
  await db.run(sql`DROP TABLE \`fresh_tariffs_extra_items\`;`)
  await db.run(sql`DROP TABLE \`fresh_tariffs_common_items\`;`)
  await db.run(sql`DROP TABLE \`fresh\`;`)
  await db.run(sql`DROP TABLE \`grm_short_facts_items\`;`)
  await db.run(sql`DROP TABLE \`grm_cards_list\`;`)
  await db.run(sql`DROP TABLE \`grm_cards\`;`)
  await db.run(sql`DROP TABLE \`grm\`;`)
  await db.run(sql`DROP TABLE \`fresh_vs_grm_fresh_rows\`;`)
  await db.run(sql`DROP TABLE \`fresh_vs_grm_grm_rows\`;`)
  await db.run(sql`DROP TABLE \`fresh_vs_grm\`;`)
}
