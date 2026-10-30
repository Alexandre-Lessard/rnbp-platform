-- Product photos replaced since the return to RNBP (T28) get new file names, because
-- /assets/* is served immutable for a year and a browser that saw the old BadgeID
-- picture would keep it. Only the catalog's paths change; the files moved in the web app.
UPDATE `products` SET `image_urls` = replace(`image_urls`, '/assets/product-door-sticker.webp', '/assets/product-door-sticker-rnbp.webp')
WHERE `image_urls` LIKE '%/assets/product-door-sticker.webp%';
--> statement-breakpoint
UPDATE `products` SET `image_urls` = replace(replace(replace(`image_urls`,
  '/assets/product-stickers.webp', '/assets/product-stickers-bid.webp'),
  '/assets/product-stickers-detail.webp', '/assets/product-stickers-bid-detail.webp'),
  '/assets/product-stickers-closeup.webp', '/assets/product-stickers-bid-closeup.webp')
WHERE `image_urls` LIKE '%/assets/product-stickers%' AND `image_urls` NOT LIKE '%product-stickers-bid%';
