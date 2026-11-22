// Mobile menu
(function () {
  var btn = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (!btn || !nav) return;
  btn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
})();

// Click-to-play YouTube: swap the thumbnail for the real player on click.
document.addEventListener('click', function (e) {
  var link = e.target.closest && e.target.closest('a.yt');
  if (!link || e.metaKey || e.ctrlKey || e.shiftKey) return;
  e.preventDefault();
  var frame = document.createElement('div');
  frame.className = 'yt-frame';
  var iframe = document.createElement('iframe');
  iframe.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(link.dataset.id) + '?autoplay=1&rel=0';
  iframe.title = link.dataset.title || 'YouTube video';
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  iframe.allowFullscreen = true;
  frame.appendChild(iframe);
  link.replaceWith(frame);
});

// Homepage fireworks: a few slow, faint bursts behind the hero (a nod to the old site).
// Only runs while the hero is on screen, and not at all if the visitor prefers reduced motion.
(function () {
  var canvas = document.querySelector('canvas.fireworks');
  if (!canvas || !canvas.getContext) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var ctx = canvas.getContext('2d');
  var COLORS = ['240,169,59', '255,236,200', '201,163,224']; // gold, warm cream, soft lavender
  var EVERY_MS = 2600;   // time between bursts
  var MAX_ALPHA = 0.8;   // soft, not loud
  var particles = [], rockets = [];
  var w = 0, h = 0, dpr = 1, running = false, raf = 0, last = 0, nextBurst = 0;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function launch() {
    // stay over the open dark area on the left (around her name); full width on phones
    var x = w * (w > 860 ? 0.04 + Math.random() * 0.48 : 0.1 + Math.random() * 0.8);
    var top = h * (0.08 + Math.random() * 0.2);
    rockets.push({ x: x, y: h, ty: top, vy: -(h - top) / 0.9, color: COLORS[(Math.random() * COLORS.length) | 0] });
  }

  function burst(x, y, color) {
    var n = 60 + ((Math.random() * 20) | 0);
    var speed = Math.min(w, h) * (0.26 + Math.random() * 0.1);
    for (var i = 0; i < n; i++) {
      var a = (i / n) * Math.PI * 2 + Math.random() * 0.2;
      var s = speed * (0.55 + Math.random() * 0.45);
      particles.push({ x: x, y: y, px: x, py: y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 0, max: 1.8 + Math.random() * 0.8, color: color });
    }
  }

  function frame(t) {
    if (!running) return;
    var dt = Math.min((t - (last || t)) / 1000, 0.05); last = t;
    if (t >= nextBurst) { launch(); nextBurst = t + EVERY_MS * (0.8 + Math.random() * 0.5); }
    ctx.clearRect(0, 0, w, h);
    ctx.lineCap = 'round';

    for (var r = rockets.length - 1; r >= 0; r--) {
      var k = rockets[r], py = k.y;
      k.y += k.vy * dt;
      ctx.strokeStyle = 'rgba(' + k.color + ',' + (MAX_ALPHA * 0.6) + ')';
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(k.x, py + 14); ctx.lineTo(k.x, k.y); ctx.stroke();
      if (k.y <= k.ty) { burst(k.x, k.ty, k.color); rockets.splice(r, 1); }
    }

    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.life += dt;
      if (p.life >= p.max) { particles.splice(i, 1); continue; }
      p.px = p.x; p.py = p.y;
      p.vx *= 0.97; p.vy = p.vy * 0.97 + 30 * dt; // drag + a little gravity
      p.x += p.vx * dt; p.y += p.vy * dt;
      var fade = 1 - p.life / p.max;
      ctx.strokeStyle = 'rgba(' + p.color + ',' + (MAX_ALPHA * fade) + ')';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(p.px, p.py); ctx.lineTo(p.x, p.y); ctx.stroke();
    }
    raf = requestAnimationFrame(frame);
  }

  function start() { if (running) return; running = true; last = 0; nextBurst = performance.now() + 500; raf = requestAnimationFrame(frame); }
  function stop() { running = false; cancelAnimationFrame(raf); }

  resize();
  window.addEventListener('resize', resize);
  var visible = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      visible && !document.hidden ? start() : stop();
    }).observe(canvas);
  } else { start(); }
  document.addEventListener('visibilitychange', function () { document.hidden || !visible ? stop() : start(); });
})();
