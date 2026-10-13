/*
 * Page behaviour: smooth scroll, reveals, hero intro, signature, timeline card, honours list, "Reach out" pill.
 * Needs GSAP 3.12 + ScrollTrigger (and Lenis for smooth scroll). Without them, or if anything throws,
 * fallback() shows the page statically. prefers-reduced-motion swaps every reveal for a short fade.
 */
(function () {
  'use strict';

  var html = document.documentElement;
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lenis = null;

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var expoOut = function (t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); };
  var wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var refresh = function () { if (window.ScrollTrigger) ScrollTrigger.refresh(); };

  function boot() {
    window.__asvReady = true; /* tells the <head> failsafe that JS arrived */
    var animated = !!(window.gsap && window.ScrollTrigger) && html.classList.contains('js');
    disclosure();
    timelineCard();
    if (!animated) return fallback();
    try { init(); } catch (err) { console.error(err); fallback(); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  /* Show everything statically: used when GSAP is missing or init() throws */
  function fallback() {
    html.classList.remove('js');
    if (window.ScrollTrigger) ScrollTrigger.getAll().forEach(function (t) { t.kill(); });
    if (window.gsap) gsap.set($$('[data-r], .ln__i, .hero__img, .hero__portrait, .sig, .pill'), { clearProps: 'all' });
    var ink = $('.sig__ink'); if (ink) ink.removeAttribute('mask');
    if (lenis) { lenis.destroy(); lenis = null; }
  }

  /* ---------------------------------------------------------------------
     Line splitter: wraps each rendered line of a block in a mask for the line reveal.
     A visually hidden copy keeps the text whole for screen readers.
     --------------------------------------------------------------------- */
  function split(el) {
    if (el._ls) return el._ls;
    var pre = el.querySelectorAll('.ln__i');
    if (pre.length) return (el._ls = Array.prototype.slice.call(pre));
    el._src = el.innerHTML;

    var words = [];
    (function walk(node, wrap) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          n.nodeValue.split(/([ \t\n\r]+)/).forEach(function (t) {
            if (!t) return;
            if (/^[ \t\n\r]+$/.test(t)) { words.push(document.createTextNode(' ')); return; }
            var w = document.createElement('span'); w.className = 'w';
            if (wrap) { var c = wrap.cloneNode(false); c.textContent = t; w.appendChild(c); } else w.textContent = t;
            words.push(w);
          });
        } else if (n.nodeType === 1) walk(n, n.cloneNode(false));
      });
    })(el, null);

    var text = el.textContent.replace(/\s+/g, ' ').trim();
    el.textContent = '';
    words.forEach(function (w) { el.appendChild(w); });

    /* Group words into lines by their top offset (one read pass after one write pass) */
    var lines = [], top = null, cur = null;
    words.forEach(function (w) {
      if (w.nodeType !== 1) { if (cur) cur.push(w); return; }
      var t = w.offsetTop;
      if (top === null || Math.abs(t - top) > 3) { cur = []; lines.push(cur); top = t; }
      cur.push(w);
    });

    el.textContent = '';
    var sr = document.createElement('span'); sr.className = 'sr-only'; sr.textContent = text;
    var vis = document.createElement('span'); vis.className = 'lns'; vis.setAttribute('aria-hidden', 'true');
    lines.forEach(function (ws) {
      var ln = document.createElement('span'); ln.className = 'ln';
      var inner = document.createElement('span'); inner.className = 'ln__i';
      ws.forEach(function (w) { inner.appendChild(w); });
      ln.appendChild(inner); vis.appendChild(ln);
    });
    el.appendChild(sr); el.appendChild(vis);
    return (el._ls = Array.prototype.slice.call(vis.querySelectorAll('.ln__i')));
  }
  function unsplit(el) {
    if (el._src == null) return;
    el.innerHTML = el._src; el._src = null; el._ls = null;
  }

  /* ---------------------------------------------------------------------
     Reveal primitives. Each adds tweens to a timeline; reduced motion: opacity only
     --------------------------------------------------------------------- */
  var building = null; /* the reveal being built, so its line splits can be undone on re-measure */
  function list(x) { return [].concat(x).filter(Boolean); }

  function linesTo(tl, els, pos, o) {
    o = o || {}; els = list(els); if (!els.length) return;
    if (RM) { tl.to(els, { opacity: 1, duration: .4, ease: 'none' }, pos); return; }
    var ls = [];
    els.forEach(function (el) { ls = ls.concat(split(el)); if (building) building.splits.push(el); });
    gsap.set(ls, { yPercent: 105 });
    gsap.set(els, { opacity: 1 });
    tl.to(ls, { yPercent: 0, duration: o.d || .9, ease: 'expo.out', stagger: o.s == null ? .08 : o.s }, pos);
  }
  function fadeTo(tl, els, pos, o) {
    o = o || {}; els = list(els); if (!els.length) return;
    if (RM) { tl.to(els, { opacity: 1, duration: .4, ease: 'none', stagger: (o.s || 0) / 2 }, pos); return; }
    var y = o.y == null ? 12 : o.y;
    var from = { opacity: 0 }, to = { opacity: 1, duration: o.d || .6, ease: o.e || 'expo.out', stagger: o.s || 0 };
    if (y) { from.y = y; to.y = 0; to.clearProps = 'transform'; }
    gsap.set(els, from);
    tl.to(els, to, pos);
  }
  function ruleTo(tl, els, pos) {
    els = list(els); if (!els.length) return;
    if (RM) { gsap.set(els, { opacity: 1 }); return; }
    gsap.set(els, { opacity: 1, scaleX: 0, transformOrigin: '0% 50%' });
    tl.to(els, { scaleX: 1, duration: .9, ease: 'power3.inOut' }, pos);
  }
  function lightTo(tl, el, pos) {
    if (!el) return;
    tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: RM ? .4 : 1.4, ease: RM ? 'none' : 'power2.inOut' }, pos);
  }

  /* Once-only scroll reveals. Rebuilt if the layout changes before they play (resize, late fonts). */
  var reveals = [];
  function reveal(trigger, build, start) {
    if (!trigger) return;
    var r = { trigger: trigger, build: build, start: start || 'top 85%', played: false, splits: [] };
    reveals.push(r); arm(r);
  }
  function arm(r) {
    building = r;
    r.tl = gsap.timeline({ paused: true });
    r.build(r.tl);
    building = null;
    r.st = ScrollTrigger.create({
      trigger: r.trigger, start: r.start, once: true,
      onEnter: function () { r.played = true; r.tl.play(); }
    });
  }
  function rearm() {
    reveals.forEach(function (r) {
      if (r.played) return;
      r.st.kill(); r.tl.kill();
      r.splits.forEach(unsplit); r.splits = [];
      arm(r);
    });
    refresh();
  }

  /* ---------------------------------------------------------------------
     Init
     --------------------------------------------------------------------- */
  function init() {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    if (!RM && window.Lenis) {
      lenis = new Lenis({ lerp: .1, smoothWheel: true, syncTouch: false });
      window.__asvLenis = lenis; /* js/assistant.js pauses it while the chat is open */
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (t) { if (lenis) lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
    anchors();

    /* Line reveals measure text, so wait for the fonts (at most 800ms) */
    var fontsIn = false;
    var fontLoad = (document.fonts && document.fonts.load)
      ? Promise.all([
          document.fonts.load('500 60px "Cormorant Garamond"'),
          document.fonts.load('600 22px "Cormorant Garamond"'),
          document.fonts.load('400 16px "Nunito Sans"')
        ]).then(function () { fontsIn = true; }, function () { fontsIn = true; })
      : Promise.resolve().then(function () { fontsIn = true; });
    var fontGate = Promise.race([fontLoad, wait(800)]);

    hero(fontGate);
    pill();
    signatureReveal();

    fontGate.then(function () {
      sections();
      refresh();
      if (!fontsIn) fontLoad.then(rearm); /* lines were measured on the fallback font */
    });

    var lastW = window.innerWidth, rt;
    window.addEventListener('resize', function () {
      if (window.innerWidth === lastW) return; /* ignore mobile toolbar height changes */
      lastW = window.innerWidth;
      clearTimeout(rt); rt = setTimeout(rearm, 200);
    });
  }

  /* In-page links through Lenis, keeping history and focus correct */
  function anchors() {
    document.addEventListener('click', function (e) {
      if (!lenis || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute('href');
      var t = id.length > 1 && document.getElementById(id.slice(1));
      if (!t) return;
      e.preventDefault();
      lenis.scrollTo(t, { duration: 1.2, easing: expoOut });
      if (history.pushState) history.pushState(null, '', id);
      if (!t.hasAttribute('tabindex')) t.setAttribute('tabindex', '-1');
      t.focus({ preventScroll: true });
    });
  }

  /* ---------------------------------------------------------------------
     1 · Hero: the light comes on, then the name; the light dims as you leave
     --------------------------------------------------------------------- */
  function hero(fontGate) {
    var heroEl = $('.hero'), portrait = $('.hero__portrait'), img = $('.hero__img');
    var name = $('.hero__name'), title = $('.hero__title'), cos = $('.hero__cos'), rule = $('.hero__rule');
    var nums = $$('.ledger__num'), labels = $$('.ledger__label');
    var imgReady = (img.decode ? img.decode() : Promise.resolve()).catch(function () {});

    if (RM) {
      Promise.race([Promise.all([imgReady, fontGate]), wait(900)]).then(function () {
        gsap.to([img, name, title, cos, rule].concat(nums, labels), { opacity: 1, duration: .4, ease: 'none' });
      });
      return;
    }

    gsap.set(portrait, { xPercent: -50, x: 0 }); /* GSAP owns the CSS translateX(-50%) so the scrub below keeps it */
    imgReady.then(function () {
      img.style.willChange = 'opacity, transform';
      gsap.timeline({ onComplete: function () { img.style.willChange = ''; } })
        .fromTo(img, { opacity: 0 }, { opacity: 1, duration: 1.4, ease: 'power2.inOut' }, 0)
        .fromTo(img, { scale: 1.03 }, { scale: 1, duration: 2.2, ease: 'expo.out' }, 0);
    });

    var t0 = performance.now();
    fontGate.then(function () {
      var tl = gsap.timeline({ delay: Math.max(0, .35 - (performance.now() - t0) / 1000) });
      linesTo(tl, name, 0, { s: .1 });
      fadeTo(tl, [title, cos], .45, { y: 8, s: .08 });
      ruleTo(tl, rule, .65);
      linesTo(tl, nums, .75, { d: .8 });
      fadeTo(tl, labels, .9, { y: 0, d: .5 });
    });

    gsap.to(portrait, {
      yPercent: 8, opacity: .4, ease: 'none',
      scrollTrigger: { trigger: heroEl, start: 'top top', end: 'bottom top', scrub: true }
    });
  }

  /* ---------------------------------------------------------------------
     2–5 · Section reveals, in page order
     --------------------------------------------------------------------- */
  function sections() {
    /* 2 · About: the lede by line, then each block as it arrives */
    var lede = $('.about__lede');
    reveal(lede, function (tl) { linesTo(tl, lede, 0); });
    $$('.about [data-r="fade"]').forEach(function (el) {
      reveal(el, function (tl) { fadeTo(tl, el, 0); });
    });

    /* 3 · Journey: heading and legend, then each stop grows out of the spine */
    var jh = $('#record-h');
    reveal(jh, function (tl) { linesTo(tl, jh, 0); fadeTo(tl, $('.legend'), .2, { y: 0 }); });
    $$('.stop').forEach(function (s) {
      var left = s.classList.contains('stop--left');
      reveal(s, function (tl) {
        if (RM) { tl.to(s, { opacity: 1, duration: .4, ease: 'none' }, 0); return; }
        gsap.set(s, { opacity: 1 });
        tl.fromTo($('.stop__circle', s), { scale: .6, opacity: 0 }, { scale: 1, opacity: 1, duration: .7, ease: 'expo.out', clearProps: 'transform' }, 0)
          .fromTo($('.stop__conn', s), { scaleX: 0 }, { scaleX: 1, duration: .5, ease: 'power3.out', transformOrigin: left ? '100% 50%' : '0% 50%' }, .1)
          .fromTo($('.stop__text', s), { opacity: 0, x: left ? 16 : -16 }, { opacity: 1, x: 0, duration: .7, ease: 'expo.out', clearProps: 'transform' }, .15);
      });
    });
    var close = $('.journey__close');
    reveal(close, function (tl) { fadeTo(tl, close, 0); });

    /* 4 · Honours: heading, the featured honour in its light, then each row */
    var hh = $('#honours-h');
    reveal(hh, function (tl) { linesTo(tl, hh, 0); });
    var feat = $('.featured');
    reveal(feat, function (tl) {
      lightTo(tl, $('.featured__glow'), 0);
      linesTo(tl, $('.featured__year'), .1);
      linesTo(tl, $('.featured__name'), .2);
      fadeTo(tl, $('.featured__ctx'), .5);
    });
    $$('.hitem').forEach(function (li) {
      reveal(li, function (tl) {
        ruleTo(tl, $('.rule', li), 0);
        fadeTo(tl, $('.hrow, .more', li), .3, { y: 0 });
      }, 'top 88%');
    });
    var hEnd = $('.hlist__end');
    reveal(hEnd, function (tl) { ruleTo(tl, hEnd, 0); }, 'top 92%');

    /* 5 · Footer: the monogram, the invitation, then the card and links */
    var foot = $('#contact');
    reveal(foot, function (tl) {
      fadeTo(tl, $('.foot__logo'), 0, { y: 0, d: .9 });
      fadeTo(tl, [$('.foot__label'), $('.foot__h'), $('.foot__lede')], .2, { s: .1 });
      fadeTo(tl, $('.mailcard'), .55, { y: 16, d: .8 });
      fadeTo(tl, [$('.socials'), $('.copy'), $('.copy2')], .8, { y: 0, s: .08 });
    }, 'top 80%');
  }

  /* ---------------------------------------------------------------------
     2 · Signature: the outline is revealed through centreline strokes (#sigStrokes), in writing order.
     Browsers restart a dash pattern at every subpath ("M"), so each stroke is split into its
     subpaths and one eased progress walks the pen through them.
     --------------------------------------------------------------------- */
  function signatureReveal() {
    var el = $('.sig'); if (!el) return;
    if (RM) {
      ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: function () { gsap.to(el, { opacity: 1, duration: .4, ease: 'none' }); } });
      return;
    }
    var ink = $('.sig__ink', el);
    ink.setAttribute('mask', 'url(#sigMask)');

    var strokes = $$('#sigStrokes path', el).map(function (s) {
      var total = 0;
      var segs = s.getAttribute('d').split(/(?=M)/).map(function (d) { return d.trim(); }).filter(Boolean).map(function (d) {
        var c = s.cloneNode(false);
        c.setAttribute('d', d);
        s.parentNode.insertBefore(c, s);
        var seg = { el: c, start: total, len: Math.max(c.getTotalLength(), .5) };
        total += seg.len;
        return seg;
      });
      s.parentNode.removeChild(s);
      return { segs: segs, total: total };
    });
    var segEls = [];
    strokes.forEach(function (s) { s.segs.forEach(function (g) { segEls.push(g.el); }); });
    gsap.set(segEls, { attr: { 'stroke-dasharray': '1 1', 'stroke-dashoffset': 1 }, opacity: 0 });
    gsap.set(el, { opacity: 1 });

    function draw(stroke, t) {
      var at = t * stroke.total;
      stroke.segs.forEach(function (g) {
        var local = Math.min(1, Math.max(0, (at - g.start) / g.len));
        g.el.setAttribute('stroke-dashoffset', String(1 - local));
        g.el.style.opacity = local > 0 ? 1 : 0;
      });
    }

    ScrollTrigger.create({
      trigger: el, start: 'top 85%', once: true,
      onEnter: function () {
        var sum = strokes.reduce(function (a, s) { return a + s.total; }, 0);
        var lift = .06, drawTime = Math.max(.6, 1.9 - lift * (strokes.length - 1)); /* ~1.9s in all, with pen lifts */
        var tl = gsap.timeline({ onComplete: function () { ink.removeAttribute('mask'); } }); /* then show the outline unmasked */
        strokes.forEach(function (s, i) {
          var o = { t: 0 };
          tl.to(o, { t: 1, duration: drawTime * s.total / sum, ease: 'sine.inOut', onUpdate: function () { draw(s, o.t); } }, i ? '+=' + lift : 0);
        });
      }
    });
  }

  /* ---------------------------------------------------------------------
     3 · Timeline card: a circle opens its card. Closes on ✕, backdrop, Esc or a swipe down;
     focus returns to the circle.
     --------------------------------------------------------------------- */
  function timelineCard() {
    var modal = $('#modal'); if (!modal) return;
    var box = $('.modal__card', modal), closeBtn = $('.modal__close', modal), opener = null;

    function fill(id, text) { var el = document.getElementById(id); el.textContent = text || ''; el.hidden = !text; }
    /* While the card is open, everything behind it is out of reach for keyboards and screen readers */
    function background(inert) { $$('.page, .pill, .asv-fab').forEach(function (n) { n.inert = inert; }); }
    function open(btn) {
      var d = btn.dataset; opener = btn;
      fill('mRange', d.range); fill('mTitle', d.title); fill('mMeta', d.meta); fill('mDetail', d.detail);
      box.scrollTop = 0;
      modal.classList.add('is-open'); modal.setAttribute('aria-hidden', 'false');
      background(true);
      html.style.overflow = 'hidden'; if (lenis) lenis.stop();
      closeBtn.focus({ preventScroll: true });
    }
    function close() {
      if (!modal.classList.contains('is-open')) return;
      modal.classList.remove('is-open'); modal.setAttribute('aria-hidden', 'true');
      background(false);
      html.style.overflow = ''; if (lenis) lenis.start();
      if (opener) opener.focus({ preventScroll: true });
    }

    $$('[data-card]').forEach(function (b) { b.addEventListener('click', function () { open(b); }); });
    closeBtn.addEventListener('click', close);
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
    document.addEventListener('keydown', function (e) {
      if (!modal.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') { e.preventDefault(); closeBtn.focus(); } /* ✕ is the card's only control */
    });
    var y0 = null;
    box.addEventListener('touchstart', function (e) { y0 = box.scrollTop <= 0 ? e.touches[0].clientY : null; }, { passive: true });
    box.addEventListener('touchmove', function (e) { if (y0 !== null && e.touches[0].clientY - y0 > 60) { y0 = null; close(); } }, { passive: true });
  }

  /* ---------------------------------------------------------------------
     4 · Honours: the full list opens inline
     --------------------------------------------------------------------- */
  function disclosure() {
    var btn = $('.more'); if (!btn) return;
    var panel = document.getElementById(btn.getAttribute('aria-controls'));
    var icon = $('.more__x', btn);
    var items = $$('.full__group, .full__link', panel);

    function collapse() {
      if (RM) { gsap.set(icon, { rotation: 0 }); panel.hidden = true; refresh(); return; }
      gsap.to(icon, { rotation: 0, duration: .5, ease: 'expo.out' });
      gsap.to(panel, { height: 0, duration: .5, ease: 'power3.inOut',
        onComplete: function () { panel.hidden = true; gsap.set(panel, { clearProps: 'height' }); refresh(); } });
    }

    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      if (!window.gsap || !html.classList.contains('js')) { panel.hidden = !open; refresh(); return; }
      gsap.killTweensOf([panel, icon].concat(items));

      if (open) {
        var h0 = panel.hidden ? 0 : panel.offsetHeight;
        panel.hidden = false;
        if (RM) {
          gsap.set(icon, { rotation: 45 });
          gsap.fromTo(items, { opacity: 0 }, { opacity: 1, duration: .2, ease: 'none' });
          refresh(); return;
        }
        gsap.to(icon, { rotation: 45, duration: .5, ease: 'expo.out' });
        gsap.fromTo(panel, { height: h0 }, { height: 'auto', duration: .7, ease: 'power3.inOut',
          onComplete: function () { gsap.set(panel, { clearProps: 'height' }); refresh(); } });
        gsap.fromTo(items, { opacity: 0 }, { opacity: 1, duration: .25, ease: 'none', stagger: { amount: .15 }, delay: .2 });
        return;
      }

      /* Closing from far below: bring the button back into view first */
      if (btn.getBoundingClientRect().top >= 0) return collapse();
      if (lenis) lenis.scrollTo(btn, { offset: -96, duration: .6, easing: expoOut, onComplete: collapse });
      else { window.scrollTo(0, btn.getBoundingClientRect().top + window.pageYOffset - 96); collapse(); }
    });
  }

  /* ---------------------------------------------------------------------
     "Reach out" pill: shown after the hero has left, hidden once Contact arrives
     --------------------------------------------------------------------- */
  function pill() {
    var el = $('.pill'), heroEl = $('.hero'), contact = $('#contact');
    if (!el) return;
    var gone = false, atContact = false, shown = false;
    gsap.set(el, { autoAlpha: 0, y: RM ? 0 : 12 });
    function update() {
      var s = gone && !atContact;
      if (s === shown) return; shown = s;
      gsap.killTweensOf(el);
      if (s) gsap.to(el, { autoAlpha: 1, y: 0, duration: RM ? .3 : .45, ease: 'power3.out' });
      else gsap.to(el, { autoAlpha: 0, y: RM ? 0 : 12, duration: .3, ease: 'power2.in' });
    }
    ScrollTrigger.create({ trigger: heroEl, start: 'bottom top',
      onEnter: function () { gone = true; update(); }, onLeaveBack: function () { gone = false; update(); } });
    ScrollTrigger.create({ trigger: contact, start: 'top 85%',
      onEnter: function () { atContact = true; update(); }, onLeaveBack: function () { atContact = false; update(); } });
  }
})();
