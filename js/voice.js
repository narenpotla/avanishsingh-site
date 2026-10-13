/* Voice-over and tap-to-enter.
   Phones only allow sound after the visitor taps the page, so the page opens behind a "Tap anywhere to
   enter" screen: that tap starts audio/vo.mp3 and lifts the screen, and the hero intro plays after it.
   Where the browser allows autoplay anyway, the voice-over starts at once and the screen lifts by itself.
   The pause/play button stays while the voice-over has something left to say, and fades away when it
   ends (or when a paused visitor scrolls past the hero). Independent of GSAP. */
(function () {
  'use strict';

  window.__asvVoice = true;        // tells the <head> failsafe this script arrived

  var SRC = 'audio/vo.mp3';
  var HIDE_AFTER_HERO = 0.9;       // paused + scrolled this far through one screen: hide for good
  var LEAVE_MS = 600;              // matches the .gate / .vo fade in css/styles.css
  var GESTURES = ['pointerup', 'touchend', 'click', 'keydown'];

  var gate, btn, ring, page, audio, entered = false, done = false, userPaused = false, hiddenByTab = false;

  function setState(playing) {
    btn.classList.toggle('is-playing', playing);
    btn.setAttribute('aria-label', playing ? 'Pause voice-over' : 'Play voice-over');
  }

  function showButton() {
    if (done || !btn.hidden) return;
    btn.hidden = false;
    void btn.offsetWidth;          // commit the hidden state so the fade-in runs
    btn.classList.add('is-shown');
  }

  function finish() {
    if (done) return;
    done = true;
    removeGestures();
    window.removeEventListener('scroll', onScroll);
    btn.classList.remove('is-shown');
    setTimeout(function () { btn.hidden = true; }, LEAVE_MS);
  }

  /* Lift the tap-to-enter screen and let the page (and its hero intro) start */
  function enter() {
    if (entered) return;
    entered = true;
    if (page) page.inert = false;
    if (gate) {
      gate.classList.add('is-leaving');
      setTimeout(function () { gate.remove(); }, LEAVE_MS);
    }
    if (window.__asvEntered) window.__asvEntered();
    showButton();
  }

  function play() {
    var p = audio.play();
    if (p && p.catch) p.catch(function () { setState(false); addGestures(); });
    return p;
  }

  /* If sound is still blocked after entering, keep trying on each real interaction until it plays */
  function onGesture(e) {
    if (done || userPaused || btn.contains(e.target)) return;
    if (!audio.paused) return removeGestures();
    play();
  }
  function addGestures() { GESTURES.forEach(function (t) { document.addEventListener(t, onGesture, true); }); }
  function removeGestures() { GESTURES.forEach(function (t) { document.removeEventListener(t, onGesture, true); }); }

  function onScroll() {
    if (audio.paused && window.scrollY > window.innerHeight * HIDE_AFTER_HERO) finish();
  }

  function init() {
    gate = document.querySelector('.gate');
    btn = document.querySelector('.vo');
    page = document.querySelector('.page');
    if (!btn) return enter();
    ring = btn.querySelector('.vo__ring circle');

    audio = new Audio(SRC);
    audio.preload = 'auto';

    audio.addEventListener('play', function () { setState(true); removeGestures(); });
    audio.addEventListener('pause', function () { if (!audio.ended) setState(false); });
    audio.addEventListener('ended', finish);
    audio.addEventListener('error', function () { finish(); enter(); });
    audio.addEventListener('timeupdate', function () {
      if (audio.duration) ring.style.strokeDashoffset = String(1 - audio.currentTime / audio.duration);
    });

    btn.addEventListener('click', function () {
      if (audio.paused) { userPaused = false; play(); }
      else { userPaused = true; audio.pause(); }
    });

    /* Don't talk to an empty room: pause while the tab is hidden, resume when it's back */
    document.addEventListener('visibilitychange', function () {
      if (done || !entered) return;
      if (document.hidden && !audio.paused) { hiddenByTab = true; audio.pause(); }
      else if (!document.hidden && hiddenByTab) { hiddenByTab = false; play(); }
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    setState(false);

    if (gate && document.documentElement.classList.contains('gated')) {
      if (page) page.inert = true;
      gate.focus({ preventScroll: true });
      gate.addEventListener('click', function () { play(); enter(); });
      /* Autoplay allowed (e.g. a desktop browser he has used before): no need to ask for the tap */
      var p = audio.play();
      if (p && p.then) p.then(enter, function () { setState(false); });
    } else {
      enter();                      // the failsafe already lifted the screen
      play();
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
