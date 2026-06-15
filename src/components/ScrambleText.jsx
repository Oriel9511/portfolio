import React, { useState, useEffect, memo } from 'react';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_*$-+@#%&';

const ScrambleText = ({ text, className = '', duration = 1.0, delay = 0.4 }) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let active = true;
    let frameId;

    const startTimeout = setTimeout(() => {
      const chars = text.split('');
      const length = chars.length;
      const totalFrames = duration * 60; // assume 60fps
      let frame = 0;

      const resolveFrames = chars.map((_, i) => {
        const progressStart = i / length; // left-to-right bias
        const randOffset = Math.random() * 0.3; // randomness
        return Math.floor(Math.min(0.9, progressStart + randOffset) * totalFrames);
      });

      const tick = () => {
        if (!active) return;
        frame++;

        const result = chars.map((char, index) => {
          if (char === ' ' || char === '\n') return char;
          
          if (frame >= totalFrames || frame >= resolveFrames[index]) {
            return char;
          }
          
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }).join('');

        setDisplayText(result);

        if (frame < totalFrames) {
          frameId = requestAnimationFrame(tick);
        }
      };

      frameId = requestAnimationFrame(tick);
    }, delay * 1000);

    return () => {
      active = false;
      clearTimeout(startTimeout);
      cancelAnimationFrame(frameId);
    };
  }, [text, duration, delay]);

  return <span className={className}>{displayText || text}</span>;
};

export default memo(ScrambleText);
