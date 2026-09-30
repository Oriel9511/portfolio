import React, { useRef } from 'react';
import AnimatedQuote from '../components/AnimatedQuote';
import CornerLink from '../components/CornerLink';
import Magnetic from '../components/Magnetic';
import StackedSection from '../components/StackedSection';
import { DATA } from '../data/portfolioData';
import { useFocus } from '../experience/useFocus';
import { useZone } from '../experience/useZone';

const CURRENT_YEAR = new Date().getFullYear();
const TEXT_SHADOW = '[text-shadow:0_2px_16px_rgba(0,0,0,0.65)]';

const ContactSection = ({ index }) => {
  const quoteRef = useRef(null);
  const emailRef = useRef(null);
  const focusRef = useRef(null);
  useZone(quoteRef, { slide: index, k: 0.42, feather: 40 });
  useZone(emailRef, { slide: index, k: 0.4, feather: 40 });
  useFocus(focusRef, index);

  return (
    <StackedSection id="contact" index={index} zIndex={60} theme="dark" className="justify-center pt-[7.5rem] pb-2">
      <span aria-hidden="true" className="pointer-events-none absolute inset-x-6 top-[100px] h-px bg-white/15" />

      <div className="container mx-auto px-6 text-center">
        <div ref={quoteRef}>
          <AnimatedQuote
            text="Para materializar tu visión, transformaremos los conceptos complejos en objetivos concretos, moldeando los límites técnicos para que des tu próximo gran salto."
            theme="dark"
            size="md"
            textClass={TEXT_SHADOW}
          />
        </div>

        <div className="mt-4 md:mt-[3vh]">
          <span ref={focusRef} aria-hidden="true" className="mx-auto block h-px w-px" />
          <span aria-hidden="true" className="mx-auto mt-[2.4vh] block h-[4vh] w-px bg-white/70" />
          <p className="mt-4 mb-6 font-mono text-xs font-bold uppercase tracking-[0.3em] text-zinc-200">Inicia la conversación</p>
          <Magnetic strength={0.12}>
            <a ref={emailRef} href={`mailto:${DATA.profile.email}`} className="group relative inline-block cursor-pointer" data-cursor="hover">
              <h2 className={`relative z-10 font-serif text-[5.6vw] leading-[0.9] text-white transition-colors duration-500 group-hover:text-zinc-300 md:text-[min(6vw,9.5vh)] ${TEXT_SHADOW}`}>
                {DATA.profile.email}
              </h2>
              <div className="absolute bottom-2 left-0 h-px w-full origin-left scale-x-0 bg-white transition-transform duration-500 group-hover:scale-x-100" />
            </a>
          </Magnetic>
        </div>

        <footer className="mt-8 flex flex-col items-center justify-between gap-1 border-t border-white/10 pt-3 pb-6 font-mono text-xs uppercase tracking-widest text-zinc-500 md:mt-[4vh] md:flex-row">
          <div className="flex items-center">
            <span aria-hidden="true" className="hidden h-px w-9 bg-zinc-500 md:block" />
            <CornerLink href={DATA.profile.linkedin} className="text-zinc-200">LinkedIn</CornerLink>
            <CornerLink href={DATA.profile.github} className="text-zinc-200">GitHub</CornerLink>
          </div>
          <p className="px-6">© {CURRENT_YEAR} Oriel Arteaga.</p>
        </footer>
      </div>
    </StackedSection>
  );
};

export default ContactSection;
