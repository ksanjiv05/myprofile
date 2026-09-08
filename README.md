# myprofile

Personal site for **Sanjiv Kumar Pandit** — AI & full-stack engineer.

**Live: https://imsanjiv.in**

Static HTML, CSS and vanilla JS. **No framework, no build step, no runtime.**
~17KB gzipped, six files, zero production dependencies — it is designed to run on a
1GB VPS where nginx serves files off disk and nothing else is running.

## Layout

```
public/          the site — this folder is the web root
  index.html
  assets/css/    tokens.css (design tokens), app.css
  assets/js/     data.js (all copy), patterns.js, app.js (hash router)
content/         profile.md — source of truth for every string on the site
design/          Pencil source + the pattern generator scripts
docs/            design system documentation
deploy/          nginx.conf, Caddyfile, deploy.sh
```

## Design

Paper–Ink palette on a "Digital Pattern" theme: `#FAF9F6` paper, `#14130F` ink,
**zero border radius anywhere**, 1px hairlines, and depth from borders rather than
shadows. Light and dark come from the same tokens — dark is the same sheet run as an
inverted press. Type is Geist / Inter / IBM Plex Mono.

Uniform dot and rule grids are CSS gradients. Halftone — where dot _size_ carries the
tone, the way print does it — is drawn on `<canvas>`, so hundreds of dots cost a few
hundred bytes of markup instead of a 20KB SVG path.

See [`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md).

## Develop

```sh
npm run serve     # http://127.0.0.1:8899
npm run dom       # jsdom: routing, filters, selector wiring
npm run audit     # Chromium across 9 viewports x 3 routes
```

`npm run audit` fails on horizontal overflow, sub-32px tap targets, clipped text, text
painted under a pattern layer, and text butting against a border. Playwright is a
dev-only dependency; the shipped site has none.

## Deploy

```sh
./deploy/deploy.sh user@your-vps
```

```sh
sudo myprofile-update --pull
```

## Republish

```sh
sudo myprofile-update
```

Static rsync — no build, no service restart. See [`deploy/README.md`](deploy/README.md).
