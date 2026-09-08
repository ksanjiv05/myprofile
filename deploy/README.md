# Deploying on a 1GB VPS

## Why there is no framework

The site is static HTML, CSS and JS with **no build step and no runtime**. Nothing
executes on the server — nginx reads files from disk and sends them. On a 1GB box that
leaves essentially all of your RAM for whatever else you run.

For comparison, the alternatives you did not need:

| approach | server RAM | build step |
|---|---|---|
| **this site (static + nginx)** | ~12MB (nginx itself) | none |
| Next.js / Nuxt SSR | 90–250MB per Node process | yes |
| Astro/Vite static | ~12MB (also static) | yes, plus Node + node_modules to build |

The trade-off taken: hash routing (`#/work`) instead of clean paths, so there is no
server-side rewrite logic and the site works even opened from a `file://` path.

## Payload

~51KB uncompressed, **~15KB gzipped**, in six files, zero dependencies. The only
third-party request is Google Fonts — see "Self-hosting the fonts" to remove it.

## Local preview

```sh
python3 -m http.server 8899 --directory public
# open http://127.0.0.1:8899
```

## Deploy

```sh
# 1. one-time on the VPS
sudo mkdir -p /var/www/sanjiv && sudo chown -R "$USER" /var/www/sanjiv
sudo cp deploy/nginx.conf /etc/nginx/sites-available/sanjiv
sudo ln -s /etc/nginx/sites-available/sanjiv /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d yourdomain.com          # free TLS

# 2. every time after that
./deploy/deploy.sh user@your-vps
```

Prefer Caddy? `deploy/Caddyfile` does the same with automatic HTTPS built in.

## Self-hosting the fonts (optional, removes the only external request)

```sh
mkdir -p public/assets/fonts
# download the woff2 files for Geist, Inter and IBM Plex Mono, then replace the
# <link> in index.html with local @font-face rules pointing at assets/fonts/.
```
Everything still works without it — `tokens.css` declares full fallback stacks
(`system-ui`, `ui-monospace`), so a blocked font request degrades rather than breaks.

## Pre-compressing (optional)

```sh
find public -type f \( -name '*.css' -o -name '*.js' -o -name '*.html' \) \
  -exec gzip -9 -k {} \;
```
Then uncomment `gzip_static on;` in `nginx.conf` so nginx serves the `.gz` directly
instead of compressing on every request.
