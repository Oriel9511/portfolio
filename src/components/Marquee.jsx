import React, { memo, useRef } from 'react';
import { motion as Motion, useAnimationFrame, useMotionValue } from 'framer-motion';

const Marquee = ({
  items,
  speed = 40,              // px/seg
  dark = true,
  separator = '✦',
  className = '',
  pauseOnHover = true,
}) => {
  const x = useMotionValue(0);
  const containerRef = useRef(null);
  const isPaused = useRef(false);

  useAnimationFrame((_, delta) => {
    if (isPaused.current) return;
    const w = containerRef.current?.scrollWidth / 2 || 0;
    if (!w) return;
    let next = x.get() - (speed * delta) / 1000;
    if (next <= -w) next += w;
    x.set(next);
  });

  const textColor = dark ? 'text-white' : 'text-black';
  const strokeColor = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

  return (
    <div
      className={`relative overflow-hidden border-y ${className} ${
        dark ? 'border-white/10' : 'border-black/10'
      }`}
      onMouseEnter={() => pauseOnHover && (isPaused.current = true)}
      onMouseLeave={() => pauseOnHover && (isPaused.current = false)}
    >
      <Motion.div
        ref={containerRef}
        className="flex items-center gap-12 whitespace-nowrap py-6 will-change-transform"
        style={{ x, color: 'inherit' }}
      >
        {[...items, ...items].map((item, i) => (
          <React.Fragment key={i}>
            <span
              className={`font-serif text-3xl md:text-5xl italic tracking-tight ${textColor}`}
              style={{ WebkitTextStroke: `0.5px ${strokeColor}` }}
            >
              {item}
            </span>
            <span className={`text-2xl ${textColor} opacity-30`}>{separator}</span>
          </React.Fragment>
        ))}
      </Motion.div>
    </div>
  );
};

export default memo(Marquee);
