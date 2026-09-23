import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."site_settings" ADD COLUMN "show_developer_credit" boolean DEFAULT true;
  ALTER TABLE "payload"."site_settings" ADD COLUMN "developer_name" varchar DEFAULT 'Hamid Ehsani';
  ALTER TABLE "payload"."site_settings" ADD COLUMN "developer_url" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."site_settings" DROP COLUMN "show_developer_credit";
  ALTER TABLE "payload"."site_settings" DROP COLUMN "developer_name";
  ALTER TABLE "payload"."site_settings" DROP COLUMN "developer_url";`)
}
