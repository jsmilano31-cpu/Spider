(() => {
  const scenes = [...document.querySelectorAll('.suit-scenes article')];
  const art = [...document.querySelectorAll('.suit-art')];
  const current = document.querySelector('#scene-current');
  if (!scenes.length) return;
  const setScene = index => {
    scenes.forEach((el,i) => el.classList.toggle('active', i === index));
    art.forEach((el,i) => el.classList.toggle('active', i === index));
    if(current) current.textContent = String(index + 1).padStart(2,'0');
  };
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio-a.intersectionRatio)[0];
    if (visible) setScene(Number(visible.target.dataset.scene));
  }, { rootMargin:'-28% 0px -28% 0px', threshold:[0,.2,.5,.8,1] });
  scenes.forEach(el => observer.observe(el));
})();
