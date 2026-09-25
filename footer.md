# Section 5 — Contact + Footer

## Contact card (navy)
- **Label:** `——  CONNECT` (gold)
- **Heading:** Let's talk. (white Cormorant)
- **Three buttons in a row** (icon + label), each 48px+ tall:
  - **Call:** `tel:+911140922210`
  - **Email:** `mailto:info@avanishsinghvisen.com`
  - **Directions:** Google Maps link to *70, Okhla Industrial Estate, Phase III, New Delhi 110020*
- **Hours:** Mon–Fri, 9 am – 6 pm (small, muted on navy).
- **Save contact:** full-width solid gold button, downloads `avanish-singh-visen.vcf`.

## vCard contents
```
BEGIN:VCARD
VERSION:3.0
N:Visen;Avanish Singh;;Mr.;
FN:Avanish Singh Visen
ORG:DCJ Group
TITLE:Director & CEO
TEL;TYPE=WORK,VOICE:+911140922210
EMAIL;TYPE=WORK:info@avanishsinghvisen.com
ADR;TYPE=WORK:;;70, Okhla Industrial Estate, Phase III;New Delhi;;110020;India
URL:https://avanishsinghvisen.com
X-SOCIALPROFILE;TYPE=linkedin:https://www.linkedin.com/in/avanish-visen-b0bb325/
END:VCARD
```
Generate it as a Blob in JS, so no extra file is needed. Must work on iOS Safari and Android Chrome.

## Footer body
Reuse the Dr. Potla footer: morphing SVG blobs and gold dust particles on navy, with staggered reveals.

- **Social icons** (real brand icons, 44px tap area):
  - LinkedIn: https://www.linkedin.com/in/avanish-visen-b0bb325/
  - Instagram: https://www.instagram.com/avanishsinghvisen1/
  - Facebook: https://www.facebook.com/VisenAvanishSingh
  - YouTube: https://www.youtube.com/@AvanishSinghVisen
- **Company links** (small text row): Encraft (https://www.encraft.in/) · APPL (https://www.applindia.co.in/) · Enzocraft (https://enzocraft.in/)
- **Sign-off:** *Speed. Quality.* in Cormorant italic, gold.
- **Bottom line:** © 2026 Avanish Singh Visen (tiny, muted).
