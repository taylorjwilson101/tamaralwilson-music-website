// Mobile menu
(function () {
  var btn = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (btn && nav) btn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  // "More" dropdown also opens on click/tap
  var more = document.querySelector('.more-btn');
  if (more) more.addEventListener('click', function (e) {
    e.stopPropagation();
    var li = more.parentNode; li.classList.toggle('open');
    more.setAttribute('aria-expanded', li.classList.contains('open') ? 'true' : 'false');
  });
  document.addEventListener('click', function () {
    var open = document.querySelector('.has-sub.open'); if (open) open.classList.remove('open');
  });
})();

// Photo carousel arrows
document.querySelectorAll('.carousel').forEach(function (c) {
  var track = c.querySelector('.carousel-track');
  c.querySelectorAll('.carousel-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      track.scrollBy({ left: (b.classList.contains('next') ? 1 : -1) * track.clientWidth * 0.8, behavior: 'smooth' });
    });
  });
});

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
