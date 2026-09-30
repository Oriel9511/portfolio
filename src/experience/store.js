// Mutable frame-rate state shared by canvas systems; never triggers React renders.
export const experience = {
  progress: 0,
  targetX: 0.5,
  targetY: 0.5,
  pointerX: 0.5,
  pointerY: 0.5,
  energy: 0,
  pointerActive: 0,
  hoverProject: -1,
  covered: false,
  // Gravitational lens driven by the custom cursor: css-px centre, Einstein radius (px) and strength 0..1.
  lens: { x: -1000, y: -1000, r: 22, s: 0 },
  zones: new Set(),
  focus: null,
};
