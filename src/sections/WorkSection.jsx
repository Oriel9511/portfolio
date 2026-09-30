import React, { useRef } from 'react';
import { motion as Motion } from 'framer-motion';
import ExperienceRow from '../components/ExperienceRow';
import StackedSection from '../components/StackedSection';
import { DATA } from '../data/portfolioData';
import { useZone } from '../experience/useZone';

const WorkSection = ({ index }) => {
  const rowsRef = useRef(null);
  useZone(rowsRef, { slide: index, k: 0.28, feather: 70 });

  return (
  <StackedSection id="work" index={index} zIndex={20} theme="dark" rule className="justify-start pt-24 pb-6 md:pt-28">
    <div className="container mx-auto mb-8 px-6 md:mb-10">
      <Motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
      >
        <h2 className="mb-5 font-serif text-5xl md:text-6xl">Trayectoria.</h2>
        <div className="h-1 w-24 bg-white/30" />
      </Motion.div>
    </div>

    <div ref={rowsRef} className="internal-scroller min-h-0 w-full flex-1 overflow-y-auto" data-internal-scroller="true">
      {DATA.experience.map((job, jobIndex) => (
        <ExperienceRow key={job.company} job={job} index={jobIndex} />
      ))}
      <div className="border-t border-white/20" />
    </div>
  </StackedSection>
  );
};

export default WorkSection;
