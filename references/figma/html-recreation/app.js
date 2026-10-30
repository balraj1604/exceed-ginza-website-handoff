document.querySelectorAll('.carousel').forEach(carousel => {
  const slides = Array.from(carousel.querySelectorAll(':scope > .slide'));
  const dots = Array.from(carousel.querySelectorAll(':scope > .carousel-controls .dot'));
  if (!slides.length) return;
  let selected = 0;
  const show = index => {
    selected = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => { slide.hidden = i !== selected; });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === selected);
      dot.setAttribute('aria-current', String(i === selected));
    });
  };
  dots.forEach((dot, i) => dot.addEventListener('click', () => show(i)));
  carousel.querySelectorAll(':scope > .carousel-controls [data-step]').forEach(button => {
    button.addEventListener('click', () => show(selected + Number(button.dataset.step)));
  });
  carousel.addEventListener('keydown', event => {
    if (event.target.closest('a, summary')) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      show(selected + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  let touchX = null;
  carousel.addEventListener('touchstart', event => {
    touchX = event.touches.length === 1 ? event.touches[0].clientX : null;
  }, {passive: true});
  carousel.addEventListener('touchend', event => {
    if (touchX === null) return;
    const delta = event.changedTouches[0].clientX - touchX;
    if (Math.abs(delta) > 60) show(selected + (delta < 0 ? 1 : -1));
    touchX = null;
  }, {passive: true});
});
