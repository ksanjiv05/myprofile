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

## Deploy — Ubuntu, one command

`setup-ubuntu.sh` provisions the whole box: nginx, the clone, the vhost, TLS, the
firewall, and a `myprofile-update` command for later. Run it **on the server as root**.

```sh
curl -fsSL https://raw.githubusercontent.com/ksanjiv05/myprofile/main/deploy/setup-ubuntu.sh -o setup.sh
sudo bash setup.sh -d yourdomain.com -e you@yourdomain.com
```

| flag | meaning |
|---|---|
| `-d, --domain` | domain to serve; omit to serve on the bare IP |
| `-e, --email` | Let's Encrypt expiry notices |
| `-b, --branch` | branch to track (default `main`) |
| `--no-tls` | skip certbot |
| `--no-www` | do not also serve `www.` |

It is idempotent — re-run it any time. If the domain does not resolve yet it says so,
serves over HTTP, and tells you the certbot command to run once DNS has propagated.

### Shipping new commits

```sh
git push            # from your laptop
ssh you@vps myprofile-update
```

`myprofile-update` fetches the branch, republishes `public/`, re-compresses, and
reloads nginx — about a second, no downtime. It refuses to reload if `nginx -t` fails.

### Alternative: push from your laptop instead of pulling

If you would rather not have git on the server:

```sh
./deploy/deploy.sh user@your-vps
```

### Verified

`setup-ubuntu.sh` was run end-to-end in Ubuntu 24.04 and 22.04 containers. Checked:
homepage 200, assets 200, deep paths falling back to the app shell, `gzip_static`
serving pre-compressed files (app.css 21,127 → 5,600 bytes), the security headers,
dotfiles returning 403, idempotent re-runs, and `myprofile-update`.

`nginx.conf` and `Caddyfile` in this folder are standalone references for a manual
setup; `setup-ubuntu.sh` generates its own vhost and is the canonical one.

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
