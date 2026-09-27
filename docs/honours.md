# Section 4 — Honours (ivory)

Recognised nationally, and by customers such as LG and Haier. Three parts: **heading → featured honour + four rows → full list behind one button.**

## Layout
- `<section id="honours">` on `--ivory`, standard section padding. It follows the navy Journey.
- **None of these:** caps label, pinning, progress line, marquee, giant "30+", watermark years, photo cards, "Tap for photo". The rows are not tappable. There are no award photos on the page: they would break the one-photograph rule, so they stay on his site, linked from the end of the full list.

| Element | Style | Space above |
|---|---|---|
| Heading (`h2`) | `display-m`, `--navy` | — |
| Featured block | See below | 32 |
| Rows ×4 | See below | 40 |
| Disclosure button | Last row of the list | — |

**Featured block.** A radial gold glow sits behind it: `radial-gradient(closest-side, rgba(196,151,58,.14), transparent)`, bleeding past the block (about 72px above and below, out to the section edges) so it reads as light, not a box. `aria-hidden`.
- Year: `display-s`, `--gold-ink`, in `<time>`.
- Name (`h3`): `display-l`, `--navy`, 4 above.
- Context: `body`, `--ink-78`, 12 above, ≤ 3 lines.

**Rows.** A `--ink-12` hairline above each row. Grid: a 56px year column, then the text. Padding 18px top and bottom.
- Year: `display-s`, `--gold-ink`. Name: `display-s` 600, `--navy`. By-line: `body-s`, `--ink-62`, 4 above.

**Disclosure button.** A `<button>` at least 56px tall, full width, with a hairline above and below it. Label in `body` 600, `--navy`. On the right, a 12px ＋ made of two 1px `--gold` lines, which rotates 45° to × when open. `aria-expanded` and `aria-controls` point to the panel. Focus stays on the button.

**Full list panel.** `hidden` when closed, so it's out of the tab order. Grouped by year, newest first.
- Year heading (`h3`): `display-s`, `--gold-ink`, 24 above each group.
- Item: title in `body`, `--navy`; by-line in `body-s`, `--ink-62`; 8 between items. Each `<li>` carries `data-kind="personal"` or `"company"`.
- The panel ends with a 48px link to his awards page (new tab, ↗ in `--gold-ink`).
- No JS: a `<noscript>` style shows the panel and hides the button.

## Content
| Slot | Copy | Rule |
|---|---|---|
| Heading | `30+ group-wide honours since 2018.` | ≤ 6 words. Must carry the count; keep the "group-wide" scope |
| Featured year | `2025` | |
| Featured name | `Atal Youth Icon` | ≤ 3 words (one line at 40px) |
| Featured context | `Young World Entrepreneur Atal Icon Award, at the Prime Minister Museum, where he gave a keynote on Make in India.` | ≤ 24 words (≤ 3 lines) |
| Button | `32 honours, 2018–2025` | The exact number of items in the list. **Update it whenever the list changes.** The accessible name matches the visible text |
| Panel link | `More honours and photos on avanishsinghvisen.com ↗` → `https://avanishsinghvisen.com/awards` | "More" is honest: the list is a selection |

- "Young" belongs to the award's name. It is not a "youngest CEO" claim.
- "Since 2018" ties the count to his years as CEO and keeps the SCM-era APPL awards (2007–2017) out of the claim.

**Four rows** (newest first)

| Year | Name (≤ 40) | By-line (≤ 32) | Flag |
|---|---|---|---|
| `2025` | `Best Quality Award` | `Haier India · APPL` | company |
| `2025` | `Silver Award, Best Raw Materials Support` | `LG · APPL` | company |
| `2024` | `Best Use of Technology, Doors & Windows` | `Uttarakhand CM · Encraft` | company |
| `2022` | `India's Most Trusted CEO` | `WCRC Leaders · Personal` | personal |

- **Choosing the rows:** a recognisable presenter or institution, recency, and a mix of personal and company honours. Customer honours (LG, Haier) tell a buyer more than generic "leader" titles.
- If the client prefers Encraft over the LG row, swap in `Best uPVC Brand, Construction & Infrastructure` / `HUDCO Chairman · Encraft` (2024).

**By-line pattern:** `Presenter · Recipient`, or `Recipient` alone when the presenter isn't stated. The recipient is `Personal`, `Encraft`, `APPL` or `DCJ Group`. Personal items say "Personal", so the flag is in the copy and doesn't rely on styling.

**Full list** — 32 items (12 personal, 20 company). Title ≤ 48 characters, by-line ≤ 28 characters.

| Group | Title | By-line | Flag |
|---|---|---|---|
| 2025 | `Young World Entrepreneur Atal Icon Award` | `PM Museum · Personal` | P |
| 2025 | `Best Quality Award` | `Haier India · APPL` | C |
| 2025 | `Silver Award, Best Raw Materials Support` | `LG · APPL` | C |
| 2025 | `Best Brand in Construction & Infrastructure` | `Encraft` | C |
| 2024 | `Atal Udyog Ratna Award` | `Personal` | P |
| 2024 | `Global 2000 Inspirational Leaders` | `Personal` | P |
| 2024 | `Idea Excellence Award` | `Personal` | P |
| 2024 | `Best uPVC Brand, Construction & Infrastructure` | `HUDCO Chairman · Encraft` | C |
| 2024 | `Best Use of Technology, Doors & Windows` | `Uttarakhand CM · Encraft` | C |
| 2024 | `Appreciation for Environment, Health & Safety` | `Samsung · APPL` | C |
| 2022 | `India's Most Trusted CEO` | `WCRC Leaders · Personal` | P |
| 2022 | `Inspirational Leaders of Asia` | `White Page · Personal` | P |
| 2022 | `Best of Asia: Most Trusted Brand` | `White Page · DCJ Group` | C |
| 2022 | `Incredible Brand` | `Zee Business · Encraft` | C |
| 2022 | `Haier North Industrial Park Award` | `Haier · APPL` | C |
| 2022 | `Best Cost Performance Award` | `LG · APPL` | C |
| 2021 | `Business Leader of the Year` | `Personal` | P |
| 2021 | `India's Inspirational Leader` | `Personal` | P |
| 2021 | `Top 10 COVID-19 CSR Initiatives of the Year` | `India CSR Awards · DCJ Group` | C |
| 2021 | `Best uPVC Windows & Doors Manufacturer` | `Encraft` | C |
| 2021 | `Best Building Material & Fitting Brand` | `Encraft` | C |
| 2020–21 | `Trusted CEO` | `WCRC Leaders · Personal` | P |
| 2020–21 | `India's Inspirational Brand` | `WCRC International · Encraft` | C |
| 2020 | `The Most Admired Global Indians` | `Passion Vista · Personal` | P |
| 2020 | `Times SME Icons` | `Encraft` | C |
| 2019 | `Most Successful CEO` | `White Page · Personal` | P |
| 2019 | `Most Trusted Brand` | `White Page · DCJ Group` | C |
| 2019 | `Award for Quality` | `Godrej · APPL` | C |
| 2019 | `Award for Fast Product Development` | `Godrej · APPL` | C |
| 2018–19 | `Fastest Growing Leaders` | `Asia One · Personal` | P |
| 2018–19 | `Best Manufacturer, uPVC Door & Window Profiles` | `Encraft` | C |
| 2018–19 | `Fastest Growing Brands` | `Asia One · Encraft` | C |

There is no 2023 group. The eight group headings are 2025, 2024, 2022, 2021, 2020–21, 2020, 2019 and 2018–19.

**Left out on purpose** (don't re-add without a confirmed source):
- Everything before 2018, including the CII 2015–17 honours. They came during his SCM years and belong to APPL.
- LOW-confidence or undated items, and company entries with no presenter.
- The 2023 Liebherr award (its exact title is unknown).
- Text-only claims: Forbes India "High Performing Human Assets", "50 Most Inspiring CEO".
- Award streak counts ("fourth consecutive year", "3rd time", "4th time in a row").

## Motion
- Heading: line mask.
- Featured block: **the light returns** — the glow fades 0 → 1 over 1.4s (`power2.inOut`). The year and name use line masks, then the context fades.
- Rows and the button reveal one by one at `top 88%`: the hairline draws, then the row fades.
- **Open:** height 0 → auto over 0.7s `power3.inOut`; the items fade in over about 0.4s in total; the ＋ rotates 45° to × over 0.5s `expo.out`.
- **Close:** if the button is above the viewport, first `lenis.scrollTo(button, {offset: -96, duration: .6})`. Then collapse over 0.5s and set `hidden`.
- Call `ScrollTrigger.refresh()` after every open and close: Contact sits below, so its trigger positions move.
- Reduced motion: instant height, and only the content fades (0.2s).

## Needs client confirmation
- Sign-off on "30+ group-wide honours since 2018", the featured Atal Youth Icon, the four rows (Haier, LG, Uttarakhand CM, WCRC) and the 32-item list.
- Missing presenters and details: Atal Udyog Ratna 2024 (who presented it, and was it personal or APPL's?), Idea Excellence 2024 (was it Nepal?), Global 2000 Inspirational Leaders 2024, Business Leader of the Year 2021, India's Inspirational Leader 2021, and the presenter of Encraft's 2025 Best Brand award.
- Incredible Brand (Zee Business): 2021 or 2022? It is listed under 2022.
- White Page brand awards (2019 Most Trusted Brand, 2022 Best of Asia): Encraft or DCJ Group? Both say DCJ Group for now.
- Streak counts can return only if the client gives counts that reconcile.
- Excluded items the client could substantiate: SiliconIndia "Leader of the Year" (which year?), Global Inspirational Leaders 2023, India's Most Responsible Companies (which year?), and the two text-only claims above.
