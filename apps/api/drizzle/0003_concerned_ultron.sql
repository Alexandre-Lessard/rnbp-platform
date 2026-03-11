ALTER TABLE "items" ALTER COLUMN "rnbp_number" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "item_id" uuid;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_admin" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "client_number" varchar(9);--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "order_items_item_id_idx" ON "order_items" USING btree ("item_id");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_client_number_unique" UNIQUE("client_number");