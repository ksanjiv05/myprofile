#!/usr/bin/env bash
#
# Provision an Ubuntu EC2 instance to serve this site.
# Assumes the repo is ALREADY CLONED on the box — it deploys from your clone and
# never overwrites it unless you ask with --pull.
#
# Run from inside the clone, as root:
#
#   cd ~/myprofile
#   sudo bash deploy/setup-ubuntu.sh -d example.com -e you@example.com
#
# Re-running is safe; every step is idempotent.
#
# EC2 note: certbot needs inbound 80 AND 443 open in the instance's SECURITY GROUP.
# The script checks what it can and tells you plainly if that is the problem.

set -euo pipefail

APP="myprofile"
DOMAIN=""
EMAIL=""
SRC=""
WEBROOT=""
WANT_TLS=1
WWW_ALIAS=1
DO_PULL=0
BRANCH=""
TLS_OK=0

say()  { printf '\033[1m→ %s\033[0m\n' "$*"; }
warn() { printf '\033[33m!  %s\033[0m\n' "$*" >&2; }
die()  { printf '\033[31m✗  %s\033[0m\n' "$*" >&2; exit 1; }

usage() {
  cat <<USAGE
Usage: sudo bash deploy/setup-ubuntu.sh [options]

  -d, --domain  DOMAIN   domain to serve (omit to serve on the EC2 public IP)
  -e, --email   EMAIL    email for Let's Encrypt expiry notices
  -s, --src     PATH     the existing clone (default: the repo this script is in)
      --app     NAME     install name, sets /var/www/NAME  (default: $APP)
      --webroot PATH     override the served directory
      --pull               git fetch + reset --hard before deploying
      --no-tls             skip certbot
      --no-www             do not also serve www.DOMAIN
  -h, --help
USAGE
  exit 0
}

while [ $# -gt 0 ]; do
  case "$1" in
    -d|--domain)  DOMAIN="${2:?}"; shift 2 ;;
    -e|--email)   EMAIL="${2:?}";  shift 2 ;;
    -s|--src)     SRC="${2:?}";    shift 2 ;;
    --app)        APP="${2:?}";    shift 2 ;;
    --webroot)    WEBROOT="${2:?}"; shift 2 ;;
    --pull)       DO_PULL=1; shift ;;
    --no-tls)     WANT_TLS=0; shift ;;
    --no-www)     WWW_ALIAS=0; shift ;;
    -h|--help)    usage ;;
    *) die "unknown option: $1  (try --help)" ;;
  esac
done

[ "$(id -u)" -eq 0 ] || die "run as root:  sudo bash deploy/setup-ubuntu.sh ..."
command -v apt-get >/dev/null || die "this script targets Debian/Ubuntu"

# ------------------------------------------------------- locate the clone ---
if [ -z "$SRC" ]; then
  # the repo root is the parent of the directory holding this script
  guess="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." 2>/dev/null && pwd || true)"
  for c in "$guess" "$PWD" "/home/ubuntu/$APP" "/opt/$APP"; do
    [ -n "$c" ] && [ -f "$c/public/index.html" ] && { SRC="$c"; break; }
  done
fi
[ -n "$SRC" ] || die "could not find the clone. Pass it:  --src /home/ubuntu/$APP"
SRC="$(cd "$SRC" && pwd)"
[ -f "$SRC/public/index.html" ] || die "$SRC/public/index.html not found — is $SRC the repo root?"
WEBROOT="${WEBROOT:-/var/www/$APP}"
say "Deploying from $SRC"

# systemd is absent in containers and some minimal images — degrade, do not fail.
svc() {
  local action="$1" unit="$2"
  if command -v systemctl >/dev/null && [ -d /run/systemd/system ]; then
    systemctl "$action" "$unit"
  elif command -v service >/dev/null; then
    service "$unit" "$action" || true
  else
    case "$action" in
      reload)       nginx -s reload 2>/dev/null || nginx ;;
      restart)      nginx -s stop 2>/dev/null || true; nginx ;;
      enable|start) pgrep -x nginx >/dev/null || nginx ;;
    esac
  fi
}

# ------------------------------------------------------------ EC2 metadata ---
PUBIP=""
if command -v curl >/dev/null; then
  TOKEN="$(curl -sS -X PUT --max-time 2 http://169.254.169.254/latest/api/token \
            -H 'X-aws-ec2-metadata-token-ttl-seconds: 60' 2>/dev/null || true)"
  if [ -n "$TOKEN" ]; then
    PUBIP="$(curl -sS --max-time 2 -H "X-aws-ec2-metadata-token: $TOKEN" \
              http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || true)"
    [ -n "$PUBIP" ] && say "EC2 instance, public IPv4 $PUBIP"
  fi
fi

# ---------------------------------------------------------------- packages ---
say "Installing packages"
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq --no-install-recommends nginx rsync ca-certificates curl >/dev/null
say "nginx $(nginx -v 2>&1 | sed 's/.*\///')"

# ------------------------------------------------------------ optional pull ---
if [ "$DO_PULL" -eq 1 ]; then
  command -v git >/dev/null || apt-get install -y -qq --no-install-recommends git >/dev/null
  [ -d "$SRC/.git" ] || die "--pull given but $SRC is not a git repo"
  BRANCH="${BRANCH:-$(git -C "$SRC" rev-parse --abbrev-ref HEAD)}"
  say "Pulling origin/$BRANCH (discards local changes in $SRC)"
  git -C "$SRC" fetch --quiet origin "$BRANCH"
  git -C "$SRC" reset --hard --quiet "origin/$BRANCH"
fi

# ----------------------------------------------------------------- publish ---
say "Publishing to $WEBROOT"
mkdir -p "$WEBROOT"
rsync -a --delete --chmod=D755,F644 "$SRC/public/" "$WEBROOT/"

# Pre-compress so nginx serves .gz directly rather than gzipping every request.
find "$WEBROOT" -type f -name '*.gz' -delete
find "$WEBROOT" -type f \( -name '*.css' -o -name '*.js' -o -name '*.html' -o -name '*.svg' \) \
  -exec gzip -9 -k -f {} \;
chown -R www-data:www-data "$WEBROOT"

# ------------------------------------------------------------------- vhost ---
if [ -n "$DOMAIN" ]; then
  SERVER_NAME="$DOMAIN"
  [ "$WWW_ALIAS" -eq 1 ] && SERVER_NAME="$DOMAIN www.$DOMAIN"
else
  SERVER_NAME="_"
  warn "no --domain given; serving on the public IP and skipping TLS"
  WANT_TLS=0
fi

say "Writing /etc/nginx/sites-available/$APP  (server_name: $SERVER_NAME)"
cat > "/etc/nginx/sites-available/$APP" <<NGINX
# Managed by deploy/setup-ubuntu.sh — re-running the script rewrites this file.
# certbot edits it in place to add the 443 block; that survives a re-run only if
# you re-run certbot afterwards, which the script does.
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

# ------------------------------------------------------------------ ufw ------
# EC2 controls inbound traffic with security groups; ufw is usually inactive.
if command -v ufw >/dev/null && ufw status 2>/dev/null | grep -q "Status: active"; then
  say "ufw is active — allowing OpenSSH and Nginx Full"
  ufw allow OpenSSH >/dev/null 2>&1 || true
  ufw allow 'Nginx Full' >/dev/null 2>&1 || true
fi

# ------------------------------------------------------------------- TLS -----
if [ "$WANT_TLS" -eq 1 ]; then
  say "Checking DNS for $DOMAIN"
  resolved="$(getent hosts "$DOMAIN" | awk '{print $1}' | head -1 || true)"

  if [ -z "$resolved" ]; then
    warn "$DOMAIN does not resolve yet."
    warn "Add an A record pointing to ${PUBIP:-the public IP of this instance}, wait for"
    warn "propagation, then re-run:  sudo certbot --nginx -d $DOMAIN"
  elif [ -n "$PUBIP" ] && [ "$resolved" != "$PUBIP" ]; then
    warn "$DOMAIN resolves to $resolved but this instance is $PUBIP."
    warn "Let's Encrypt will fail the HTTP-01 challenge until the A record matches."
    warn "Fix the DNS (an Elastic IP keeps it stable across restarts), then:"
    warn "  sudo certbot --nginx -d $DOMAIN"
  else
    say "DNS OK ($DOMAIN -> $resolved). Requesting certificate."
    apt-get install -y -qq --no-install-recommends certbot python3-certbot-nginx >/dev/null
    args=(--nginx --non-interactive --agree-tos --redirect -d "$DOMAIN")
    [ "$WWW_ALIAS" -eq 1 ] && args+=(-d "www.$DOMAIN")
    if [ -n "$EMAIL" ]; then args+=(-m "$EMAIL"); else args+=(--register-unsafely-without-email); fi

    if certbot "${args[@]}"; then
      TLS_OK=1
      say "Certificate installed; renewal timer is handled by the certbot package."
    else
      warn "certbot failed. On EC2 this is almost always the SECURITY GROUP:"
      warn "  inbound TCP 80 and 443 must be open to 0.0.0.0/0."
      warn "Fix that, then re-run:  sudo certbot --nginx -d $DOMAIN"
    fi
  fi
fi

# ------------------------------------------------------- update command ------
say "Installing the '$APP-update' command"
cat > "/usr/local/bin/$APP-update" <<UPDATE
#!/usr/bin/env bash
# Republish the site from the clone. Add --pull to fetch the latest commit first.
set -euo pipefail
SRC="$SRC"; WEBROOT="$WEBROOT"
if [ "\${1:-}" = "--pull" ]; then
  branch="\$(git -C "\$SRC" rev-parse --abbrev-ref HEAD)"
  git -C "\$SRC" fetch --quiet origin "\$branch"
  git -C "\$SRC" reset --hard --quiet "origin/\$branch"
fi
rsync -a --delete --chmod=D755,F644 "\$SRC/public/" "\$WEBROOT/"
find "\$WEBROOT" -type f -name '*.gz' -delete
find "\$WEBROOT" -type f \\( -name '*.css' -o -name '*.js' -o -name '*.html' -o -name '*.svg' \\) \\
  -exec gzip -9 -k -f {} \;
chown -R www-data:www-data "\$WEBROOT"
nginx -t >/dev/null 2>&1 || { echo "nginx config test failed; not reloading" >&2; exit 1; }
{ systemctl reload nginx || service nginx reload || nginx -s reload; } >/dev/null 2>&1
if [ -d "\$SRC/.git" ]; then echo "published \$(git -C "\$SRC" rev-parse --short HEAD)"; else echo "published"; fi
UPDATE
chmod +x "/usr/local/bin/$APP-update"

printf '\n\033[1m✓ Done.\033[0m\n'
echo "  source  : $SRC"
echo "  serving : $WEBROOT  ($(find "$WEBROOT" -type f ! -name '*.gz' | wc -l | tr -d ' ') files)"
[ -d "$SRC/.git" ] && echo "  commit  : $(git -C "$SRC" rev-parse --short HEAD 2>/dev/null || echo '?')"
if [ -n "$DOMAIN" ]; then
  echo "  url     : http$([ "$TLS_OK" -eq 1 ] && echo s)://$DOMAIN"
  [ "$TLS_OK" -eq 1 ] || echo "  tls     : NOT configured — see the warnings above"
else
  echo "  url     : http://${PUBIP:-$(hostname -I 2>/dev/null | awk '{print $1}')}"
fi
echo
echo "  Deploy new commits with:   sudo $APP-update --pull"
echo "  Republish local edits:     sudo $APP-update"
