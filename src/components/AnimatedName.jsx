import React, { memo, useEffect, useMemo, useRef } from 'react';
import { motion as Motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { subscribeFrame } from '../experience/frameLoop';
import { experience } from '../experience/store';

const letterVariants = {
  hidden: { opacity: 0, y: '0.55em', rotateX: -55, filter: 'blur(14px)' },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: 'blur(0px)',
    transition: { duration: 1.1, delay: 0.08 * i, ease: [0.16, 1, 0.3, 1] },
  }),
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function NameRow({ letters, direction, play, reduce, scrollY }) {
  const shift = useTransform(scrollY, (value) => {
    const t = clamp(value / (typeof window === 'undefined' ? 900 : window.innerHeight), 0, 1);
    return `${direction * t * 16}vw`;
  });

  return (
    <Motion.div className="block" style={reduce ? undefined : { x: shift }}>
      {letters.map(({ character, key, index }) => (
        <Motion.span
          key={key}
          custom={index}
          initial={reduce ? false : 'hidden'}
          animate={play || reduce ? 'visible' : 'hidden'}
          variants={letterVariants}
          className="inline-block will-change-transform"
        >
          <span data-name-letter="true" className="inline-block will-change-transform">
            {character}
          </span>
        </Motion.span>
      ))}
    </Motion.div>
  );
}

// Letters lean toward the pointer with spring-smoothed proximity; rows split apart as the hero scrolls away.
const AnimatedName = ({ text, play = true, className = '' }) => {
  const reduce = useReducedMotion();
  const rootRef = useRef(null);
  const { scrollY } = useScroll();

  const rows = useMemo(() => {
    const words = (text || '').toUpperCase().split(/\s+/).filter(Boolean);
    const starts = words.map((_, i) => words.slice(0, i).join('').length);
    return words.map((word, wordIndex) => ({
      key: `w-${wordIndex}`,
      letters: Array.from(word, (character, letterIndex) => ({
        character,
        key: `c-${starts[wordIndex] + letterIndex}`,
        index: starts[wordIndex] + letterIndex,
      })),
    }));
  }, [text]);

  useEffect(() => {
    if (reduce) return undefined;
    const letters = Array.from(rootRef.current.querySelectorAll('[data-name-letter]'));
    const state = letters.map(() => ({ x: 0, y: 0, r: 0, s: 1 }));
    let restFrames = 0;

    return subscribeFrame((dt) => {
      if (experience.progress > 1.05 || !experience.pointerActive) return;
      if (restFrames > 30 && experience.energy < 0.002) return;
      const px = experience.pointerX * window.innerWidth;
      const py = experience.pointerY * window.innerHeight;
      const active = experience.pointerActive;
      const ease = 1 - Math.exp(-dt * 9);

      let moving = false;
      const rects = letters.map((el) => el.getBoundingClientRect());
      letters.forEach((el, i) => {
        const rect = rects[i];
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = px - cx;
        const dy = py - cy;
        const reach = rect.height * 1.1;
        const pull = Math.exp(-((dx * dx + dy * dy) / (reach * reach))) * active;

        const s = state[i];
        s.x += (clamp(dx * 0.07, -12, 12) * pull - s.x) * ease;
        s.y += (clamp(dy * 0.05, -8, 8) * pull - rect.height * 0.03 * pull - s.y) * ease;
        s.r += (clamp(dx * 0.01, -2.2, 2.2) * pull - s.r) * ease;
        s.s += (1 + 0.025 * pull - s.s) * ease;
        moving = moving || Math.abs(s.x) + Math.abs(s.y) > 0.02;
        el.style.transform = `translate3d(${s.x.toFixed(2)}px, ${s.y.toFixed(2)}px, 0) rotate(${s.r.toFixed(2)}deg) scale(${s.s.toFixed(3)})`;
      });
      restFrames = moving || experience.energy >= 0.002 ? 0 : restFrames + 1;
    });
  }, [reduce, rows]);

  return (
    <h1 ref={rootRef} className={`w-full text-center ${className}`} aria-label={text}>
      <div className="inline-flex flex-col items-center leading-[0.8] [perspective:1200px]" aria-hidden="true">
        {rows.map((row, rowIndex) => (
          <NameRow
            key={row.key}
            letters={row.letters}
            direction={rowIndex % 2 === 0 ? -1 : 1}
            play={play}
            reduce={reduce}
            scrollY={scrollY}
          />
        ))}
      </div>
    </h1>
  );
};

export default memo(AnimatedName);
