-- Return to the RNBP name (T28): Badge codes take the BID- prefix. The 8-character
-- base-31 suffix is unchanged, so every code keeps its place in its sheet's range.
-- No foreign key points at these columns.
UPDATE `sticker_codes` SET `code` = 'BID-' || substr(`code`, 7) WHERE `code` LIKE 'BADGE-%';
--> statement-breakpoint
UPDATE `items` SET `badge_code` = 'BID-' || substr(`badge_code`, 7) WHERE `badge_code` LIKE 'BADGE-%';
--> statement-breakpoint
UPDATE `order_items` SET `badge_code` = 'BID-' || substr(`badge_code`, 7) WHERE `badge_code` LIKE 'BADGE-%';
