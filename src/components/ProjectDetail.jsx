import React, { memo, useEffect, useMemo, useRef } from 'react';
import FocusTrap from 'focus-trap-react';
import { motion as Motion } from 'framer-motion';
import { ArrowLeft, Github, ExternalLink, X } from 'lucide-react';
import { useI18n } from '../i18n/context';
import ProjectWorld from './ProjectWorld';

const IRIS_EASE = [0.16, 1, 0.3, 1];

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.55 + i * 0.07, duration: 0.8, ease: IRIS_EASE },
  }),
};

const BACK_BUTTON_TRANSITION = { type: 'spring', stiffness: 300, damping: 20 };
const CLOSE_BUTTON_TRANSITION = { type: 'spring', stiffness: 300, damping: 18 };

const ProjectDetailBody = memo(function ProjectDetailBody({ project }) {
  const { ui } = useI18n();
  const stackItems = useMemo(
    () => project.tech.split(/[,/]/).map((item) => item.trim()).filter(Boolean),
    [project.tech],
  );

  const ctas = useMemo(
    () => [
      project.repo ? { key: 'repo', href: project.repo, icon: Github, label: ui.detail.repo } : null,
      project.demo ? { key: 'demo', href: project.demo, icon: ExternalLink, label: ui.detail.demo } : null,
    ].filter(Boolean),
    [project.demo, project.repo, ui.detail.repo, ui.detail.demo],
  );

  return (
    <>
      <div className="flex-1 container mx-auto px-6 md:px-12 py-16 md:py-24 max-w-5xl">
        <div className="grid md:grid-cols-12 gap-12 mb-20">
          <Motion.div custom={2} variants={itemVariants} initial="hidden" animate="visible" className="md:col-span-7 space-y-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-400 mb-6">{ui.detail.description}</p>
            <p className="text-zinc-700 font-light text-lg leading-relaxed">{project.desc}</p>
            {project.overview && <p className="text-zinc-500 font-light leading-relaxed">{project.overview}</p>}

            {!!project.flow?.length && (
              <div className="pt-8">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-400 mb-5">{ui.detail.howItWorks}</p>
                <ol className="space-y-4">
                  {project.flow.map((step, i) => (
                    <li key={step} className="flex items-start gap-4">
                      <span className="mt-0.5 font-mono text-[11px] text-zinc-400">{String(i + 1).padStart(2, '0')}</span>
                      <span className="text-sm font-light leading-relaxed text-zinc-600">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </Motion.div>

          <Motion.div custom={3} variants={itemVariants} initial="hidden" animate="visible" className="md:col-span-4 md:col-start-9 space-y-10">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-400 mb-4">{ui.detail.role}</p>
              <p className="text-zinc-600 font-light leading-relaxed">{project.role || ui.detail.defaultRole}</p>
              {project.status && (
                <p className="mt-3 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-black/60" />
                  {project.status}
                </p>
              )}
            </div>

            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-400 mb-4">{ui.detail.stack}</p>
              <div className="flex flex-wrap gap-2">
                {stackItems.map((item) => (
                  <span
                    key={item}
                    className="text-xs border border-black/10 bg-black/5 px-3 py-1.5 text-zinc-700 rounded-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {!!project.highlights?.length && (
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-400 mb-4">{ui.detail.keyPoints}</p>
                <ul className="space-y-3">
                  {project.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-3 text-sm text-zinc-400 font-light">
                      <span className="mt-1.5 h-px w-4 shrink-0 bg-zinc-400" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Motion.div>
        </div>

        {!!project.facts?.length && (
          <Motion.div custom={4} variants={itemVariants} initial="hidden" animate="visible" className="border-t border-black/10 pt-12 mb-16">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-400 mb-8">{ui.detail.inNumbers}</p>
            <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
              {project.facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-2">{fact.label}</dt>
                  <dd className="font-serif text-xl leading-snug text-black">{fact.value}</dd>
                </div>
              ))}
            </dl>
            {project.note && <p className="mt-8 max-w-2xl text-xs font-light leading-relaxed text-zinc-500">{project.note}</p>}
          </Motion.div>
        )}

        {!!project.challenges?.length && (
          <Motion.div custom={5} variants={itemVariants} initial="hidden" animate="visible" className="border-t border-black/10 pt-16 mb-20">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-400 mb-8">{ui.detail.challenges}</p>
            <div className="grid md:grid-cols-2 gap-8">
              {project.challenges.map((card) => (
                <div key={card.title} className="border border-black/10 p-8 bg-black/3">
                  <h3 className="font-serif text-2xl mb-4 text-black">{card.title}</h3>
                  <p className="text-zinc-500 font-light leading-relaxed text-sm">{card.detail}</p>
                </div>
              ))}
            </div>
          </Motion.div>
        )}

        {ctas.length > 0 && (
          <Motion.div custom={6} variants={itemVariants} initial="hidden" animate="visible" className="flex flex-wrap gap-6">
            {ctas.map((cta) => {
              const CtaIcon = cta.icon;

              return (
                <a
                  key={cta.key}
                  href={cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 border border-black/20 px-6 py-4 text-sm font-mono uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300"
                  data-cursor="hover"
                >
                  <CtaIcon size={16} />
                  {cta.label}
                  <ArrowLeft size={14} className="rotate-180 group-hover:translate-x-1 transition-transform" />
                </a>
              );
            })}
          </Motion.div>
        )}
      </div>

      <div className="border-t border-black/10 px-6 md:px-12 py-6 flex justify-between items-center text-zinc-400 text-xs font-mono uppercase tracking-widest">
        <span>{project.name}</span>
        <span>{project.tech}</span>
      </div>
    </>
  );
});

const ProjectDetail = ({ project, origin, onClose }) => {
  const { ui, format } = useI18n();
  const closeButtonRef = useRef(null);
  const cx = origin?.x ?? (typeof window === 'undefined' ? 0 : window.innerWidth / 2);
  const cy = origin?.y ?? (typeof window === 'undefined' ? 0 : window.innerHeight / 2);
  const iris = (radius) => `circle(${radius} at ${cx}px ${cy}px)`;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!project) return null;

  return (
    <FocusTrap focusTrapOptions={{ initialFocus: () => closeButtonRef.current, fallbackFocus: () => closeButtonRef.current }}>
      <Motion.div
        initial={{ clipPath: iris('0%') }}
        animate={{ clipPath: iris('150%'), transition: { duration: 1.1, ease: IRIS_EASE } }}
        exit={{ clipPath: iris('0%'), transition: { duration: 0.8, ease: IRIS_EASE } }}
        className="fixed inset-0 z-[150] flex flex-col overflow-y-auto bg-[#f0f0f0] text-black scroll-hidden"
        aria-modal="true"
        role="dialog"
        aria-label={format(ui.detail.dialog, { name: project.name })}
      >
        <div className="sticky top-0 left-0 right-0 z-20 flex items-center justify-between border-b border-white/10 bg-[#0a0a0a] px-6 py-5 text-white md:px-12">
          <Motion.button
            onClick={onClose}
            className="group flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-zinc-400 transition-colors hover:text-white"
            data-cursor="hover"
            whileHover={{ x: -4 }}
            transition={BACK_BUTTON_TRANSITION}
            aria-label={ui.detail.back}
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            {ui.detail.backLabel}
          </Motion.button>

          <Motion.button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-2 text-zinc-400 transition-colors hover:text-white"
            data-cursor="hover"
            whileHover={{ rotate: 90 }}
            transition={CLOSE_BUTTON_TRANSITION}
            aria-label={ui.detail.close}
          >
            <X size={20} />
          </Motion.button>
        </div>

        <div className="relative bg-[#0a0a0a] text-white">
          <div className="relative h-[34vh] min-h-[240px] border-b border-white/10">
            <ProjectWorld world={project.world} />
          </div>
          <div className="container mx-auto flex flex-wrap items-end justify-between gap-4 px-6 py-8 md:px-12 md:py-10">
            <Motion.h2
              custom={0}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="font-serif text-5xl leading-none tracking-tighter md:text-7xl lg:text-8xl"
            >
              {project.name}
            </Motion.h2>
            <Motion.div custom={1} variants={itemVariants} initial="hidden" animate="visible" className="flex flex-col items-start gap-1 font-mono text-xs uppercase tracking-[0.25em] text-zinc-400 md:items-end">
              <span>{project.tech}</span>
              {project.year && <span className="text-zinc-500">{project.year}</span>}
            </Motion.div>
          </div>
        </div>

        <ProjectDetailBody project={project} />
      </Motion.div>
    </FocusTrap>
  );
};

export default memo(ProjectDetail);
