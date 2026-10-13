/* Voice-over: plays audio/vo.mp3 as soon as the page opens.
   Phones block sound until the visitor taps the page, so if autoplay is refused it starts on their first
   tap, click or key press anywhere (a swipe to scroll doesn't count on most phones). The pause/play
   button stays while the voice-over has something left to say, and fades away when it ends (or when a
   paused visitor scrolls past the hero). Independent of GSAP, so it works even if the CDNs fail. */
(function () {
  'use strict';

  var SRC = 'audio/vo.mp3';
  var HIDE_AFTER_HERO = 0.9;       // paused + scrolled this far through one screen: hide for good
  var LEAVE_MS = 600;              // a little over the .vo fade in css/styles.css
  var GESTURES = ['pointerup', 'touchend', 'click', 'keydown'];

  var btn, ring, audio, done = false, userPaused = false, hiddenByTab = false;

  function setState(playing) {
    btn.classList.toggle('is-playing', playing);
    btn.setAttribute('aria-label', playing ? 'Pause voice-over' : 'Play voice-over');
  }

  function finish() {
    if (done) return;
    done = true;
    removeGestures();
    window.removeEventListener('scroll', onScroll);
    btn.classList.remove('is-shown');
    setTimeout(function () { btn.hidden = true; }, LEAVE_MS);
  }

  function play() {
    var p = audio.play();
    if (p && p.catch) p.catch(function () { setState(false); addGestures(); });
  }

  /* Autoplay was refused: keep trying on each real interaction until it plays (the button handles itself) */
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
    btn = document.querySelector('.vo');
    if (!btn) return;
    ring = btn.querySelector('.vo__ring circle');

    audio = new Audio(SRC);
    audio.preload = 'auto';

    audio.addEventListener('play', function () { setState(true); removeGestures(); });
    audio.addEventListener('pause', function () { if (!audio.ended) setState(false); });
    audio.addEventListener('ended', finish);
    audio.addEventListener('error', finish);
    audio.addEventListener('timeupdate', function () {
      if (audio.duration) ring.style.strokeDashoffset = String(1 - audio.currentTime / audio.duration);
    });

    btn.addEventListener('click', function () {
      if (audio.paused) { userPaused = false; play(); }
      else { userPaused = true; audio.pause(); }
    });

    /* Don't talk to an empty room: pause while the tab is hidden, resume when it's back */
    document.addEventListener('visibilitychange', function () {
      if (done) return;
      if (document.hidden && !audio.paused) { hiddenByTab = true; audio.pause(); }
      else if (!document.hidden && hiddenByTab) { hiddenByTab = false; play(); }
    });

    window.addEventListener('scroll', onScroll, { passive: true });

    setState(false);
    btn.hidden = false;
    void btn.offsetWidth;          // commit the hidden state so the fade-in runs
    btn.classList.add('is-shown');
    play();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
