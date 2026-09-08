# Paper · Ink — Digital Pattern

Design system for the personal site. Everything below is decided, not proposed.
Source of truth for values: [`public/assets/css/tokens.css`](../public/assets/css/tokens.css).
Source of truth for layout: [`design/profile.pen`](../design/profile.pen).

---

## 1. What the research said

**Paper ground.** `#FAF9F6` is the canonical warm off-white: RGB(250,249,246), hue 45°,
lightness 97.3%. It carries warm undertones pure white lacks, reads softer and less
clinical, and reduces eye strain on screens while staying luminous. It is the standard
"paper" ground when paired with black ink text.

**Type that reads as software.** For 2026 developer portfolios the recommended free
pairings are Geist Sans + Geist Mono, Inter + JetBrains Mono, and Mona Sans + Hubot Mono.
The consistent finding: *monospace has become the design signal for anything technical,
numeric, or intentionally structured* — mono in labels and headings communicates
technical credibility instantly. Geist is called out as one of the best free
monospace/grotesk families released recently, engineered on a strict grid.

**Pattern as texture, not decoration.** Halftone reproduces tone by varying **dot size**
in a grid, not by blurring opacity — that size variation is what makes it read as
*printed*. CSS gets a true dot grid from a repeating `radial-gradient`; a real halftone
needs generated geometry, which is why our patterns are script-generated.

**Zero radius is the current direction, not a gimmick.** The soft-UI aesthetic of the
early 2020s (heavy shadows, extreme radii, floating components) is being phased out;
the replacement is stark 0px right angles with hard flat borders, 1px hairlines
separating regions, and a wireframe-structured feel. It suits portfolios and editorial
work specifically — which is exactly this site.

**Sources**
- [#FAF9F6 — Icons8 off-white](https://icons8.com/colors/off-white) ·
  [colorhexa](https://www.colorhexa.com/faf9f6) ·
  [encycolorpedia](https://encycolorpedia.com/faf9f6)
- [Best font pairings for designer portfolios 2026 — The Crit](https://thecrit.co/resources/best-font-pairings-portfolio)
- [Best monospace fonts 2026 — Made Good Designs](https://madegooddesigns.com/best-monospace-fonts-2026/)
- [26 best free fonts for UI & web 2026 — DiverseKit](https://diversekit.com/blog/26-best-free-fonts-for-ui-web-design-in-2026)
- [CSS halftone patterns — CSS { In Real Life }](https://css-irl.info/css-halftone-patterns/)
- [CSS dotted background — DEV](https://dev.to/codingdudecom/css-dotted-background-4m20)
- [Retro & brutalist UI — a 2026 field guide, Setproduct](https://www.setproduct.com/blog/retro-brutalist-ui-design-2026)
- [Brutalist web design: CSS recipe & trend data — Superdesign](https://superdesign.dev/styles/brutalism)

## 2. The three decisions

| Decision | Chosen | Why |
|---|---|---|
| Ground | `#FAF9F6` paper, `#14130F` ink | Warm, AAA at 15.9:1, never pure black on pure white |
| Type | Geist / Inter / IBM Plex Mono | Grotesk on a strict grid + screen-native body + the strongest available "digital" cue |
| Geometry | radius 0, 1px hairlines, no shadows | Depth from borders and ground, the way print gets it |

## 3. Tokens

Light is the default. Dark is not a filter — it is the same sheet run as an
**inverted press**: ink becomes the ground, paper becomes the mark.

| token | light | dark |
|---|---|---|
| `--paper-0` | `#FAF9F6` | `#141310` |
| `--paper-1` | `#F3F1EA` | `#1C1B17` |
| `--paper-2` | `#E9E6DB` | `#24231E` |
| `--rule` | `#D6D2C4` | `#33312A` |
| `--ink-900` | `#14130F` | `#F3F1EA` |
| `--ink-700` | `#3B3831` | `#D6D2C4` |
| `--ink-500` | `#6C685E` | `#A9A395` |
| `--ink-300` | `#A9A395` | `#6C685E` |
| `--ink-inverse` | `#FAF9F6` | `#141310` |
| `--stamp` | `#C0362C` | `#E4574B` |
| `--blueprint` | `#26386E` | `#7B8DC7` |

Because every colour is a token pair, the whole site inverts by flipping one attribute.
The `05 — Dark / Inverted press` artboard in the .pen file is the *same nodes* as the
home page with `theme: {mode: "dark"}` — nothing was redrawn.

**Type scale** (ratio 1.25): 11 · 12 · 14 · 16 · 18 · 20 · 25 · 31 · 39 · 49 · 61.
**Spacing**: 4 8 12 16 24 32 48 64 96 128, on an 8px baseline.
**Grid**: 1440 frame, 64px margins, 1312 content, 12 columns, 24px gutter.

## 4. Pattern vocabulary

Four generators, all deterministic, all local in [`design/scripts/`](../design/scripts/):

| Script | Pattern | Where it is used |
|---|---|---|
| `dot-grid.js` | uniform dots, pitch 16–24 | page grounds, hero |
| `halftone.js` | dot **size** carries tone (down/up/left/right/radial) | card header bands, hero plate, CTA |
| `rule-grid.js` | graph-paper hairlines, pitch 24–40 | section headers, capability band |
| `ascii-field.js` | monospace character texture | portrait plate, specimen |

Each emits a **single path node** holding every dot, so a 1440×660 field costs one node
rather than a thousand. Each card instance overrides only the generator's inputs — six
work cards, six distinct halftones, one component.

Rules: patterns sit under text at ≤8% contrast against their ground; tone is always
carried by dot size, never by blur; no pattern is purely decorative — each one marks a
zone change.

## 5. Components

Built once in the .pen file, reused everywhere: Nav, Button (Primary / Secondary /
Inverse / Primary-hover), Link, Tag, Input, Stat, Work Card, Index Row, CTA, Footer.

- **Buttons** — mono uppercase 12/1.2, padding 12×20, 1px border. Hover is a hard
  4px 4px 0 print offset in `--stamp`. No radius, no gradient, no blur.
- **Cards** — `--paper-1` on a 1px `--rule`, halftone band on top, mono index `01 / 06`,
  title, description, tags, arrow link. No shadow, ever.
- **Inputs** — square, 1px `--ink-900`, no glow ring.
- **Motion** — 120–200ms, `cubic-bezier(.2,0,0,1)`, translate/opacity only.

## 6. Artboards in `design/profile.pen`

| Artboard | Node | Contents |
|---|---|---|
| `00 — Design System` | `Z80RO` | colour, type scale, pattern specimens, all components |
| `01 — Home` | `ztUY2` | nav, hero, ticker, stats, work, capabilities, CTA, footer |
| `02 — Work` | `s597W0` | index header with filters, 6-card grid, footer |
| `03 — About` | `Hp4u8` | intro + halftone plate, history, toolbox, CTA, footer |
| `04 — Mobile` | `dN7f1` | 390px home |
| `05 — Dark` | `B2y6L` | inverted press, same nodes, theme flipped |

## 7. Copy

All site copy lives in [`content/profile.md`](../content/profile.md), with every line
marked verified / stated / TODO. Update that file first, then propagate to the .pen.

## 8. Open items

- Contact details, employment dates and years of experience are still TODO in
  `content/profile.md`.
- `WishperWave` needs a public link; its card is drawn in the "awaiting copy" state.
- Work showcase order is FindMyPlayer → Tasker AI → Neuron → Vaani → Lattice → WishperWave.
- An apps/writing detail template is not designed yet.
- The built site lives in `public/` — see [`deploy/README.md`](../deploy/README.md).
- Decide whether the halftone plate on About is eventually replaced by a real photo
  run through the same halftone treatment.
