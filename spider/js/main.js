(() => {
  const dialog = document.querySelector('#trailer-dialog');
  const openBtn = document.querySelector('#play-trailer');
  const closeBtn = document.querySelector('#close-trailer');
  if (dialog && openBtn && closeBtn) {
    openBtn.addEventListener('click', () => dialog.showModal());
    closeBtn.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('visible'));
  }, { threshold: .18 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();
