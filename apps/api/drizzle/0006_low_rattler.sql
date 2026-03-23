CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(100) NOT NULL,
	"name_fr" varchar(255) NOT NULL,
	"name_en" varchar(255) NOT NULL,
	"description_fr" text,
	"description_en" text,
	"features_fr" text[],
	"features_en" text[],
	"price_cents" integer NOT NULL,
	"stripe_price_id" varchar(255),
	"image_url" varchar(500),
	"is_active" boolean DEFAULT true NOT NULL,
	"requires_item" boolean DEFAULT false NOT NULL,
	"custom_mechanic" varchar(50),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "product_id" uuid;--> statement-breakpoint
CREATE INDEX "products_slug_idx" ON "products" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "products_sort_order_idx" ON "products" USING btree ("sort_order");--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
-- Seed products
INSERT INTO "products" ("slug", "name_fr", "name_en", "description_fr", "description_en", "features_fr", "features_en", "price_cents", "is_active", "requires_item", "custom_mechanic", "sort_order", "image_url")
VALUES
  ('sticker-sheet', 'Feuille de 20 autocollants d''identification RNBP', 'Sheet of 20 RNBP identification stickers', 'Étiquettes inaltérables avec votre numéro RNBP unique. Collez-les sur vos biens pour les identifier rapidement en cas de perte ou de vol.', 'Tamper-proof labels with your unique RNBP number. Stick them on your belongings for quick identification in case of loss or theft.', ARRAY['Résistants aux intempéries et à l''usure', 'Numéro RNBP unique par feuille', 'Adhésif permanent haute qualité', 'Format compact — facile à coller partout'], ARRAY['Weather and wear resistant', 'Unique RNBP number per sheet', 'High-quality permanent adhesive', 'Compact format — easy to stick anywhere'], 0, true, true, 'item-linked-stickers', 0, '/assets/product-stickers.png'),
  ('door-sticker', 'Collant de protection RNBP', 'RNBP Protection Sticker', 'Pour fenêtres et portes. Signalez que vos biens sont enregistrés et protégés par le RNBP, comme les anciens autocollants de systèmes d''alarme. Effet dissuasif prouvé.', 'For windows and doors. Signal that your valuables are registered and protected by the NRPP, like classic alarm system stickers. Proven deterrent effect.', ARRAY['Résistant aux UV et aux intempéries', 'Design professionnel et dissuasif', 'Adhésif repositionnable', 'Idéal pour portes et fenêtres'], ARRAY['UV and weather resistant', 'Professional deterrent design', 'Repositionable adhesive', 'Ideal for doors and windows'], 0, true, false, NULL, 1, '/assets/product-door-sticker.png')
ON CONFLICT ("slug") DO NOTHING;