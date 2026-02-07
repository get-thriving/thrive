#!/bin/bash
set -euo pipefail

LOG=/var/log/startup-script.log
exec > >(tee -a "$LOG") 2>&1

echo "[startup] waiting for apt/dpkg locks..."

# Wait for common apt/dpkg locks to be released
while fuser /var/lib/dpkg/lock-frontend >/dev/null 2>&1 \
   || fuser /var/lib/dpkg/lock >/dev/null 2>&1 \
   || fuser /var/lib/apt/lists/lock >/dev/null 2>&1; do
  echo "[startup] apt is busy, sleeping..."
  sleep 3
done

# If dpkg was interrupted, fix it
dpkg --configure -a || true

echo "[startup] $(date -Is) begin"

apt-get update
apt-get install -y ca-certificates curl gnupg

# Install Docker

sudo install -m 0755 -d /etc/apt/keyrings

curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /tmp/docker.gpg

sudo gpg --dearmor --batch --yes --no-tty \
  -o /etc/apt/keyrings/docker.gpg /tmp/docker.gpg

sudo chmod a+r /etc/apt/keyrings/docker.gpg
rm -f /tmp/docker.gpg

if [ -f /etc/os-release ]; then
  # shellcheck source=/dev/null
  . /etc/os-release
elif command -v lsb_release >/dev/null 2>&1; then
  VERSION_CODENAME=$(lsb_release -cs)
else
  echo "Error: /etc/os-release not found and lsb_release command not available." >&2
  exit 1
fi

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
https://download.docker.com/linux/ubuntu \
$VERSION_CODENAME stable" \
> /etc/apt/sources.list.d/docker.list

apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

systemctl enable --now docker

if id ubuntu >/dev/null 2>&1; then
  usermod -aG docker ubuntu || true
fi

echo "[startup] $(date -Is) done"
docker --version || true
docker compose version || true

# Install Certbot

snap install --classic certbot
ln -sf /snap/bin/certbot /usr/bin/certbot

certbot --version || true
