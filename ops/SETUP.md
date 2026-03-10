# Guide de mise en production — RNBP

Guide complet pour déployer le projet depuis zéro.

## Architecture

```
[Navigateur] → rnbp.ca  → [Cloudflare Pages] → SPA React (FR par défaut)
[Navigateur] → nrpp.ca  → [Cloudflare Pages] → SPA React (EN par défaut)
                                  ↓ API calls
[Navigateur] → api.rnbp.ca → [Cloudflare Tunnel] → 192.168.50.241:3000 → [Fastify]
                                                                              ↓
                                                          192.168.50.239 → [PostgreSQL 16]
```

- **Pas de nginx** — Cloudflare Tunnel connecte directement à Fastify (nginx existant sur le container n'interfère pas)
- **Pas de certbot** — Cloudflare gère le TLS à l'edge
- **Pas d'IP publique** — le tunnel est une connexion sortante

### Infrastructure Proxmox

| Container | ID | IP | Rôle |
|-----------|-----|-----|------|
| prod (existant) | 241 | `192.168.50.241` | API RNBP + Cloudflare Tunnel |
| postgresql-prod (Turnkey) | 239 | `192.168.50.239` | PostgreSQL 16 dédié |

## Prérequis

- Proxmox avec les 2 containers ci-dessus
- 2 domaines : `rnbp.ca` et `nrpp.ca` (NS pointés vers Cloudflare)
- Compte Cloudflare (gratuit suffit)

---

## 1. Container prod (192.168.50.241)

Le container prod existant (CT 241) héberge déjà d'autres services. On y ajoute RNBP.

```bash
# Se connecter au container
ssh root@192.168.50.241

# Mise à jour
apt update && apt upgrade -y

# Outils nécessaires (si pas déjà installés)
apt install -y curl git
```

### Installer Node.js 20 LTS (si pas déjà installé)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs
node -v  # v20.x.x
```

### Installer pnpm (si pas déjà installé)

```bash
npm i -g pnpm
pnpm -v  # 9.x.x
```

### Préparer le dossier application

On réutilise l'utilisateur `prod` existant sur le container.

```bash
mkdir -p /opt/rnbp
chown prod:prod /opt/rnbp
```

## 2. Container PostgreSQL (192.168.50.239)

Créer un container Turnkey PostgreSQL (CT 239) sur Proxmox.

Une fois le container démarré :

```bash
ssh root@192.168.50.239
```

### Configurer l'accès réseau

Par défaut, PostgreSQL n'écoute que sur localhost. Il faut l'ouvrir au container prod.

```bash
# Trouver le fichier de config (varie selon la version Turnkey)
PG_CONF=$(find /etc/postgresql -name postgresql.conf)
PG_HBA=$(find /etc/postgresql -name pg_hba.conf)

# Écouter sur toutes les interfaces
sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" $PG_CONF

# Autoriser le container prod à se connecter
echo "host    rnbp_prod    rnbp    192.168.50.241/32    scram-sha-256" >> $PG_HBA

# Redémarrer PostgreSQL
systemctl restart postgresql
```

---

### Créer l'utilisateur et la base

```bash
# Sur le container PostgreSQL (192.168.50.239)
sudo -u postgres createuser rnbp
sudo -u postgres createdb rnbp_prod -O rnbp
sudo -u postgres psql -c "ALTER USER rnbp WITH PASSWORD '<MOT_DE_PASSE_SECURISE>';"
```

### Tester la connexion depuis le container prod

```bash
# Depuis 192.168.50.241
apt install -y postgresql-client   # si pas installé
psql -h 192.168.50.239 -U rnbp -d rnbp_prod -c "SELECT 1;"
```

L'URL de connexion sera :
```
postgresql://rnbp:<MOT_DE_PASSE>@192.168.50.239:5432/rnbp_prod
```

---

## 3. Accès SSH

Sur le **poste de développement** :

```bash
# Générer une clé SSH (si pas déjà fait)
ssh-keygen -t ed25519 -C "dev@rnbp"

# Copier la clé publique sur le serveur
ssh-copy-id prod@192.168.50.241

# Tester la connexion
ssh prod@192.168.50.241
```

Cet accès est requis pour que le script `ops/deploy.sh` fonctionne.

---

## 4. Application

### Cloner le repo

```bash
sudo -u prod git clone <URL_REPO> /opt/rnbp/repo
```

### Configurer l'environnement

```bash
sudo cp /opt/rnbp/repo/apps/api/.env.example /opt/rnbp/.env
sudo chown prod:prod /opt/rnbp/.env
sudo chmod 600 /opt/rnbp/.env
```

Éditer `/opt/rnbp/.env` avec les valeurs de production :

| Variable | Valeur |
|----------|--------|
| `NODE_ENV` | `production` |
| `PORT` | `3000` |
| `DATABASE_URL` | `postgresql://rnbp:<MOT_DE_PASSE>@192.168.50.239:5432/rnbp_prod` |
| `JWT_PRIVATE_KEY` | *(voir ci-dessous)* |
| `JWT_PUBLIC_KEY` | *(voir ci-dessous)* |
| `CORS_ORIGINS` | `https://rnbp.ca,https://nrpp.ca` |
| `UPLOAD_DIR` | `/opt/rnbp/uploads` |
| `FRONTEND_URL` | `https://rnbp.ca` |
| `FROM_EMAIL` | `noreply@rnbp.ca` |
| `BREVO_API_KEY` | *(clé Brevo si emails activés)* |

### Générer les clés JWT Ed25519

```bash
openssl genpkey -algorithm Ed25519 -out /tmp/ed25519_private.pem
openssl pkey -in /tmp/ed25519_private.pem -pubout -out /tmp/ed25519_public.pem

# Copier ces valeurs dans .env
echo "JWT_PRIVATE_KEY=$(base64 -w 0 /tmp/ed25519_private.pem)"
echo "JWT_PUBLIC_KEY=$(base64 -w 0 /tmp/ed25519_public.pem)"

# Supprimer les fichiers temporaires
rm /tmp/ed25519_private.pem /tmp/ed25519_public.pem
```

### Build initial

```bash
cd /opt/rnbp/repo
sudo -u prod pnpm install --frozen-lockfile
sudo -u prod pnpm --filter @rnbp/shared build
sudo -u prod pnpm --filter @rnbp/api build
```

### Migrations

```bash
cd /opt/rnbp/repo/apps/api
sudo -u prod node --env-file=/opt/rnbp/.env dist/migrate.js
```

### Dossier uploads

```bash
sudo mkdir -p /opt/rnbp/uploads
sudo chown prod:prod /opt/rnbp/uploads
```

---

## 5. systemd

```bash
sudo cp /opt/rnbp/repo/ops/rnbp-api.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable rnbp-api
sudo systemctl start rnbp-api
```

### Vérifier

```bash
sudo systemctl status rnbp-api
curl -s http://localhost:3000/api/health | jq
```

### Commandes utiles

```bash
# Logs en temps réel
sudo journalctl -u rnbp-api -f

# 50 dernières lignes de logs
sudo journalctl -u rnbp-api -n 50

# Redémarrer
sudo systemctl restart rnbp-api
```

---

## 6. Cloudflare Tunnel (backend)

Le tunnel remplace nginx + certbot. Il crée une connexion sortante chiffrée entre le serveur et Cloudflare — aucun port à ouvrir, aucun certificat à gérer.

### Installer cloudflared

```bash
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared.deb
rm cloudflared.deb
```

### Authentifier

```bash
cloudflared tunnel login
```

Ceci ouvre un navigateur pour autoriser le compte Cloudflare.

### Créer le tunnel

```bash
cloudflared tunnel create rnbp-api
```

Note l'ID du tunnel (ex: `a1b2c3d4-...`).

### Configurer le tunnel

Créer `/opt/rnbp/.cloudflared/config.yml` :

```yaml
tunnel: <TUNNEL_ID>
credentials-file: /root/.cloudflared/<TUNNEL_ID>.json

ingress:
  - hostname: api.rnbp.ca
    service: http://localhost:3000
  - service: http_status:404
```

> **Note** : déplacer le fichier credentials JSON dans `/opt/rnbp/.cloudflared/` si le tunnel est installé en tant que service sous l'utilisateur prod.

### Configurer le DNS

```bash
cloudflared tunnel route dns rnbp-api api.rnbp.ca
```

Ceci crée automatiquement un CNAME `api.rnbp.ca` → `<TUNNEL_ID>.cfargotunnel.com`.

### Installer comme service

```bash
sudo cloudflared service install
sudo systemctl enable cloudflared
sudo systemctl start cloudflared
```

### Vérifier

```bash
sudo systemctl status cloudflared
curl -s https://api.rnbp.ca/api/health | jq
```

---

## 7. Cloudflare Pages (frontend)

### Créer le projet

```bash
# Depuis le poste de dev, à la racine du repo
npx wrangler pages project create rnbp-web
```

### Premier déploiement

```bash
pnpm --filter @rnbp/shared build
pnpm --filter @rnbp/web build
npx wrangler pages deploy apps/web/dist --project-name rnbp-web
```

### Custom domains

Dans le dashboard Cloudflare Pages → projet `rnbp-web` → Custom Domains :

1. `rnbp.ca`
2. `www.rnbp.ca` (redirect vers `rnbp.ca`)
3. `nrpp.ca`
4. `www.nrpp.ca` (redirect vers `nrpp.ca`)

### SPA Routing

Créer `apps/web/public/_redirects` :

```
/*  /index.html  200
```

Ceci permet au routeur React de gérer toutes les routes côté client.

---

## 8. DNS Cloudflare

Les deux domaines (`rnbp.ca` et `nrpp.ca`) doivent avoir leurs nameservers pointés vers Cloudflare.

### rnbp.ca

| Type | Nom | Contenu | Proxy |
|------|-----|---------|-------|
| CNAME | `@` | `rnbp-web.pages.dev` | Oui |
| CNAME | `www` | `rnbp-web.pages.dev` | Oui |
| CNAME | `api` | `<TUNNEL_ID>.cfargotunnel.com` | Oui |

### nrpp.ca

| Type | Nom | Contenu | Proxy |
|------|-----|---------|-------|
| CNAME | `@` | `rnbp-web.pages.dev` | Oui |
| CNAME | `www` | `rnbp-web.pages.dev` | Oui |

> **Note** : les CNAME `@` et `www` pour les Pages sont souvent configurés automatiquement par Cloudflare lors de l'ajout des custom domains.

---

## 9. Backups

### Configurer le backup automatique

```bash
sudo mkdir -p /opt/rnbp/backups
sudo chown prod:prod /opt/rnbp/backups
```

Ajouter au crontab de l'utilisateur `prod` :

```bash
sudo -u prod crontab -e
```

Ajouter la ligne :
```
0 3 * * * /opt/rnbp/repo/ops/backup.sh >> /opt/rnbp/backups/backup.log 2>&1
```

### Tester un restore

```bash
# Lister les backups
ls -la /opt/rnbp/backups/

# Tester un restore dans une DB temporaire
sudo -u postgres createdb rnbp_restore_test
pg_restore -d rnbp_restore_test /opt/rnbp/backups/<fichier_backup>
# Vérifier les données, puis supprimer
sudo -u postgres dropdb rnbp_restore_test
```

### Backup distant (optionnel)

Pour envoyer les backups vers Cloudflare R2 :

```bash
sudo apt install -y rclone
rclone config  # Configurer un remote R2
# Ajouter dans backup.sh : rclone copy /opt/rnbp/backups/ r2:rnbp-backups/
```

---

## 10. Déploiement et mises à jour

### Configuration locale

Sur le poste de dev, créer `.deploy.env` à la racine du repo :

```bash
cp .deploy.env.example .deploy.env
# Éditer avec les bonnes valeurs
```

### Déployer

```bash
# Tout (frontend + backend)
pnpm run deploy

# Frontend seulement
pnpm run deploy:web

# Backend seulement
pnpm run deploy:api
```

### Workflow des migrations

1. Modifier le schéma dans `apps/api/src/db/schema.ts`
2. Générer le SQL : `cd apps/api && pnpm db:generate`
3. Vérifier le fichier SQL dans `apps/api/drizzle/`
4. Commit et push
5. Déployer : `pnpm run deploy:api` — le script propose d'exécuter les migrations

### Rollback

Le script de deploy crée un snapshot de `apps/api/dist/` et `apps/api/node_modules/` avant chaque deploy. En cas de problème :

**Automatique** : Si le health check échoue après un deploy, le script propose un rollback automatique (ou le fait sans demander en mode non-interactif).

**Manuel** :
```bash
# Rollback au dernier snapshot
pnpm run rollback

# Rollback à un snapshot spécifique (2 = avant-dernier)
pnpm run rollback 2
```

**Snapshots** : Stockés dans `/opt/rnbp/backups/rollback/` sur le serveur prod. Rétention : 3 derniers.

**Rollback DB** : Si une migration a été appliquée, les dumps sont dans `/opt/rnbp/backups/rollback/db_*.sql.gz`. Pour restaurer :
```bash
ssh prod@192.168.50.241
gunzip -c /opt/rnbp/backups/rollback/db_YYYYMMDD_HHMMSS.sql.gz | psql "$DATABASE_URL"
```

**Désactiver l'auto-rollback** : `pnpm run deploy:api -- --no-auto-rollback`

---

## 11. Monitoring

### UptimeRobot

Configurer un moniteur sur [UptimeRobot](https://uptimerobot.com/) (gratuit) :

- **URL** : `https://api.rnbp.ca/api/health`
- **Intervalle** : 5 minutes
- **Alerte** : email

### Logs

```bash
# Logs API en temps réel
ssh prod@192.168.50.241 'sudo journalctl -u rnbp-api -f'

# Logs tunnel
ssh prod@192.168.50.241 'sudo journalctl -u cloudflared -f'

# Logs des 24 dernières heures
ssh prod@192.168.50.241 'sudo journalctl -u rnbp-api --since "24 hours ago"'
```

---

## 12. Troubleshooting

### Le service API ne démarre pas

```bash
sudo journalctl -u rnbp-api -n 100
# Vérifier les erreurs de config (.env manquant, DB inaccessible, etc.)

# Tester manuellement
cd /opt/rnbp/repo/apps/api
sudo -u prod node --env-file=/opt/rnbp/.env dist/index.js
```

### Le tunnel Cloudflare est déconnecté

```bash
sudo systemctl status cloudflared
sudo journalctl -u cloudflared -n 50

# Redémarrer
sudo systemctl restart cloudflared
```

### Les migrations échouent

```bash
# Vérifier la connexion DB
psql -h 192.168.50.239 -U rnbp -d rnbp_prod -c "SELECT 1;"

# Vérifier les fichiers SQL
ls -la /opt/rnbp/repo/apps/api/drizzle/

# Exécuter manuellement
cd /opt/rnbp/repo/apps/api
sudo -u prod node --env-file=/opt/rnbp/.env dist/migrate.js
```

### Espace disque

```bash
# Taille des uploads
du -sh /opt/rnbp/uploads/

# Taille des backups
du -sh /opt/rnbp/backups/

# Nettoyer les vieux backups (garder 7 jours)
find /opt/rnbp/backups/ -name "*.sql.gz" -mtime +7 -delete
```

### L'API répond 502 depuis internet mais fonctionne en local

1. Vérifier que le tunnel est connecté : `sudo systemctl status cloudflared`
2. Vérifier que l'API écoute : `curl http://localhost:3000/api/health`
3. Vérifier la config du tunnel : `/opt/rnbp/.cloudflared/config.yml`
