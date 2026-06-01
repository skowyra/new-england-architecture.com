(function () {
  function openLightbox(src, alt) {
    const overlay = document.createElement('div');
    overlay.className = 'mjs-lightbox';

    const img = document.createElement('img');
    img.className = 'mjs-lightbox__img';
    img.src = src;
    img.alt = alt;

    const close = document.createElement('button');
    close.className = 'mjs-lightbox__close';
    close.setAttribute('aria-label', 'Close');
    close.textContent = '×';

    overlay.appendChild(img);
    overlay.appendChild(close);
    document.body.appendChild(overlay);

    function dismiss(e) {
      if (e.type === 'keydown' && e.key !== 'Escape') return;
      if (e.target === img) return;
      overlay.remove();
      document.removeEventListener('keydown', dismiss);
    }

    overlay.addEventListener('click', dismiss);
    close.addEventListener('click', dismiss);
    document.addEventListener('keydown', dismiss);
  }

  document.addEventListener('click', function (e) {
    const img = e.target.closest('.mjs-image-caption__img');
    if (!img) return;
    openLightbox(img.src, img.alt);
  });
})();
