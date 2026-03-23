ALTER TABLE "items" ADD COLUMN "archived_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "archive_reason" varchar(50);--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "archive_reason_custom" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "preferred_language" varchar(2) DEFAULT 'fr' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "terms_accepted_at" timestamp with time zone;