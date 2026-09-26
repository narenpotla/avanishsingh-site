# Section 3 — Journey (navy)

Education and career as an alternating timeline on a gold spine. Tap any circle for its card. The section closes on "16 years. One group." (His signature now ends the About section.)

## Layout
- `<section id="record">`, `--navy`, standard section padding. It sits between the ivory Intro and the ivory Honours. The id stays `record` because the hero's "20+ Years in industry" links to it.
- Heading (`h2`, `display-m`, `--ivory`): **Two decades, one direction.**
- Legend under it (`body-s`, `--ivory-60`, left-aligned): ○ Education · ● Career.
- **Timeline:** a 2px `--gold` spine down the centre. Stops alternate left and right, starting left.
  - Each stop is a **64px circle** holding the year in Cormorant 600 (17px; a second line such as `–03` at 12px).
  - Education (hollow): `--navy` fill, 1.5px `--gold` border, ivory year. Career (filled): `--ivory` fill, navy year. Current role: filled, plus an extra gold ring (3px navy gap, then 2px gold).
  - Each circle joins the spine with a 22px, 2px gold connector and an 8px gold dot on the spine.
  - Text sits on the opposite side of the spine: type label (`caps`, `--gold`), role (Cormorant 600 18px, `--ivory`), organisation (Nunito 12px, `--ivory-60`).
- **Closing:** a 40px gold rule, then *16 years. One group.* (Cormorant italic 26px, `--ivory`), centred.

On navy, gold text is fine. On the ivory sections, gold text uses `--gold-ink` (#8A6A28, 4.6:1); `--gold` itself is 2.5:1 there.

## Stops (chronological)
| # | Side | Type | Circle | Role | Organisation (list) | Card: range | Card: meta | Card: detail |
|---|---|---|---|---|---|---|---|---|
| 1 | L | Education | 2000 –03 | Diploma, Mechanical Engineering | IERT Allahabad | 2000 – 2003 | IERT Allahabad | — |
| 2 | R | Career | 2003 | Technical Officer | Mahindra & Mahindra | Jul 2003 – Oct 2005 | Mahindra & Mahindra | — |
| 3 | L | Career | 2005 | Engineer, Materials | Eicher Tractors | Oct 2005 – Feb 2007 | Eicher Tractors | — |
| 4 | R | Career | 2007 | Team Lead, Sourcing | Lenovo · Puducherry | Mar 2007 – Aug 2008 | Lenovo Group · Puducherry · 1 yr 6 mo | — |
| 5 | L | Career | 2008 | Asst. Manager, Sourcing | Videocon · Kashipur | Oct 2008 – Jan 2010 | Videocon Consumer Durables · Kashipur · 1 yr 4 mo | — |
| 6 | R | Career | 2010 | Sr. Manager, Purchase | Seaga India · Bahadurgarh | Feb – May 2010 | Seaga India · Bahadurgarh · 4 mo | — |
| 7 | L | Career | 2010 | SCM Head | DCJ Group · New Delhi | Jun 2010 – Jul 2018 | DCJ Group · New Delhi · 8 yrs 2 mo | Ran supply chain for 13 plants across Ajay Poly, Encraft and Ajay Industrial Polymers, with a team of 15. |
| 8 | R | Education | 2010 –12 | MBA, Logistics, Materials & SCM | EIILM University | 2010 – 2012 | EIILM University | — |
| 9 | L | Career | 2018 | CEO | Encraft India Pvt. Ltd. | Aug 2018 – Jun 2020 | Encraft India Pvt. Ltd. | Encraft named Best Manufacturer of uPVC Doors & Windows Profile Systems by Worldwide Achievers, 2018–19. |
| 10 | R | Career (current) | 2020 | Director & CEO | DCJ Group | Jun 2020 – present | DCJ Group · APPL, Encraft, Enzocraft | — |

- Durations count months inclusively, as LinkedIn does. Stops without a detail simply show none: never a visible `TODO`.
- IBM and TAFE are left out (no dates on the site).

## Tap card
- Every circle is a `<button>` carrying `data-range`, `data-title`, `data-meta` and optional `data-detail`; one shared card is filled from them.
- White card (the page behind is navy), radius 20, `min(88vw, 420px)`, over a 30% navy backdrop with an 8px blur. Range in Cormorant 30px `--gold-ink`, role 24px navy, meta 14px `--ink-62`, detail 15px `--ink-78`, 48px ✕ top right.
- Closes on ✕, backdrop tap, Esc or a swipe down of more than 60px. Focus moves to ✕ on open and back to the circle on close. Page scroll (Lenis) pauses while it's open.
- A FLIP grow-from-circle transition is still a possible later upgrade; today the card fades and rises in.

## Motion (once, at `top 85%`)
- Heading line-mask, then the legend fades.
- Each stop as it enters: circle scales .6→1 and fades (0.7s `expo.out`), connector draws from the spine (0.5s), text slides 16px from the spine side (0.7s).
- Closing line fades up.
- Reduced motion: opacity-only fades.

## Needs client confirmation
- "13 plants" and "a team of 15" (a single, undated mention on his site).
- The date he became Director (the site dates only the CEO role, Jun 2020).
