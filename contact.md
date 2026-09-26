# Section 5 — Contact + footer (navy)

The page's closing card: his monogram, an invitation, one email card, socials, and the copyright line, with a large monogram watermark catching the light in the bottom-right corner. Phone and office address are not shown here; the assistant gives them (office line, hours, directions).

## Layout
- `<footer id="contact">` on `--navy`, `overflow: hidden`. Padding 72px top; bottom `max(104px, safe-area + 96px)` so the floating assistant button never covers the © lines.
- **Monogram** (top): 76px wide, gold gradient (`#E5C16A → #C4973A → #E5C16A`). It is an inline SVG traced from `images/logo.png` (the source file is blue on white; the page never loads the PNG). viewBox `50 80 1152 916`.
- **Label:** 44px gold rule, then `Let’s connect` in 12px caps, `--gold2`, tracking .28em. 40px below the monogram.
- **Heading** (`h2`): `Building Relationships.` in `--ivory`, `Creating Impact.` on its own line in `--gold2`. Cormorant 500, `clamp(34px, 10.4vw, 44px)`/1.08.
- **Lede:** `I’m always open to conversations, collaborations and new opportunities.` in `--ivory-60`, max 30ch.
- **Email card:** the whole card is one `mailto:` link. 1px gold border (60%), radius 14, faint gold wash. A 44px gold-ringed envelope with a soft glow, a gold divider, `GET IN TOUCH` (12px caps, `--ivory-75`), the address in Cormorant sized `min(20px, (100vw − 190px) / 11.3)` so it stays on one line from 360px up, and a gold → arrow.
- **Hairline**, then **socials:** LinkedIn, Instagram, Facebook, YouTube as 52px circles with a gold (70%) ring and `--gold2` brand glyphs. New tab.
- **Copyright:** `© 2026 Avanish Singh Visen` (12px caps, `--ivory-75`, tracking .24em), then `All rights reserved` (`--ivory-60`).
- **Watermark:** the same monogram at 88% of the width, anchored off the bottom-right edge. Fill `rgba(250,247,242,.035)`, 4-unit stroke with a gold gradient that brightens mid-way, plus a soft radial gold glow behind it. `aria-hidden`.

## Content
| Slot | Copy |
|---|---|
| Label | `Let’s connect` |
| Heading | `Building Relationships.` / `Creating Impact.` |
| Lede | `I’m always open to conversations, collaborations and new opportunities.` |
| Card | `Get in touch` / `info@avanishsinghvisen.com` → `mailto:info@avanishsinghvisen.com` |
| Socials | LinkedIn `https://www.linkedin.com/in/avanish-visen-b0bb325/` · Instagram `https://www.instagram.com/avanishsinghvisen1/` · Facebook `https://www.facebook.com/VisenAvanishSingh` · YouTube `https://www.youtube.com/@AvanishSinghVisen` |
| © | `© 2026 Avanish Singh Visen` / `All rights reserved` |

The lede is in the first person, as in the approved reference design; the rest of the page speaks about him in the third person.

## Email pill
One persistent contact control for people who just met him.
- A fixed `<a href="mailto:info@avanishsinghvisen.com">`, placed after the page column, labelled "Reach out". 48px tall, radius 999, `rgba(7,16,31,.92)` fill (`--navy2` at 92%), 1px `--hair-ledger` border, `body-s` 600 `--ivory` label, 18px `--gold` envelope icon. No backdrop blur. `aria-label`: "Reach out by email: info@avanishsinghvisen.com".
- Position: to the left of the assistant button (`assistant.md`): `right: calc(max(0px, (100vw - 480px) / 2) + 82px)`; `bottom: max(16px, env(safe-area-inset-bottom) + 8px)`.
- **Shows** when the hero has fully left the viewport: opacity 0 → 1, y 12 → 0, 0.45s `power3.out`.
- **Hides** when this section's top reaches 85% of the viewport: 0.3s `power2.in`. Both reverse on scroll back.
- So the email never appears twice on screen, and there is no contact control on the first screen.
- Starts hidden (`opacity: 0; visibility: hidden`). Focus ring `--gold2`.

## Motion
- Once, at `top 80%`: the monogram fades in (0.9s), the label, heading and lede rise 12px in turn (0.1s stagger), then the email card rises 16px, then socials and © lines fade.
- Nothing here animates continuously. Reduced motion: opacity-only fades.

## Needs client confirmation
- **Direct contact:** a personal email for the card (it shows the shared info@ inbox).
- **Logo:** a vector (SVG/AI) master would be better than the traced PNG, though the trace is clean.
- **Phone and address** now live only in the assistant; say if they should come back to the footer.
