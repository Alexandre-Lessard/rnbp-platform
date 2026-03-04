import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  pgEnum,
  integer,
  index,
} from "drizzle-orm/pg-core";

// ── Enums ──────────────────────────────────────────────────────────────

export const itemStatusEnum = pgEnum("item_status", [
  "active",
  "stolen",
  "recovered",
  "transferred",
]);

export const reportStatusEnum = pgEnum("report_status", [
  "pending",
  "confirmed",
  "resolved",
  "dismissed",
]);

// ── Users ──────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  emailVerified: boolean("email_verified").notNull().default(false),
  tokenRevokedBefore: timestamp("token_revoked_before", {
    withTimezone: true,
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ── Sessions ───────────────────────────────────────────────────────────

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    deviceInfo: text("device_info"),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("sessions_user_id_idx").on(table.userId)],
);

// ── Items ──────────────────────────────────────────────────────────────

export const items = pgTable(
  "items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    category: varchar("category", { length: 100 }).notNull(),
    brand: varchar("brand", { length: 100 }),
    model: varchar("model", { length: 100 }),
    serialNumber: varchar("serial_number", { length: 255 }),
    estimatedValue: integer("estimated_value"),
    purchaseDate: timestamp("purchase_date", { withTimezone: true }),
    status: itemStatusEnum("status").notNull().default("active"),
    rcbpNumber: varchar("rcbp_number", { length: 13 }).notNull().unique(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("items_owner_id_idx").on(table.ownerId),
    index("items_rcbp_number_idx").on(table.rcbpNumber),
    index("items_status_idx").on(table.status),
  ],
);

// ── Item Photos ────────────────────────────────────────────────────────

export const itemPhotos = pgTable(
  "item_photos",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    itemId: uuid("item_id")
      .notNull()
      .references(() => items.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    caption: varchar("caption", { length: 255 }),
    isPrimary: boolean("is_primary").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("item_photos_item_id_idx").on(table.itemId)],
);

// ── Item Documents ─────────────────────────────────────────────────────

export const itemDocuments = pgTable(
  "item_documents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    itemId: uuid("item_id")
      .notNull()
      .references(() => items.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    type: varchar("type", { length: 50 }).notNull(),
    fileName: varchar("file_name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("item_documents_item_id_idx").on(table.itemId)],
);

// ── Theft Reports ──────────────────────────────────────────────────────

export const theftReports = pgTable(
  "theft_reports",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    itemId: uuid("item_id")
      .notNull()
      .references(() => items.id, { onDelete: "cascade" }),
    reporterId: uuid("reporter_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    policeReportNumber: varchar("police_report_number", { length: 100 }),
    theftDate: timestamp("theft_date", { withTimezone: true }),
    theftLocation: varchar("theft_location", { length: 500 }),
    description: text("description"),
    status: reportStatusEnum("status").notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("theft_reports_item_id_idx").on(table.itemId),
    index("theft_reports_reporter_id_idx").on(table.reporterId),
  ],
);

// ── Insurance Requests ─────────────────────────────────────────────────

export const insuranceRequests = pgTable("insurance_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  insurerName: varchar("insurer_name", { length: 100 }).notNull(),
  messageContent: text("message_content").notNull(),
  sentAt: timestamp("sent_at", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ── Partners ───────────────────────────────────────────────────────────

export const partnerTypeEnum = pgEnum("partner_type", [
  "insurer",
  "retailer",
  "security",
  "other",
]);

export const partners = pgTable("partners", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyName: varchar("company_name", { length: 255 }).notNull(),
  type: partnerTypeEnum("type").notNull(),
  contactEmail: varchar("contact_email", { length: 255 }),
  contactPhone: varchar("contact_phone", { length: 20 }),
  website: varchar("website", { length: 500 }),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ── Newsletter Subscribers ─────────────────────────────────────────────

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
