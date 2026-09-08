#!/usr/bin/env bash
# One-shot deploy: rsync the static folder to the VPS. No build, no restart.
set -euo pipefail

HOST="${1:-user@your-vps}"          # TODO: your host
REMOTE="${2:-/var/www/sanjiv}"
LOCAL="$(cd "$(dirname "$0")/.." && pwd)/public/"

echo "→ $LOCAL  ==>  $HOST:$REMOTE"
rsync -avz --delete \
  --chmod=D755,F644 \
  "$LOCAL" "$HOST:$REMOTE/"

echo "→ done. No service restart needed; nginx serves from disk."
