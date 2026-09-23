-- =====================================================================
-- RB Studio — database schema for Supabase (PostgreSQL)
-- Generated from the Payload CMS collection definitions (src/migrations/20260923_111354_initial.ts).
--
-- You normally do NOT need to run this by hand: the website runs its migrations
-- automatically on start (or run: npm run payload migrate).
-- Use this file only if you prefer to create the tables in the Supabase SQL editor.
--
-- All tables live in the "payload" schema, which Supabase does not expose through its
-- public REST API — keep it that way (Project settings → API → Exposed schemas).
-- =====================================================================

BEGIN;
CREATE SCHEMA IF NOT EXISTS "payload";
   CREATE TYPE "payload"."enum_pages_blocks_hero_tone" AS ENUM('light', 'sand', 'dark');
  CREATE TYPE "payload"."enum_pages_blocks_hero_height" AS ENUM('full', 'tall');
  CREATE TYPE "payload"."enum_pages_blocks_page_header_tone" AS ENUM('light', 'sand', 'dark');
  CREATE TYPE "payload"."enum_pages_blocks_intro_tone" AS ENUM('light', 'sand', 'dark');
  CREATE TYPE "payload"."enum_pages_blocks_featured_portfolio_tone" AS ENUM('light', 'sand', 'dark');
  CREATE TYPE "payload"."enum_pages_blocks_featured_portfolio_mode" AS ENUM('featured', 'selected', 'category');
  CREATE TYPE "payload"."enum_pages_blocks_featured_story_tone" AS ENUM('light', 'sand', 'dark');
  CREATE TYPE "payload"."enum_pages_blocks_services_tone" AS ENUM('light', 'sand', 'dark');
  CREATE TYPE "payload"."enum_pages_blocks_services_mode" AS ENUM('all', 'selected');
  CREATE TYPE "payload"."enum_pages_blocks_pricing_tone" AS ENUM('light', 'sand', 'dark');
  CREATE TYPE "payload"."enum_pages_blocks_pricing_mode" AS ENUM('all', 'selected');
  CREATE TYPE "payload"."enum_pages_blocks_process_tone" AS ENUM('light', 'sand', 'dark');
  CREATE TYPE "payload"."enum_pages_blocks_testimonials_tone" AS ENUM('light', 'sand', 'dark');
  CREATE TYPE "payload"."enum_pages_blocks_testimonials_mode" AS ENUM('featured', 'all', 'selected');
  CREATE TYPE "payload"."enum_pages_blocks_faq_tone" AS ENUM('light', 'sand', 'dark');
  CREATE TYPE "payload"."enum_pages_blocks_availability_tone" AS ENUM('light', 'sand', 'dark');
  CREATE TYPE "payload"."enum_pages_blocks_contact_tone" AS ENUM('light', 'sand', 'dark');
  CREATE TYPE "payload"."enum_pages_blocks_instagram_tone" AS ENUM('light', 'sand', 'dark');
  CREATE TYPE "payload"."enum_pages_blocks_instagram_source" AS ENUM('manual', 'live');
  CREATE TYPE "payload"."enum_pages_blocks_about_tone" AS ENUM('light', 'sand', 'dark');
  CREATE TYPE "payload"."enum_pages_blocks_rich_text_tone" AS ENUM('light', 'sand', 'dark');
  CREATE TYPE "payload"."enum_pages_blocks_rich_text_width" AS ENUM('narrow', 'wide');
  CREATE TYPE "payload"."enum_pages_blocks_image_banner_tone" AS ENUM('light', 'sand', 'dark');
  CREATE TYPE "payload"."enum_pages_blocks_image_banner_height" AS ENUM('full', 'tall', 'medium');
  CREATE TYPE "payload"."enum_pages_blocks_cta_tone" AS ENUM('light', 'sand', 'dark');
  CREATE TYPE "payload"."enum_pages_blocks_portfolio_index_tone" AS ENUM('light', 'sand', 'dark');
  CREATE TYPE "payload"."enum_pages_blocks_journal_list_tone" AS ENUM('light', 'sand', 'dark');
  CREATE TYPE "payload"."enum_pages_blocks_gallery_tone" AS ENUM('light', 'sand', 'dark');
  CREATE TYPE "payload"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__pages_v_blocks_hero_tone" AS ENUM('light', 'sand', 'dark');
  CREATE TYPE "payload"."enum__pages_v_blocks_hero_height" AS ENUM('full', 'tall');
  CREATE TYPE "payload"."enum__pages_v_blocks_page_header_tone" AS ENUM('light', 'sand', 'dark');
  CREATE TYPE "payload"."enum__pages_v_blocks_intro_tone" AS ENUM('light', 'sand', 'dark');
  CREATE TYPE "payload"."enum__pages_v_blocks_featured_portfolio_tone" AS ENUM('light', 'sand', 'dark');
  CREATE TYPE "payload"."enum__pages_v_blocks_featured_portfolio_mode" AS ENUM('featured', 'selected', 'category');
  CREATE TYPE "payload"."enum__pages_v_blocks_featured_story_tone" AS ENUM('light', 'sand', 'dark');
  CREATE TYPE "payload"."enum__pages_v_blocks_services_tone" AS ENUM('light', 'sand', 'dark');
  CREATE TYPE "payload"."enum__pages_v_blocks_services_mode" AS ENUM('all', 'selected');
  CREATE TYPE "payload"."enum__pages_v_blocks_pricing_tone" AS ENUM('light', 'sand', 'dark');
  CREATE TYPE "payload"."enum__pages_v_blocks_pricing_mode" AS ENUM('all', 'selected');
  CREATE TYPE "payload"."enum__pages_v_blocks_process_tone" AS ENUM('light', 'sand', 'dark');
  CREATE TYPE "payload"."enum__pages_v_blocks_testimonials_tone" AS ENUM('light', 'sand', 'dark');
  CREATE TYPE "payload"."enum__pages_v_blocks_testimonials_mode" AS ENUM('featured', 'all', 'selected');
  CREATE TYPE "payload"."enum__pages_v_blocks_faq_tone" AS ENUM('light', 'sand', 'dark');
  CREATE TYPE "payload"."enum__pages_v_blocks_availability_tone" AS ENUM('light', 'sand', 'dark');
  CREATE TYPE "payload"."enum__pages_v_blocks_contact_tone" AS ENUM('light', 'sand', 'dark');
  CREATE TYPE "payload"."enum__pages_v_blocks_instagram_tone" AS ENUM('light', 'sand', 'dark');
  CREATE TYPE "payload"."enum__pages_v_blocks_instagram_source" AS ENUM('manual', 'live');
  CREATE TYPE "payload"."enum__pages_v_blocks_about_tone" AS ENUM('light', 'sand', 'dark');
  CREATE TYPE "payload"."enum__pages_v_blocks_rich_text_tone" AS ENUM('light', 'sand', 'dark');
  CREATE TYPE "payload"."enum__pages_v_blocks_rich_text_width" AS ENUM('narrow', 'wide');
  CREATE TYPE "payload"."enum__pages_v_blocks_image_banner_tone" AS ENUM('light', 'sand', 'dark');
  CREATE TYPE "payload"."enum__pages_v_blocks_image_banner_height" AS ENUM('full', 'tall', 'medium');
  CREATE TYPE "payload"."enum__pages_v_blocks_cta_tone" AS ENUM('light', 'sand', 'dark');
  CREATE TYPE "payload"."enum__pages_v_blocks_portfolio_index_tone" AS ENUM('light', 'sand', 'dark');
  CREATE TYPE "payload"."enum__pages_v_blocks_journal_list_tone" AS ENUM('light', 'sand', 'dark');
  CREATE TYPE "payload"."enum__pages_v_blocks_gallery_tone" AS ENUM('light', 'sand', 'dark');
  CREATE TYPE "payload"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_projects_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__projects_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_availability_status" AS ENUM('booked', 'tentative', 'available');
  CREATE TYPE "payload"."enum_inquiries_status" AS ENUM('new', 'contacted', 'follow-up', 'booked', 'declined', 'archived');
  CREATE TYPE "payload"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TYPE "payload"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "payload"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "payload"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "payload"."enum_payload_folders_folder_type" AS ENUM('media');
  CREATE TYPE "payload"."enum_site_settings_social_platform" AS ENUM('instagram', 'facebook', 'youtube', 'tiktok', 'pinterest', 'linkedin', 'vimeo', 'other');
  CREATE TABLE "payload"."pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"tone" "payload"."enum_pages_blocks_hero_tone" DEFAULT 'light',
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"subheading" varchar,
  	"primary_cta_label" varchar DEFAULT 'Check availability',
  	"primary_cta_url" varchar DEFAULT '/contact',
  	"secondary_cta_label" varchar DEFAULT 'View portfolio',
  	"secondary_cta_url" varchar DEFAULT '/portfolio',
  	"height" "payload"."enum_pages_blocks_hero_height" DEFAULT 'full',
  	"overlay" numeric DEFAULT 35,
  	"interval" numeric DEFAULT 6,
  	"show_scroll_indicator" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."pages_blocks_page_header" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"tone" "payload"."enum_pages_blocks_page_header_tone" DEFAULT 'light',
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"text" varchar,
  	"image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."pages_blocks_intro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"tone" "payload"."enum_pages_blocks_intro_tone" DEFAULT 'light',
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"heading" varchar DEFAULT 'Images that feel like you.',
  	"text" varchar,
  	"image_id" integer,
  	"secondary_image_id" integer,
  	"cta_label" varchar DEFAULT 'Meet the photographer',
  	"cta_url" varchar DEFAULT '/about',
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."pages_blocks_featured_portfolio" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"tone" "payload"."enum_pages_blocks_featured_portfolio_tone" DEFAULT 'light',
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"heading" varchar DEFAULT 'Selected work',
  	"text" varchar,
  	"mode" "payload"."enum_pages_blocks_featured_portfolio_mode" DEFAULT 'featured',
  	"category_id" integer,
  	"limit" numeric DEFAULT 6,
  	"show_categories" boolean DEFAULT true,
  	"cta_label" varchar DEFAULT 'View the full portfolio',
  	"cta_url" varchar DEFAULT '/portfolio',
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."pages_blocks_featured_story" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"tone" "payload"."enum_pages_blocks_featured_story_tone" DEFAULT 'light',
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"project_id" integer,
  	"heading_override" varchar,
  	"text_override" varchar,
  	"image_count" numeric DEFAULT 5,
  	"cta_label" varchar DEFAULT 'Read the story',
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."pages_blocks_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"tone" "payload"."enum_pages_blocks_services_tone" DEFAULT 'light',
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"heading" varchar DEFAULT 'What I offer',
  	"text" varchar,
  	"mode" "payload"."enum_pages_blocks_services_mode" DEFAULT 'all',
  	"cta_label" varchar,
  	"cta_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."pages_blocks_pricing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"tone" "payload"."enum_pages_blocks_pricing_tone" DEFAULT 'light',
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"heading" varchar DEFAULT 'Collections',
  	"text" varchar,
  	"mode" "payload"."enum_pages_blocks_pricing_mode" DEFAULT 'all',
  	"footnote" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."pages_blocks_process" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"tone" "payload"."enum_pages_blocks_process_tone" DEFAULT 'light',
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"heading" varchar DEFAULT 'How it works',
  	"text" varchar,
  	"image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."pages_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"tone" "payload"."enum_pages_blocks_testimonials_tone" DEFAULT 'light',
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"heading" varchar DEFAULT 'Kind words',
  	"mode" "payload"."enum_pages_blocks_testimonials_mode" DEFAULT 'featured',
  	"limit" numeric DEFAULT 8,
  	"background_image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."pages_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"tone" "payload"."enum_pages_blocks_faq_tone" DEFAULT 'light',
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"heading" varchar DEFAULT 'Questions & answers',
  	"text" varchar,
  	"topic" varchar,
  	"group_by_topic" boolean DEFAULT false,
  	"limit" numeric DEFAULT 50,
  	"cta_label" varchar,
  	"cta_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."pages_blocks_availability" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"tone" "payload"."enum_pages_blocks_availability_tone" DEFAULT 'light',
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"heading" varchar DEFAULT 'Availability',
  	"text" varchar,
  	"months_ahead" numeric DEFAULT 18,
  	"show_tentative" boolean DEFAULT true,
  	"cta_label" varchar DEFAULT 'Ask about your date',
  	"cta_url" varchar DEFAULT '/contact',
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."pages_blocks_contact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"tone" "payload"."enum_pages_blocks_contact_tone" DEFAULT 'light',
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"heading" varchar DEFAULT 'Let''s work together',
  	"text" varchar,
  	"image_id" integer,
  	"show_details" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."pages_blocks_instagram" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"tone" "payload"."enum_pages_blocks_instagram_tone" DEFAULT 'light',
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"heading" varchar DEFAULT 'Follow along',
  	"source" "payload"."enum_pages_blocks_instagram_source" DEFAULT 'manual',
  	"limit" numeric DEFAULT 6,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."pages_blocks_about" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"tone" "payload"."enum_pages_blocks_about_tone" DEFAULT 'light',
  	"anchor" varchar,
  	"show_experience" boolean DEFAULT true,
  	"show_philosophy" boolean DEFAULT true,
  	"show_publications" boolean DEFAULT true,
  	"show_awards" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."pages_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"tone" "payload"."enum_pages_blocks_rich_text_tone" DEFAULT 'light',
  	"anchor" varchar,
  	"heading" varchar,
  	"content" jsonb,
  	"width" "payload"."enum_pages_blocks_rich_text_width" DEFAULT 'narrow',
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."pages_blocks_image_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"tone" "payload"."enum_pages_blocks_image_banner_tone" DEFAULT 'light',
  	"anchor" varchar,
  	"image_id" integer,
  	"quote" varchar,
  	"attribution" varchar,
  	"height" "payload"."enum_pages_blocks_image_banner_height" DEFAULT 'tall',
  	"parallax" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."pages_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"tone" "payload"."enum_pages_blocks_cta_tone" DEFAULT 'light',
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"text" varchar,
  	"button_label" varchar DEFAULT 'Check availability',
  	"button_url" varchar DEFAULT '/contact',
  	"image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."pages_blocks_portfolio_index" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"tone" "payload"."enum_pages_blocks_portfolio_index_tone" DEFAULT 'light',
  	"anchor" varchar,
  	"show_category_filter" boolean DEFAULT true,
  	"limit" numeric DEFAULT 60,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."pages_blocks_journal_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"tone" "payload"."enum_pages_blocks_journal_list_tone" DEFAULT 'light',
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"limit" numeric DEFAULT 12,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."pages_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"tone" "payload"."enum_pages_blocks_gallery_tone" DEFAULT 'light',
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_og_title" varchar,
  	"meta_og_description" varchar,
  	"meta_canonical" varchar,
  	"meta_no_index" boolean,
  	"slug" varchar,
  	"exclude_from_sitemap" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "payload"."enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "payload"."pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"projects_id" integer,
  	"services_id" integer,
  	"packages_id" integer,
  	"testimonials_id" integer
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"tone" "payload"."enum__pages_v_blocks_hero_tone" DEFAULT 'light',
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"subheading" varchar,
  	"primary_cta_label" varchar DEFAULT 'Check availability',
  	"primary_cta_url" varchar DEFAULT '/contact',
  	"secondary_cta_label" varchar DEFAULT 'View portfolio',
  	"secondary_cta_url" varchar DEFAULT '/portfolio',
  	"height" "payload"."enum__pages_v_blocks_hero_height" DEFAULT 'full',
  	"overlay" numeric DEFAULT 35,
  	"interval" numeric DEFAULT 6,
  	"show_scroll_indicator" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_page_header" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"tone" "payload"."enum__pages_v_blocks_page_header_tone" DEFAULT 'light',
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"text" varchar,
  	"image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_intro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"tone" "payload"."enum__pages_v_blocks_intro_tone" DEFAULT 'light',
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"heading" varchar DEFAULT 'Images that feel like you.',
  	"text" varchar,
  	"image_id" integer,
  	"secondary_image_id" integer,
  	"cta_label" varchar DEFAULT 'Meet the photographer',
  	"cta_url" varchar DEFAULT '/about',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_featured_portfolio" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"tone" "payload"."enum__pages_v_blocks_featured_portfolio_tone" DEFAULT 'light',
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"heading" varchar DEFAULT 'Selected work',
  	"text" varchar,
  	"mode" "payload"."enum__pages_v_blocks_featured_portfolio_mode" DEFAULT 'featured',
  	"category_id" integer,
  	"limit" numeric DEFAULT 6,
  	"show_categories" boolean DEFAULT true,
  	"cta_label" varchar DEFAULT 'View the full portfolio',
  	"cta_url" varchar DEFAULT '/portfolio',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_featured_story" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"tone" "payload"."enum__pages_v_blocks_featured_story_tone" DEFAULT 'light',
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"project_id" integer,
  	"heading_override" varchar,
  	"text_override" varchar,
  	"image_count" numeric DEFAULT 5,
  	"cta_label" varchar DEFAULT 'Read the story',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"tone" "payload"."enum__pages_v_blocks_services_tone" DEFAULT 'light',
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"heading" varchar DEFAULT 'What I offer',
  	"text" varchar,
  	"mode" "payload"."enum__pages_v_blocks_services_mode" DEFAULT 'all',
  	"cta_label" varchar,
  	"cta_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_pricing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"tone" "payload"."enum__pages_v_blocks_pricing_tone" DEFAULT 'light',
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"heading" varchar DEFAULT 'Collections',
  	"text" varchar,
  	"mode" "payload"."enum__pages_v_blocks_pricing_mode" DEFAULT 'all',
  	"footnote" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_process" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"tone" "payload"."enum__pages_v_blocks_process_tone" DEFAULT 'light',
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"heading" varchar DEFAULT 'How it works',
  	"text" varchar,
  	"image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"tone" "payload"."enum__pages_v_blocks_testimonials_tone" DEFAULT 'light',
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"heading" varchar DEFAULT 'Kind words',
  	"mode" "payload"."enum__pages_v_blocks_testimonials_mode" DEFAULT 'featured',
  	"limit" numeric DEFAULT 8,
  	"background_image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"tone" "payload"."enum__pages_v_blocks_faq_tone" DEFAULT 'light',
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"heading" varchar DEFAULT 'Questions & answers',
  	"text" varchar,
  	"topic" varchar,
  	"group_by_topic" boolean DEFAULT false,
  	"limit" numeric DEFAULT 50,
  	"cta_label" varchar,
  	"cta_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_availability" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"tone" "payload"."enum__pages_v_blocks_availability_tone" DEFAULT 'light',
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"heading" varchar DEFAULT 'Availability',
  	"text" varchar,
  	"months_ahead" numeric DEFAULT 18,
  	"show_tentative" boolean DEFAULT true,
  	"cta_label" varchar DEFAULT 'Ask about your date',
  	"cta_url" varchar DEFAULT '/contact',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_contact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"tone" "payload"."enum__pages_v_blocks_contact_tone" DEFAULT 'light',
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"heading" varchar DEFAULT 'Let''s work together',
  	"text" varchar,
  	"image_id" integer,
  	"show_details" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_instagram" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"tone" "payload"."enum__pages_v_blocks_instagram_tone" DEFAULT 'light',
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"heading" varchar DEFAULT 'Follow along',
  	"source" "payload"."enum__pages_v_blocks_instagram_source" DEFAULT 'manual',
  	"limit" numeric DEFAULT 6,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_about" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"tone" "payload"."enum__pages_v_blocks_about_tone" DEFAULT 'light',
  	"anchor" varchar,
  	"show_experience" boolean DEFAULT true,
  	"show_philosophy" boolean DEFAULT true,
  	"show_publications" boolean DEFAULT true,
  	"show_awards" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"tone" "payload"."enum__pages_v_blocks_rich_text_tone" DEFAULT 'light',
  	"anchor" varchar,
  	"heading" varchar,
  	"content" jsonb,
  	"width" "payload"."enum__pages_v_blocks_rich_text_width" DEFAULT 'narrow',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_image_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"tone" "payload"."enum__pages_v_blocks_image_banner_tone" DEFAULT 'light',
  	"anchor" varchar,
  	"image_id" integer,
  	"quote" varchar,
  	"attribution" varchar,
  	"height" "payload"."enum__pages_v_blocks_image_banner_height" DEFAULT 'tall',
  	"parallax" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"tone" "payload"."enum__pages_v_blocks_cta_tone" DEFAULT 'light',
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"text" varchar,
  	"button_label" varchar DEFAULT 'Check availability',
  	"button_url" varchar DEFAULT '/contact',
  	"image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_portfolio_index" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"tone" "payload"."enum__pages_v_blocks_portfolio_index_tone" DEFAULT 'light',
  	"anchor" varchar,
  	"show_category_filter" boolean DEFAULT true,
  	"limit" numeric DEFAULT 60,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_journal_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"tone" "payload"."enum__pages_v_blocks_journal_list_tone" DEFAULT 'light',
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"limit" numeric DEFAULT 12,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"tone" "payload"."enum__pages_v_blocks_gallery_tone" DEFAULT 'light',
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_og_title" varchar,
  	"version_meta_og_description" varchar,
  	"version_meta_canonical" varchar,
  	"version_meta_no_index" boolean,
  	"version_slug" varchar,
  	"version_exclude_from_sitemap" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "payload"."enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "payload"."_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"projects_id" integer,
  	"services_id" integer,
  	"packages_id" integer,
  	"testimonials_id" integer
  );
  
  CREATE TABLE "payload"."media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"title" varchar,
  	"caption" varchar,
  	"description" varchar,
  	"blur_data_u_r_l" varchar,
  	"folder_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumb_url" varchar,
  	"sizes_thumb_width" numeric,
  	"sizes_thumb_height" numeric,
  	"sizes_thumb_mime_type" varchar,
  	"sizes_thumb_filesize" numeric,
  	"sizes_thumb_filename" varchar,
  	"sizes_medium_url" varchar,
  	"sizes_medium_width" numeric,
  	"sizes_medium_height" numeric,
  	"sizes_medium_mime_type" varchar,
  	"sizes_medium_filesize" numeric,
  	"sizes_medium_filename" varchar,
  	"sizes_large_url" varchar,
  	"sizes_large_width" numeric,
  	"sizes_large_height" numeric,
  	"sizes_large_mime_type" varchar,
  	"sizes_large_filesize" numeric,
  	"sizes_large_filename" varchar,
  	"sizes_og_url" varchar,
  	"sizes_og_width" numeric,
  	"sizes_og_height" numeric,
  	"sizes_og_mime_type" varchar,
  	"sizes_og_filesize" numeric,
  	"sizes_og_filename" varchar
  );
  
  CREATE TABLE "payload"."testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"client_name" varchar NOT NULL,
  	"quote" varchar NOT NULL,
  	"location" varchar,
  	"date" timestamp(3) with time zone,
  	"client_image_id" integer,
  	"category_id" integer,
  	"featured" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."faqs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"topic" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."process_steps" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"title" varchar NOT NULL,
  	"text" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."projects_chapters" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"text" varchar,
  	"after_image" numeric DEFAULT 2
  );
  
  CREATE TABLE "payload"."projects_credits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"role" varchar,
  	"name" varchar
  );
  
  CREATE TABLE "payload"."projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"title" varchar,
  	"location" varchar,
  	"date" timestamp(3) with time zone,
  	"excerpt" varchar,
  	"cover_id" integer,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_og_title" varchar,
  	"meta_og_description" varchar,
  	"meta_canonical" varchar,
  	"meta_no_index" boolean,
  	"slug" varchar,
  	"category_id" integer,
  	"featured" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "payload"."enum_projects_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "payload"."projects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "payload"."_projects_v_version_chapters" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"text" varchar,
  	"after_image" numeric DEFAULT 2,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_projects_v_version_credits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"role" varchar,
  	"name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_projects_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__order" varchar,
  	"version_title" varchar,
  	"version_location" varchar,
  	"version_date" timestamp(3) with time zone,
  	"version_excerpt" varchar,
  	"version_cover_id" integer,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_og_title" varchar,
  	"version_meta_og_description" varchar,
  	"version_meta_canonical" varchar,
  	"version_meta_no_index" boolean,
  	"version_slug" varchar,
  	"version_category_id" integer,
  	"version_featured" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "payload"."enum__projects_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "payload"."_projects_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "payload"."categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"title" varchar NOT NULL,
  	"eyebrow" varchar,
  	"description" varchar,
  	"cover_id" integer,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_og_title" varchar,
  	"meta_og_description" varchar,
  	"meta_canonical" varchar,
  	"meta_no_index" boolean,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."services_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."services_areas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"title" varchar NOT NULL,
  	"excerpt" varchar,
  	"image_id" integer,
  	"starting_price" varchar,
  	"price_note" varchar,
  	"description" jsonb,
  	"related_category_id" integer,
  	"cta_label" varchar DEFAULT 'Check availability',
  	"cta_url" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_og_title" varchar,
  	"meta_og_description" varchar,
  	"meta_canonical" varchar,
  	"meta_no_index" boolean,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."services_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "payload"."packages_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."packages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"name" varchar NOT NULL,
  	"tagline" varchar,
  	"description" varchar,
  	"price" varchar NOT NULL,
  	"price_note" varchar,
  	"image_id" integer,
  	"cta_label" varchar DEFAULT 'Enquire',
  	"cta_url" varchar,
  	"slug" varchar,
  	"service_id" integer,
  	"most_popular" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."availability" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"status" "payload"."enum_availability_status" DEFAULT 'booked' NOT NULL,
  	"label" varchar,
  	"note" varchar,
  	"title" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."inquiries_internal_notes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"note" varchar NOT NULL,
  	"date" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."inquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"service" varchar,
  	"package" varchar,
  	"event_date" timestamp(3) with time zone,
  	"location" varchar,
  	"budget" varchar,
  	"hours" varchar,
  	"message" varchar,
  	"status" "payload"."enum_inquiries_status" DEFAULT 'new' NOT NULL,
  	"consent" boolean,
  	"source_page" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"excerpt" varchar,
  	"cover_id" integer,
  	"content" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_og_title" varchar,
  	"meta_og_description" varchar,
  	"meta_canonical" varchar,
  	"meta_no_index" boolean,
  	"slug" varchar,
  	"published_at" timestamp(3) with time zone,
  	"author_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "payload"."enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "payload"."posts_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "payload"."posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"post_categories_id" integer
  );
  
  CREATE TABLE "payload"."_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_cover_id" integer,
  	"version_content" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_og_title" varchar,
  	"version_meta_og_description" varchar,
  	"version_meta_canonical" varchar,
  	"version_meta_no_index" boolean,
  	"version_slug" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_author_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "payload"."enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "payload"."_posts_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "payload"."_posts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"post_categories_id" integer
  );
  
  CREATE TABLE "payload"."post_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "payload"."users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" "payload"."enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload"."payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "payload"."enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "payload"."enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload"."payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "payload"."enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."payload_folders_folder_type" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "payload"."enum_payload_folders_folder_type",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "payload"."payload_folders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"folder_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"media_id" integer,
  	"testimonials_id" integer,
  	"faqs_id" integer,
  	"process_steps_id" integer,
  	"projects_id" integer,
  	"categories_id" integer,
  	"services_id" integer,
  	"packages_id" integer,
  	"availability_id" integer,
  	"inquiries_id" integer,
  	"posts_id" integer,
  	"post_categories_id" integer,
  	"users_id" integer,
  	"payload_folders_id" integer
  );
  
  CREATE TABLE "payload"."payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload"."payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."site_settings_budget_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."site_settings_hours_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."site_settings_header_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."site_settings_footer_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."site_settings_legal_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."site_settings_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "payload"."enum_site_settings_social_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."site_settings_service_areas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar DEFAULT 'RB Studio' NOT NULL,
  	"tagline" varchar,
  	"logo_id" integer,
  	"favicon_id" integer,
  	"copyright" varchar,
  	"email" varchar,
  	"phone" varchar,
  	"inquiry_email" varchar,
  	"auto_reply_enabled" boolean DEFAULT false,
  	"auto_reply_subject" varchar,
  	"auto_reply_text" varchar,
  	"form_intro" varchar,
  	"consent_text" varchar DEFAULT 'I agree that RB Studio stores my details to answer my inquiry.',
  	"success_heading" varchar DEFAULT 'Thank you.',
  	"success_message" varchar DEFAULT 'Your message has arrived. I personally reply to every inquiry within two working days.',
  	"header_cta_label" varchar DEFAULT 'Check availability',
  	"header_cta_url" varchar DEFAULT '/contact',
  	"footer_heading" varchar DEFAULT 'Let’s create something timeless.',
  	"footer_text" varchar,
  	"instagram_handle" varchar,
  	"instagram_token" varchar,
  	"seo_title" varchar,
  	"seo_title_suffix" varchar DEFAULT ' — RB Studio',
  	"seo_description" varchar,
  	"og_image_id" integer,
  	"photographer_name" varchar,
  	"price_range" varchar DEFAULT '$$$',
  	"street" varchar,
  	"postal_code" varchar,
  	"city" varchar DEFAULT 'Stockholm',
  	"region" varchar,
  	"country" varchar DEFAULT 'SE',
  	"latitude" numeric,
  	"longitude" numeric,
  	"cookie_banner_enabled" boolean DEFAULT true,
  	"cookie_text" varchar DEFAULT 'I use cookies to understand how the site is used and to improve it. You choose what to allow.',
  	"cookie_policy_url" varchar DEFAULT '/cookie-policy',
  	"ga4_id" varchar,
  	"gtm_id" varchar,
  	"meta_pixel_id" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."about_experience" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."about_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."about_publications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"year" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "payload"."about_awards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"issuer" varchar,
  	"year" varchar
  );
  
  CREATE TABLE "payload"."about" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar,
  	"location" varchar,
  	"portrait_id" integer,
  	"secondary_image_id" integer,
  	"headline" varchar,
  	"bio" jsonb,
  	"philosophy" varchar,
  	"style" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload"."pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_page_header" ADD CONSTRAINT "pages_blocks_page_header_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_page_header" ADD CONSTRAINT "pages_blocks_page_header_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_intro" ADD CONSTRAINT "pages_blocks_intro_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_intro" ADD CONSTRAINT "pages_blocks_intro_secondary_image_id_media_id_fk" FOREIGN KEY ("secondary_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_intro" ADD CONSTRAINT "pages_blocks_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_featured_portfolio" ADD CONSTRAINT "pages_blocks_featured_portfolio_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "payload"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_featured_portfolio" ADD CONSTRAINT "pages_blocks_featured_portfolio_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_featured_story" ADD CONSTRAINT "pages_blocks_featured_story_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "payload"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_featured_story" ADD CONSTRAINT "pages_blocks_featured_story_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_services" ADD CONSTRAINT "pages_blocks_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_pricing" ADD CONSTRAINT "pages_blocks_pricing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_process" ADD CONSTRAINT "pages_blocks_process_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_process" ADD CONSTRAINT "pages_blocks_process_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_faq" ADD CONSTRAINT "pages_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_availability" ADD CONSTRAINT "pages_blocks_availability_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_contact" ADD CONSTRAINT "pages_blocks_contact_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_contact" ADD CONSTRAINT "pages_blocks_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_instagram" ADD CONSTRAINT "pages_blocks_instagram_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_about" ADD CONSTRAINT "pages_blocks_about_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_rich_text" ADD CONSTRAINT "pages_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_image_banner" ADD CONSTRAINT "pages_blocks_image_banner_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_image_banner" ADD CONSTRAINT "pages_blocks_image_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_portfolio_index" ADD CONSTRAINT "pages_blocks_portfolio_index_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_journal_list" ADD CONSTRAINT "pages_blocks_journal_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_gallery" ADD CONSTRAINT "pages_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages" ADD CONSTRAINT "pages_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_rels" ADD CONSTRAINT "pages_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "payload"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_rels" ADD CONSTRAINT "pages_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "payload"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_rels" ADD CONSTRAINT "pages_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "payload"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_rels" ADD CONSTRAINT "pages_rels_packages_fk" FOREIGN KEY ("packages_id") REFERENCES "payload"."packages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_rels" ADD CONSTRAINT "pages_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "payload"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_page_header" ADD CONSTRAINT "_pages_v_blocks_page_header_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_page_header" ADD CONSTRAINT "_pages_v_blocks_page_header_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_intro" ADD CONSTRAINT "_pages_v_blocks_intro_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_intro" ADD CONSTRAINT "_pages_v_blocks_intro_secondary_image_id_media_id_fk" FOREIGN KEY ("secondary_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_intro" ADD CONSTRAINT "_pages_v_blocks_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_featured_portfolio" ADD CONSTRAINT "_pages_v_blocks_featured_portfolio_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "payload"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_featured_portfolio" ADD CONSTRAINT "_pages_v_blocks_featured_portfolio_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_featured_story" ADD CONSTRAINT "_pages_v_blocks_featured_story_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "payload"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_featured_story" ADD CONSTRAINT "_pages_v_blocks_featured_story_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_services" ADD CONSTRAINT "_pages_v_blocks_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_pricing" ADD CONSTRAINT "_pages_v_blocks_pricing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_process" ADD CONSTRAINT "_pages_v_blocks_process_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_process" ADD CONSTRAINT "_pages_v_blocks_process_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_testimonials" ADD CONSTRAINT "_pages_v_blocks_testimonials_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_testimonials" ADD CONSTRAINT "_pages_v_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_faq" ADD CONSTRAINT "_pages_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_availability" ADD CONSTRAINT "_pages_v_blocks_availability_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_contact" ADD CONSTRAINT "_pages_v_blocks_contact_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_contact" ADD CONSTRAINT "_pages_v_blocks_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_instagram" ADD CONSTRAINT "_pages_v_blocks_instagram_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_about" ADD CONSTRAINT "_pages_v_blocks_about_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_rich_text" ADD CONSTRAINT "_pages_v_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_image_banner" ADD CONSTRAINT "_pages_v_blocks_image_banner_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_image_banner" ADD CONSTRAINT "_pages_v_blocks_image_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_cta" ADD CONSTRAINT "_pages_v_blocks_cta_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_cta" ADD CONSTRAINT "_pages_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_portfolio_index" ADD CONSTRAINT "_pages_v_blocks_portfolio_index_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_journal_list" ADD CONSTRAINT "_pages_v_blocks_journal_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_gallery" ADD CONSTRAINT "_pages_v_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v" ADD CONSTRAINT "_pages_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "payload"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "payload"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "payload"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_packages_fk" FOREIGN KEY ("packages_id") REFERENCES "payload"."packages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "payload"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."media" ADD CONSTRAINT "media_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "payload"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."testimonials" ADD CONSTRAINT "testimonials_client_image_id_media_id_fk" FOREIGN KEY ("client_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."testimonials" ADD CONSTRAINT "testimonials_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "payload"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."projects_chapters" ADD CONSTRAINT "projects_chapters_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."projects_credits" ADD CONSTRAINT "projects_credits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."projects" ADD CONSTRAINT "projects_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."projects" ADD CONSTRAINT "projects_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."projects" ADD CONSTRAINT "projects_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "payload"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."projects_rels" ADD CONSTRAINT "projects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."projects_rels" ADD CONSTRAINT "projects_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "payload"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_projects_v_version_chapters" ADD CONSTRAINT "_projects_v_version_chapters_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_projects_v_version_credits" ADD CONSTRAINT "_projects_v_version_credits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_projects_v" ADD CONSTRAINT "_projects_v_parent_id_projects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_projects_v" ADD CONSTRAINT "_projects_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_projects_v" ADD CONSTRAINT "_projects_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_projects_v" ADD CONSTRAINT "_projects_v_version_category_id_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "payload"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "payload"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."categories" ADD CONSTRAINT "categories_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."categories" ADD CONSTRAINT "categories_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."services_features" ADD CONSTRAINT "services_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."services_areas" ADD CONSTRAINT "services_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."services" ADD CONSTRAINT "services_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."services" ADD CONSTRAINT "services_related_category_id_categories_id_fk" FOREIGN KEY ("related_category_id") REFERENCES "payload"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."services" ADD CONSTRAINT "services_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."services_rels" ADD CONSTRAINT "services_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."services_rels" ADD CONSTRAINT "services_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "payload"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."packages_features" ADD CONSTRAINT "packages_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."packages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."packages" ADD CONSTRAINT "packages_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."packages" ADD CONSTRAINT "packages_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "payload"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."inquiries_internal_notes" ADD CONSTRAINT "inquiries_internal_notes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."inquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."posts" ADD CONSTRAINT "posts_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."posts" ADD CONSTRAINT "posts_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."posts" ADD CONSTRAINT "posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "payload"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."posts_texts" ADD CONSTRAINT "posts_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."posts_rels" ADD CONSTRAINT "posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."posts_rels" ADD CONSTRAINT "posts_rels_post_categories_fk" FOREIGN KEY ("post_categories_id") REFERENCES "payload"."post_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_posts_v" ADD CONSTRAINT "_posts_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_posts_v" ADD CONSTRAINT "_posts_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_posts_v" ADD CONSTRAINT "_posts_v_version_author_id_users_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "payload"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_posts_v_texts" ADD CONSTRAINT "_posts_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_post_categories_fk" FOREIGN KEY ("post_categories_id") REFERENCES "payload"."post_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_folders_folder_type" ADD CONSTRAINT "payload_folders_folder_type_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."payload_folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_folders" ADD CONSTRAINT "payload_folders_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "payload"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "payload"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "payload"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "payload"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_process_steps_fk" FOREIGN KEY ("process_steps_id") REFERENCES "payload"."process_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "payload"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "payload"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "payload"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_packages_fk" FOREIGN KEY ("packages_id") REFERENCES "payload"."packages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_availability_fk" FOREIGN KEY ("availability_id") REFERENCES "payload"."availability"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_inquiries_fk" FOREIGN KEY ("inquiries_id") REFERENCES "payload"."inquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "payload"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_post_categories_fk" FOREIGN KEY ("post_categories_id") REFERENCES "payload"."post_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "payload"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_folders_fk" FOREIGN KEY ("payload_folders_id") REFERENCES "payload"."payload_folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "payload"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."site_settings_budget_options" ADD CONSTRAINT "site_settings_budget_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."site_settings_hours_options" ADD CONSTRAINT "site_settings_hours_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."site_settings_header_links" ADD CONSTRAINT "site_settings_header_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."site_settings_footer_links" ADD CONSTRAINT "site_settings_footer_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."site_settings_legal_links" ADD CONSTRAINT "site_settings_legal_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."site_settings_social" ADD CONSTRAINT "site_settings_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."site_settings_service_areas" ADD CONSTRAINT "site_settings_service_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."site_settings" ADD CONSTRAINT "site_settings_favicon_id_media_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."site_settings" ADD CONSTRAINT "site_settings_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."about_experience" ADD CONSTRAINT "about_experience_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."about_facts" ADD CONSTRAINT "about_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."about_publications" ADD CONSTRAINT "about_publications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."about_awards" ADD CONSTRAINT "about_awards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."about" ADD CONSTRAINT "about_portrait_id_media_id_fk" FOREIGN KEY ("portrait_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."about" ADD CONSTRAINT "about_secondary_image_id_media_id_fk" FOREIGN KEY ("secondary_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_hero_order_idx" ON "payload"."pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_parent_id_idx" ON "payload"."pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_path_idx" ON "payload"."pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_page_header_order_idx" ON "payload"."pages_blocks_page_header" USING btree ("_order");
  CREATE INDEX "pages_blocks_page_header_parent_id_idx" ON "payload"."pages_blocks_page_header" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_page_header_path_idx" ON "payload"."pages_blocks_page_header" USING btree ("_path");
  CREATE INDEX "pages_blocks_page_header_image_idx" ON "payload"."pages_blocks_page_header" USING btree ("image_id");
  CREATE INDEX "pages_blocks_intro_order_idx" ON "payload"."pages_blocks_intro" USING btree ("_order");
  CREATE INDEX "pages_blocks_intro_parent_id_idx" ON "payload"."pages_blocks_intro" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_intro_path_idx" ON "payload"."pages_blocks_intro" USING btree ("_path");
  CREATE INDEX "pages_blocks_intro_image_idx" ON "payload"."pages_blocks_intro" USING btree ("image_id");
  CREATE INDEX "pages_blocks_intro_secondary_image_idx" ON "payload"."pages_blocks_intro" USING btree ("secondary_image_id");
  CREATE INDEX "pages_blocks_featured_portfolio_order_idx" ON "payload"."pages_blocks_featured_portfolio" USING btree ("_order");
  CREATE INDEX "pages_blocks_featured_portfolio_parent_id_idx" ON "payload"."pages_blocks_featured_portfolio" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_featured_portfolio_path_idx" ON "payload"."pages_blocks_featured_portfolio" USING btree ("_path");
  CREATE INDEX "pages_blocks_featured_portfolio_category_idx" ON "payload"."pages_blocks_featured_portfolio" USING btree ("category_id");
  CREATE INDEX "pages_blocks_featured_story_order_idx" ON "payload"."pages_blocks_featured_story" USING btree ("_order");
  CREATE INDEX "pages_blocks_featured_story_parent_id_idx" ON "payload"."pages_blocks_featured_story" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_featured_story_path_idx" ON "payload"."pages_blocks_featured_story" USING btree ("_path");
  CREATE INDEX "pages_blocks_featured_story_project_idx" ON "payload"."pages_blocks_featured_story" USING btree ("project_id");
  CREATE INDEX "pages_blocks_services_order_idx" ON "payload"."pages_blocks_services" USING btree ("_order");
  CREATE INDEX "pages_blocks_services_parent_id_idx" ON "payload"."pages_blocks_services" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_services_path_idx" ON "payload"."pages_blocks_services" USING btree ("_path");
  CREATE INDEX "pages_blocks_pricing_order_idx" ON "payload"."pages_blocks_pricing" USING btree ("_order");
  CREATE INDEX "pages_blocks_pricing_parent_id_idx" ON "payload"."pages_blocks_pricing" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pricing_path_idx" ON "payload"."pages_blocks_pricing" USING btree ("_path");
  CREATE INDEX "pages_blocks_process_order_idx" ON "payload"."pages_blocks_process" USING btree ("_order");
  CREATE INDEX "pages_blocks_process_parent_id_idx" ON "payload"."pages_blocks_process" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_process_path_idx" ON "payload"."pages_blocks_process" USING btree ("_path");
  CREATE INDEX "pages_blocks_process_image_idx" ON "payload"."pages_blocks_process" USING btree ("image_id");
  CREATE INDEX "pages_blocks_testimonials_order_idx" ON "payload"."pages_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_parent_id_idx" ON "payload"."pages_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_path_idx" ON "payload"."pages_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "pages_blocks_testimonials_background_image_idx" ON "payload"."pages_blocks_testimonials" USING btree ("background_image_id");
  CREATE INDEX "pages_blocks_faq_order_idx" ON "payload"."pages_blocks_faq" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_parent_id_idx" ON "payload"."pages_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_path_idx" ON "payload"."pages_blocks_faq" USING btree ("_path");
  CREATE INDEX "pages_blocks_availability_order_idx" ON "payload"."pages_blocks_availability" USING btree ("_order");
  CREATE INDEX "pages_blocks_availability_parent_id_idx" ON "payload"."pages_blocks_availability" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_availability_path_idx" ON "payload"."pages_blocks_availability" USING btree ("_path");
  CREATE INDEX "pages_blocks_contact_order_idx" ON "payload"."pages_blocks_contact" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_parent_id_idx" ON "payload"."pages_blocks_contact" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_path_idx" ON "payload"."pages_blocks_contact" USING btree ("_path");
  CREATE INDEX "pages_blocks_contact_image_idx" ON "payload"."pages_blocks_contact" USING btree ("image_id");
  CREATE INDEX "pages_blocks_instagram_order_idx" ON "payload"."pages_blocks_instagram" USING btree ("_order");
  CREATE INDEX "pages_blocks_instagram_parent_id_idx" ON "payload"."pages_blocks_instagram" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_instagram_path_idx" ON "payload"."pages_blocks_instagram" USING btree ("_path");
  CREATE INDEX "pages_blocks_about_order_idx" ON "payload"."pages_blocks_about" USING btree ("_order");
  CREATE INDEX "pages_blocks_about_parent_id_idx" ON "payload"."pages_blocks_about" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_about_path_idx" ON "payload"."pages_blocks_about" USING btree ("_path");
  CREATE INDEX "pages_blocks_rich_text_order_idx" ON "payload"."pages_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_rich_text_parent_id_idx" ON "payload"."pages_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rich_text_path_idx" ON "payload"."pages_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "pages_blocks_image_banner_order_idx" ON "payload"."pages_blocks_image_banner" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_banner_parent_id_idx" ON "payload"."pages_blocks_image_banner" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_banner_path_idx" ON "payload"."pages_blocks_image_banner" USING btree ("_path");
  CREATE INDEX "pages_blocks_image_banner_image_idx" ON "payload"."pages_blocks_image_banner" USING btree ("image_id");
  CREATE INDEX "pages_blocks_cta_order_idx" ON "payload"."pages_blocks_cta" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_parent_id_idx" ON "payload"."pages_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_path_idx" ON "payload"."pages_blocks_cta" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_image_idx" ON "payload"."pages_blocks_cta" USING btree ("image_id");
  CREATE INDEX "pages_blocks_portfolio_index_order_idx" ON "payload"."pages_blocks_portfolio_index" USING btree ("_order");
  CREATE INDEX "pages_blocks_portfolio_index_parent_id_idx" ON "payload"."pages_blocks_portfolio_index" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_portfolio_index_path_idx" ON "payload"."pages_blocks_portfolio_index" USING btree ("_path");
  CREATE INDEX "pages_blocks_journal_list_order_idx" ON "payload"."pages_blocks_journal_list" USING btree ("_order");
  CREATE INDEX "pages_blocks_journal_list_parent_id_idx" ON "payload"."pages_blocks_journal_list" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_journal_list_path_idx" ON "payload"."pages_blocks_journal_list" USING btree ("_path");
  CREATE INDEX "pages_blocks_gallery_order_idx" ON "payload"."pages_blocks_gallery" USING btree ("_order");
  CREATE INDEX "pages_blocks_gallery_parent_id_idx" ON "payload"."pages_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gallery_path_idx" ON "payload"."pages_blocks_gallery" USING btree ("_path");
  CREATE INDEX "pages_meta_meta_image_idx" ON "payload"."pages" USING btree ("meta_image_id");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "payload"."pages" USING btree ("slug");
  CREATE INDEX "pages_updated_at_idx" ON "payload"."pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "payload"."pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "payload"."pages" USING btree ("_status");
  CREATE INDEX "pages_rels_order_idx" ON "payload"."pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "payload"."pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "payload"."pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_media_id_idx" ON "payload"."pages_rels" USING btree ("media_id");
  CREATE INDEX "pages_rels_projects_id_idx" ON "payload"."pages_rels" USING btree ("projects_id");
  CREATE INDEX "pages_rels_services_id_idx" ON "payload"."pages_rels" USING btree ("services_id");
  CREATE INDEX "pages_rels_packages_id_idx" ON "payload"."pages_rels" USING btree ("packages_id");
  CREATE INDEX "pages_rels_testimonials_id_idx" ON "payload"."pages_rels" USING btree ("testimonials_id");
  CREATE INDEX "_pages_v_blocks_hero_order_idx" ON "payload"."_pages_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_parent_id_idx" ON "payload"."_pages_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_path_idx" ON "payload"."_pages_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_page_header_order_idx" ON "payload"."_pages_v_blocks_page_header" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_page_header_parent_id_idx" ON "payload"."_pages_v_blocks_page_header" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_page_header_path_idx" ON "payload"."_pages_v_blocks_page_header" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_page_header_image_idx" ON "payload"."_pages_v_blocks_page_header" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_intro_order_idx" ON "payload"."_pages_v_blocks_intro" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_intro_parent_id_idx" ON "payload"."_pages_v_blocks_intro" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_intro_path_idx" ON "payload"."_pages_v_blocks_intro" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_intro_image_idx" ON "payload"."_pages_v_blocks_intro" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_intro_secondary_image_idx" ON "payload"."_pages_v_blocks_intro" USING btree ("secondary_image_id");
  CREATE INDEX "_pages_v_blocks_featured_portfolio_order_idx" ON "payload"."_pages_v_blocks_featured_portfolio" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_featured_portfolio_parent_id_idx" ON "payload"."_pages_v_blocks_featured_portfolio" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_featured_portfolio_path_idx" ON "payload"."_pages_v_blocks_featured_portfolio" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_featured_portfolio_category_idx" ON "payload"."_pages_v_blocks_featured_portfolio" USING btree ("category_id");
  CREATE INDEX "_pages_v_blocks_featured_story_order_idx" ON "payload"."_pages_v_blocks_featured_story" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_featured_story_parent_id_idx" ON "payload"."_pages_v_blocks_featured_story" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_featured_story_path_idx" ON "payload"."_pages_v_blocks_featured_story" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_featured_story_project_idx" ON "payload"."_pages_v_blocks_featured_story" USING btree ("project_id");
  CREATE INDEX "_pages_v_blocks_services_order_idx" ON "payload"."_pages_v_blocks_services" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_services_parent_id_idx" ON "payload"."_pages_v_blocks_services" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_services_path_idx" ON "payload"."_pages_v_blocks_services" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_pricing_order_idx" ON "payload"."_pages_v_blocks_pricing" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_pricing_parent_id_idx" ON "payload"."_pages_v_blocks_pricing" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_pricing_path_idx" ON "payload"."_pages_v_blocks_pricing" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_process_order_idx" ON "payload"."_pages_v_blocks_process" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_process_parent_id_idx" ON "payload"."_pages_v_blocks_process" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_process_path_idx" ON "payload"."_pages_v_blocks_process" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_process_image_idx" ON "payload"."_pages_v_blocks_process" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_testimonials_order_idx" ON "payload"."_pages_v_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonials_parent_id_idx" ON "payload"."_pages_v_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_path_idx" ON "payload"."_pages_v_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_testimonials_background_image_idx" ON "payload"."_pages_v_blocks_testimonials" USING btree ("background_image_id");
  CREATE INDEX "_pages_v_blocks_faq_order_idx" ON "payload"."_pages_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_parent_id_idx" ON "payload"."_pages_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_path_idx" ON "payload"."_pages_v_blocks_faq" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_availability_order_idx" ON "payload"."_pages_v_blocks_availability" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_availability_parent_id_idx" ON "payload"."_pages_v_blocks_availability" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_availability_path_idx" ON "payload"."_pages_v_blocks_availability" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_contact_order_idx" ON "payload"."_pages_v_blocks_contact" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_contact_parent_id_idx" ON "payload"."_pages_v_blocks_contact" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_path_idx" ON "payload"."_pages_v_blocks_contact" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_contact_image_idx" ON "payload"."_pages_v_blocks_contact" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_instagram_order_idx" ON "payload"."_pages_v_blocks_instagram" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_instagram_parent_id_idx" ON "payload"."_pages_v_blocks_instagram" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_instagram_path_idx" ON "payload"."_pages_v_blocks_instagram" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_about_order_idx" ON "payload"."_pages_v_blocks_about" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_about_parent_id_idx" ON "payload"."_pages_v_blocks_about" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_about_path_idx" ON "payload"."_pages_v_blocks_about" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_rich_text_order_idx" ON "payload"."_pages_v_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_rich_text_parent_id_idx" ON "payload"."_pages_v_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rich_text_path_idx" ON "payload"."_pages_v_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_image_banner_order_idx" ON "payload"."_pages_v_blocks_image_banner" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_image_banner_parent_id_idx" ON "payload"."_pages_v_blocks_image_banner" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_image_banner_path_idx" ON "payload"."_pages_v_blocks_image_banner" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_image_banner_image_idx" ON "payload"."_pages_v_blocks_image_banner" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_cta_order_idx" ON "payload"."_pages_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_parent_id_idx" ON "payload"."_pages_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_path_idx" ON "payload"."_pages_v_blocks_cta" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_cta_image_idx" ON "payload"."_pages_v_blocks_cta" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_portfolio_index_order_idx" ON "payload"."_pages_v_blocks_portfolio_index" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_portfolio_index_parent_id_idx" ON "payload"."_pages_v_blocks_portfolio_index" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_portfolio_index_path_idx" ON "payload"."_pages_v_blocks_portfolio_index" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_journal_list_order_idx" ON "payload"."_pages_v_blocks_journal_list" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_journal_list_parent_id_idx" ON "payload"."_pages_v_blocks_journal_list" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_journal_list_path_idx" ON "payload"."_pages_v_blocks_journal_list" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_gallery_order_idx" ON "payload"."_pages_v_blocks_gallery" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gallery_parent_id_idx" ON "payload"."_pages_v_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gallery_path_idx" ON "payload"."_pages_v_blocks_gallery" USING btree ("_path");
  CREATE INDEX "_pages_v_parent_idx" ON "payload"."_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "payload"."_pages_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "payload"."_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "payload"."_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "payload"."_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "payload"."_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "payload"."_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "payload"."_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "payload"."_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_autosave_idx" ON "payload"."_pages_v" USING btree ("autosave");
  CREATE INDEX "_pages_v_rels_order_idx" ON "payload"."_pages_v_rels" USING btree ("order");
  CREATE INDEX "_pages_v_rels_parent_idx" ON "payload"."_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pages_v_rels_path_idx" ON "payload"."_pages_v_rels" USING btree ("path");
  CREATE INDEX "_pages_v_rels_media_id_idx" ON "payload"."_pages_v_rels" USING btree ("media_id");
  CREATE INDEX "_pages_v_rels_projects_id_idx" ON "payload"."_pages_v_rels" USING btree ("projects_id");
  CREATE INDEX "_pages_v_rels_services_id_idx" ON "payload"."_pages_v_rels" USING btree ("services_id");
  CREATE INDEX "_pages_v_rels_packages_id_idx" ON "payload"."_pages_v_rels" USING btree ("packages_id");
  CREATE INDEX "_pages_v_rels_testimonials_id_idx" ON "payload"."_pages_v_rels" USING btree ("testimonials_id");
  CREATE INDEX "media_folder_idx" ON "payload"."media" USING btree ("folder_id");
  CREATE INDEX "media_updated_at_idx" ON "payload"."media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "payload"."media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "payload"."media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumb_sizes_thumb_filename_idx" ON "payload"."media" USING btree ("sizes_thumb_filename");
  CREATE INDEX "media_sizes_medium_sizes_medium_filename_idx" ON "payload"."media" USING btree ("sizes_medium_filename");
  CREATE INDEX "media_sizes_large_sizes_large_filename_idx" ON "payload"."media" USING btree ("sizes_large_filename");
  CREATE INDEX "media_sizes_og_sizes_og_filename_idx" ON "payload"."media" USING btree ("sizes_og_filename");
  CREATE INDEX "testimonials__order_idx" ON "payload"."testimonials" USING btree ("_order");
  CREATE INDEX "testimonials_client_image_idx" ON "payload"."testimonials" USING btree ("client_image_id");
  CREATE INDEX "testimonials_category_idx" ON "payload"."testimonials" USING btree ("category_id");
  CREATE INDEX "testimonials_updated_at_idx" ON "payload"."testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "payload"."testimonials" USING btree ("created_at");
  CREATE INDEX "faqs__order_idx" ON "payload"."faqs" USING btree ("_order");
  CREATE INDEX "faqs_updated_at_idx" ON "payload"."faqs" USING btree ("updated_at");
  CREATE INDEX "faqs_created_at_idx" ON "payload"."faqs" USING btree ("created_at");
  CREATE INDEX "process_steps__order_idx" ON "payload"."process_steps" USING btree ("_order");
  CREATE INDEX "process_steps_updated_at_idx" ON "payload"."process_steps" USING btree ("updated_at");
  CREATE INDEX "process_steps_created_at_idx" ON "payload"."process_steps" USING btree ("created_at");
  CREATE INDEX "projects_chapters_order_idx" ON "payload"."projects_chapters" USING btree ("_order");
  CREATE INDEX "projects_chapters_parent_id_idx" ON "payload"."projects_chapters" USING btree ("_parent_id");
  CREATE INDEX "projects_credits_order_idx" ON "payload"."projects_credits" USING btree ("_order");
  CREATE INDEX "projects_credits_parent_id_idx" ON "payload"."projects_credits" USING btree ("_parent_id");
  CREATE INDEX "projects__order_idx" ON "payload"."projects" USING btree ("_order");
  CREATE INDEX "projects_cover_idx" ON "payload"."projects" USING btree ("cover_id");
  CREATE INDEX "projects_meta_meta_image_idx" ON "payload"."projects" USING btree ("meta_image_id");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "payload"."projects" USING btree ("slug");
  CREATE INDEX "projects_category_idx" ON "payload"."projects" USING btree ("category_id");
  CREATE INDEX "projects_updated_at_idx" ON "payload"."projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "payload"."projects" USING btree ("created_at");
  CREATE INDEX "projects__status_idx" ON "payload"."projects" USING btree ("_status");
  CREATE INDEX "projects_rels_order_idx" ON "payload"."projects_rels" USING btree ("order");
  CREATE INDEX "projects_rels_parent_idx" ON "payload"."projects_rels" USING btree ("parent_id");
  CREATE INDEX "projects_rels_path_idx" ON "payload"."projects_rels" USING btree ("path");
  CREATE INDEX "projects_rels_media_id_idx" ON "payload"."projects_rels" USING btree ("media_id");
  CREATE INDEX "_projects_v_version_chapters_order_idx" ON "payload"."_projects_v_version_chapters" USING btree ("_order");
  CREATE INDEX "_projects_v_version_chapters_parent_id_idx" ON "payload"."_projects_v_version_chapters" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_credits_order_idx" ON "payload"."_projects_v_version_credits" USING btree ("_order");
  CREATE INDEX "_projects_v_version_credits_parent_id_idx" ON "payload"."_projects_v_version_credits" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_parent_idx" ON "payload"."_projects_v" USING btree ("parent_id");
  CREATE INDEX "_projects_v_version_version__order_idx" ON "payload"."_projects_v" USING btree ("version__order");
  CREATE INDEX "_projects_v_version_version_cover_idx" ON "payload"."_projects_v" USING btree ("version_cover_id");
  CREATE INDEX "_projects_v_version_meta_version_meta_image_idx" ON "payload"."_projects_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_projects_v_version_version_slug_idx" ON "payload"."_projects_v" USING btree ("version_slug");
  CREATE INDEX "_projects_v_version_version_category_idx" ON "payload"."_projects_v" USING btree ("version_category_id");
  CREATE INDEX "_projects_v_version_version_updated_at_idx" ON "payload"."_projects_v" USING btree ("version_updated_at");
  CREATE INDEX "_projects_v_version_version_created_at_idx" ON "payload"."_projects_v" USING btree ("version_created_at");
  CREATE INDEX "_projects_v_version_version__status_idx" ON "payload"."_projects_v" USING btree ("version__status");
  CREATE INDEX "_projects_v_created_at_idx" ON "payload"."_projects_v" USING btree ("created_at");
  CREATE INDEX "_projects_v_updated_at_idx" ON "payload"."_projects_v" USING btree ("updated_at");
  CREATE INDEX "_projects_v_latest_idx" ON "payload"."_projects_v" USING btree ("latest");
  CREATE INDEX "_projects_v_autosave_idx" ON "payload"."_projects_v" USING btree ("autosave");
  CREATE INDEX "_projects_v_rels_order_idx" ON "payload"."_projects_v_rels" USING btree ("order");
  CREATE INDEX "_projects_v_rels_parent_idx" ON "payload"."_projects_v_rels" USING btree ("parent_id");
  CREATE INDEX "_projects_v_rels_path_idx" ON "payload"."_projects_v_rels" USING btree ("path");
  CREATE INDEX "_projects_v_rels_media_id_idx" ON "payload"."_projects_v_rels" USING btree ("media_id");
  CREATE INDEX "categories__order_idx" ON "payload"."categories" USING btree ("_order");
  CREATE INDEX "categories_cover_idx" ON "payload"."categories" USING btree ("cover_id");
  CREATE INDEX "categories_meta_meta_image_idx" ON "payload"."categories" USING btree ("meta_image_id");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "payload"."categories" USING btree ("slug");
  CREATE INDEX "categories_updated_at_idx" ON "payload"."categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "payload"."categories" USING btree ("created_at");
  CREATE INDEX "services_features_order_idx" ON "payload"."services_features" USING btree ("_order");
  CREATE INDEX "services_features_parent_id_idx" ON "payload"."services_features" USING btree ("_parent_id");
  CREATE INDEX "services_areas_order_idx" ON "payload"."services_areas" USING btree ("_order");
  CREATE INDEX "services_areas_parent_id_idx" ON "payload"."services_areas" USING btree ("_parent_id");
  CREATE INDEX "services__order_idx" ON "payload"."services" USING btree ("_order");
  CREATE INDEX "services_image_idx" ON "payload"."services" USING btree ("image_id");
  CREATE INDEX "services_related_category_idx" ON "payload"."services" USING btree ("related_category_id");
  CREATE INDEX "services_meta_meta_image_idx" ON "payload"."services" USING btree ("meta_image_id");
  CREATE UNIQUE INDEX "services_slug_idx" ON "payload"."services" USING btree ("slug");
  CREATE INDEX "services_updated_at_idx" ON "payload"."services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "payload"."services" USING btree ("created_at");
  CREATE INDEX "services_rels_order_idx" ON "payload"."services_rels" USING btree ("order");
  CREATE INDEX "services_rels_parent_idx" ON "payload"."services_rels" USING btree ("parent_id");
  CREATE INDEX "services_rels_path_idx" ON "payload"."services_rels" USING btree ("path");
  CREATE INDEX "services_rels_media_id_idx" ON "payload"."services_rels" USING btree ("media_id");
  CREATE INDEX "packages_features_order_idx" ON "payload"."packages_features" USING btree ("_order");
  CREATE INDEX "packages_features_parent_id_idx" ON "payload"."packages_features" USING btree ("_parent_id");
  CREATE INDEX "packages__order_idx" ON "payload"."packages" USING btree ("_order");
  CREATE INDEX "packages_image_idx" ON "payload"."packages" USING btree ("image_id");
  CREATE UNIQUE INDEX "packages_slug_idx" ON "payload"."packages" USING btree ("slug");
  CREATE INDEX "packages_service_idx" ON "payload"."packages" USING btree ("service_id");
  CREATE INDEX "packages_updated_at_idx" ON "payload"."packages" USING btree ("updated_at");
  CREATE INDEX "packages_created_at_idx" ON "payload"."packages" USING btree ("created_at");
  CREATE UNIQUE INDEX "availability_date_idx" ON "payload"."availability" USING btree ("date");
  CREATE INDEX "availability_updated_at_idx" ON "payload"."availability" USING btree ("updated_at");
  CREATE INDEX "availability_created_at_idx" ON "payload"."availability" USING btree ("created_at");
  CREATE INDEX "inquiries_internal_notes_order_idx" ON "payload"."inquiries_internal_notes" USING btree ("_order");
  CREATE INDEX "inquiries_internal_notes_parent_id_idx" ON "payload"."inquiries_internal_notes" USING btree ("_parent_id");
  CREATE INDEX "inquiries_status_idx" ON "payload"."inquiries" USING btree ("status");
  CREATE INDEX "inquiries_updated_at_idx" ON "payload"."inquiries" USING btree ("updated_at");
  CREATE INDEX "inquiries_created_at_idx" ON "payload"."inquiries" USING btree ("created_at");
  CREATE INDEX "posts_cover_idx" ON "payload"."posts" USING btree ("cover_id");
  CREATE INDEX "posts_meta_meta_image_idx" ON "payload"."posts" USING btree ("meta_image_id");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "payload"."posts" USING btree ("slug");
  CREATE INDEX "posts_author_idx" ON "payload"."posts" USING btree ("author_id");
  CREATE INDEX "posts_updated_at_idx" ON "payload"."posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "payload"."posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "payload"."posts" USING btree ("_status");
  CREATE INDEX "posts_texts_order_parent" ON "payload"."posts_texts" USING btree ("order","parent_id");
  CREATE INDEX "posts_rels_order_idx" ON "payload"."posts_rels" USING btree ("order");
  CREATE INDEX "posts_rels_parent_idx" ON "payload"."posts_rels" USING btree ("parent_id");
  CREATE INDEX "posts_rels_path_idx" ON "payload"."posts_rels" USING btree ("path");
  CREATE INDEX "posts_rels_post_categories_id_idx" ON "payload"."posts_rels" USING btree ("post_categories_id");
  CREATE INDEX "_posts_v_parent_idx" ON "payload"."_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_cover_idx" ON "payload"."_posts_v" USING btree ("version_cover_id");
  CREATE INDEX "_posts_v_version_meta_version_meta_image_idx" ON "payload"."_posts_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "payload"."_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_author_idx" ON "payload"."_posts_v" USING btree ("version_author_id");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "payload"."_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "payload"."_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "payload"."_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "payload"."_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "payload"."_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_latest_idx" ON "payload"."_posts_v" USING btree ("latest");
  CREATE INDEX "_posts_v_autosave_idx" ON "payload"."_posts_v" USING btree ("autosave");
  CREATE INDEX "_posts_v_texts_order_parent" ON "payload"."_posts_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "_posts_v_rels_order_idx" ON "payload"."_posts_v_rels" USING btree ("order");
  CREATE INDEX "_posts_v_rels_parent_idx" ON "payload"."_posts_v_rels" USING btree ("parent_id");
  CREATE INDEX "_posts_v_rels_path_idx" ON "payload"."_posts_v_rels" USING btree ("path");
  CREATE INDEX "_posts_v_rels_post_categories_id_idx" ON "payload"."_posts_v_rels" USING btree ("post_categories_id");
  CREATE UNIQUE INDEX "post_categories_slug_idx" ON "payload"."post_categories" USING btree ("slug");
  CREATE INDEX "post_categories_updated_at_idx" ON "payload"."post_categories" USING btree ("updated_at");
  CREATE INDEX "post_categories_created_at_idx" ON "payload"."post_categories" USING btree ("created_at");
  CREATE INDEX "users_sessions_order_idx" ON "payload"."users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "payload"."users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "payload"."users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "payload"."users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "payload"."users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload"."payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload"."payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload"."payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload"."payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload"."payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload"."payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload"."payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload"."payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload"."payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload"."payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload"."payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload"."payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_folders_folder_type_order_idx" ON "payload"."payload_folders_folder_type" USING btree ("order");
  CREATE INDEX "payload_folders_folder_type_parent_idx" ON "payload"."payload_folders_folder_type" USING btree ("parent_id");
  CREATE INDEX "payload_folders_name_idx" ON "payload"."payload_folders" USING btree ("name");
  CREATE INDEX "payload_folders_folder_idx" ON "payload"."payload_folders" USING btree ("folder_id");
  CREATE INDEX "payload_folders_updated_at_idx" ON "payload"."payload_folders" USING btree ("updated_at");
  CREATE INDEX "payload_folders_created_at_idx" ON "payload"."payload_folders" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload"."payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload"."payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload"."payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload"."payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload"."payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload"."payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_faqs_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("faqs_id");
  CREATE INDEX "payload_locked_documents_rels_process_steps_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("process_steps_id");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_packages_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("packages_id");
  CREATE INDEX "payload_locked_documents_rels_availability_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("availability_id");
  CREATE INDEX "payload_locked_documents_rels_inquiries_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("inquiries_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_post_categories_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("post_categories_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_payload_folders_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("payload_folders_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload"."payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload"."payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload"."payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload"."payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload"."payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload"."payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload"."payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload"."payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload"."payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_budget_options_order_idx" ON "payload"."site_settings_budget_options" USING btree ("_order");
  CREATE INDEX "site_settings_budget_options_parent_id_idx" ON "payload"."site_settings_budget_options" USING btree ("_parent_id");
  CREATE INDEX "site_settings_hours_options_order_idx" ON "payload"."site_settings_hours_options" USING btree ("_order");
  CREATE INDEX "site_settings_hours_options_parent_id_idx" ON "payload"."site_settings_hours_options" USING btree ("_parent_id");
  CREATE INDEX "site_settings_header_links_order_idx" ON "payload"."site_settings_header_links" USING btree ("_order");
  CREATE INDEX "site_settings_header_links_parent_id_idx" ON "payload"."site_settings_header_links" USING btree ("_parent_id");
  CREATE INDEX "site_settings_footer_links_order_idx" ON "payload"."site_settings_footer_links" USING btree ("_order");
  CREATE INDEX "site_settings_footer_links_parent_id_idx" ON "payload"."site_settings_footer_links" USING btree ("_parent_id");
  CREATE INDEX "site_settings_legal_links_order_idx" ON "payload"."site_settings_legal_links" USING btree ("_order");
  CREATE INDEX "site_settings_legal_links_parent_id_idx" ON "payload"."site_settings_legal_links" USING btree ("_parent_id");
  CREATE INDEX "site_settings_social_order_idx" ON "payload"."site_settings_social" USING btree ("_order");
  CREATE INDEX "site_settings_social_parent_id_idx" ON "payload"."site_settings_social" USING btree ("_parent_id");
  CREATE INDEX "site_settings_service_areas_order_idx" ON "payload"."site_settings_service_areas" USING btree ("_order");
  CREATE INDEX "site_settings_service_areas_parent_id_idx" ON "payload"."site_settings_service_areas" USING btree ("_parent_id");
  CREATE INDEX "site_settings_logo_idx" ON "payload"."site_settings" USING btree ("logo_id");
  CREATE INDEX "site_settings_favicon_idx" ON "payload"."site_settings" USING btree ("favicon_id");
  CREATE INDEX "site_settings_og_image_idx" ON "payload"."site_settings" USING btree ("og_image_id");
  CREATE INDEX "about_experience_order_idx" ON "payload"."about_experience" USING btree ("_order");
  CREATE INDEX "about_experience_parent_id_idx" ON "payload"."about_experience" USING btree ("_parent_id");
  CREATE INDEX "about_facts_order_idx" ON "payload"."about_facts" USING btree ("_order");
  CREATE INDEX "about_facts_parent_id_idx" ON "payload"."about_facts" USING btree ("_parent_id");
  CREATE INDEX "about_publications_order_idx" ON "payload"."about_publications" USING btree ("_order");
  CREATE INDEX "about_publications_parent_id_idx" ON "payload"."about_publications" USING btree ("_parent_id");
  CREATE INDEX "about_awards_order_idx" ON "payload"."about_awards" USING btree ("_order");
  CREATE INDEX "about_awards_parent_id_idx" ON "payload"."about_awards" USING btree ("_parent_id");
  CREATE INDEX "about_portrait_idx" ON "payload"."about" USING btree ("portrait_id");
  CREATE INDEX "about_secondary_image_idx" ON "payload"."about" USING btree ("secondary_image_id");

-- Tell Payload this migration has already been applied.
INSERT INTO "payload"."payload_migrations" ("name", "batch") VALUES ('20260923_111354_initial', 1);

-- 20260923_120247_blob_object_key: storage key for photos kept in Vercel Blob
ALTER TABLE "payload"."media" ADD COLUMN "_objectkey" varchar;
INSERT INTO "payload"."payload_migrations" ("name", "batch") VALUES ('20260923_120247_blob_object_key', 2);

-- 20260923_122605_developer_credit: "Website by …" credit in the footer
ALTER TABLE "payload"."site_settings" ADD COLUMN "show_developer_credit" boolean DEFAULT true;
ALTER TABLE "payload"."site_settings" ADD COLUMN "developer_name" varchar DEFAULT 'Hamid Ehsani';
ALTER TABLE "payload"."site_settings" ADD COLUMN "developer_url" varchar;
INSERT INTO "payload"."payload_migrations" ("name", "batch") VALUES ('20260923_122605_developer_credit', 3);
COMMIT;
