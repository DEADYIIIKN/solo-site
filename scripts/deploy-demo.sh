#!/usr/bin/env bash
set -euo pipefail

STACK_DIR="/opt/beget/n8n"
RUNTIME_COMPOSE="$STACK_DIR/docker-compose.solo-site.yml"
ENV_FILE="$STACK_DIR/solo-site.env.production"
PROD_ENV_FILE="$STACK_DIR/solo-site-prod.env.production"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE"
  echo "Create it from $STACK_DIR/solo-site.env.production.example first."
  exit 1
fi

if [[ ! -f "$PROD_ENV_FILE" ]]; then
  echo "Missing $PROD_ENV_FILE"
  echo "Create it from $ENV_FILE and set NEXT_PUBLIC_SITE_URL/PAYLOAD_PUBLIC_SERVER_URL to https://soloproduction.pro."
  exit 1
fi

if [[ ! -f "$RUNTIME_COMPOSE" ]]; then
  echo "Missing $RUNTIME_COMPOSE"
  exit 1
fi

echo "==> Pruning unused Docker cache"
docker builder prune -af >/dev/null || true
docker image prune -af >/dev/null || true

echo "==> Pulling solo-site images"
docker compose \
  --project-directory "$STACK_DIR" \
  -f "$RUNTIME_COMPOSE" \
  pull solo-site solo-site-prod

echo "==> Starting solo-site containers"
docker compose \
  --project-directory "$STACK_DIR" \
  -f "$RUNTIME_COMPOSE" \
  up -d solo-site solo-site-prod

echo "==> Container status"
docker compose \
  --project-directory "$STACK_DIR" \
  -f "$RUNTIME_COMPOSE" \
  ps solo-site solo-site-prod

echo "==> Recent logs"
docker compose \
  --project-directory "$STACK_DIR" \
  -f "$RUNTIME_COMPOSE" \
  logs --tail=60 solo-site solo-site-prod
