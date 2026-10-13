# Avanish Singh Visen — NFC Identity Page

## What this is
A single-page personal identity site for Avanish Singh Visen, Director & CEO of DCJ Group. It opens on a phone when someone taps his NFC card, and they decide in about 10 seconds whether he's credible. It should feel premium, calm and precise: a calling card lit like a portrait and signed like a letter, not a corporate website.

## Status
The design is final. Changes are content updates, fixes, or requests from the user. Don't redesign, restyle or add sections without asking. Nothing from the old Dr. Sivaiah Potla template should come back.

## Stack
- Static files, vanilla JS. No framework, no bundler, no build step.
- GSAP 3.12.5 + ScrollTrigger from cdnjs. No other GSAP plugins.
- Lenis 1.1.14 (pinned) from unpkg for smooth scroll.
- Google Fonts: Cormorant Garamond (500, 600, 500 italic) + Nunito Sans (400, 600).
- All scripts load with `defer`. The page must still work, statically, if the CDNs fail.

## Files
| Path | Holds |
|---|---|
| `index.html` | All content and markup. `<!-- FACT: … -->` comments are open client questions. |
| `css/styles.css` | All styles, in page order. Design tokens are custom properties at the top. Use a token, not a raw value. |
| `js/main.js` | Smooth scroll, reveals, hero intro, signature, timeline card, honours list, "Reach out" pill. |
| `js/assistant.js` | Offline assistant: matcher and chat panel. Tuning constants at the top. |
| `js/assistant-kb.js` | Assistant knowledge (intents, answers, synonyms). Lazy-loaded. |
| `js/voice.js` | Tap-to-enter screen + voice-over (`audio/vo.mp3`). The tap unlocks sound; the hero intro waits for it. Pause button hides when the voice-over ends. |
| `images/` | Deployed images only: hero WebP srcset, `og.jpg`, favicon, touch icon. |
| `docs/` | Section specs and source masters. Not deployed. |
| `tools/qa/` | Regression harness. Not deployed. See README. |

## Spec files (source of truth)
| File | Covers |
|---|---|
| `docs/tokens.md` | Colour roles, type scale, spacing, motion, reduced motion |
| `docs/hero.md` | Section 1: portrait hero, name, two-cell ledger |
| `docs/about.md` | Section 2: the letter about him as a person and leader, signature (sources per line) |
| `docs/journey.md` | Section 3: alternating timeline with tap cards |
| `docs/honours.md` | Section 4: featured honour, four rows, full list disclosure |
| `docs/contact.md` | Section 5: footer with monogram, email card, socials |
| `docs/assistant.md` | Offline assistant: scope, tone, matching |

If the code and a spec disagree about something visual, the code is final; update the spec.

## Page order
Hero (navy) → About (ivory) → Journey (navy) → Honours (ivory) → Contact footer (navy)

## Rules
- Mobile-first at 390px. Must also work at 360px. On desktop, centre the page at max-width 480px.
- Tap targets 48px minimum.
- Every section reveals once on scroll. Nothing animates continuously.
- Respect `prefers-reduced-motion`: no Lenis, reveals become fades, the signature appears complete.
- Gold is never text on ivory. Use `--gold-ink` there.
- No contact buttons on the first screen. Contact lives in the footer and the "Reach out" pill.
- One left axis. Signature on the left, at the end of the About letter.
- No links to the APPL, Encraft or Enzocraft pages.
- No stock images. If an asset is missing, leave a clearly labelled placeholder and tell me.
- Don't invent facts. If content is missing, leave a `TODO` comment. Every About line must be sourced (see `docs/about.md`).
- Never attribute borrowed quotes to him, name his family members, or reuse testimonials from other pages.
- The assistant answers only from `js/assistant-kb.js`. When unsure it says sorry and offers contact; it never guesses.
- Keep it fast: no extra libraries without asking; any image below the hero lazy-loads.

## Workflow
- After any change to CSS or JS, check the page still looks and behaves the same using the QA harness (README), served with caching off.
- When a change is done, summarise it in 3–5 lines.
- Commit only when asked.
