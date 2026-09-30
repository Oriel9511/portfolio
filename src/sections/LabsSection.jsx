import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import LabsStage from '../components/LabsStage';
import StackedSection from '../components/StackedSection';
import { useI18n } from '../i18n/context';
import { experience } from '../experience/store';
import { useZone } from '../experience/useZone';

const CINE = [0.16, 1, 0.3, 1];
const SWIPE_DISTANCE = 48;

const LabsSection = ({ index, paused, onOpenProject }) => {
  const { ui, data } = useI18n();
  const PROJECTS = data.opensource;
  const count = PROJECTS.length;
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const stageRef = useRef(null);
  const swipeStart = useRef(null);
  const listRef = useRef(null);
  useZone(listRef, { slide: index, k: 0.3, feather: 50 });
  const project = PROJECTS[active];

  const select = useCallback((next) => {
    const target = (next + count) % count;
    setDirection(target >= active ? 1 : -1);
    setActive(target);
    experience.hoverProject = target;
  }, [active, count]);

  useEffect(() => () => {
    experience.hoverProject = -1;
  }, []);

  const open = useCallback((trigger) => {
    const rect = stageRef.current?.getBoundingClientRect();
    const origin = rect
      ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      : { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    onOpenProject(project, trigger ?? stageRef.current, origin);
  }, [onOpenProject, project]);

  const onListKeyDown = (event) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    const next = (active + (event.key === 'ArrowDown' ? 1 : -1) + PROJECTS.length) % PROJECTS.length;
    select(next);
    event.currentTarget.querySelectorAll('[data-lab-item]')[next]?.focus();
  };

  const onSwipeStart = (event) => {
    swipeStart.current = event.clientX;
  };
  const onSwipeEnd = (event) => {
    if (swipeStart.current === null) return;
    const delta = event.clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(delta) > SWIPE_DISTANCE) select(active + (delta < 0 ? 1 : -1));
  };

  return (
    <StackedSection id="opensource" index={index} zIndex={40} theme="dark" rule className="justify-start pt-[7.5rem] pb-6">
      <div className="container mx-auto flex min-h-0 flex-1 flex-col px-6">
        <div className="mb-5 flex items-end justify-between gap-6 md:mb-7">
          <div>
            <h2 className="font-serif text-4xl md:text-[clamp(2rem,5.2vh,3rem)]">{ui.labs.title}</h2>
            <p className="mt-3 hidden max-w-xl text-sm font-light text-zinc-400 md:block [@media(max-height:830px)]:!hidden">
              {ui.labs.subtitle}
            </p>
          </div>
          <span className="whitespace-nowrap font-mono text-xs uppercase tracking-[0.25em] text-zinc-500">
            {String(active + 1).padStart(2, '0')} / {String(PROJECTS.length).padStart(2, '0')}
          </span>
        </div>

        <div className="grid min-h-0 content-start gap-5 md:flex-1 md:grid-cols-12 md:grid-rows-[minmax(0,1fr)] md:content-stretch md:gap-10">
          <ul
            ref={listRef}
            className="order-2 hidden min-h-0 md:order-1 md:col-span-5 md:flex md:flex-col md:justify-start"
            onKeyDown={onListKeyDown}
            onMouseLeave={() => {
              experience.hoverProject = -1;
            }}
          >
            {PROJECTS.map((item, i) => {
              const isActive = i === active;
              return (
                <li key={item.name} className="shrink-0 md:shrink md:border-t md:border-white/10 md:last:border-b">
                  <button
                    type="button"
                    data-lab-item="true"
                    data-cursor="hover"
                    aria-current={isActive ? 'true' : undefined}
                    onMouseEnter={() => select(i)}
                    onFocus={() => select(i)}
                    onClick={(event) => (isActive ? open(event.currentTarget) : select(i))}
                    className="group grid w-full grid-cols-[2.25rem_1fr] items-baseline gap-1 py-2 text-left md:py-[0.6vh]"
                  >
                    <span className={`font-mono text-xs transition-colors duration-500 ${isActive ? 'text-white' : 'text-zinc-600'}`}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>
                      <span className={`block font-serif text-lg transition-all duration-500 md:text-[clamp(1.05rem,2.5vh,1.7rem)] ${isActive ? 'italic text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                        {item.name}
                      </span>
                      <AnimatePresence initial={false}>
                        {isActive && (
                          <Motion.span
                            key="meta"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.7, ease: CINE }}
                            className="hidden overflow-hidden md:block"
                          >
                            <span className="mt-1 block font-mono text-[11px] text-zinc-400">{item.tech}</span>
                            <span className="mt-2 block max-w-md text-[13px] font-light leading-relaxed text-zinc-300">{item.desc}</span>
                            <span className="mt-3 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                              {item.year}
                              <span className="h-px w-8 bg-zinc-600" />
                              <span className="flex items-center gap-2 text-zinc-300">{ui.labs.open} <ArrowRight size={12} /></span>
                            </span>
                          </Motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="order-1 min-h-0 md:order-2 md:col-span-7" onPointerDown={onSwipeStart} onPointerUp={onSwipeEnd}>
            <LabsStage
              ref={stageRef}
              project={project}
              index={active}
              direction={direction}
              paused={paused}
              onOpen={() => open()}
              className="h-[40vh] w-full md:h-full md:max-h-[44rem]"
            />
          </div>
        </div>

        <div className="mt-6 md:hidden">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="font-serif text-3xl italic">{project.name}</h3>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-zinc-500">{project.year}</span>
          </div>
          <p className="mt-1 font-mono text-xs text-zinc-400">{project.tech}</p>
          <p className="mt-3 text-sm font-light leading-relaxed text-zinc-300">{project.desc}</p>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex min-w-0 flex-1 items-center pr-3">
              {PROJECTS.map((item, i) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => select(i)}
                  aria-label={item.name}
                  aria-current={i === active ? 'true' : undefined}
                  className="flex h-11 min-w-0 flex-1 items-center px-[1px]"
                >
                  <span className={`block h-px transition-all duration-500 ${i === active ? 'bg-white' : 'bg-zinc-600'} w-full`} />
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={(event) => open(event.currentTarget)}
              className="flex h-11 shrink-0 items-center gap-2 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.2em] text-white"
            >
              {ui.labs.open} <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </StackedSection>
  );
};

export default LabsSection;
