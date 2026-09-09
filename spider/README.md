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
