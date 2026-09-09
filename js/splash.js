(() => {
  const splash = document.querySelector('#splash-screen');
  const svg = document.querySelector('#splash-web-svg');
  const spokesGroup = document.querySelector('#web-spokes');
  const ringsGroup = document.querySelector('#web-rings');

  if (!splash || !svg || !spokesGroup || !ringsGroup) return;

  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NS = 'http://www.w3.org/2000/svg';

  root.classList.add('is-loading');

  /*
   * Classic web geometry based on the supplied reference:
   * - straight radial spokes from one center
   * - scalloped curved catches between neighboring spokes
   * - progressively wider spacing toward the outer edge
   * The curves are created ring-by-ring, but delayed clockwise so the
   * web visually "spins" out from behind the spider without becoming
   * a literal spiral shape.
   */
  const cx = 500;
  const cy = 500;
  const spokeCount = 12;
  const outerRadius = 475;
  const radii = [48, 76, 110, 151, 199, 255, 319, 391, 470];

  const point = (angle, radius) => ({
    x: cx + Math.cos(angle) * radius,
    y: cy + Math.sin(angle) * radius
  });

  const makePath = (className, d, delay, fallbackLength) => {
    const path = document.createElementNS(NS, 'path');
    path.setAttribute('class', className);
    path.setAttribute('d', d);
    path.style.setProperty('--delay', `${delay.toFixed(3)}s`);
    path.style.setProperty('--path-length', `${fallbackLength}`);
    return path;
  };

  /* Main radial structure. */
  for (let i = 0; i < spokeCount; i++) {
    const angle = -Math.PI / 2 + (Math.PI * 2 * i) / spokeCount;
    const end = point(angle, outerRadius);
    const path = makePath(
      'web-spoke',
      `M ${cx} ${cy} L ${end.x.toFixed(2)} ${end.y.toFixed(2)}`,
      .12 + i * .018,
      490
    );
    spokesGroup.appendChild(path);
  }

  /* Scalloped rings. Each segment bows inward toward the center. */
  radii.forEach((radius, ringIndex) => {
    for (let i = 0; i < spokeCount; i++) {
      const a1 = -Math.PI / 2 + (Math.PI * 2 * i) / spokeCount;
      const a2 = -Math.PI / 2 + (Math.PI * 2 * (i + 1)) / spokeCount;
      const p1 = point(a1, radius);
      const p2 = point(a2, radius);
      const midAngle = (a1 + a2) / 2;

      /* Stronger inward bow on larger rings gives the reference's web shape. */
      const bow = Math.max(13, radius * .11);
      const controlRadius = radius - bow;
      const c = point(midAngle, controlRadius);

      const d = `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} Q ${c.x.toFixed(2)} ${c.y.toFixed(2)} ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;

      /* Ring grows outward; each ring itself is drawn clockwise. */
      const delay = .26 + ringIndex * .19 + i * .022;
      const arc = makePath('web-arc', d, delay, Math.max(100, radius * .55));
      ringsGroup.appendChild(arc);

      /* Sparse highlights on intersections like the supplied web example. */
      if (ringIndex > 1 && (i + ringIndex) % 3 === 0) {
        const node = document.createElementNS(NS, 'circle');
        node.setAttribute('class', 'web-node');
        node.setAttribute('cx', p1.x.toFixed(2));
        node.setAttribute('cy', p1.y.toFixed(2));
        node.setAttribute('r', ringIndex > 6 ? '2.1' : '1.55');
        node.style.setProperty('--delay', `${(delay + .34).toFixed(3)}s`);
        ringsGroup.appendChild(node);
      }
    }
  });

  /* Replace fallback dash lengths with actual browser-measured lengths. */
  requestAnimationFrame(() => {
    svg.querySelectorAll('path').forEach(path => {
      try {
        const length = Math.ceil(path.getTotalLength());
        path.style.setProperty('--path-length', String(length));
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
      } catch (_) {}
    });
  });

  const duration = reducedMotion ? 650 : 3380;

  const finish = () => {
    if (splash.classList.contains('is-complete')) return;

    /*
     * Start the landing-page entrance at the same moment the loader begins
     * fading. Keeping this as a separate state lets the hero animation overlap
     * the splash exit instead of waiting for a blank cut between screens.
     */
    splash.classList.add('is-complete');
    root.classList.add('hero-intro-ready');
    root.classList.remove('is-loading');

    window.dispatchEvent(new CustomEvent('spider:splash-complete'));
    window.setTimeout(() => splash.remove(), 760);
  };

  window.addEventListener('load', () => {
    window.setTimeout(finish, duration);
  }, { once: true });

  /* Fallback in case an external font/resource hangs. */
  window.setTimeout(finish, duration + 1800);
})();
