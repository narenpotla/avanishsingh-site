# Section 1 — Hero

## Layout
- Full viewport height (`100svh`).
- Portrait `images/hero.webp` fills the frame, `object-fit: cover`, face in the upper third.
- Navy gradient over the bottom 35%, so text sits on solid colour.
- Text block centred in the bottom third.
- Glass stats column on the left edge: reuse the Dr. Potla component.
- **No badge. No location line. No video.**

## Content
1. Name on two lines: `Avanish` / `Singh Visen`. Cormorant ~44px, white.
2. Gold underline, 60px wide, centred.
3. `Director & CEO · DCJ Group`. Nunito Sans 13px, gold, letter-spaced.
4. Buttons:
   - **Save contact:** solid gold, downloads the vCard (see `footer.md`).
   - **Connect:** outline, scrolls to the footer.

## Stats (glass column, rolling digits)
| Number | Label |
|---|---|
| 20+ | Years of leading with passion |
| 30+ | National and international honours |
| 3 | Companies, one vision |
| 5 | Industries |

Digits roll up individually, like an odometer, not a plain count.

## Motion sequence (on load)
1. Portrait fades in with a slow zoom: scale 1.06 → 1.0 over 20s.
2. Name clip-reveals line by line, 0.4s each.
3. Underline draws left to right, 0.3s.
4. Title line fades up.
5. Stats roll, staggered 120ms.
6. Buttons fade up.

Total time to interactive feel: under 2.5s.
