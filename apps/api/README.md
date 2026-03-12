# @rnbp/api — Backend

API REST pour le Registre national des biens personnels.

## Stack

Fastify 5, Drizzle ORM, PostgreSQL 16, JWT EdDSA (Ed25519), Argon2, Brevo (emails transactionnels).

## Setup local

```bash
# Copier la config
cp .env.example .env
# Éditer .env (DATABASE_URL, JWT keys, etc.)

# Créer la DB PostgreSQL
createdb rnbp_development

# Générer les clés JWT Ed25519
openssl genpkey -algorithm Ed25519 -out /tmp/ed25519_private.pem
openssl pkey -in /tmp/ed25519_private.pem -pubout -out /tmp/ed25519_public.pem
echo "JWT_PRIVATE_KEY=$(base64 -w 0 /tmp/ed25519_private.pem)"
echo "JWT_PUBLIC_KEY=$(base64 -w 0 /tmp/ed25519_public.pem)"
rm /tmp/ed25519_private.pem /tmp/ed25519_public.pem
# Copier les valeurs dans .env

# Lancer en dev (auto-migrate + hot reload)
pnpm dev:api
```

## Variables d'environnement

| Variable | Requis | Défaut | Description |
|----------|--------|--------|-------------|
| `DATABASE_URL` | Oui | — | URL de connexion PostgreSQL |
| `JWT_PRIVATE_KEY` | Oui | — | Clé privée Ed25519 (base64) |
| `JWT_PUBLIC_KEY` | Oui | — | Clé publique Ed25519 (base64) |
| `NODE_ENV` | Non | `development` | `development`, `production`, `test` |
| `PORT` | Non | `3000` | Port du serveur |
| `HOST` | Non | `0.0.0.0` | Host du serveur |
| `JWT_ACCESS_EXPIRES_IN` | Non | `15m` | Durée du token d'accès |
| `JWT_REFRESH_EXPIRES_IN` | Non | `7d` | Durée du token de rafraîchissement |
| `CORS_ORIGINS` | Non | `http://localhost:5173` | Origines CORS autorisées (séparées par `,`) |
| `UPLOAD_DIR` | Non | `./uploads` | Dossier pour les uploads |
| `MAX_FILE_SIZE` | Non | `10485760` | Taille max des fichiers (10 Mo) |
| `BREVO_API_KEY` | Non | — | Clé API Brevo (emails). Sans clé = log console. |
| `FROM_EMAIL` | Non | `noreply@rnbp.ca` | Adresse expéditeur |
| `FROM_NAME` | Non | `RNBP` | Nom expéditeur |
| `FRONTEND_URL` | Non | `http://localhost:5173` | URL du frontend (pour les liens dans les emails) |

## Base de données

### Tables

| Table | Description |
|-------|-------------|
| `users` | Comptes utilisateurs (email, mot de passe hashé, vérification email) |
| `sessions` | Sessions actives (hash du refresh token, expiration) |
| `items` | Biens enregistrés (numéro RNBP nullable, assigné par l'admin, statut, propriétaire) |
| `item_photos` | Photos associées aux biens |
| `item_documents` | Documents (reçus, garanties, factures) |
| `theft_reports` | Déclarations de vol |
| `insurance_requests` | Demandes d'assurance |
| `partners` | Partenaires (assureurs, détaillants) |
| `orders` | Commandes Stripe (statut, montant) |
| `order_items` | Lignes de commande (référence item, quantité, numéro RNBP assigné) |
| `contact_messages` | Messages du formulaire de contact |
| `newsletter_subscribers` | Abonnés infolettre |

### Migrations

Les migrations Drizzle sont automatiques au démarrage du backend (dev et prod).

```bash
# Workflow de migration :

# 1. Modifier le schéma dans src/db/schema.ts

# 2. Générer le SQL de migration
pnpm db:generate

# 3. Vérifier le fichier SQL généré dans drizzle/

# 4. Démarrer le backend — les migrations s'appliquent automatiquement
pnpm dev:api
```

## Routes API

Toutes les routes sont préfixées par `/api`.

### Authentification (`/auth`)

| Méthode | Path | Auth | Limite | Description |
|---------|------|------|--------|-------------|
| POST | `/auth/register` | Non | 5/min | Créer un compte |
| POST | `/auth/login` | Non | 5/min | Se connecter |
| POST | `/auth/refresh` | Non | — | Rafraîchir le token d'accès |
| POST | `/auth/logout` | Oui | — | Se déconnecter |
| GET | `/auth/me` | Oui | — | Profil utilisateur |
| POST | `/auth/forgot-password` | Non | 3/min | Demander un reset de mot de passe |
| POST | `/auth/reset-password` | Non | — | Réinitialiser le mot de passe |
| POST | `/auth/verify-email` | Non | — | Vérifier l'email |
| POST | `/auth/resend-verification` | Oui | — | Renvoyer le courriel de vérification |
| POST | `/auth/register-with-item` | Non | — | Inscription + enregistrement d'un bien (atomique) |

### Biens (`/items`)

| Méthode | Path | Auth | Limite | Description |
|---------|------|------|--------|-------------|
| GET | `/items` | Vérifié | — | Lister ses biens |
| POST | `/items` | Vérifié | — | Enregistrer un bien |
| GET | `/items/:id` | Vérifié | — | Détail d'un bien (photos + documents) |
| PATCH | `/items/:id` | Vérifié | — | Modifier un bien |
| DELETE | `/items/:id` | Vérifié | — | Supprimer un bien |
| GET | `/lookup/:rnbpNumber` | Non | 30/min | Recherche publique par numéro RNBP |

### Déclarations de vol (`/reports`)

| Méthode | Path | Auth | Description |
|---------|------|------|-------------|
| POST | `/reports` | Oui | Déclarer un vol (change le statut du bien) |
| GET | `/reports` | Oui | Lister ses déclarations |

### Assurance (`/insurance`)

| Méthode | Path | Auth | Description |
|---------|------|------|-------------|
| POST | `/insurance/request` | Oui | Soumettre une demande d'assurance |
| GET | `/insurance/insurers` | Non | Liste des assureurs disponibles |

### Boutique (`/shop`)

| Méthode | Path | Auth | Description |
|---------|------|------|-------------|
| POST | `/shop/checkout` | Opt. | Créer une session Stripe Checkout |
| POST | `/shop/webhook` | Non | Webhook Stripe (confirmation paiement) |

### Administration (`/admin`)

| Méthode | Path | Auth | Description |
|---------|------|------|-------------|
| GET | `/admin/orders` | Admin | Lister les commandes (filtre par statut) |
| GET | `/admin/orders/:id` | Admin | Détail d'une commande |
| PATCH | `/admin/orders/:id/items/:orderItemId/assign` | Admin | Assigner un numéro RNBP à un item |
| PATCH | `/admin/orders/:id/ship` | Admin | Marquer une commande comme expédiée |

### Contact (`/contact`)

| Méthode | Path | Auth | Limite | Description |
|---------|------|------|--------|-------------|
| POST | `/contact` | Non | 5/15min | Envoyer un message de contact |

### Autres

| Méthode | Path | Auth | Description |
|---------|------|------|-------------|
| POST | `/newsletter/subscribe` | Non | S'abonner à l'infolettre |
| GET | `/health` | Non | Health check (statut DB) |

## Flow d'authentification

```
┌─────────────────────────────────────────────────────────────────┐
│  INSCRIPTION                                                    │
│                                                                 │
│  POST /auth/register ──→ Crée user + session                   │
│       │                   Retourne accessToken + refreshToken   │
│       └──→ Email de vérification (fire & forget)                │
│                                                                 │
│  POST /auth/register-with-item ──→ Même chose + crée un bien   │
│       (transaction atomique : user + item réussissent ou rien)  │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  CONNEXION / DÉCONNEXION                                        │
│                                                                 │
│  POST /auth/login ──→ Vérifie email + Argon2                   │
│       Retourne accessToken (15m) + refreshToken (7j)            │
│                                                                 │
│  POST /auth/logout ──→ Supprime la session (ou toutes)          │
│       Note: le JWT access reste valide jusqu'à expiration (15m) │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  RAFRAÎCHISSEMENT (refresh token rotation)                      │
│                                                                 │
│  POST /auth/refresh ──→ Vérifie refreshToken                   │
│       1. Valide le JWT                                          │
│       2. Cherche la session en DB (par hash SHA-256 du token)   │
│       3. Vérifie tokenRevokedBefore (révocation de masse)       │
│       4. Supprime l'ancienne session                            │
│       5. Crée une nouvelle session + nouveaux tokens            │
│       (= rotation : chaque refresh token est usage unique)      │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  RESET MOT DE PASSE                                             │
│                                                                 │
│  POST /auth/forgot-password ──→ Email avec token signé (1h)     │
│       (réponse identique que le compte existe ou non)           │
│                                                                 │
│  POST /auth/reset-password ──→ Vérifie token signé             │
│       1. Change le mot de passe                                 │
│       2. Set tokenRevokedBefore = now (invalide TOUS les JWT)   │
│       3. Supprime toutes les sessions                           │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  VÉRIFICATION EMAIL                                             │
│                                                                 │
│  POST /auth/verify-email ──→ Token signé (24h)                  │
│  POST /auth/resend-verification ──→ Renvoie le courriel (auth)  │
│                                                                 │
│  Impact : requireVerifiedEmail bloque l'accès aux biens         │
│           (/items) et aux déclarations de vol (/reports)        │
│           sans email vérifié.                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Tokens

| Type | Durée | Stockage | Révocation |
|------|-------|----------|------------|
| Access (JWT) | 15 min | Client seulement | Expire naturellement, ou via `tokenRevokedBefore` |
| Refresh (JWT) | 7 jours | Hash SHA-256 en DB (table `sessions`) | Suppression de la session, ou `tokenRevokedBefore` |
| Email verification | 24h | Token signé HMAC (pas en DB) | Expire naturellement |
| Password reset | 1h | Token signé HMAC (pas en DB) | Expire naturellement |

### Révocation de masse (`tokenRevokedBefore`)

Champ timestamp sur `users`. Quand défini, tout JWT (access ou refresh) émis **avant** ce timestamp est refusé au middleware `requireAuth` et lors du `refresh`. Utilisé lors d'un reset de mot de passe pour forcer la reconnexion sur tous les appareils.

### `requireAuth` vs `requireVerifiedEmail`

- **`requireAuth`** — Vérifie le JWT access, vérifie `tokenRevokedBefore`. Utilisé sur la majorité des routes protégées.
- **`requireVerifiedEmail`** — Appelle `requireAuth` + vérifie `emailVerified = true`. Utilisé pour les biens (`/items`) et les déclarations de vol (`POST /reports`).

## Transactions atomiques

Certaines opérations modifient plusieurs tables et doivent réussir ou échouer ensemble. On utilise `db.transaction()` pour garantir l'atomicité :

- **`register-with-item`** — Vérifie unicité email + crée user + crée item. Sans transaction, un crash entre les deux inserts laisserait un user sans item.
- **`reports`** — Crée la déclaration de vol + met à jour le statut de l'item à `stolen`. Sans transaction, l'item pourrait être marqué volé sans déclaration associée.

**Règle : utiliser `db.transaction()` dès qu'un endpoint modifie plus d'une table.**

## Architecture

```
src/
├── routes/           # Handlers de routes (auth, items, reports, etc.)
├── middleware/        # Auth JWT, error handler, security headers
├── db/               # Schéma Drizzle, client PostgreSQL
├── utils/            # Tokens JWT, hashing, emails, validation fichiers
├── constants/        # Durées d'expiration des tokens
├── config.ts         # Validation des variables d'environnement (Zod)
├── app.ts            # Construction de l'app Fastify
├── index.ts          # Point d'entrée (démarrage serveur)
└── migrate.ts        # Runner de migration standalone (prod)
```

### Middleware

- **Auth** — Vérifie le JWT EdDSA, supporte la révocation de tokens (`requireAuth`, `requireVerifiedEmail`, `requireAdmin`)
- **Error handler** — Formate les erreurs (AppError, ZodError, Fastify validation)
- **Security headers** — HSTS, X-Frame-Options, CSP-adjacent headers
- **Rate limiting** — 100 req/min global, limites spécifiques par route
- **CORS** — Origines configurables via `CORS_ORIGINS`
