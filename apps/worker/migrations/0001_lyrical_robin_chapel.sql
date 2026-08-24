ALTER TABLE `newsletter_subscribers` ADD `consent_source` text;--> statement-breakpoint
ALTER TABLE `newsletter_subscribers` ADD `consent_at` integer;--> statement-breakpoint
ALTER TABLE `newsletter_subscribers` ADD `unsubscribed_at` integer;