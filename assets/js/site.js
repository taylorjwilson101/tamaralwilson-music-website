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
