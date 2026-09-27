# Assistant — offline Q&A about Avanish

A small chat assistant that answers questions about him from his published profile. No API, no server: everything is inside `index.html`, and nothing a visitor types leaves the page.

## Behaviour
- **Button:** 56px circle, `--navy-deep` with a gold ring and chat icon, bottom-right. Hidden on the first screen (it would sit on the hero ledger); it appears once the visitor has scrolled 35% of a screen. The "Reach out" email pill sits to its left.
- **Panel:** built on the first tap only. A bottom sheet on phones (86% of the screen, max 640px), a centred 480px panel on desktop. Navy header ("Ask about Avanish"), ivory message area, white bot bubbles, navy visitor bubbles.
- **Opening:** a one-line welcome and 4 chips: Who is Avanish? · His awards · Business enquiry · Office & directions.
- **Answers:** 1–3 short sentences, then follow-up chips and/or action buttons (Call, Email, Directions, LinkedIn, See honours, See his journey, His website). Scroll actions close the panel and glide to the section.
- **Not sure → honest sorry:** "Sorry, I’m not sure about that one. For anything specific, his office will be glad to help." with Call and Email. The same reply covers things his site doesn't publish (revenue, headcount, stock). Private questions (age, salary, family names, religion, politics) get a polite decline.
- **Accessibility:** `role="dialog"`, focus kept inside, Esc closes, focus returns to the button, answers in an `aria-live` log, page scroll paused while open, 48px tap areas. Reduced motion: no slide or bubble animation.

## Knowledge base
About 38 intents in `js/assistant-kb.js` (the matcher is `js/assistant.js`). Each has `k` (keywords), `p` (phrases, matched as unordered word sets), `a` (answer), `c` (follow-up chips) and `x` (action buttons). Every answer comes from his site or this page; the sources are the same as `about.md`, `journey.md` and `honours.md`. **Edit answers there, and never add a fact that isn't on his site.**

## Matching
Normalise → drop filler words → stem → synonyms (including a few Hinglish words: kaun, kahan, padhai, puraskar, sampark) → typo correction (edit distance 1 for 4–6 letters, 2 for 7+; 4-letter words may only correct to longer words, and 2-letter fixes must keep the first letter) → score each intent:
- keywords weighted by rarity; DCJ / group / company count as context (0.4×) when other words are present;
- phrase bonus 3.5 + 0.5 per word;
- coverage: a match that leaves the question's key words unexplained scores lower;
- a named sub-topic (Atal, company awards, APPL, Encraft) beats its parent;
- action intents (business, partnership, jobs, meeting, no-data, private) win over topic intents when both appear ("a quote for uPVC windows" is a business enquiry);
- below a score of 1.6 → the honest sorry; two close candidates → "Did you mean…?" chips;
- "tell me more", "and?", "yes" follow the last answer's first chip.

`window.__asvMatch(q)` returns the chosen intent id, for QA.

## Test results (Sep 2026)
- Tuning set, 160 questions (typos, one-word, Hinglish, out-of-scope): 160/160.
- Earlier unseen sets, 98 questions: 98/98 after fixes.
- Final holdout, 20 new questions, measured before any fix: 13/20 correct, 4 honest "sorry", 3 routed to a nearby answer. None stated anything untrue.
- Keyword matching has limits with new phrasings; when it misses, it usually says sorry rather than guess. Add real synonyms to `k` or phrases to `p` when visitors' questions show a gap.

## Weight
`js/assistant.js` (logic, ≈ 13 KB) loads with the page; `js/assistant-kb.js` (≈ 16 KB) is fetched when the button first appears. No libraries. The panel and the search index are built on the first tap.
