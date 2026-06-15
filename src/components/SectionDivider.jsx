import React, { memo } from 'react';
import { motion as Motion } from 'framer-motion';

const SectionDivider = ({ from, to, height = 'h-32 md:h-48' }) => (
  <div className={`relative w-full ${height} overflow-hidden pointer-events-none`}>
    <Motion.div
      className="absolute inset-0"
      style={{ background: `linear-gradient(180deg, ${from} 0%, ${to} 100%)` }}
      initial={{ clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 100%)' }}
      whileInView={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
      viewport={{ once: true, margin: '-15% 0px' }}
      transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
    />
  </div>
);

export default memo(SectionDivider);
