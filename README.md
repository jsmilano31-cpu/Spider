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

## Story section: Gwen fall entrance

`assets/story/gwendied.png` is anchored close to the top edge so the web strand visually meets the upper border. When the `.story` section enters the viewport, JavaScript adds `story-gwen--falling`, triggering a downward fall with a small overshoot and recoil to simulate the web catching her weight. Reduced-motion users receive the final static position immediately.


## Gwen story scroll interaction

The Gwen image in the story section is scroll-scrubbed rather than triggered once. `js/main.js` calculates progress from the story section's viewport position on every animation frame requested by scrolling. The image begins above the frame and transparent, falls as the page is scrolled downward, settles with a small web-catch recoil, and follows the exact movement backward when the user scrolls upward. Reduced-motion users receive a static final placement.

## Story rescue composition update

The `.story-photo` layer now contains both `gwendied.png` and `spiderdark.png`. Gwen has been shifted left to open the right side of the frame, while Spider-Man is anchored to the lower-right edge and reaches inward toward her. Gwen retains the reversible scroll-scrubbed fall/catch animation. Spider-Man receives only a restrained counter-motion tied to the same scroll progress so the scene reads as one rescue beat without overpowering Gwen's fall.


## Peter portrait update
- Added `assets/characters/peterparker.png` to the Peter card.
- Uses the same centered, bottom-anchored transparent-image treatment as MJ.
- Removed Peter's generic silhouette placeholder while keeping card hover behavior.


## Character portrait balance update

- Added `assets/characters/kraven.png` to THE HUNTER card.
- Increased MJ portrait presence.
- Reduced Peter portrait size to compensate for the source being a close-up crop.
- Added separate responsive sizing for all three portraits.


## Trailer integration
The Trailer section now embeds the supplied YouTube video (`JfVOs4VSpmA`) using the privacy-enhanced YouTube embed domain. An internet connection is required for playback.


## UI cleanup

- Removed the fixed red page scroll progress bar from the top edge.
- Removed the page-progress JavaScript from the document.
- Disabled the moving fixed film-grain transform that could expose/flicker at the left and right viewport edges. The grain remains as a static oversized texture so the cinematic look is preserved without corner blinking.
