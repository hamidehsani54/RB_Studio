import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."site_settings" ADD COLUMN "send_client_emails" boolean DEFAULT true;
  ALTER TABLE "payload"."site_settings" ADD COLUMN "request_email_subject" varchar;
  ALTER TABLE "payload"."site_settings" ADD COLUMN "request_email_message" varchar;
  ALTER TABLE "payload"."site_settings" ADD COLUMN "confirmed_email_subject" varchar;
  ALTER TABLE "payload"."site_settings" ADD COLUMN "confirmed_email_message" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."site_settings" DROP COLUMN "send_client_emails";
  ALTER TABLE "payload"."site_settings" DROP COLUMN "request_email_subject";
  ALTER TABLE "payload"."site_settings" DROP COLUMN "request_email_message";
  ALTER TABLE "payload"."site_settings" DROP COLUMN "confirmed_email_subject";
  ALTER TABLE "payload"."site_settings" DROP COLUMN "confirmed_email_message";`)
}
