import React, { memo, useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

const AnimatedCounter = ({
  to,
  prefix = '',
  suffix = '',
  duration = 1800,
  className = '',
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let active = true;
    let frameId;
    const start = performance.now();
    const tick = (now) => {
      if (!active) return;
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setVal(Math.floor(eased * to));
      if (t < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };
    frameId = requestAnimationFrame(tick);
    return () => {
      active = false;
      cancelAnimationFrame(frameId);
    };
  }, [inView, to, duration]);

  return (
    <div ref={ref} className={`flex flex-col ${className}`}>
      <span className="font-serif text-5xl md:text-7xl tabular-nums leading-none">
        {prefix}{val}{suffix}
      </span>
    </div>
  );
};

export default memo(AnimatedCounter);
