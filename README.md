# Oriel Arteaga — Portfolio

React 19 + Vite + framer-motion + Tailwind 4. A slide-based portfolio treated as one continuous audiovisual piece: a single WebGL signal field is seen through a different "instrument" on every slide.

```bash
npm run dev      # dev server
npm run build    # production build + prerender
npm run verify   # static HTML a11y/SEO checks on dist/
npm run lint
```

## Narrative

One signal, seven instruments — the automation-engineer-turned-software-engineer story told visually.

| Slide | Instrument (shader scene) |
| --- | --- |
| Hero | Ridgelines of a landscape gliding toward the camera, rippled by the pointer |
| Vision | Contour lines of the same noise field, seen from above |
| Trayectoria | Page-grid traces carrying data packets |
| Filosofía | Rings radiating outward (resilience) |
| Labs | Routed service graph with signals on the edges |
| Perfil | Registration crosses that swell around the pointer |
| Contacto | Rays converging on a single point (the pupil) |

A seam line follows the boundary between two slides while they transition, so the field and the DOM curtain stay aligned.

## Architecture

```
src/
  experience/          reusable systems, no React state
    store.js           mutable frame-rate state (progress, pointer, zones)
    frameLoop.js       one rAF loop + smoothed pointer shared by every effect
    quality.js         device tier + adaptive render scale
    slideScroller.js   eased window scroll
    useSlideController.js  wheel / keys / touch-settle slide navigation
    useZone.js         registers "quiet" zones (dim the field behind copy) and holes
    field/             WebGL2 renderer + the fragment shader (all scenes)
  components/
    FieldCanvas.jsx    fixed canvas, mix-blend-mode: difference (works on light and dark slides)
    StackedSection.jsx sticky curtain + scroll-driven depth (y / scale / shade)
    LabsStage.jsx, ProjectWorld.jsx  Labs stage and its procedural Canvas 2D worlds
  labs/                one procedural Canvas 2D world per project (8 scenes, see worlds.js)
  sections/            one file per slide
  data/portfolioData.js  content (synced with the CV)
```

### Design rules

- Identity is unchanged: `#0a0a0a` / `#f0f0f0`, serif display + mono microlabels, hairline borders, the eye cursor and the corner-bracket hover.
- Copy never fights the field: `useZone` dims the field behind the hero name, the profile text, the contact copy and holes it out behind the Labs stage.
- Slide navigation keeps the scroll-snapping contract: wheel/keys are intercepted on fine pointers, elements marked `data-internal-scroller="true"` scroll first, touch devices scroll natively and settle to the nearest slide.

### Performance and accessibility

- The field canvas is lazy-loaded after hydration, capped by device tier (`quality.js`) and lowers its render scale when frames run long. It pauses when the tab is hidden or the project detail covers it.
- `prefers-reduced-motion`: no splash, no slide easing, no depth transforms, no pointer kinetics; the field and the Labs worlds render a single still frame.
- Canvases are `aria-hidden`; every interactive control is a real button/link with visible focus.
- If WebGL2 is unavailable the canvas stays empty and the site remains fully usable.

### Verifying visually

The dev server can be driven with a headless Chrome (`--use-angle=swiftshader`) to capture each slide at 1440×900, 1366×768 and 390×844, plus static mid-transition frames by scrolling to fractional slide positions (e.g. `scrollY = 0.5 * innerHeight`).
