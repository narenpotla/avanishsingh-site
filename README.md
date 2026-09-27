# Avanish Singh Visen — NFC identity page

A one-page personal site for Avanish Singh Visen, Director & CEO of DCJ Group. It opens on a phone when someone taps his NFC card, so it is built for a 390px screen first and centres at 480px on desktop.

Plain HTML, CSS and JavaScript. No framework and no build step. Animation uses GSAP 3.12.5 (with ScrollTrigger) and Lenis 1.1.14 from public CDNs; the page still works, statically, if they fail to load.

## Structure

```
index.html              the page: content and markup for all five sections
css/styles.css          all styles; design tokens are the custom properties at the top
js/main.js              smooth scroll, reveals, hero intro, signature, timeline card, honours list, "Reach out" pill
js/assistant.js         the offline assistant: matcher and chat panel
js/assistant-kb.js      the assistant's knowledge: intents, answers, synonyms (loaded on demand)
images/                 everything the page serves
  hero-640.webp, hero-1024.webp   portrait (srcset)
  og.jpg                          share image, 1200×630
  favicon.svg, apple-touch-icon.png
docs/                   design and content specs per section, and source files (not deployed)
  source-assets/                  portrait master, logo PNG, signature scan
tools/qa/               regression harness (dev only, not deployed)
```

Sections, top to bottom: **Hero** (navy) · **About** (ivory) · **Journey** (navy) · **Honours** (ivory) · **Contact + footer** (navy). Each is marked with a banner comment in `index.html` and `css/styles.css`, and has a spec in `docs/`.

## Run locally

Any static server works. From the project folder:

```bash
python -m http.server 8000
```

Then open http://localhost:8000. An internet connection is needed for the fonts and the GSAP/Lenis CDNs.

## Deploy

Upload `index.html`, `css/`, `js/` and `images/` to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3 + CloudFront). Leave out `docs/`, `tools/` and `README.md`.

Before going live, once the domain is known (see the `TODO(deploy)` comment in `<head>`):

- add `<link rel="canonical" href="https://…/">` and `<meta property="og:url" content="https://…/">`;
- make `og:image`, `twitter:image` and the JSON-LD `image` absolute URLs. WhatsApp, LinkedIn and X ignore relative ones, so link previews won't show the image until this is done;
- serve over HTTPS. Long cache lifetimes are safe for `images/`; give `index.html`, `css/` and `js/` a short one or add version query strings when they change.

## Updating content

- **Text** lives in `index.html`. Every line in About is sourced from his own site; the sources are in `docs/about.md`. Don't add facts his site or interviews don't support.
- **Journey stops:** each circle is a `<button>` whose `data-range`, `data-title`, `data-meta` and optional `data-detail` fill the tap card. Update the visible text beside it too.
- **Honours:** the button label ("32 honours, 2018–2025") must match the number of `.full__item` entries.
- **Open questions for the client** are marked `<!-- FACT: … -->` in `index.html`.
- **Portrait:** export the master (`docs/source-assets/hero-master.webp` or a new photo, 2:3) as 640px and 1024px WebP at about quality 82, keeping the file names. Regenerate `images/og.jpg` if the portrait changes.
- **Colours, sizes and spacing** are tokens at the top of `css/styles.css`. Gold is never used as text on ivory; use `--gold-ink` there.

## Updating the assistant

Everything it knows is in `js/assistant-kb.js`; the field meanings are documented at the top of that file.

- **Change an answer:** edit its `a`. Keep it short, factual and sourced.
- **It misunderstands a question:** add the missing word to the intent's `k`, a phrase to `p`, or a synonym to `synonyms`. Prefer real synonyms over copying the exact question.
- **New topic:** add an intent (and a chip label `t` if it should be offered as a suggestion).
- **Contact details** appear as `TEL` / `MAIL` at the top of the file, in the `actions`, and in `index.html`. Change them together.

The scoring constants at the top of `js/assistant.js` are tuned against about 280 test questions; change them only with the QA harness below. More detail: `docs/assistant.md`.

## QA harness (`tools/qa`)

A visual and behavioural regression check used for refactoring. It reveals the whole page, fingerprints every element (position, size and key computed styles), exercises the timeline card, the honours list and the assistant, and runs every test question through the matcher.

1. Serve with caching off: `python tools/qa/serve.py .` (port 8765).
2. Open a known-good version, and in the console run
   `const fp = await import('/tools/qa/fp.js'); await fp.capture('base')` and
   `localStorage.setItem('fp:matcher', JSON.stringify(await fp.matcherRun((await import('/tools/qa/queries.js')).QUERIES)))`.
3. Open the changed version at the same viewport and run
   `(await import('/tools/qa/run.js')).run('base')`. `diffCount: 0`, `behaviours: "identical"` and `matcher: "identical"` mean nothing changed.

Use a fresh origin or the no-cache server: a cached stylesheet or script will make a real change look identical.
