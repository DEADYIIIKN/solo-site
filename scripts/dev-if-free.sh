#!/usr/bin/env sh
# Если на :3000 уже слушает процесс (часто — прежний next dev), не стартуем второй.
set -e
if command -v lsof >/dev/null 2>&1; then
  if lsof -ti :3000 >/dev/null 2>&1; then
    echo "[dev:auto] Порт 3000 занят — новый процесс не запускаем. Откройте http://localhost:3000"
    exit 0
  fi
fi
exec npm run dev
