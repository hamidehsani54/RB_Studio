import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "payload"."enum_inquiries_status" ADD VALUE 'cancelled' BEFORE 'archived';
  ALTER TABLE "payload"."availability" ADD COLUMN "inquiry_id" integer;
  ALTER TABLE "payload"."availability" ADD CONSTRAINT "availability_inquiry_id_inquiries_id_fk" FOREIGN KEY ("inquiry_id") REFERENCES "payload"."inquiries"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "availability_inquiry_idx" ON "payload"."availability" USING btree ("inquiry_id");
  ALTER TABLE "payload"."site_settings" DROP COLUMN "auto_reply_enabled";
  ALTER TABLE "payload"."site_settings" DROP COLUMN "auto_reply_subject";
  ALTER TABLE "payload"."site_settings" DROP COLUMN "auto_reply_text";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."availability" DROP CONSTRAINT "availability_inquiry_id_inquiries_id_fk";
  
  ALTER TABLE "payload"."inquiries" ALTER COLUMN "status" SET DATA TYPE text;
  ALTER TABLE "payload"."inquiries" ALTER COLUMN "status" SET DEFAULT 'new'::text;
  DROP TYPE "payload"."enum_inquiries_status";
  CREATE TYPE "payload"."enum_inquiries_status" AS ENUM('new', 'contacted', 'follow-up', 'booked', 'declined', 'archived');
  ALTER TABLE "payload"."inquiries" ALTER COLUMN "status" SET DEFAULT 'new'::"payload"."enum_inquiries_status";
  ALTER TABLE "payload"."inquiries" ALTER COLUMN "status" SET DATA TYPE "payload"."enum_inquiries_status" USING "status"::"payload"."enum_inquiries_status";
  DROP INDEX "payload"."availability_inquiry_idx";
  ALTER TABLE "payload"."site_settings" ADD COLUMN "auto_reply_enabled" boolean DEFAULT false;
  ALTER TABLE "payload"."site_settings" ADD COLUMN "auto_reply_subject" varchar;
  ALTER TABLE "payload"."site_settings" ADD COLUMN "auto_reply_text" varchar;
  ALTER TABLE "payload"."availability" DROP COLUMN "inquiry_id";`)
}
