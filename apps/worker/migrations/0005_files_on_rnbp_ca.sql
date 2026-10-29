-- Return to the RNBP name (T28, wave 2): uploads move from the badge-uploads
-- bucket (files.badgeid.ca) to rnbp-uploads (files.rnbp.ca). Photo and document
-- URLs are stored absolute, so they are rewritten here; staging's host is
-- rewritten the same way. Rows already on rnbp.ca are left alone.
UPDATE `item_photos` SET `url` = replace(`url`, 'https://files.badgeid.ca/', 'https://files.rnbp.ca/') WHERE `url` LIKE 'https://files.badgeid.ca/%';
--> statement-breakpoint
UPDATE `item_documents` SET `url` = replace(`url`, 'https://files.badgeid.ca/', 'https://files.rnbp.ca/') WHERE `url` LIKE 'https://files.badgeid.ca/%';
--> statement-breakpoint
UPDATE `item_photos` SET `url` = replace(`url`, 'https://files-staging.badgeid.ca/', 'https://files-staging.rnbp.ca/') WHERE `url` LIKE 'https://files-staging.badgeid.ca/%';
--> statement-breakpoint
UPDATE `item_documents` SET `url` = replace(`url`, 'https://files-staging.badgeid.ca/', 'https://files-staging.rnbp.ca/') WHERE `url` LIKE 'https://files-staging.badgeid.ca/%';
