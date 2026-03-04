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
| `items` | Biens enregistrés (numéro RNBP unique, statut, propriétaire) |
| `item_photos` | Photos associées aux biens |
| `item_documents` | Documents (reçus, garanties, factures) |
| `theft_reports` | Déclarations de vol |
| `insurance_requests` | Demandes d'assurance |
| `partners` | Partenaires (assureurs, détaillants) |
| `newsletter_subscribers` | Abonnés infolettre |

### Migrations

Les migrations sont gérées avec Drizzle Kit (dev) et un runner standalone (prod).

```bash
# Workflow de migration :

# 1. Modifier le schéma dans src/db/schema.ts

# 2. Générer le SQL de migration
pnpm db:generate

# 3. Vérifier le fichier SQL généré dans drizzle/

# 4. Appliquer en dev (automatique au démarrage)
pnpm dev:api

# 5. En prod : le script de déploiement propose d'exécuter les migrations
pnpm run deploy:api
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
| GET | `/items` | Oui | — | Lister ses biens |
| POST | `/items` | Oui | — | Enregistrer un bien |
| GET | `/items/:id` | Oui | — | Détail d'un bien (photos + documents) |
| PATCH | `/items/:id` | Oui | — | Modifier un bien |
| DELETE | `/items/:id` | Oui | — | Supprimer un bien |
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

### Autres

| Méthode | Path | Auth | Description |
|---------|------|------|-------------|
| POST | `/newsletter/subscribe` | Non | S'abonner à l'infolettre |
| GET | `/health` | Non | Health check (statut DB) |

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

- **Auth** — Vérifie le JWT EdDSA, supporte la révocation de tokens
- **Error handler** — Formate les erreurs (AppError, ZodError, Fastify validation)
- **Security headers** — HSTS, X-Frame-Options, CSP-adjacent headers
- **Rate limiting** — 100 req/min global, limites spécifiques par route
- **CORS** — Origines configurables via `CORS_ORIGINS`
