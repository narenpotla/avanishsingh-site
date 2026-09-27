# Design tokens and page-wide rules

Applies to every section. The values live in `:root` in `index.html`. Don't add colours, sizes or spacing values that aren't listed here.

## Grid
- Mobile-first at 390px. Must also work at 360px.
- **Gutter:** 24px at ≥ 375px; 20px below 375px.
- **Desktop (≥ 481px):** one column, max-width 480px, centred, 32px gutter, on a `--navy-deep` backdrop with a 1px `rgba(250,247,242,.06)` edge left and right. No box-shadow.
- **One left axis:** everything hangs on the left gutter. Nothing is centred.
- **Section padding:** 80px top and bottom (72px below 375px). Exceptions: Hero has no top padding; Contact has 72px top. Hero and Contact bottoms are `max(32px, env(safe-area-inset-bottom) + 20px)`.
- **Space scale:** 4 · 8 · 12 · 16 · 24 · 32 · 40 · 48 · 56 · 80. The section specs name a few fixed exceptions (6, 14, 18, 20, 28, 36, 72). Don't add others.
- **Radii:** 20 (contact card) · 14 (email button, skip link) · 999 (email pill, social circles). Everything else is square.

## Colour
| Token | Value | Role |
|---|---|---|
| `--navy` | #0E1A30 | Ground of Hero, Honours, Contact. Ink on ivory |
| `--navy-deep` | #07101F | Desktop backdrop, contact card fill, email pill fill (at 92%) |
| `--gold` | #C4973A | Light: hairlines, the thread, dots, arrows, and text **on navy only** (hero title, years, contact title). Its one fill is the email button |
| `--gold-light` | #E5C16A | Focus ring on navy. email button `:active` |
| `--ivory` | #FAF7F2 | Ground of Intro and Honours. Text on navy |
| `--ink-78` | rgba(14,26,48,.78) | Body text on ivory (≈ 8:1) |
| `--ink-62` | rgba(14,26,48,.62) | Secondary text on ivory (≈ 4.8:1). Lightest text allowed on ivory |
| `--ivory-75` | rgba(250,247,242,.75) | Body text on navy |
| `--ivory-60` | rgba(250,247,242,.6) | Secondary text on navy (≈ 6.5:1). Lightest text allowed on navy |
| `--ink-12` | rgba(14,26,48,.12) | Hairlines on ivory |
| `--ivory-12` | rgba(250,247,242,.12) | Hairlines on navy (contact card rows use .10) |
| `--gold-45` | rgba(196,151,58,.45) | Hero ledger rule, email pill border, pre-ink dot border |

Other gold alphas, one use each: `.16` honours glow · `.28` contact card border · `.3` thread track. Social circles use a 1px `rgba(250,247,242,.18)` border.

**Hard rule: gold is never text on ivory** (2.5:1, fails WCAG at every size). On ivory, gold is only lines and dots, and the focus ring is navy.

**Retired:** `--white`, `--navy-deep`, gold gradients, glows and shadows, glass, `backdrop-filter`.

## Type
Two voices. Cormorant Garamond is for what you would engrave (the name, titles, honours, years). Nunito Sans is for what you would read.

| Token | Font | Size / line height | Weight | Tracking | Used for |
|---|---|---|---|---|---|
| `display-xl` | Cormorant | `clamp(52px, 15.4vw, 64px)` / .95 (60px at 390) | 500 | -0.015em | The name, and nothing else |
| `display-l` | Cormorant | 40 / 1.05 | 500 | -0.01em | Hero numerals, featured honour |
| `display-m` | Cormorant | 30 / 1.18 | 500 | -0.01em | Section headings, Intro lede, current role, contact name |
| `display-s` | Cormorant | 22 / 1.25 | 600 (500 for the hero title) | 0 | Record roles, honour names and years, company names, hero title |
| `body` | Nunito Sans | 16 / 1.6 | 400 | 0 | Paragraphs, contact values |
| `body-s` | Nunito Sans | 14 / 1.45 | 400 | 0 | Organisations, by-lines, ledger labels |
| `caps` | Nunito Sans | 12 / 1.3, uppercase | 600 | 0.14em | Year ranges, contact labels, © line |

- 12px is the minimum size on the page. No weight 700. No caps labels above headings.
- Cormorant numerals use `font-variant-numeric: lining-nums tabular-nums`.
- Italic Cormorant 500 appears once: *speed and quality* in the Intro lede.
- Font request: `Cormorant+Garamond:ital,wght@0,500;0,600;1,500` and `Nunito+Sans:wght@400;600`, `display=swap`, with preconnect. Five files.

## Copy conventions
- British/Indian spelling ("honours", "programme"). "uPVC" with a lower-case u. "Encraft", not "ENCRAFT".
- Dashes: closed en dash in split years (`2018–19`); spaced en dash in ranges (`2003 – 2010`, `2020 – Now`).
- Every heading carries a fact. The mantra appears once (Intro).
- Character limits in the slot tables count spaces and exclude the ↓ / ↗ glyphs.
- Never on the page: testimonials, borrowed quotes, "youngest CEO" or other superlatives, award streak counts, headcount, turnover or market-share figures, Encraft's "largest / only / first" claims, family details.

## Interaction
- **Press:** rows and buttons on `:active` scale to .98 over 120ms, with a tint of `rgba(250,247,242,.04)` on navy or `rgba(14,26,48,.04)` on ivory.
- **Focus ring:** 2px `--gold-light`, offset 3px, on navy. 2px `--navy`, offset 3px, on ivory.
- **Tap targets:** 56px for ledger cells, the disclosure button and the email button. At least 68px for contact rows and 72px for company rows. 48px for socials, the pill, the panel link and the skip link. Nothing smaller.

## Motion
Like a camera: few moves, each long, decelerating and tied to meaning.

| | Value |
|---|---|
| Entrance easing | `expo.out` (CSS `cubic-bezier(.16,1,.3,1)`) |
| Structural easing | `power3.inOut` (hairline draws, disclosure) |
| Scrub easing | linear |
| Durations | press .12s · fades .6s · line masks .9s · light 1.4s · signature ≈ 1.9s |
| Distances | blocks rise 12px (hero title 8px, contact card 16px). Display lines rise from a 105% mask (`yPercent` 105 → 0) |
| Stagger | .08s (contact rows .06s) |
| Trigger | `top 85%`, `once: true` (honours rows `top 88%`) |

- Animate only `transform` and `opacity`. Named exceptions: the disclosure panel's height and the signature mask's `stroke-dashoffset`.
- `will-change` only during the hero load timeline, then removed.
- **Line masks:** GSAP 3.12's SplitText is Club-only. Use a short vanilla splitter that groups words by `offsetTop` into `overflow: hidden` lines and keeps a whole copy of the text for screen readers. Re-split on resize, or when the fonts arrive late, only if the element hasn't revealed yet.
- **Lenis:** `lerp: .1`, `smoothWheel: true`, `syncTouch: false` (phones keep native momentum), driven by `gsap.ticker`. Anchor links use `lenis.scrollTo(target, {duration: 1.2, easing: expoOut})`, then update history and move focus to the target. It must not break keyboard scrolling or `:target` jumps.
- Call `ScrollTrigger.refresh()` after fonts load and after the honours panel opens or closes.

**Forbidden:** `back`, `elastic` and `bounce` eases · scale pops · rotation (except the honours ＋ turning to ×) · anything that loops or runs continuously (marquees, Ken Burns zooms, particles, blobs) · pinning · odometer or count-up numbers · parallax on text.

## Reduced motion (`prefers-reduced-motion: reduce`)
- No Lenis. No hero exit scrub.
- Hero: the portrait and the whole text block fade in together over 0.4s. No scale, no masks.
- Reveals: opacity-only fades over 0.4s. No line masks, no hairline draws (lines are simply present).
- Journey: stops fade in place (no scale, no slide). The signature is shown complete and fades in with its block.
- Disclosure: instant height; only the content fades (0.2s). Email pill: opacity only.

## Page-wide build rules
- **Head order:** hero image preload → font preconnects and stylesheet → inline `html.js` script → GSAP 3.12.5, ScrollTrigger (cdnjs) and Lenis 1.1.14 (unpkg, pinned), all with `defer`. Initialise on `DOMContentLoaded`. No other GSAP plugins.
- **No-JS failsafe:** the inline script adds `html.js`, and every hidden pre-animation state is scoped to `.js`. If `gsap` or `ScrollTrigger` is missing 2.5s after `DOMContentLoaded`, or init hasn't run after 4s, remove `.js` so all content shows. If init throws, show everything statically.
- **Structure:** one `h1` (the name) and one `h2` per section (`sr-only` in Intro and Contact). `<main>` holds Hero to Honours; Contact is the `<footer>`. The first element in `<body>` is the skip link, "Skip to contact".
- **Accessibility:** decorative elements (thread, dots, glow, hairlines, arrows) are `aria-hidden`. Links that open a new tab carry an `sr-only` "(opens in a new tab)".
- **Budget:** under 300 KB transferred, LCP under 1.8s on 4G. The hero portrait is the only raster image; everything else is inline SVG. Any raster image added below the hero must lazy-load.
- **Layout stability:** the portrait box has a fixed aspect ratio, the hero has a minimum height, and the honours panel starts `hidden`.
