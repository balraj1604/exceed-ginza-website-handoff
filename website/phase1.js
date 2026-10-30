(() => {
  const tabs = [...document.querySelectorAll('[data-developer]')];
  function select(tab, focus = false) {
    tabs.forEach(t => {
      const active = t === tab;
      t.setAttribute('aria-selected', String(active)); t.tabIndex = active ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (!active) panel.querySelectorAll('video').forEach(v => v.pause());
      panel.hidden = !active;
    });
    if (focus) tab.focus();
  }
  tabs.forEach((tab,i) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', e => {
      if (!['ArrowLeft','ArrowRight','Home','End'].includes(e.key)) return;
      e.preventDefault();
      const n = e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length-1 : (i+(e.key === 'ArrowRight' ? 1 : -1)+tabs.length)%tabs.length;
      select(tabs[n],true);
    });
  });
  const categories = [...document.querySelectorAll('.category-choices details')];
  categories.forEach(d => d.addEventListener('toggle', () => {if(d.open) categories.filter(x=>x!==d).forEach(x=>x.open=false)}));
})();
// Topic navigation keeps both country comparisons together as one readable story.
(() => {
  const tabs = [...document.querySelectorAll('[data-learning]')];
  function show(next, focus = false) {
    tabs.forEach(tab => {
      const active = tab === next;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      document.getElementById(tab.getAttribute('aria-controls')).hidden = !active;
    });
    if (focus) next.focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => show(tab));
    tab.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      show(tabs[next], true);
    });
  });
})();
// Count each achievement once when it enters view. Final values remain accessible
// and are the default when JavaScript or motion is disabled.
(() => {
  const numbers = [...document.querySelectorAll('[data-count]')];
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motion.matches || !('IntersectionObserver' in window)) return;
  const pending = new Map();
  const finish = () => pending.forEach((frame, element) => {
    cancelAnimationFrame(frame);
    element.textContent = element.dataset.count;
    element.classList.remove('count-running');
    pending.delete(element);
  });
  motion.addEventListener('change', event => { if (event.matches) finish(); });
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      observer.unobserve(element);
      if (motion.matches) return;
      const target = Number(element.dataset.count);
      const started = performance.now();
      element.classList.add('count-running');
      function tick(time) {
        const progress = Math.min(1, (time - started) / 1250);
        element.textContent = String(Math.round(target * (1 - Math.pow(1 - progress, 3))));
        if (progress < 1) pending.set(element, requestAnimationFrame(tick));
        else { pending.delete(element); element.classList.remove('count-running'); }
      }
      pending.set(element, requestAnimationFrame(tick));
    });
  }, { threshold: 0.65 });
  numbers.forEach(element => observer.observe(element));
})();
