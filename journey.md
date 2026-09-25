# Section 3 — Journey (education + career)

## Layout
- **Label:** `——  THE JOURNEY`
- **Heading:** Two decades, one direction.
- **Legend:** ○ Education · ● Career (small, muted, centred)
- **Timeline:**
  - A 2px gold spine runs down the centre.
  - Each stop is a 64px circle holding the year in Cormorant.
  - Stops alternate left and right of the spine, with the text on the opposite side.
  - Each circle links to a small gold dot on the spine by a short gold connector.
  - Text beside each circle: type label (small gold caps), role (Cormorant ~17px navy), organisation (Nunito Sans ~12px muted).
- **Current role (2020):** navy fill + extra gold ring.
- **Closing line** after the last stop: *16 years. One group.* Centred Cormorant ~26px, with a short gold rule above it.

## Scroll motion
1. The spine draws downward as the section scrolls (ScrollTrigger scrub).
2. Each circle pops in as it enters: scale 0.3 → 1, `back.out`.
3. The connector extends, and the text slides in from the opposite side.

## Tap to expand
- **Open:** Tapping a circle grows it into a large card in one continuous motion. Use GSAP FLIP: record the circle's rect, then animate the card from that rect to its final position. It must not look like a popup appearing.
- **Backdrop:** `backdrop-filter: blur(8px)` plus a 30% navy overlay over the rest of the page.
- **Card:**
  - White, radius 20px, width ~88vw.
  - Year range in large gold Cormorant.
  - Role in navy Cormorant.
  - Organisation · location · duration in muted Nunito Sans.
  - 2–3 lines of detail.
  - Close button (✕) top right.
- **Close:** Tap the backdrop, tap ✕, or swipe down >60px. The card animates back into its circle.
- **Lock:** Page scroll (Lenis) is paused while the card is open.
- **Accessibility:** Circles are `<button>`s. Esc closes the card. Focus moves into the card and returns to the circle on close.

## Stops
| # | Type | Circle | Role | Organisation | Card detail |
|---|---|---|---|---|---|
| 1 | Education | 2000 –03 | Diploma, Mechanical Engineering | IERT Allahabad | Where his engineering foundation began. |
| 2 | Career | 2007 | Team Lead, Sourcing | Lenovo Group · Puducherry | Mar 2007 – Aug 2008 · 1 yr 6 mo. TODO |
| 3 | Career | 2008 | Asst. Manager, Sourcing | Videocon Consumer Durables · Kashipur | Oct 2008 – Jan 2010 · 1 yr 4 mo. TODO |
| 4 | Career | 2010 | Sr. Manager, Purchase | Seaga India · Bahadurgarh | Feb – May 2010 · 4 mo. TODO |
| 5 | Career | 2010 | SCM Head | DCJ Group · New Delhi | Jun 2010 – Jul 2018 · 8 yrs 2 mo. Led supply chain across Ajay Poly, Encraft and Ajay Industrial Polymers. |
| 6 | Education | 2010 –12 | MBA, Logistics, Materials & SCM | EIILM University | Completed while leading the group's supply chain. |
| 7 | Career | 2018 | CEO | Encraft India Pvt. Ltd. | Aug 2018 – Jun 2020. Encraft named Best Manufacturer of uPVC Doors & Windows Profile Systems, 2019. |
| 8 | Career | 2020 | Director & CEO | DCJ Group | Jun 2020 – present. Leads APPL, Encraft and Enzocraft. |

Leave `TODO` rows as visible placeholder text in the card until they are filled.
