import React, { memo, useMemo, useRef } from 'react';
import {
  motion as Motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'framer-motion';

const wordVariants = {
  hidden: {},
  visible: (i) => ({
    transition: { staggerChildren: 0.04, delayChildren: i * 0.08 },
  }),
};

const charVariants = {
  hidden: { y: '115%', rotateX: -60, opacity: 0 },
  visible: {
    y: '0%',
    rotateX: 0,
    opacity: 1,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

const SplitText = ({
  text,
  as: Tag = 'h1', // eslint-disable-line no-unused-vars
  className = '',
  mode = 'mount',
  scrubRange = [0, 1],
  scrubOffset = ['start 0.9', 'end 0.4'],
  highlightLastWord = false,
}) => {
  const shouldReduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll(
    mode === 'scroll' ? { target: ref, offset: scrubOffset } : {}
  );
  const progress = useTransform(scrollYProgress, scrubRange, [0, 1]);

  const rows = useMemo(() => {
    const words = (text || '').split(/\s+/).filter(Boolean);
    return words.map((word, wi) => ({
      word,
      key: `w-${wi}`,
      isLast: wi === words.length - 1,
    }));
  }, [text]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 200, damping: 25, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 200, damping: 25, mass: 0.4 });

  const handleMouse = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * 0.04);
    my.set((e.clientY - (r.top + r.height / 2)) * 0.04);
  };
  const handleLeave = () => { mx.set(0); my.set(0); };

  if (shouldReduce) {
    return <Tag className={className}>{text}</Tag>;
  }

  const charAnimate = mode === 'scroll' ? progress : 'visible';
  const initial = mode === 'scroll' ? { opacity: 1 } : 'hidden';

  return (
    <Tag
      ref={ref}
      className={`inline-block ${className}`}
      aria-label={text}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
    >
      <Motion.span
        style={{ x: sx, y: sy }}
        className="inline-flex flex-col items-center leading-[0.85] [perspective:1200px]"
      >
        {rows.map((row, rowIndex) => (
          <span key={row.key} className="block whitespace-nowrap">
            <Motion.span
              className="inline-flex"
              custom={rowIndex}
              variants={mode === 'scroll' ? undefined : wordVariants}
              initial={initial}
              whileInView={mode === 'mount' ? 'visible' : undefined}
              animate={mode === 'mount' ? undefined : charAnimate}
              viewport={{ once: true, margin: '-10% 0px' }}
            >
              {Array.from(row.word).map((ch, i) => {
                const charKey = `c-${rowIndex}-${i}`;
                return (
                  <span
                    key={charKey}
                    className="inline-block overflow-hidden [transform-style:preserve-3d] align-baseline"
                  >
                    <SplitChar
                      ch={ch}
                      rowIndex={rowIndex}
                      progress={progress}
                      mode={mode}
                      highlightLastWord={highlightLastWord}
                      isLast={row.isLast}
                    />
                  </span>
                );
              })}
            </Motion.span>
            {rowIndex < rows.length - 1 && (
              <span className="inline-block">&nbsp;</span>
            )}
          </span>
        ))}
      </Motion.span>
    </Tag>
  );
};

const SplitChar = memo(({ ch, rowIndex, progress, mode, highlightLastWord, isLast }) => {
  const transformY = useTransform(
    progress,
    [Math.max(0, rowIndex * 0.15), Math.min(1, rowIndex * 0.15 + 0.6)],
    ['115%', '0%']
  );

  return (
    <Motion.span
      className={`inline-block will-change-transform ${
        highlightLastWord && isLast ? 'italic text-zinc-500' : ''
      }`}
      variants={mode === 'scroll' ? undefined : charVariants}
      style={mode === 'scroll' ? { y: transformY } : undefined}
    >
      {ch}
    </Motion.span>
  );
});

SplitChar.displayName = 'SplitChar';

export default memo(SplitText);
