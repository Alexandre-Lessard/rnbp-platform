# RNBP Deployment Guide — Debian Server

## Prerequisites

- Debian 12+ (Bookworm)
- Node.js 20 LTS
- PostgreSQL 16
- nginx
- certbot (Let's Encrypt)

## 1. System Setup

```bash
# Create system user
sudo useradd --system --shell /bin/bash --create-home -d /opt/rnbp rnbp

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install pnpm
sudo npm i -g pnpm

# Install PostgreSQL 16
sudo apt install -y postgresql-16

# Install nginx + certbot
sudo apt install -y nginx certbot python3-certbot-nginx

# Firewall
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

## 2. Database

```bash
sudo -u postgres createuser rnbp
sudo -u postgres createdb rnbp_production -O rnbp
sudo -u postgres psql -c "ALTER USER rnbp WITH PASSWORD 'your_secure_password';"
```

## 3. Application

```bash
# Clone and build
sudo -u rnbp git clone <repo-url> /opt/rnbp/repo
cd /opt/rnbp/repo
sudo -u rnbp pnpm install --frozen-lockfile
sudo -u rnbp pnpm --filter @rnbp/shared build
sudo -u rnbp pnpm --filter @rnbp/api build

# Environment
sudo cp /opt/rnbp/repo/.env.example /opt/rnbp/.env
sudo chown rnbp:rnbp /opt/rnbp/.env
sudo chmod 600 /opt/rnbp/.env
# Edit .env with production values (DATABASE_URL, JWT keys, etc.)

# Generate JWT Ed25519 keys
openssl genpkey -algorithm Ed25519 -out /tmp/ed25519_private.pem
openssl pkey -in /tmp/ed25519_private.pem -pubout -out /tmp/ed25519_public.pem
echo "JWT_PRIVATE_KEY=$(base64 -w 0 /tmp/ed25519_private.pem)"
echo "JWT_PUBLIC_KEY=$(base64 -w 0 /tmp/ed25519_public.pem)"
rm /tmp/ed25519_private.pem /tmp/ed25519_public.pem

# Run migrations
cd /opt/rnbp/repo/apps/api
sudo -u rnbp pnpm db:push

# Create uploads directory
sudo mkdir -p /opt/rnbp/uploads
sudo chown rnbp:rnbp /opt/rnbp/uploads
```

## 4. systemd

```bash
sudo cp /opt/rnbp/repo/deploy/rnbp-api.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable rnbp-api
sudo systemctl start rnbp-api
sudo systemctl status rnbp-api
```

## 5. nginx + TLS

```bash
# Get certificate
sudo certbot certonly --nginx -d api.rnbp.ca

# Install config
sudo cp /opt/rnbp/repo/deploy/nginx-rnbp.conf /etc/nginx/sites-available/rnbp
sudo ln -s /etc/nginx/sites-available/rnbp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 6. Backups

```bash
sudo mkdir -p /opt/rnbp/backups
sudo chown rnbp:rnbp /opt/rnbp/backups

# Add to crontab
sudo -u rnbp crontab -e
# Add: 0 3 * * * /opt/rnbp/repo/deploy/backup.sh >> /opt/rnbp/backups/backup.log 2>&1
```

## 7. Monitoring

Set up UptimeRobot (free tier) to monitor `https://api.rnbp.ca/api/health` every 5 minutes.

## Updates

```bash
cd /opt/rnbp/repo
sudo -u rnbp git pull
sudo -u rnbp pnpm install --frozen-lockfile
sudo -u rnbp pnpm --filter @rnbp/shared build
sudo -u rnbp pnpm --filter @rnbp/api build
sudo -u rnbp pnpm --filter @rnbp/api db:push
sudo systemctl restart rnbp-api
```
