# Design tokens

Same system as the Dr. Potla page. Use the values already defined in `index.html`. The core set:

```css
--navy:  #0E1A30;
--gold:  #C4973A;
--ivory: #FAF7F2;
--white: #FFFFFF;
```
Reuse any other shades (muted text, borders, glass) already defined in `index.html`. Don't add new colours.

## Type
- **Headings:** Cormorant Garamond 500/600.
- **Body:** Nunito Sans 400/600.
- **Section labels:** Nunito Sans 600, 10–11px, uppercase, letter-spacing 0.2em, gold. Preceded by a 28px gold line: `——  ABOUT`.
- **Section headings:** Cormorant ~32–36px, navy, line-height 1.1.

## Motion
- Easing: `power3.out` for reveals, `back.out(1.6)` for pops.
- Standard reveal: fade + 24px rise, 0.6s, triggered at 80% viewport, runs once.
- Stagger: 120–200ms between items.
- `prefers-reduced-motion`: opacity fades only, no pins, no marquee movement.

## Colour roles
| Element | Colour |
|---|---|
| Education markers | Ivory fill, gold border |
| Career markers | Navy fill |
| Current role | Navy fill + extra gold ring |
| Personal awards | Navy text |
| Company awards | Gold text |
