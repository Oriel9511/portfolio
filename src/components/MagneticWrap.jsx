import React, { memo, useRef } from 'react';
import { motion as Motion, useMotionValue, useSpring } from 'framer-motion';

export const MagneticWrap = ({ children, strength = 0.18 }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 20 });
  const sy = useSpring(y, { stiffness: 250, damping: 20 });

  return (
    <Motion.span
      ref={ref}
      style={{ x: sx, y: sy, display: 'inline-block' }}
      className="magnetic"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
    >
      {children}
    </Motion.span>
  );
};

export default memo(MagneticWrap);
