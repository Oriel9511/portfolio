import React, { useRef } from 'react';
import { motion as Motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import AnimatedName from '../components/AnimatedName';
import StackedSection from '../components/StackedSection';
import { DATA } from '../data/portfolioData';
import { useZone } from '../experience/useZone';

const CINE = [0.16, 1, 0.3, 1];

const MetaItem = ({ label, value, align }) => (
  <div className={`flex flex-col ${align}`}>
    <span className="mb-1 font-mono text-xs uppercase tracking-widest text-zinc-500">{label}</span>
    <span className="font-serif text-lg tracking-wide text-white md:text-xl">{value}</span>
  </div>
);

const Divider = () => <span aria-hidden="true" className="hidden h-10 w-px self-center bg-white/25 md:block" />;

const HeroSection = ({ index, play }) => {
  const nameRef = useRef(null);
  const captionRef = useRef(null);
  useZone(nameRef, { slide: index, k: 0.5, feather: 60 });
  useZone(captionRef, { slide: index, k: 0.3, feather: 36 });

  return (
    <StackedSection id="hero" index={index} zIndex={0} theme="dark" className="px-6 pt-24 pb-10">
      <div className="container relative z-10 mx-auto flex h-full flex-col justify-between">
        <Motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={play ? { opacity: 1, y: 0 } : { opacity: 0, y: -16 }}
          transition={{ duration: 1.2, delay: 0.3, ease: CINE }}
          className="flex w-full items-start justify-between border-t border-white/10 pt-6"
        >
          <div className="flex flex-1 justify-start">
            <MetaItem label="Ubicación" value={DATA.profile.location} align="items-start text-left" />
          </div>
          <Divider />
          <div className="hidden flex-[1.5] justify-center md:flex">
            <MetaItem label="Enfoque" value="IA agéntica · Sistemas distribuidos" align="items-center text-center" />
          </div>
          <Divider />
          <div className="flex flex-1 justify-end">
            <MetaItem label="Rol" value={DATA.profile.role} align="items-end text-right" />
          </div>
        </Motion.div>

        <div ref={nameRef} className="my-8 flex flex-grow items-center justify-center md:my-0">
          <AnimatedName
            text={DATA.profile.name}
            play={play}
            className="font-serif text-[18vw] font-medium tracking-tighter text-white [text-shadow:0_0_42px_rgba(255,255,255,0.28)] md:text-[12.6vw]"
          />
        </div>

        <div className="flex flex-col items-center text-center">
          <Motion.div
            ref={captionRef}
            initial={{ opacity: 0, y: 12 }}
            animate={play ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ delay: 1.3, duration: 1.2, ease: CINE }}
          >
            <p className="mx-auto max-w-xl text-sm font-light leading-relaxed text-white md:text-lg">
              De la programación de hardware al desarrollo Full Stack.
              <span className="block text-zinc-400">Una visión sistémica para arquitecturas web complejas.</span>
            </p>
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: play ? 1 : 0 }}
            transition={{ delay: 1.7, duration: 1.2 }}
            className="mt-6 flex flex-col items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-500"
          >
            <span className="h-px w-8 bg-zinc-600" />
            <span>Scroll</span>
            <span className="h-6 w-px bg-zinc-600" />
            <ArrowDown size={12} className="-mt-2 animate-bounce" />
          </Motion.div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.45)_100%)]" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}textures/noise.png)` }}
      />
    </StackedSection>
  );
};

export default HeroSection;
