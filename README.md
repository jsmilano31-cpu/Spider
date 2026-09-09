# Spider-Man Movie Site — Cinematic UI Concept

A dependency-free HTML/CSS/JavaScript implementation based on the supplied UI/UX plan.

## Run
Open `index.html` directly, or serve the folder locally:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Included
- Full-screen cinematic hero
- Scroll-driven intro
- Sticky 8-stage suit breakdown
- Mechanical web-shooter section
- Story section
- Three large character panels
- 16:9 trailer placeholder and dialog
- Final release CTA
- Pointer parallax
- Scroll progress
- IntersectionObserver-based reveals
- Responsive layout
- `prefers-reduced-motion` support

## Assets
This package intentionally does **not** include copyrighted Spider-Man / Marvel promotional photography, logos, video, or audio.

Replace the procedural CSS placeholders with properly licensed assets in:

- `assets/suit/`
- `assets/characters/`
- `assets/backgrounds/`
- `assets/video/`
- `assets/audio/`

Suggested suit filenames from the plan:

- `full.webp`
- `mask.webp`
- `lens.webp`
- `chest.webp`
- `web-shooter.webp`
- `gloves.webp`
- `material.webp`
- `boots.webp`

The current implementation uses CSS art so the project works immediately even before real assets are added.

## Notes
The movie subtitle and release date are fictional placeholders and can be changed in `index.html`.


## Splash / Loading Screen

The project now opens with a full-viewport cinematic loading sequence before the landing page appears. The loader uses a large central spider silhouette with expanding radial web strands, irregular web rings, and spiral web paths that grow outward until the web fills the screen. The sequence is implemented in `css/splash.css` and `js/splash.js`, respects `prefers-reduced-motion`, and automatically releases the page after loading.


## Hero artwork update
The Pinterest iframe has been removed. The hero now uses `assets/hero/spidermanbg.png` directly, so it works locally without loading the Pinterest embed.


## Post-splash hero transition

The hero entrance is synchronized with the loader in `js/splash.js`. When the loader exits it adds `hero-intro-ready` to the root HTML element. `css/hero.css` then performs a layered cinematic handoff: background focus recovery, retracting dark wipe, Spider-Man depth entrance, staggered title/copy, header reveal, scroll-cue reveal, and a brief directional red light sweep. The Spider-Man image is animated instead of `.hero-figure` so the existing mouse-parallax transform remains independent.

## Interactive Web Shooter 3D

The WRIST MODULE section now contains a procedural WebGL 3D web-shooter built with Three.js primitives. It includes metallic housing, dual cartridge chambers, emitter rings/nozzle, trigger paddle, side rails, dynamic lighting, idle motion, and pointer/touch drag rotation. If WebGL or Three.js is unavailable, the section falls back to a static CSS device silhouette.

## Web Shooter 3D Reference Revision

The interactive Wrist Module model was rebuilt using `assets/reference/web-shooter.jpg` as its visual reference. The procedural model now prioritizes the visible characteristics of that image: an elongated tapered black gauntlet, cyan illuminated circuit lines, angular silver/gold side armor, a red/orange central core, and the narrow mechanical extension to a circular palm trigger.

Because the supplied reference is a single 2D view, hidden/back-side geometry is an interpretation rather than an exact reconstruction. The visible/front-facing silhouette, proportions, color hierarchy, and key mechanical elements are the primary matching targets.
