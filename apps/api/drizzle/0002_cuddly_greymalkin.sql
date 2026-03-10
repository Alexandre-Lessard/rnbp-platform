CREATE TYPE "public"."order_status" AS ENUM('pending', 'paid', 'shipped', 'cancelled');--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"rnbp_number" varchar(13),
	"product_type" varchar(50) NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price_cents" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"user_id" uuid,
	"stripe_session_id" varchar(255),
	"stripe_payment_intent_id" varchar(255),
	"total_amount_cents" integer NOT NULL,
	"status" "order_status" DEFAULT 'pending' NOT NULL,
	"shipping_name" varchar(255),
	"shipping_address" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "orders_stripe_session_id_unique" UNIQUE("stripe_session_id")
);
--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "year" integer;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "order_items_order_id_idx" ON "order_items" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "orders_user_id_idx" ON "orders" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "orders_stripe_session_id_idx" ON "orders" USING btree ("stripe_session_id");