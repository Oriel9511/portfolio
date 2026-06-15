import React, { memo, useRef, useState } from 'react';
import { motion as Motion, useMotionValue, useSpring } from 'framer-motion';

const MagneticButton = ({
  children,
  className = '',
  strength = 0.25,        // 0 = no movement, 1 = full follow
  scale = 1.05,           // scale on hover
  as: Tag = 'button', // eslint-disable-line no-unused-vars
  ...rest
}) => {
  const containerRef = useRef(null);
  const [hover, setHover] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const handleMove = (e) => {
    if (!containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => { x.set(0); y.set(0); setHover(false); };
  const enter = () => setHover(true);

  return (
    <Motion.div
      ref={containerRef}
      onMouseMove={handleMove}
      onMouseEnter={enter}
      onMouseLeave={reset}
      className="inline-block magnetic"
      style={{ x: sx, y: sy }}
    >
      <Motion.div
        animate={{ scale: hover ? scale : 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 20 }}
        className="inline-block"
      >
        <Tag className={className} {...rest}>
          {children}
        </Tag>
      </Motion.div>
    </Motion.div>
  );
};

export default memo(MagneticButton);
