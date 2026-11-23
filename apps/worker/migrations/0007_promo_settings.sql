CREATE TABLE `promo_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`auto_hide` integer DEFAULT true NOT NULL,
	`ends_on` text NOT NULL,
	`text_fr` text NOT NULL,
	`text_en` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
-- The offer that was hard-coded in fr.ts / en.ts until now. The "valid until"
-- sentence is no longer part of the text: the web app builds it from ends_on.
INSERT INTO `promo_settings` (`id`, `active`, `auto_hide`, `ends_on`, `text_fr`, `text_en`, `created_at`, `updated_at`)
VALUES ('current', 1, 1, '2027-01-01', 'Obtenez vos étiquettes d''identification gratuitement.', 'Get your identification labels for free.', 1795471937028, 1795471937028);
