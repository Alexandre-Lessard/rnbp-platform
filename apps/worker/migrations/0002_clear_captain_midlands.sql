CREATE TABLE `ad_spend` (
	`id` text PRIMARY KEY NOT NULL,
	`campaign` text NOT NULL,
	`platform` text DEFAULT 'facebook' NOT NULL,
	`amount_cents` integer NOT NULL,
	`period_start` integer NOT NULL,
	`period_end` integer NOT NULL,
	`note` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `ad_spend_campaign_idx` ON `ad_spend` (`campaign`);--> statement-breakpoint
ALTER TABLE `orders` ADD `utm_source` text;--> statement-breakpoint
ALTER TABLE `orders` ADD `utm_medium` text;--> statement-breakpoint
ALTER TABLE `orders` ADD `utm_campaign` text;--> statement-breakpoint
ALTER TABLE `orders` ADD `fbclid` text;--> statement-breakpoint
ALTER TABLE `orders` ADD `ad_consent` integer;--> statement-breakpoint
ALTER TABLE `orders` ADD `capi_event_id` text;--> statement-breakpoint
ALTER TABLE `orders` ADD `capi_sent_at` integer;--> statement-breakpoint
CREATE INDEX `orders_utm_campaign_idx` ON `orders` (`utm_campaign`);--> statement-breakpoint
ALTER TABLE `users` ADD `utm_source` text;--> statement-breakpoint
ALTER TABLE `users` ADD `utm_medium` text;--> statement-breakpoint
ALTER TABLE `users` ADD `utm_campaign` text;