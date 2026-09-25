# Section 4 — Honours

Three parts, in this order: **spotlight → marquee → 30+ close**.

- **Label:** `——  HONOURS`
- **Heading:** Recognised by the nation. Earned with the team.
- **Background:** white

## Part A — Scroll spotlight (top 5)
- **Pin:** The section pins for 5 steps, ~70vh of scroll each (ScrollTrigger pin + scrub, snapping to each award).
- **Progress:** A thin 2px gold progress line on the right edge fills as you move through the steps.
- **Each step, centred:**
  - The year, very large behind the text: Cormorant ~140px, gold, ~12% opacity.
  - The award name: Cormorant ~36px, navy, max 3 lines.
  - The presenter: Nunito Sans 600, 11px caps, gold.
  - One line of context: Nunito Sans 14px, muted.
  - A small "Tap for photo" hint, muted, shown only on the first award.
- **Transition:** The current award fades and rises out (−30px) as the next rises in (+30px).
- **Tap:** Opens the same expand card as `journey.md`, with the ceremony photo at the top of the card.

| # | Year | Award | Presenter / context | Photo |
|---|---|---|---|---|
| 1 | 2025 | Atal Youth Icon | National Atal Award Ceremony · Keynote on Make in India, PM Museum | images/awards/1.webp |
| 2 | 2024 | Atal Udyog Ratna | Atal Foundation | images/awards/2.webp |
| 3 | 2024 | Global 2000 Inspirational Leaders | Best of Asia | images/awards/3.webp |
| 4 | 2022 | India's Most Trusted CEO | WCRC Leaders | images/awards/4.webp |
| 5 | 2024 | Best uPVC Brand, 4th year running | Presented by the HUDCO Chairman · Encraft | images/awards/5.webp |

## Part B — Honour roll marquee
- After the last spotlight step, the pin releases and two rows scroll horizontally in opposite directions, ~40s per loop, seamless.
- **Row 1, personal awards:** navy, Cormorant 22px, separated by small gold dots:
  Inspirational Leaders of Asia 2022 · Business Leader of the Year 2021 · Most Admired Global Indians 2020 · Times SME Icons 2020 · Trusted CEO 2020–21 · Fastest Growing Leader 2018–19 · IDEA Excellence Award 2024 · Most Successful CEO 2019
- **Row 2, company awards:** gold, Cormorant 22px, moving the opposite way:
  Best Quality Award 2025 · LG Silver Award 2025 · Best Use of Technology, Uttarakhand 2024 · Best of Asia Most Trusted Brand 2022 · India CSR Awards 2021 · CII SMB Star Icon 2020 · India's Most Trusted Brand 2021–22 · Best Manufacturer uPVC Profile Systems 2019
- Tap anywhere on the marquee to pause both rows. Tap again to resume.
- White-to-transparent fade masks on the left and right edges.
- Pause the animation when the marquee is off-screen (IntersectionObserver).

## Part C — Close
- Centred: a large gold **30+** (Cormorant ~96px) that counts up as it enters.
- *honours since 2018* below it, in Cormorant italic, muted.
- Small text link: `View all on avanishsinghvisen.com →` (https://avanishsinghvisen.com/awards)
