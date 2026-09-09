(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const hero = document.querySelector('.hero');
  const layers = [...document.querySelectorAll('.parallax-layer')];
  if (!hero || !layers.length) return;
  let x=0,y=0,raf=0;
  hero.addEventListener('pointermove', e => {
    const r = hero.getBoundingClientRect();
    x = (e.clientX-r.left)/r.width-.5; y=(e.clientY-r.top)/r.height-.5;
    hero.style.setProperty('--mx', `${(x+.5)*100}%`);
    hero.style.setProperty('--my', `${(y+.5)*100}%`);
    if(!raf) raf=requestAnimationFrame(() => {
      layers.forEach(layer => { const d=Number(layer.dataset.depth||.2); layer.style.transform=`translate3d(${x*d*22}px,${y*d*18}px,0) scale(1.015)`; });
      raf=0;
    });
  });
})();
