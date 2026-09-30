import React, { useRef } from 'react';
import { Code2, Cpu, Layers } from 'lucide-react';
import StackedSection from '../components/StackedSection';
import { DATA } from '../data/portfolioData';
import { useZone } from '../experience/useZone';

const GROUPS = [
  { key: 'languages', title: 'Lenguajes', icon: Code2 },
  { key: 'platforms', title: 'Plataformas', icon: Layers },
  { key: 'systems', title: 'IA & Sistemas', icon: Cpu },
];

const AboutSection = ({ index }) => {
  const copyRef = useRef(null);
  useZone(copyRef, { slide: index, k: 0.4, feather: 40 });

  return (
    <StackedSection id="about" index={index} zIndex={50} theme="light" rule className="justify-center pt-[7.5rem] pb-8">
      <div ref={copyRef} className="container internal-scroller mx-auto max-h-full min-h-0 overflow-y-auto px-6" data-internal-scroller="true">
        <div>
          <div className="mb-6 md:mb-[4vh]">
            <h2 className="max-w-5xl font-serif text-[clamp(1.9rem,min(4.6vw,7vh),4.4rem)] leading-[1.02] text-black">
              Ingeniería, software y criterio de producto.
              <span className="mt-3 block font-sans text-[clamp(1rem,min(2vw,3.2vh),1.7rem)] font-light leading-snug text-zinc-500">
                Soluciones técnicas mantenibles enfocadas en la experiencia de uso.
              </span>
            </h2>
          </div>

          <div className="mb-6 grid items-start gap-6 md:mb-[4vh] md:grid-cols-12 md:gap-12">
            <div className="space-y-3 text-base font-light leading-relaxed text-zinc-700 md:col-span-8 md:text-[1.05rem]">
              <p>
                Mi formación en Ingeniería Automática en la CUJAE me dio una forma de pensar basada en sistemas, procesos, control y optimización. Hoy aplico esa base al desarrollo de software: aplicaciones empresariales, sistemas distribuidos de alta concurrencia e integraciones complejas.
              </p>
              <p>
                Con más de 4 años en desarrollo y 4 previos en automatización industrial, me enfoco en sistemas agénticos de IA y aplicaciones basadas en LLM para clasificar información y enrutar microservicios de forma inteligente.
              </p>
            </div>

            <div className="border-black/20 md:col-span-4 md:border-l md:pl-12">
              <h3 className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Formación</h3>
              <p className="mb-1 font-serif text-2xl text-black">{DATA.education.degree}</p>
              <p className="text-sm text-zinc-600">{DATA.education.school} — {DATA.education.year}</p>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">Idiomas · {DATA.languages.join(' / ')}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-black/10 pt-5 md:pt-[3vh]">
          <h3 className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Arsenal Tecnológico</h3>
          <div className="grid gap-6 md:grid-cols-3 md:gap-8">
            {GROUPS.map((group) => {
              const Icon = group.icon;
              return (
                <div key={group.key}>
                  <div className="mb-3 flex items-center gap-2 text-black">
                    <Icon size={20} aria-hidden="true" />
                    <span className="font-serif text-xl">{group.title}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {DATA.skills[group.key].map((skill) => (
                      <span key={skill} className="rounded-sm border border-black/10 bg-black/5 px-3 py-1.5 text-xs text-zinc-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </StackedSection>
  );
};

export default AboutSection;
