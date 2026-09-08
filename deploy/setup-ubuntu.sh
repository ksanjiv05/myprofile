#!/usr/bin/env bash
#
# One-time provisioning for an Ubuntu VPS (20.04 / 22.04 / 24.04).
# Installs nginx, clones the site, configures the vhost, gets a TLS cert and
# leaves a `myprofile-update` command behind for future deploys.
#
# Run ON THE SERVER, as root:
#
#   curl -fsSL https://raw.githubusercontent.com/ksanjiv05/myprofile/main/deploy/setup-ubuntu.sh -o setup.sh
#   sudo bash setup.sh -d example.com -e you@example.com
#
# Re-running is safe — every step is idempotent.

set -euo pipefail

APP="myprofile"
REPO="https://github.com/ksanjiv05/myprofile.git"
BRANCH="main"
DOMAIN=""
EMAIL=""
SRC="/opt/$APP"
WEBROOT="/var/www/$APP"
WANT_TLS=1
WWW_ALIAS=1
TLS_OK=0        # set only when certbot actually succeeds

say()  { printf '\033[1m→ %s\033[0m\n' "$*"; }
warn() { printf '\033[33m!  %s\033[0m\n' "$*" >&2; }
die()  { printf '\033[31m✗  %s\033[0m\n' "$*" >&2; exit 1; }

usage() {
  cat <<USAGE
Usage: sudo bash $0 [options]

  -d, --domain   DOMAIN   domain to serve (omit to serve on the bare IP)
  -e, --email    EMAIL    email for Let's Encrypt expiry notices
  -r, --repo     URL      git repo to deploy    (default: $REPO)
  -b, --branch   NAME     branch to track       (default: $BRANCH)
      --app      NAME     install name          (default: $APP)
      --no-tls            skip certbot entirely
      --no-www            do not also serve www.DOMAIN
  -h, --help
USAGE
  exit 0
}

while [ $# -gt 0 ]; do
  case "$1" in
    -d|--domain) DOMAIN="${2:?}"; shift 2 ;;
    -e|--email)  EMAIL="${2:?}";  shift 2 ;;
    -r|--repo)   REPO="${2:?}";   shift 2 ;;
    -b|--branch) BRANCH="${2:?}"; shift 2 ;;
    --app)       APP="${2:?}"; SRC="/opt/$APP"; WEBROOT="/var/www/$APP"; shift 2 ;;
    --no-tls)    WANT_TLS=0; shift ;;
    --no-www)    WWW_ALIAS=0; shift ;;
    -h|--help)   usage ;;
    *) die "unknown option: $1  (try --help)" ;;
  esac
done

[ "$(id -u)" -eq 0 ] || die "run as root:  sudo bash $0 ..."
command -v apt-get >/dev/null || die "this script targets Debian/Ubuntu (apt-get not found)"

# systemd is absent in containers and minimal images — degrade instead of failing.
svc() {
  local action="$1" unit="$2"
  if command -v systemctl >/dev/null && [ -d /run/systemd/system ]; then
    systemctl "$action" "$unit"
  elif command -v service >/dev/null; then
    service "$unit" "$action" || true
  else
    case "$action" in
      reload)  nginx -s reload 2>/dev/null || nginx ;;
      restart) nginx -s stop 2>/dev/null || true; nginx ;;
      enable|start) pgrep -x nginx >/dev/null || nginx ;;
    esac
  fi
}

# ---------------------------------------------------------------- packages ---
say "Installing packages"
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq --no-install-recommends nginx git rsync ca-certificates curl >/dev/null
say "nginx $(nginx -v 2>&1 | sed 's/.*\///')"

# -------------------------------------------------------------------- code ---
if [ -d "$SRC/.git" ]; then
  say "Updating $SRC"
  git -C "$SRC" remote set-url origin "$REPO"
  git -C "$SRC" fetch --quiet --depth 1 origin "$BRANCH"
  git -C "$SRC" reset --hard --quiet "origin/$BRANCH"
else
  say "Cloning $REPO"
  rm -rf "$SRC"
  git clone --quiet --depth 1 --branch "$BRANCH" "$REPO" "$SRC"
fi
[ -f "$SRC/public/index.html" ] || die "$SRC/public/index.html missing — wrong repo or branch?"

# ------------------------------------------------------------------ publish ---
say "Publishing to $WEBROOT"
mkdir -p "$WEBROOT"
rsync -a --delete --chmod=D755,F644 "$SRC/public/" "$WEBROOT/"

# Pre-compress so nginx serves .gz directly instead of gzipping every request.
find "$WEBROOT" -type f -name '*.gz' -delete
find "$WEBROOT" -type f \( -name '*.css' -o -name '*.js' -o -name '*.html' -o -name '*.svg' \) \
  -exec gzip -9 -k -f {} \;
chown -R www-data:www-data "$WEBROOT"

# -------------------------------------------------------------------- vhost ---
if [ -n "$DOMAIN" ]; then
  SERVER_NAME="$DOMAIN"
  [ "$WWW_ALIAS" -eq 1 ] && SERVER_NAME="$DOMAIN www.$DOMAIN"
else
  SERVER_NAME="_"
  warn "no --domain given; serving on the bare IP and skipping TLS"
  WANT_TLS=0
fi

say "Writing /etc/nginx/sites-available/$APP  (server_name: $SERVER_NAME)"
cat > "/etc/nginx/sites-available/$APP" <<NGINX
# Managed by deploy/setup-ubuntu.sh — re-running the script rewrites this file.
server {
    listen 80;
    listen [::]:80;
    server_name $SERVER_NAME;
    root $WEBROOT;
    index index.html;

    # Hash routing: every path resolves to the same document.
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /assets/ {
        add_header Cache-Control "public, max-age=3600, must-revalidate";
        access_log off;
    }

    gzip_static on;
    gzip on;
    gzip_vary on;
    gzip_min_length 512;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/javascript application/json image/svg+xml;

    add_header X-Content-Type-Options nosniff always;
    add_header Referrer-Policy strict-origin-when-cross-origin always;
    add_header Content-Security-Policy "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; script-src 'self' 'unsafe-inline'; base-uri 'self'; frame-ancestors 'none'" always;

    location = /favicon.ico { access_log off; log_not_found off; }
    location ~ /\\.(?!well-known) { deny all; }
}
NGINX

ln -sfn "/etc/nginx/sites-available/$APP" "/etc/nginx/sites-enabled/$APP"
rm -f /etc/nginx/sites-enabled/default

say "Testing nginx config"
nginx -t 2>&1 | sed 's/^/   /'
svc enable nginx >/dev/null 2>&1 || true
svc reload nginx

# ----------------------------------------------------------------- firewall ---
if command -v ufw >/dev/null && ufw status 2>/dev/null | grep -q "Status: active"; then
  say "Opening firewall (OpenSSH + Nginx Full)"
  ufw allow OpenSSH >/dev/null 2>&1 || true
  ufw allow 'Nginx Full' >/dev/null 2>&1 || true
fi

# ---------------------------------------------------------------------- TLS ---
if [ "$WANT_TLS" -eq 1 ]; then
  resolved="$(getent hosts "$DOMAIN" | awk '{print $1}' | head -1 || true)"
  if [ -z "$resolved" ]; then
    warn "$DOMAIN does not resolve yet — skipping TLS."
    warn "Point the A record here, then run:  certbot --nginx -d $DOMAIN"
  else
    say "Requesting certificate for $SERVER_NAME (resolves to $resolved)"
    apt-get install -y -qq --no-install-recommends certbot python3-certbot-nginx >/dev/null
    certbot_args=(--nginx --non-interactive --agree-tos --redirect -d "$DOMAIN")
    [ "$WWW_ALIAS" -eq 1 ] && certbot_args+=(-d "www.$DOMAIN")
    if [ -n "$EMAIL" ]; then certbot_args+=(-m "$EMAIL"); else certbot_args+=(--register-unsafely-without-email); fi
    if certbot "${certbot_args[@]}"; then
      TLS_OK=1
    else
      warn "certbot failed — the site still serves over HTTP. Re-run: certbot --nginx -d $DOMAIN"
    fi
  fi
fi

# ------------------------------------------------------------ update command ---
say "Installing the '$APP-update' command"
cat > "/usr/local/bin/$APP-update" <<UPDATE
#!/usr/bin/env bash
# Pull the latest commit and republish. Takes about a second.
set -euo pipefail
SRC="$SRC"; WEBROOT="$WEBROOT"; BRANCH="$BRANCH"
git -C "\$SRC" fetch --quiet --depth 1 origin "\$BRANCH"
git -C "\$SRC" reset --hard --quiet "origin/\$BRANCH"
rsync -a --delete --chmod=D755,F644 "\$SRC/public/" "\$WEBROOT/"
find "\$WEBROOT" -type f -name '*.gz' -delete
find "\$WEBROOT" -type f \\( -name '*.css' -o -name '*.js' -o -name '*.html' -o -name '*.svg' \\) \\
  -exec gzip -9 -k -f {} \;
chown -R www-data:www-data "\$WEBROOT"
nginx -t >/dev/null 2>&1 || { echo "nginx config test failed; not reloading" >&2; exit 1; }
{ systemctl reload nginx || service nginx reload || nginx -s reload; } >/dev/null 2>&1
echo "updated to \$(git -C "\$SRC" rev-parse --short HEAD)"
UPDATE
chmod +x "/usr/local/bin/$APP-update"

printf '\n\033[1m✓ Done.\033[0m\n'
echo "  serving : $WEBROOT  ($(find "$WEBROOT" -type f ! -name '*.gz' | wc -l | tr -d ' ') files)"
echo "  commit  : $(git -C "$SRC" rev-parse --short HEAD)"
if [ -n "$DOMAIN" ]; then
  echo "  url     : http$([ "$TLS_OK" -eq 1 ] && echo s)://$DOMAIN"
  [ "$TLS_OK" -eq 1 ] || echo "  tls     : not configured yet (see the warning above)"
else
  echo "  url     : http://$(hostname -I 2>/dev/null | awk '{print $1}')"
fi
echo
echo "  To deploy new commits later, just run:  $APP-update"
