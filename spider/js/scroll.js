(() => {
  const bar = document.querySelector('#page-progress');
  let ticking = false;
  function update(){
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? scrollY / max : 0;
    if (bar) bar.style.width = `${Math.min(1, Math.max(0,p))*100}%`;
    ticking = false;
  }
  addEventListener('scroll', () => { if(!ticking){ requestAnimationFrame(update); ticking = true; } }, {passive:true});
  update();
})();
