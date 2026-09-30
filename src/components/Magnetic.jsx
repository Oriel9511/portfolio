import React, { useRef } from 'react';
import { motion as Motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

const SPRING = { stiffness: 220, damping: 18, mass: 0.4 };

// Pulls its child toward the pointer with spring physics; inert for reduced motion.
const Magnetic = ({ children, strength = 0.22, className = '' }) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING);
  const springY = useSpring(y, SPRING);

  const onMove = (event) => {
    if (reduce || event.pointerType === 'touch') return;
    const rect = ref.current.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <Motion.div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} style={{ x: springX, y: springY }} className={`inline-block ${className}`}>
      {children}
    </Motion.div>
  );
};

export default Magnetic;
