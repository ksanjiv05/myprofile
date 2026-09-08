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

## Deploy — Ubuntu on EC2

The script assumes **the repo is already cloned on the instance** and deploys from
that clone. It never overwrites your working tree unless you pass `--pull`.

```sh
ssh ubuntu@your-ec2
cd ~/myprofile
sudo bash deploy/setup-ubuntu.sh -d imsanjiv.in -e you@imsanjiv.in
```

It finds the clone from its own location, so run it from inside the repo. Everything
is idempotent — re-run it whenever.

| flag | meaning |
|---|---|
| `-d, --domain` | domain to serve; omit to serve on the EC2 public IP |
| `-e, --email` | Let's Encrypt expiry notices |
| `-s, --src` | path to the clone, if auto-detection misses it |
| `--pull` | `git fetch` + `reset --hard` before deploying (discards local changes) |
| `--no-tls` | skip certbot |
| `--no-www` | do not also serve `www.` |

### Before certbot will work — the EC2 gotcha

Let's Encrypt validates over HTTP-01, which means it connects **back to your instance
from the internet**. Two things must be true, and neither is under the script's control:

1. **Security group** allows inbound TCP **80 and 443** from `0.0.0.0/0`.
   Ubuntu's `ufw` is inactive on stock EC2 images — the security group is the firewall.
2. **The A record points at this instance.** The script reads the instance's public
   IPv4 from EC2 metadata (IMDSv2) and compares it to what your domain resolves to.
   On a mismatch it tells you both addresses and skips certbot rather than burning a
   Let's Encrypt rate limit on a request that cannot succeed.

Attach an **Elastic IP** — a stop/start otherwise changes the public IP and breaks
both the DNS record and the certificate renewal.

When DNS is ready:

```sh
sudo certbot --nginx -d imsanjiv.in -d www.imsanjiv.in
```

Renewal is automatic; the certbot package installs its own systemd timer.

### Shipping new commits

```sh
git push                                  # from your laptop
ssh ubuntu@your-ec2 sudo myprofile-update --pull
```

`myprofile-update` republishes `public/`, re-compresses, and reloads nginx — about a
second, no downtime. It refuses to reload if `nginx -t` fails. Without `--pull` it
republishes whatever is in the clone, which is handy for testing an edit on the box.

### Verified

Run end-to-end in Ubuntu 24.04 and 22.04 containers, from a clone at
`/home/ubuntu/myprofile`, exactly as documented above. Checked: homepage and assets
200, deep paths falling back to the app shell, `gzip_static` serving pre-compressed
files (app.css 21,127 → 5,600 bytes), security headers, dotfiles 403, the clone left
untouched, idempotent re-runs, and `myprofile-update` picking up local edits.

`nginx.conf` and `Caddyfile` here are standalone references for a manual setup;
`setup-ubuntu.sh` generates its own vhost and that one is canonical.

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
