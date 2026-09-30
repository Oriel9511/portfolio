import React from 'react';
import { motion as Motion } from 'framer-motion';

const REVEAL = { hover: { pathLength: 1 }, initial: { pathLength: 0 } };
const REVEAL_TRANSITION = { duration: 0.4, ease: 'easeInOut' };

// Anchor whose corner brackets draw themselves on hover — the site's signature hover.
const CornerLink = ({ href, children, className = '' }) => (
  <Motion.a
    whileHover="hover"
    initial="initial"
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`relative px-6 py-4 transition-colors hover:text-white ${className}`}
    data-cursor="hover"
  >
    {children}
    <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ overflow: 'visible' }} aria-hidden="true">
      <Motion.polyline points="1,1 99,1 99,99" fill="none" stroke="currentColor" strokeWidth="1" variants={REVEAL} transition={REVEAL_TRANSITION} />
      <Motion.polyline points="1,1 1,99 99,99" fill="none" stroke="currentColor" strokeWidth="1" variants={REVEAL} transition={REVEAL_TRANSITION} />
    </svg>
  </Motion.a>
);

export default CornerLink;
