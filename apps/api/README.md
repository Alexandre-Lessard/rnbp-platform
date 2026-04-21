# @rnbp/api — Backend

REST API for the National Registry of Personal Property.

## Stack

Fastify 5, Drizzle ORM, PostgreSQL 16, JWT EdDSA (Ed25519), Argon2, Brevo (transactional emails).

## Local setup

```bash
# Copy config
cp .env.example .env
# Edit .env (DATABASE_URL, JWT keys, etc.)

# Create the PostgreSQL database
createdb rnbp_development

# Generate Ed25519 JWT keys
openssl genpkey -algorithm Ed25519 -out /tmp/ed25519_private.pem
openssl pkey -in /tmp/ed25519_private.pem -pubout -out /tmp/ed25519_public.pem
echo "JWT_PRIVATE_KEY=$(base64 -w 0 /tmp/ed25519_private.pem)"
echo "JWT_PUBLIC_KEY=$(base64 -w 0 /tmp/ed25519_public.pem)"
rm /tmp/ed25519_private.pem /tmp/ed25519_public.pem
# Copy the values into .env

# Start in dev mode (auto-migrate + hot reload)
pnpm dev:api
```

## Environment variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | — | PostgreSQL connection URL |
| `JWT_PRIVATE_KEY` | Yes | — | Ed25519 private key (base64) |
| `JWT_PUBLIC_KEY` | Yes | — | Ed25519 public key (base64) |
| `NODE_ENV` | No | `development` | `development`, `production`, `test` |
| `PORT` | No | `3000` | Server port |
| `HOST` | No | `0.0.0.0` | Server host |
| `JWT_ACCESS_EXPIRES_IN` | No | `15m` | Access token duration |
| `JWT_REFRESH_EXPIRES_IN` | No | `7d` | Refresh token duration |
| `CORS_ORIGINS` | No | `http://localhost:5173` | Allowed CORS origins (comma-separated) |
| `UPLOAD_DIR` | No | `./uploads` | Upload directory |
| `MAX_FILE_SIZE` | No | `10485760` | Max file size (10 MB) |
| `BREVO_API_KEY` | No | — | Brevo API key (emails). Without key = console log. |
| `FROM_EMAIL` | No | `noreply@rnbp.ca` | Sender email address |
| `FROM_NAME` | No | `RNBP` | Sender name |
| `FRONTEND_URL` | No | `http://localhost:5173` | Frontend URL (used for links in emails) |
| `GOOGLE_CLIENT_ID` | No | — | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | No | — | Google OAuth client secret |
| `MICROSOFT_CLIENT_ID` | No | — | Microsoft OAuth client ID |
| `MICROSOFT_CLIENT_SECRET` | No | — | Microsoft OAuth client secret |
| `FACEBOOK_CLIENT_ID` | No | — | Facebook OAuth app ID |
| `FACEBOOK_CLIENT_SECRET` | No | — | Facebook OAuth app secret |
| `R2_ACCOUNT_ID` | No | — | Cloudflare account ID for R2 storage |
| `R2_ACCESS_KEY_ID` | No | — | R2 S3-compatible access key ID |
| `R2_SECRET_ACCESS_KEY` | No | — | R2 S3-compatible secret access key |
| `R2_BUCKET_NAME` | No | `rnbp-uploads` | R2 bucket used for item photos and documents |
| `R2_PUBLIC_URL` | No | `https://pub-xxx.r2.dev` | Enabled public R2 domain used to serve uploaded files |

## Database

### Tables

| Table | Description |
|-------|-------------|
| `users` | User accounts (email, hashed password, preferred language, optional civic address, email verification, OAuth links) |
| `sessions` | Active sessions (refresh token hash, expiration) |
| `items` | Registered items (nullable RNBP number, assigned by admin, status, owner) |
| `item_photos` | Photos associated with items (`isPrimary` supported, oldest remaining photo is promoted on primary deletion) |
| `item_documents` | Documents (receipts, warranties, invoices) |
| `theft_reports` | Theft reports |
| `insurance_requests` | Insurance requests |
| `partners` | Partners (insurers, retailers) |
| `orders` | Stripe orders (status, amount) |
| `order_items` | Order line items (item reference, quantity, assigned RNBP number) |
| `contact_messages` | Contact form messages |
| `newsletter_subscribers` | Newsletter subscribers |

### Migrations

Drizzle migrations run automatically on backend startup (both dev and prod).

```bash
# Migration workflow:

# 1. Edit the schema in src/db/schema.ts

# 2. Generate the migration SQL
pnpm db:generate

# 3. Review the generated SQL file in drizzle/

# 4. Start the backend — migrations apply automatically
pnpm dev:api
```

## API routes

All routes are prefixed with `/api`.

### Authentication (`/auth`)

| Method | Path | Auth | Rate limit | Description |
|--------|------|------|------------|-------------|
| POST | `/auth/register` | No | 5/min | Create an account |
| POST | `/auth/login` | No | 5/min | Log in |
| POST | `/auth/google` | No | 5/min | OAuth login with Google |
| POST | `/auth/facebook` | No | 5/min | OAuth login with Facebook |
| POST | `/auth/microsoft` | No | 5/min | OAuth login with Microsoft |
| POST | `/auth/oauth-complete` | No | 5/min | Complete OAuth sign-in when the provider does not return an email |
| POST | `/auth/refresh` | No | — | Refresh the access token |
| POST | `/auth/logout` | Yes | — | Log out |
| GET | `/auth/me` | Yes | — | User profile |
| PATCH | `/auth/profile` | Yes | — | Update personal info, civic address, or preferred language |
| POST | `/auth/forgot-password` | No | 3/min | Request a password reset |
| POST | `/auth/reset-password` | No | — | Reset password |
| POST | `/auth/verify-email` | No | — | Verify email |
| POST | `/auth/resend-verification` | Yes | — | Resend verification email |
| POST | `/auth/register-with-item` | No | — | Register + create an item (atomic) |

### Items (`/items`)

| Method | Path | Auth | Rate limit | Description |
|--------|------|------|------------|-------------|
| GET | `/items` | Verified | — | List own items |
| POST | `/items` | Verified | — | Register an item |
| GET | `/items/:id` | Verified | — | Item detail (photos + documents) |
| PATCH | `/items/:id` | Verified | — | Update an item |
| POST | `/items/:id/archive` | Verified | — | Archive an item with a reason |
| PATCH | `/items/:id/recover` | Verified | — | Mark a stolen item as recovered |
| DELETE | `/items/:id` | Verified | — | Delete an item |
| POST | `/items/:id/photos` | Verified | — | Upload item photos (max 5, first upload becomes primary) |
| DELETE | `/items/:id/photos/:photoId` | Verified | — | Delete a photo and promote the oldest remaining photo to primary when needed |
| POST | `/items/:id/documents` | Verified | — | Upload supporting documents (max 10) |
| DELETE | `/items/:id/documents/:docId` | Verified | — | Delete a document |
| GET | `/lookup` | No | 30/min | Public lookup by RNBP number or serial number |
| GET | `/lookup/:rnbpNumber` | No | 30/min | Public lookup by RNBP number |

### Theft reports (`/reports`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/reports` | Yes | Report a theft (changes item status) |
| GET | `/reports` | Yes | List own reports |

### Insurance (`/insurance`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/insurance/request` | Yes | Submit an insurance request |
| GET | `/insurance/insurers` | No | List available insurers |

### Shop (`/shop`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/shop/products` | No | List active products |
| GET | `/shop/status` | No | Check if the shop is available |
| POST | `/shop/checkout` | Opt. | Create a Stripe Checkout session |
| POST | `/shop/webhook` | No | Stripe webhook (payment confirmation) |

### Administration (`/admin`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/admin/orders` | Admin | List orders (filter by status) |
| GET | `/admin/orders/:id` | Admin | Order detail |
| PATCH | `/admin/orders/:id/items/:orderItemId/assign` | Admin | Assign an RNBP number to an item |
| PATCH | `/admin/orders/:id/ship` | Admin | Mark an order as shipped |

### Contact (`/contact`)

| Method | Path | Auth | Rate limit | Description |
|--------|------|------|------------|-------------|
| POST | `/contact` | No | 5/15min | Send a contact message |

### Other

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/newsletter/subscribe` | No | Subscribe to the newsletter |
| GET | `/health` | No | Health check (DB status) |

## Authentication flow

```
┌─────────────────────────────────────────────────────────────────┐
│  REGISTRATION                                                   │
│                                                                 │
│  POST /auth/register ──→ Creates user + session                 │
│       │                   Returns accessToken + refreshToken     │
│       └──→ Verification email (fire & forget)                   │
│                                                                 │
│  POST /auth/register-with-item ──→ Same + creates an item       │
│       (atomic transaction: user + item both succeed or neither)  │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  LOGIN / LOGOUT                                                 │
│                                                                 │
│  POST /auth/login ──→ Verifies email + Argon2                   │
│       Returns accessToken (15m) + refreshToken (7d)             │
│                                                                 │
│  POST /auth/logout ──→ Deletes the session (or all sessions)    │
│       Note: the JWT access token remains valid until expiry (15m)│
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  REFRESH (refresh token rotation)                               │
│                                                                 │
│  POST /auth/refresh ──→ Verifies refreshToken                   │
│       1. Validates the JWT                                      │
│       2. Looks up the session in DB (by SHA-256 hash of token)  │
│       3. Checks tokenRevokedBefore (mass revocation)            │
│       4. Deletes the old session                                │
│       5. Creates a new session + new tokens                     │
│       (= rotation: each refresh token is single-use)            │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  PASSWORD RESET                                                 │
│                                                                 │
│  POST /auth/forgot-password ──→ Email with signed token (1h)    │
│       (same response whether the account exists or not)         │
│                                                                 │
│  POST /auth/reset-password ──→ Verifies signed token            │
│       1. Changes the password                                   │
│       2. Sets tokenRevokedBefore = now (invalidates ALL JWTs)   │
│       3. Deletes all sessions                                   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  EMAIL VERIFICATION                                             │
│                                                                 │
│  POST /auth/verify-email ──→ Signed token (24h)                 │
│  POST /auth/resend-verification ──→ Resends the email (auth)    │
│                                                                 │
│  Impact: requireVerifiedEmail blocks access to items (/items)   │
│          and theft reports (/reports) without a verified email.  │
└─────────────────────────────────────────────────────────────────┘
```

### Tokens

| Type | Duration | Storage | Revocation |
|------|----------|---------|------------|
| Access (JWT) | 15 min | Client only | Expires naturally, or via `tokenRevokedBefore` |
| Refresh (JWT) | 7 days | SHA-256 hash in DB (`sessions` table) | Session deletion, or `tokenRevokedBefore` |
| Email verification | 24h | HMAC-signed token (not in DB) | Expires naturally |
| Password reset | 1h | HMAC-signed token (not in DB) | Expires naturally |

### Mass revocation (`tokenRevokedBefore`)

Timestamp field on `users`. When set, any JWT (access or refresh) issued **before** this timestamp is rejected by the `requireAuth` middleware and during `refresh`. Used on password reset to force re-login on all devices.

### `requireAuth` vs `requireVerifiedEmail`

- **`requireAuth`** — Verifies the JWT access token, checks `tokenRevokedBefore`. Used on most protected routes.
- **`requireVerifiedEmail`** — Calls `requireAuth` + verifies `emailVerified = true`. Used for items (`/items`) and theft reports (`POST /reports`).

## Atomic transactions

Some operations modify multiple tables and must succeed or fail together. We use `db.transaction()` to guarantee atomicity:

- **`register-with-item`** — Checks email uniqueness + creates user + creates item. Without a transaction, a crash between the two inserts would leave a user without an item.
- **`reports`** — Creates the theft report + updates the item status to `stolen`. Without a transaction, the item could be marked stolen without an associated report.

**Rule: use `db.transaction()` whenever an endpoint modifies more than one table.**

## Architecture

```
src/
├── routes/           # Route handlers (auth, items, reports, etc.)
├── middleware/        # JWT auth, error handler, security headers
├── db/               # Drizzle schema, PostgreSQL client
├── utils/            # JWT tokens, hashing, emails, file validation
├── constants/        # Token expiration durations
├── config.ts         # Environment variable validation (Zod)
├── app.ts            # Fastify app construction
├── index.ts          # Entry point (server startup)
└── migrate.ts        # Standalone migration runner (prod)
```

### Middleware

- **Auth** — Verifies the EdDSA JWT, supports token revocation (`requireAuth`, `requireVerifiedEmail`, `requireAdmin`)
- **Error handler** — Formats errors (AppError, ZodError, Fastify validation)
- **Security headers** — HSTS, X-Frame-Options, CSP-adjacent headers
- **Rate limiting** — 100 req/min global, route-specific limits
- **CORS** — Configurable origins via `CORS_ORIGINS`
