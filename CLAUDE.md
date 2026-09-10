# CLAUDE.md — my-profile

Professional personal website for a software developer.
Theme: **Digital Pattern** on a **Paper–Ink** palette, zero-radius components.

---

## 0. HARD RULES (never break)

1. **All files live in this folder.**
   Project root = `/Users/sanjiv/Desktop/sanjiv/migrate-api/my-profile`.
   Every file you create, edit, export or download MUST be written under this root.
2. **Never write outside the root.** No files in `/tmp`, no home-dir dotfiles, no
   sibling folders, no "server-side"/remote-only artifacts. If a tool defaults to
   somewhere else, pass an explicit absolute path inside this root.
3. **Nothing may exist only on the Claude server.** Any artifact, canvas, export or
   generated asset must have a saved copy on this local disk before the task is
   called done. Design work goes to `design/*.pen`; exports go to `design/exports/`.
4. **No hidden scratch work.** Temporary scripts go in `scratch/` (git-ignored), not
   in a system temp dir.
5. **Ask before deleting** anything already on disk. Overwrite only after reading.
6. **Pencil buffers are not files.** `open_document` binds a path, but the `.pen` only
   reaches disk when the editor saves it (⌘S). `export_nodes` fails until then. After a
   design session: save in Pencil, confirm `design/profile.pen` exists on disk, then
   export screens to `design/exports/`.

## 1. Folder layout

```
my-profile/
├── CLAUDE.md            # this file — rules
├── docs/                # design system + decisions (markdown)
├── design/              # .pen source files (Pencil MCP)
│   └── exports/         # png/svg exports of screens
├── content/             # profile.md — source of truth for all site copy
├── public/              # THE SITE. Static, no build step. This folder is the web root.
│   ├── index.html
│   └── assets/{css,js}/ # tokens.css, app.css, data.js, patterns.js, app.js
├── deploy/              # nginx.conf, Caddyfile, deploy.sh, deploy notes
└── scratch/             # throwaway, git-ignored
```

## 2. Design language

### 2.1 Theme: Digital Pattern

The page is a sheet of paper; the _digital_ comes from **printed patterns**, not from
gloss. Allowed pattern vocabulary only:

- dot grid (radial-gradient dots, 4–24px pitch)
- ruled / graph lines (1px hairlines, 8px or 24px pitch)
- halftone dot gradients (dot size varies, never opacity blur)
- ASCII / monospace character fields
- registration marks, crop marks, index numbers in the margins
  Forbidden: glassmorphism, blur backdrops, neon glow, drop shadows for depth,
  gradient meshes, 3D bevels.

### 2.2 Color — Paper & Ink

Light ("paper"):
| token | hex | use |
|---|---|---|
| `--paper-0` | `#FAF9F6` | page ground |
| `--paper-1` | `#F3F1EA` | raised surface / card |
| `--paper-2` | `#E9E6DB` | sunken, pattern field |
| `--rule` | `#D6D2C4` | hairline borders, grid lines |
| `--ink-900` | `#14130F` | primary text, borders |
| `--ink-700` | `#3B3831` | headings on paper-1 |
| `--ink-500` | `#6C685E` | secondary text |
| `--ink-300` | `#A9A395` | muted, captions, pattern dots |
| `--stamp` | `#C0362C` | ONE accent: links-hover, marks, active |
| `--blueprint`| `#26386E` | optional second ink for diagrams only |

Dark ("inverted press"): swap ground to `--ink-900` `#141310`, surfaces
`#1C1B17` / `#24231E`, rule `#33312A`, text `#F3F1EA` / `#A9A395`, stamp `#E4574B`.

Rules: max **two inks + paper** on any one screen. `--stamp` covers at most ~5% of
pixels. Never use color alone to carry meaning.

### 2.3 Type — "digital intuition"

Three faces, chosen because each one _reads as software_: a grotesk cut for
screens, a UI workhorse, and a monospace that signals "this was typed, not styled".

- Display / headings: **Geist** — 600/700, tracking `-0.02em`. Vercel's grotesk;
  engineered on a strict grid, so it feels drawn by a compiler, not a calligrapher.
- Body / UI: **Inter** — 400/500. The screen-native default; huge x-height, no
  personality tax on long reading.
- Technical: **IBM Plex Mono** — labels, metadata, numbers, nav, buttons, eyebrows,
  code. Uppercase + `letter-spacing: 0.08em` for eyebrows/labels. Fixed advance
  width is the single strongest "digital" cue available in type.
- Fallback stacks: `Geist, "Inter", system-ui, sans-serif` /
  `"IBM Plex Mono", ui-monospace, "SFMono-Regular", monospace`.
- These same three are used in `design/profile.pen` so the mock and the build match.
- Numbers always tabular (`font-variant-numeric: tabular-nums`).
- Scale (1.25): 12 / 14 / 16 / 20 / 25 / 31 / 39 / 49 / 61 px.
- Line-height: 1.6 body, 1.15 display. Measure 60–75ch.

### 2.4 Geometry

- **`border-radius: 0` everywhere.** No exceptions — cards, buttons, inputs,
  avatars, badges, images, modals. Avatars are squares.
- Borders: `1px solid var(--rule)`; emphasis `1px solid var(--ink-900)`;
  active/pressed `2px solid var(--ink-900)`. Never 3px+.
- Depth is expressed by **border and ground**, never by shadow. The only allowed
  shadow is a hard offset print block: `box-shadow: 4px 4px 0 var(--ink-900)` and
  only on primary CTA hover.
- Spacing scale: 4 8 12 16 24 32 48 64 96 128. 8px baseline grid.
- Layout: 12-column grid, 24px gutter, 1200px max, with visible hairline column
  rules on wide screens.

### 2.5 Components

- Buttons: rectangular, mono uppercase label, 12px 20px padding, 1px ink border.
  Primary = ink fill / paper text. Secondary = paper fill / ink border.
  Hover = 4px 4px 0 hard offset. No radius, no gradient, no transition longer than 150ms.
- Cards: paper-1 fill, 1px rule border, no shadow, optional dot-grid header band,
  mono index number (`01 / 06`) top-right.
- Inputs: square, 1px rule, focus = 1px ink + 2px stamp underline. No glow ring.
- Motion: 120–200ms, `cubic-bezier(.2,0,0,1)`. Movement is translate/opacity only;
  no scale bounce, no springs.

## 3. Accessibility

- Body text contrast >= 7:1 on paper (ink-900 on paper-0 passes AAA).
- Never rely on `--stamp` alone; pair with an underline, border, or label.
- Focus is always visible: 2px `--ink-900` outline, 2px offset.
- Pattern backgrounds must sit under text at <= 8% contrast against their ground.
- Respect `prefers-reduced-motion` and `prefers-color-scheme`.

## 4. Working agreements

- Research first, then design in Pencil (`design/*.pen`), then build code.
- Reuse Pencil components; never copy-paste a component's node tree by hand.
- Screenshot-verify every Pencil screen before calling it done.
- Keep `docs/DESIGN-SYSTEM.md` as the single source of truth for tokens; code must
  read from CSS custom properties in `public/assets/css/tokens.css`, never hardcode hex.
- All site copy lives in `content/profile.md` and is mirrored in
  `public/assets/js/data.js`. Change the markdown first.

## 5. The site build

**No framework and no build step, on purpose** — the VPS is 1GB, so the server runs
nginx and nothing else. Do not introduce a bundler, a Node runtime, or a dependency
without a concrete reason that outweighs that.

- Plain HTML + CSS + ES5-compatible JS, hash-routed SPA (`#/`, `#/work`, `#/about`).
- Budget: keep the whole site under **25KB gzipped**. It is ~15KB today.
- Uniform dot/rule grids are CSS gradients; only halftone uses `<canvas>` — never emit
  thousands of SVG nodes for a pattern.
- Every animation must be gated behind `prefers-reduced-motion`.
- Verify before calling a change done:
  - `npm run dom` — jsdom: routing, filters, selector wiring
  - `npm run audit` — real Chromium across 9 viewports x 3 routes; fails on horizontal
    overflow, sub-32px tap targets, clipped text, and text painted under a pattern
  - `node scratch/shots.js` — screenshots into `scratch/shots/` to eyeball
- Playwright is a **dev-only** dependency (`node_modules/`, browser in
  `scratch/ms-playwright/`, both git-ignored). The shipped site in `public/` still has
  zero dependencies and no build step — keep it that way.

# Git Guidelines

- Always commit using default local git configuration.
- Do not add custom `--author` or co-authorship tags to commits.
- Push directly using the authenticated user identity.
