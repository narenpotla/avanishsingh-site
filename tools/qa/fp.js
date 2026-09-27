// QA harness (dev only, not deployed).
// Fingerprints the fully revealed page and its behaviours, so a refactor can be diffed against a baseline.
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const tick = async (n = 40) => { for (let i = 0; i < n; i++) { if (window.gsap) gsap.ticker.tick(); await sleep(25); } };

async function settle() {
  await document.fonts.ready;
  await sleep(900);
  const H = document.documentElement.scrollHeight;
  for (let y = 0; y <= H; y += 200) {
    window.scrollTo(0, y); window.dispatchEvent(new Event('scroll'));
    if (window.ScrollTrigger) ScrollTrigger.update();
    await tick(4);
  }
  await tick(140);
  window.scrollTo(0, 0); window.dispatchEvent(new Event('scroll'));
  if (window.ScrollTrigger) ScrollTrigger.update();
  await tick(20);
}

const PROPS = ['display', 'position', 'visibility', 'opacity', 'color', 'backgroundColor', 'backgroundImage', 'fontFamily', 'fontSize', 'fontWeight',
  'fontStyle', 'lineHeight', 'letterSpacing', 'textTransform', 'textAlign', 'borderTopWidth', 'borderTopColor', 'borderLeftWidth', 'borderLeftColor',
  'borderBottomWidth', 'borderRadius', 'boxShadow', 'transform', 'zIndex', 'maskImage', 'fill', 'stroke', 'strokeWidth', 'gap', 'paddingTop', 'paddingLeft'];
const r2 = (v) => Math.round(v * 2) / 2;

function snapshot(root) {
  const out = [];
  root.querySelectorAll('*').forEach((el) => {
    if (/^(SCRIPT|STYLE|NOSCRIPT|LINK|META|TITLE)$/.test(el.tagName)) return;
    const cs = getComputedStyle(el), b = el.getBoundingClientRect();
    const own = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join(' ').trim();
    out.push({
      k: el.tagName + (el.id ? '#' + el.id : '') + '.' + String(el.getAttribute('class') || '').trim().replace(/\s+/g, '.'),
      r: [r2(b.left), r2(b.top + scrollY), r2(b.width), r2(b.height)],
      s: PROPS.map((p) => cs[p]).join('|'),
      t: own.slice(0, 60),
      a: ['href', 'aria-label', 'alt', 'role', 'aria-expanded', 'hidden', 'd', 'viewBox'].map((a) => (el.getAttribute(a) || '').slice(0, 80)).join('|')
    });
  });
  return out;
}

async function behaviours() {
  const b = {};
  // Journey tap card
  const circle = document.querySelectorAll('.stop__circle')[6];
  circle.click(); await tick(20);
  const modal = document.getElementById('modal');
  b.card = { open: modal.classList.contains('is-open'), text: modal.innerText.replace(/\s+/g, ' ').trim(), focus: document.activeElement.className };
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); await tick(20);
  b.card.closed = !modal.classList.contains('is-open'); b.card.focusBack = document.activeElement === circle;
  // Honours disclosure
  const more = document.querySelector('.more'); more.click(); await tick(60);
  b.more = { expanded: more.getAttribute('aria-expanded'), panelHidden: document.getElementById('honours-full').hidden, items: document.querySelectorAll('.full__item').length };
  more.click(); await tick(60);
  b.more.after = { expanded: more.getAttribute('aria-expanded'), panelHidden: document.getElementById('honours-full').hidden };
  // Assistant
  window.scrollTo(0, 600); window.dispatchEvent(new Event('scroll')); await tick(10);
  const fab = document.querySelector('.asv-fab');
  b.fabShown = fab.classList.contains('is-shown');
  fab.click(); await sleep(400); await tick(10);
  const panel = document.querySelector('.asv-panel');
  b.asv = { open: document.documentElement.classList.contains('asv-open'), welcome: panel && panel.querySelector('.asv-msg--bot').textContent,
    chips: panel && [...panel.querySelectorAll('.asv-chip')].map((c) => c.textContent) };
  const inp = panel.querySelector('.asv-in'), form = panel.querySelector('.asv-form');
  const convo = [];
  for (const q of ['who is he', 'awrds', 'where is his ofice', 'tell me more', 'what is his favourite movie', 'how old is he', 'i need a quote for upvc windows', 'thanks']) {
    inp.value = q; form.dispatchEvent(new Event('submit', { cancelable: true })); await sleep(30);
    const last = panel.querySelector('.asv-log').lastElementChild, msgs = panel.querySelectorAll('.asv-msg--bot');
    convo.push({ q, a: msgs[msgs.length - 1].textContent, row: last.classList.contains('asv-row') ? [...last.children].map((c) => c.textContent.trim() + '>' + (c.getAttribute('href') || '')) : [] });
  }
  b.asv.convo = convo;
  b.asv.panelSnap = snapshot(panel).map((e) => e.k + '|' + e.s).join('\n').length;
  panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); await sleep(50);
  b.asv.closed = !document.documentElement.classList.contains('asv-open'); b.asv.focusBack = document.activeElement === fab;
  return b;
}

export async function matcherRun(qs) {
  const m = window.__asvMatch;
  const out = [];
  for (const q of qs) out.push(await m(q));
  return out;
}

export async function capture(label) {
  await settle();
  const snap = snapshot(document.body);
  const beh = await behaviours();
  const data = { w: innerWidth, h: innerHeight, docH: document.documentElement.scrollHeight, sw: document.documentElement.scrollWidth, snap, beh };
  localStorage.setItem('fp:' + label, JSON.stringify(data));
  return { label, elements: snap.length, docH: data.docH, sw: data.sw, beh: JSON.stringify(beh).length };
}

export async function compare(baseLabel) {
  await settle();
  const base = JSON.parse(localStorage.getItem('fp:' + baseLabel));
  const snap = snapshot(document.body);
  const beh = await behaviours();
  const diffs = [];
  const n = Math.max(base.snap.length, snap.length);
  for (let i = 0; i < n && diffs.length < 25; i++) {
    const a = base.snap[i], b = snap[i];
    if (!a || !b) { diffs.push({ i, only: a ? 'base:' + a.k : 'new:' + b.k }); continue; }
    const d = {};
    if (a.r.join() !== b.r.join()) d.rect = [a.r, b.r];
    if (a.s !== b.s) { const as = a.s.split('|'), bs = b.s.split('|'); d.style = PROPS.filter((p, j) => as[j] !== bs[j]).map((p) => p + ': ' + as[PROPS.indexOf(p)] + ' → ' + bs[PROPS.indexOf(p)]); }
    if (a.t !== b.t) d.text = [a.t, b.t];
    if (a.a !== b.a) d.attr = [a.a, b.a];
    if (Object.keys(d).length) diffs.push({ i, k: b.k, kBase: a.k === b.k ? undefined : a.k, ...d });
  }
  const behDiff = JSON.stringify(base.beh) === JSON.stringify(beh) ? 'identical' : { base: base.beh, now: beh };
  return { elements: [base.snap.length, snap.length], docH: [base.docH, document.documentElement.scrollHeight], sw: document.documentElement.scrollWidth, diffCount: diffs.length, diffs, behaviours: behDiff };
}
