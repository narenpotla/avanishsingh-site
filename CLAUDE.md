# Avanish Singh Visen — NFC Identity Page

## What this is
A single-page personal identity site for Avanish Singh Visen, Director & CEO of DCJ Group (APPL, Encraft, Enzocraft). It opens on a phone when someone taps his NFC card, and they decide in about 10 seconds whether he's credible. It should feel premium, calm and precise: a digital identity card, not a corporate website.

## Starting point
`index.html` is the finished Dr. Sivaiah Potla page. Keep its theme, tokens, glass stats column, scroll-reveal utilities and footer. Replace all of its content. Remove its video hero, specializations, education swipe deck and chatbot.

## Stack
- Single `index.html`. Vanilla JS. No framework, no bundler, no build step.
- GSAP 3.12.5 + ScrollTrigger from cdnjs.
- Lenis from unpkg for smooth scroll.
- Google Fonts: Cormorant Garamond + Nunito Sans.
- Images live in `/images`, as WebP.

## Spec files (source of truth)
| File | Covers |
|---|---|
| `tokens.md` | Colours, type, spacing, motion rules |
| `hero.md` | Section 1: static portrait hero + rolling stats |
| `about.md` | Section 2: brief about, mantra, signature |
| `journey.md` | Section 3: education + career timeline with tap-to-expand |
| `honours.md` | Section 4: spotlight → marquee → 30+ |
| `footer.md` | Section 5: contact card, vCard, footer |

`profile.json` holds the raw content. If it disagrees with a spec file, the spec file wins.

## Page order
Hero (navy) → About (ivory) → Journey (ivory) → Honours (white) → Footer (navy)

## Rules
- Mobile-first at 390px. Must also work at 360px. On desktop, centre the page at max-width 480px.
- Tap targets 48px minimum.
- Every section reveals once on scroll. Only the marquee and footer animate continuously.
- Respect `prefers-reduced-motion`: reveals become fades, the marquee stops, pinning is disabled.
- No stock images. If an asset is missing, leave a clearly labelled placeholder and tell me.
- Don't invent facts. If content is missing, leave a `TODO` comment.
- Don't change the theme or redesign sections beyond the spec. Ask first.
- Keep it fast: lazy-load images below the hero, no extra libraries without asking.

## Workflow
- Build one section per session, in page order.
- When a section is done, stop and summarise what changed in 3–5 lines.
