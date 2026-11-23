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

// Videos open full-screen over a dimmed page (thumbnails and the homepage Play button).
// Esc, the close button or clicking outside closes it and stops the video.
// Without JavaScript the links simply go to YouTube.
(function () {
  var box = document.createElement('dialog');
  if (typeof box.showModal !== 'function') return; // very old browsers: links open YouTube
  box.className = 'lightbox';
  box.setAttribute('aria-label', 'Video');
  box.innerHTML =
    '<div class="lightbox-frame"></div>' +
    '<p class="lightbox-title"></p>' +
    '<button class="lightbox-close" type="button" aria-label="Close video">&times;</button>';
  document.body.appendChild(box);
  var frame = box.querySelector('.lightbox-frame');
  var title = box.querySelector('.lightbox-title');
  var opener = null;

  function close() { if (box.open) box.close(); }
  box.addEventListener('close', function () {
    frame.innerHTML = '';                 // stops the video
    document.documentElement.classList.remove('lightbox-open');
    if (opener) opener.focus();
  });
  box.querySelector('.lightbox-close').addEventListener('click', close);
  box.addEventListener('click', function (e) { if (e.target === box) close(); });

  document.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('a.yt, a.yt-open');
    if (!link || e.metaKey || e.ctrlKey || e.shiftKey || !link.dataset.id) return;
    e.preventDefault();
    opener = link;
    var iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(link.dataset.id) + '?autoplay=1&rel=0';
    iframe.title = link.dataset.title || 'YouTube video';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin'; // YouTube needs to know which site the player is on
    frame.innerHTML = '';
    frame.appendChild(iframe);
    title.textContent = link.dataset.title || '';
    document.documentElement.classList.add('lightbox-open');
    box.showModal();
    box.querySelector('.lightbox-close').focus();
  });
})();

// Top bar takes on the color of the section underneath it as you scroll.
// Sections set their color as --c ("R, G, B") or --m (a hex color).
(function () {
  var header = document.querySelector('.site-header');
  var sections = document.querySelectorAll('.poster, .album');
  if (!header || !sections.length || !window.CSS || !CSS.supports('color', 'color-mix(in srgb, red 50%, blue)')) return;
  var current = null, ticking = false;
  function colorOf(sec) {
    var st = getComputedStyle(sec);
    var c = st.getPropertyValue('--c').trim();
    if (c) return 'rgb(' + c + ')';
    var m = st.getPropertyValue('--m').trim();
    return m || '';
  }
  function update() {
    ticking = false;
    var y = header.getBoundingClientRect().bottom + 2, found = null;
    for (var i = 0; i < sections.length; i++) {
      var r = sections[i].getBoundingClientRect();
      if (r.top <= y && r.bottom > y) { found = sections[i]; break; }
    }
    if (found === current) return;
    current = found;
    var col = found ? colorOf(found) : '';
    if (col) header.style.setProperty('--tint', col); else header.style.removeProperty('--tint');
    header.classList.toggle('tinted', !!col);
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

// Gentle scroll-in for posters (CSS keeps everything visible if this doesn't run).
(function () {
  var els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) { els.forEach(function (el) { el.classList.add('in'); }); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  els.forEach(function (el) { io.observe(el); });
})();

// Side-scrolling video rows: arrows show only when there's more to see that way.
(function () {
  document.querySelectorAll('.vrow').forEach(function (row) {
    var track = row.querySelector('.vrow-track');
    var prev = row.querySelector('.vrow-btn.prev');
    var next = row.querySelector('.vrow-btn.next');
    if (!track || !prev || !next) return;
    function update() {
      var max = track.scrollWidth - track.clientWidth;
      prev.hidden = track.scrollLeft <= 4;
      next.hidden = track.scrollLeft >= max - 4;
    }
    function go(dir) {
      var card = track.querySelector('.video');
      var step = card ? card.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 0) : track.clientWidth;
      var per = Math.max(1, Math.floor((track.clientWidth + 1) / step));
      track.scrollBy({ left: dir * per * step, behavior: 'smooth' });
    }
    prev.addEventListener('click', function () { go(-1); });
    next.addEventListener('click', function () { go(1); });
    track.addEventListener('scroll', function () { requestAnimationFrame(update); }, { passive: true });
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    });
    window.addEventListener('resize', update);
    update();
  });
})();
