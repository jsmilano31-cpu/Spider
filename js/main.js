(() => {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('visible'));
  }, { threshold: .18 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Scroll-scrubbed Gwen fall. The animation follows the scrollbar in both
  // directions instead of firing once when the section intersects the viewport.
  const storySection = document.querySelector('.story');
  const gwenImage = document.querySelector('.story-gwen');

  if (storySection && gwenImage) {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let ticking = false;

    const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
    const smoothstep = t => t * t * (3 - 2 * t);

    function updateGwenFromScroll() {
      ticking = false;

      if (reducedMotion.matches) {
        storySection.classList.add('story-gwen-active');
        gwenImage.style.removeProperty('--gwen-y');
        gwenImage.style.removeProperty('--gwen-opacity');
        gwenImage.style.removeProperty('--gwen-rotate');
        gwenImage.style.removeProperty('--gwen-scale');
        return;
      }

      const rect = storySection.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;

      // Start while the story is still just below the viewport so Gwen is
      // genuinely hidden above her frame. Finish after the section moves well
      // into view, giving the user enough scrolling distance to see the fall.
      const startLine = vh * 0.96;
      const endLine = vh * 0.18;
      const rawProgress = clamp((startLine - rect.top) / (startLine - endLine));
      const progress = smoothstep(rawProgress);

      // A small catch/recoil near the bottom adds weight without disconnecting
      // the motion from the scrollbar. Because this is a mathematical function
      // of progress, scrolling upward reproduces the exact reverse movement.
      let yVh;
      if (progress < 0.82) {
        const fall = progress / 0.82;
        yVh = -76 + (82 * fall);       // -76vh -> +6vh overshoot
      } else {
        const catchP = (progress - 0.82) / 0.18;
        yVh = 6 * (1 - catchP);        // +6vh -> 0vh caught position
      }

      const visibleProgress = clamp((rawProgress - 0.055) / 0.18);
      const baseOpacity = window.innerWidth <= 800 ? 0.66 : 0.92;
      const opacity = smoothstep(visibleProgress) * baseOpacity;

      // Gentle pendulum movement as the web takes the load.
      const swing = Math.sin(progress * Math.PI) * 2.1 - (1 - progress) * 1.6;
      const scale = 0.985 + progress * 0.015;

      gwenImage.style.setProperty('--gwen-y', `${yVh.toFixed(3)}vh`);
      gwenImage.style.setProperty('--gwen-opacity', opacity.toFixed(3));
      gwenImage.style.setProperty('--gwen-rotate', `${swing.toFixed(3)}deg`);
      gwenImage.style.setProperty('--gwen-scale', scale.toFixed(4));

      // Keep Spider-Man in the same story-photo layer while giving him a
      // restrained counter-motion toward Gwen as the rescue beat develops.
      const spiderImage = storySection.querySelector('.story-spiderdark');
      if (spiderImage) {
        const spiderEase = smoothstep(clamp((rawProgress - 0.08) / 0.72));
        spiderImage.style.setProperty('--spider-x', `${(3 - spiderEase * 3).toFixed(3)}vw`);
        spiderImage.style.setProperty('--spider-y', `${(1.5 - spiderEase * 1.5).toFixed(3)}vh`);
        spiderImage.style.setProperty('--spider-scale', (0.985 + spiderEase * 0.015).toFixed(4));
      }

      storySection.classList.toggle('story-gwen-active', rawProgress > 0.001);
    }

    function requestGwenUpdate() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateGwenFromScroll);
      }
    }

    window.addEventListener('scroll', requestGwenUpdate, { passive: true });
    window.addEventListener('resize', requestGwenUpdate, { passive: true });
    reducedMotion.addEventListener?.('change', requestGwenUpdate);
    updateGwenFromScroll();
  }

})();
