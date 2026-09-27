/*
 * Assistant: an offline Q&A about Avanish, running entirely in the page (no API, nothing sent anywhere).
 * The floating button appears once the visitor scrolls; the knowledge base (js/assistant-kb.js) is fetched
 * in the background when it does, and the panel is built on the first tap.
 *
 * Matching: normalise → stem → synonyms → typo correction → score every intent by keyword rarity,
 * phrase matches and coverage of the question → rerank (sub-topics beat parents, actions beat topics).
 * Low confidence gives the honest "Sorry…"; two close candidates give "Did you mean…?".
 */
(function () {
  'use strict';

  var fab = document.querySelector('.asv-fab');
  if (!fab) return;
  var html = document.documentElement;
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var KB_SRC = 'js/assistant-kb.js';

  /* Tuning: see assistant.md in /docs before changing these */
  var MIN_SCORE = 1.6;       /* below this, say sorry */
  var CLOSE_CALL = .92;      /* second place within 92% of first ... */
  var CLOSE_CALL_MAX = 4;    /* ... and first place weaker than this: ask "Did you mean" */
  var CONTEXT_WEIGHT = .4;   /* weight of group/company words when other words are present */
  var PHRASE_BONUS = 3.5;    /* plus .5 per phrase word */
  var CHILD_BONUS = 1.5;     /* a matched sub-topic beats its parent by this */
  var ACTION_BONUS = 3;      /* an action intent's boost when it matches ... */
  var TOPIC_DAMPING = .6;    /* ... and the factor applied to topic intents */

  /* Language data (domain vocabulary lives in the knowledge base) */
  var STOP = set('a an the is are was were be been am of to in on at for and or his him he me my i you your yours about tell please pls plz can could would should do does did it its this that these those with from any some kya hai ka ki ke ko se mein me there here what whats which how much many does get give know want need like just also so very really');
  var PHRASE_WORDS = set('who where when how what you are many long old time is he his him does did do the a an of in to for with me about from up work set book place'); /* stopwords that phrases may use */
  var FOLLOW = set('more else detail details continue elaborate explain go on and then ok okay yes sure aur'); /* "tell me more" */

  function set(words) { var o = {}; words.split(' ').forEach(function (w) { o[w] = 1; }); return o; }

  /* ---------------------------------------------------------------------
     Button: shown after 35% of a screen of scrolling (on the hero it would cover the ledger)
     --------------------------------------------------------------------- */
  var shown = null;
  function onScroll() {
    var s = window.scrollY > window.innerHeight * .35;
    if (s === shown) return;
    shown = s;
    fab.classList.toggle('is-shown', s);
    if (s) loadKB();
  }
  fab.hidden = false;
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var kbReady = null;
  function loadKB() {
    if (!kbReady) kbReady = new Promise(function (resolve, reject) {
      if (window.ASV_KB) return resolve();
      var s = document.createElement('script');
      s.src = KB_SRC; s.async = true;
      s.onload = function () { resolve(); };
      s.onerror = reject;
      document.head.appendChild(s);
    });
    return kbReady;
  }

  var ui = null, idx = null, lastIntent = null;
  fab.addEventListener('click', function () {
    loadKB().then(function () { if (!ui) build(); open(); }, function () { window.location.href = 'mailto:info@avanishsinghvisen.com'; });
  });

  /* ---------------------------------------------------------------------
     Index: normalised keywords, phrases and word rarity (idf) for every intent
     --------------------------------------------------------------------- */
  function stem(w) {
    if (w.length > 4 && /ies$/.test(w)) return w.slice(0, -3) + 'y';
    if (w.length > 3 && /s$/.test(w) && !/(ss|us|is)$/.test(w)) return w.slice(0, -1);
    if (w.length > 5 && /ing$/.test(w)) return w.slice(0, -3);
    return w;
  }
  function canon(w) {
    if (STOP[w]) return w;
    var syn = idx.syn;
    if (syn[w]) return syn[w];
    var s = stem(w);
    return syn[s] || s;
  }
  function words(s) {
    return String(s).toLowerCase().replace(/[’`']/g, '').replace(/&/g, ' and ')
      .replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
  }
  function toks(s) { return words(s).map(canon); }
  function unique(w, i, a) { return a.indexOf(w) === i; }

  function buildIndex() {
    var KB = window.ASV_KB, df = {}, vocab = {};
    idx = { syn: KB.synonyms, context: set(KB.contextWords.join(' ')), names: set(KB.nameWords.join(' ')), intents: KB.intents, byId: {} };
    KB.intents.forEach(function (it) {
      idx.byId[it.id] = it;
      it._k = {}; toks(it.k).forEach(function (w) { it._k[w] = 1; });
      it._p = (it.p || []).map(function (p) { return toks(p).filter(unique); }); /* synonyms can collapse words */
      Object.keys(it._k).forEach(function (w) { df[w] = (df[w] || 0) + 1; vocab[w] = 1; });
      it._p.forEach(function (p) { p.forEach(function (w) { if (!STOP[w] || PHRASE_WORDS[w]) vocab[w] = 1; }); });
    });
    var N = KB.intents.length;
    idx.idf = {};
    Object.keys(df).forEach(function (w) { idx.idf[w] = 1 + Math.log(N / df[w]); });
    idx.vocab = Object.keys(vocab);
  }

  /* ---------------------------------------------------------------------
     Typo correction: Damerau–Levenshtein distance to the vocabulary
     --------------------------------------------------------------------- */
  function dist(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return max + 1;
    var d = [], i, j;
    for (i = 0; i <= a.length; i++) d[i] = [i];
    for (j = 0; j <= b.length; j++) d[0][j] = j;
    for (i = 1; i <= a.length; i++) {
      var rowMin = Infinity;
      for (j = 1; j <= b.length; j++) {
        var c = a[i - 1] === b[j - 1] ? 0 : 1;
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + c);
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
        rowMin = Math.min(rowMin, d[i][j]);
      }
      if (rowMin > max) return max + 1; /* early exit */
    }
    return d[a.length][b.length];
  }
  /* One edit for 4–6 letters, two for 7+. Four-letter words may only grow ("awrd" → "award", never
     "core" → "come"); two-edit fixes must keep the first letter ("weather" never becomes "father"). */
  function correct(w) {
    if (w.length < 4 || /^\d+$/.test(w)) return w;
    var max = w.length >= 7 ? 2 : 1, best = w, bd = max + 1;
    idx.vocab.forEach(function (v) {
      if (v.length < 3 || (w.length === 4 && v.length <= 4)) return;
      var dd = dist(w, v, max);
      if (dd === 2 && v[0] !== w[0]) return;
      if (dd < bd || (dd === bd && v[0] === w[0] && best[0] !== w[0])) { bd = dd; best = v; }
    });
    return bd <= max ? best : w;
  }

  /* ---------------------------------------------------------------------
     Scoring
     --------------------------------------------------------------------- */
  function score(it, content, present) {
    var s = 0, hit = 0, phrase = false, explained = {};
    content.forEach(function (w) {
      if (!it._k[w]) return;
      s += idx.idf[w] * (idx.context[w] && content.length > 1 ? CONTEXT_WEIGHT : 1);
      explained[w] = 1;
    });
    it._p.forEach(function (p) {
      if (!p.length || !p.every(function (w) { return present[w]; })) return;
      s += PHRASE_BONUS + p.length * .5; phrase = true;
      p.forEach(function (w) { explained[w] = 1; });
    });
    content.forEach(function (w) { if (explained[w]) hit++; });
    if (content.length) s *= .5 + .5 * hit / content.length; /* coverage of the question */
    return { it: it, s: s, hit: hit, phrase: phrase };
  }

  function match(q) {
    var all = toks(q).map(function (w) { return idx.idf[w] || idx.vocab.indexOf(w) > -1 || STOP[w] ? w : correct(w); });
    var content = all.filter(function (w) { return !STOP[w] && !idx.names[w]; });
    var present = {}; all.forEach(function (w) { present[w] = 1; });

    /* Just his name ("Avanish?") means: who is he */
    if (!content.length && all.some(function (w) { return idx.names[w]; })) return { best: { it: idx.byId.who, s: 9 }, second: null, content: content };

    var scored = idx.intents.map(function (it) { return score(it, content, present); });
    var byId = {}; scored.forEach(function (r) { byId[r.it.id] = r; });
    scored.forEach(function (r) {
      var parent = r.it.parent && byId[r.it.parent];
      if (parent && parent.s > 0 && (r.hit || r.phrase) && r.s > 0) r.s = Math.max(r.s, parent.s) + CHILD_BONUS;
    });
    if (scored.some(function (r) { return r.it.act && r.hit; })) {
      scored.forEach(function (r) {
        if (r.it.act && r.hit) r.s += ACTION_BONUS; else if (!r.it.act) r.s *= TOPIC_DAMPING;
      });
    }
    scored.sort(function (a, b) { return b.s - a.s; });
    return { best: scored[0], second: scored[1], content: content };
  }

  /* One decision, shared by the chat and the QA hook */
  function decide(q) {
    var m = match(q);
    var follow = m.content.length > 0 && m.content.every(function (w) { return FOLLOW[w]; });
    if (!m.best || m.best.s < MIN_SCORE) return { kind: 'sorry', follow: follow };
    var b = m.best, c = m.second;
    if (c && c.s >= b.s * CLOSE_CALL && b.s < CLOSE_CALL_MAX && c.it.t && b.it.t) return { kind: 'ask', ids: [b.it.id, c.it.id], follow: follow };
    return { kind: 'answer', it: b.it, follow: follow };
  }

  function respond(q) {
    var d = decide(q);
    var next = d.follow && lastIntent && (lastIntent.c || [])[0];
    if (next) return answer(idx.byId[next]);
    if (d.kind === 'sorry') { lastIntent = null; return say(window.ASV_KB.fallback, null, window.ASV_KB.fallbackActions); }
    if (d.kind === 'ask') return say('Did you mean one of these?', d.ids);
    answer(d.it);
  }
  function answer(it) { lastIntent = it; say(it.a, it.c, it.x); }

  /* ---------------------------------------------------------------------
     Panel
     --------------------------------------------------------------------- */
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function icon(p) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>'; }

  function build() {
    if (!idx) buildIndex();
    var scrim = el('div', 'asv-scrim');
    var panel = el('div', 'asv-panel');
    panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-labelledby', 'asvTitle'); panel.setAttribute('data-lenis-prevent', '');
    panel.innerHTML =
      '<div class="asv-head"><div class="asv-head__txt"><p class="asv-title" id="asvTitle" tabindex="-1">Ask about Avanish</p>' +
      '<p class="asv-sub">Answers from his published profile</p></div>' +
      '<button class="asv-x" type="button" aria-label="Close">' + icon('<path d="M6 6l12 12M18 6 6 18"/>') + '</button></div>' +
      '<div class="asv-log" role="log" aria-live="polite"></div>' +
      '<form class="asv-form" autocomplete="off"><input class="asv-in" type="text" maxlength="160" placeholder="Ask a question…" aria-label="Type your question" enterkeyhint="send">' +
      '<button class="asv-send" type="submit" aria-label="Send">' + icon('<path d="M4 12h15M13 6l6 6-6 6"/>') + '</button></form>';
    document.body.appendChild(scrim); document.body.appendChild(panel);
    ui = { panel: panel, log: panel.querySelector('.asv-log'), input: panel.querySelector('.asv-in') };

    panel.querySelector('.asv-x').addEventListener('click', close);
    scrim.addEventListener('click', close);
    panel.querySelector('.asv-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var q = ui.input.value.trim(); if (!q) return;
      ui.input.value = ''; me(q); respond(q);
    });
    panel.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key !== 'Tab') return;
      /* keep focus inside the panel */
      var f = Array.prototype.filter.call(panel.querySelectorAll('button, a[href], input'), function (n) { return n.offsetParent !== null; });
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    });
    say(window.ASV_KB.welcome, window.ASV_KB.starters);
  }

  function scrollBottom() { ui.log.scrollTop = ui.log.scrollHeight; }
  function me(text) { ui.log.appendChild(el('div', 'asv-msg asv-msg--me', text)); scrollBottom(); }
  function say(text, chips, acts) {
    ui.log.appendChild(el('div', 'asv-msg asv-msg--bot', text));
    var row = el('div', 'asv-row');
    (acts || []).forEach(function (k) {
      var A = window.ASV_KB.actions[k]; if (!A) return;
      var a = el('a', 'asv-act');
      a.href = A.href || A.to;
      if (A.ext) { a.target = '_blank'; a.rel = 'noopener'; }
      a.innerHTML = icon(A.i) + '<span></span>'; a.querySelector('span').textContent = A.l;
      if (A.to) a.addEventListener('click', function (e) { e.preventDefault(); close(); scrollToSection(A.to); });
      row.appendChild(a);
    });
    (chips || []).forEach(function (id) {
      var it = idx.byId[id]; if (!it || !it.t) return;
      var b = el('button', 'asv-chip', it.t); b.type = 'button';
      b.addEventListener('click', function () { me(it.t); answer(it); });
      row.appendChild(b);
    });
    if (row.children.length) ui.log.appendChild(row);
    scrollBottom();
  }
  function scrollToSection(sel) {
    var t = document.querySelector(sel); if (!t) return;
    var L = window.__asvLenis;
    if (L) L.scrollTo(t, { duration: 1.2 }); else t.scrollIntoView({ behavior: RM ? 'auto' : 'smooth' });
  }

  /* While the panel is open, the page behind it is out of reach for keyboards and screen readers */
  function background(inert) { var p = document.querySelector('.page'); if (p) p.inert = inert; }

  function open() {
    html.classList.add('asv-open');
    background(true);
    html.style.overflow = 'hidden';
    if (window.__asvLenis) window.__asvLenis.stop();
    fab.setAttribute('aria-expanded', 'true');
    var fine = window.matchMedia('(pointer: fine)').matches; /* no keyboard pop-up on phones */
    setTimeout(function () { (fine ? ui.input : ui.panel.querySelector('#asvTitle')).focus({ preventScroll: true }); }, 60);
    scrollBottom();
  }
  function close() {
    html.classList.remove('asv-open');
    background(false);
    html.style.overflow = '';
    if (window.__asvLenis) window.__asvLenis.start();
    fab.setAttribute('aria-expanded', 'false');
    fab.focus({ preventScroll: true });
  }

  /* QA hook: resolves to the intent id the matcher picks, e.g. "awards", "ask:a|b", "fallback" */
  window.__asvMatch = function (q) {
    return loadKB().then(function () {
      if (!idx) buildIndex();
      var d = decide(q);
      if (d.kind === 'sorry') return 'fallback';
      if (d.kind === 'ask') return 'ask:' + d.ids.join('|');
      return d.it.id + (d.follow ? '(follow)' : '');
    });
  };
})();
