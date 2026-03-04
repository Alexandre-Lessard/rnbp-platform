# RCBP Deployment Guide — Debian Server

## Prerequisites

- Debian 12+ (Bookworm)
- Node.js 20 LTS
- PostgreSQL 16
- nginx
- certbot (Let's Encrypt)

## 1. System Setup

```bash
# Create system user
sudo useradd --system --shell /bin/bash --create-home -d /opt/rcbp rcbp

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
sudo -u postgres createuser rcbp
sudo -u postgres createdb rcbp_production -O rcbp
sudo -u postgres psql -c "ALTER USER rcbp WITH PASSWORD 'your_secure_password';"
```

## 3. Application

```bash
# Clone and build
sudo -u rcbp git clone <repo-url> /opt/rcbp/repo
cd /opt/rcbp/repo
sudo -u rcbp pnpm install --frozen-lockfile
sudo -u rcbp pnpm --filter @rcbp/shared build
sudo -u rcbp pnpm --filter @rcbp/api build

# Environment
sudo cp /opt/rcbp/repo/.env.example /opt/rcbp/.env
sudo chown rcbp:rcbp /opt/rcbp/.env
sudo chmod 600 /opt/rcbp/.env
# Edit .env with production values (DATABASE_URL, JWT keys, etc.)

# Generate JWT Ed25519 keys
openssl genpkey -algorithm Ed25519 -out /tmp/ed25519_private.pem
openssl pkey -in /tmp/ed25519_private.pem -pubout -out /tmp/ed25519_public.pem
echo "JWT_PRIVATE_KEY=$(base64 -w 0 /tmp/ed25519_private.pem)"
echo "JWT_PUBLIC_KEY=$(base64 -w 0 /tmp/ed25519_public.pem)"
rm /tmp/ed25519_private.pem /tmp/ed25519_public.pem

# Run migrations
cd /opt/rcbp/repo/apps/api
sudo -u rcbp pnpm db:push

# Create uploads directory
sudo mkdir -p /opt/rcbp/uploads
sudo chown rcbp:rcbp /opt/rcbp/uploads
```

## 4. systemd

```bash
sudo cp /opt/rcbp/repo/deploy/rcbp-api.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable rcbp-api
sudo systemctl start rcbp-api
sudo systemctl status rcbp-api
```

## 5. nginx + TLS

```bash
# Get certificate
sudo certbot certonly --nginx -d api.rcbp.ca

# Install config
sudo cp /opt/rcbp/repo/deploy/nginx-rcbp.conf /etc/nginx/sites-available/rcbp
sudo ln -s /etc/nginx/sites-available/rcbp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 6. Backups

```bash
sudo mkdir -p /opt/rcbp/backups
sudo chown rcbp:rcbp /opt/rcbp/backups

# Add to crontab
sudo -u rcbp crontab -e
# Add: 0 3 * * * /opt/rcbp/repo/deploy/backup.sh >> /opt/rcbp/backups/backup.log 2>&1
```

## 7. Monitoring

Set up UptimeRobot (free tier) to monitor `https://api.rcbp.ca/api/health` every 5 minutes.

## Updates

```bash
cd /opt/rcbp/repo
sudo -u rcbp git pull
sudo -u rcbp pnpm install --frozen-lockfile
sudo -u rcbp pnpm --filter @rcbp/shared build
sudo -u rcbp pnpm --filter @rcbp/api build
sudo -u rcbp pnpm --filter @rcbp/api db:push
sudo systemctl restart rcbp-api
```
