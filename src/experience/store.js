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
  zones: new Set(),
  focus: null,
};
