import React, { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion as Motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, Code2, Database, Layers } from 'lucide-react';
import Navbar from './components/Navbar';
import ExperienceRow from './components/ExperienceRow';
import ProjectCard from './components/ProjectCard';
import StackedSection from './components/StackedSection';
import AnimatedQuote from './components/AnimatedQuote';
import AnimatedName from './components/AnimatedName';
import SplashScreen from './components/SplashScreen';
import { DATA } from './data/portfolioData';
import { canonicalUrl, defaultMeta, getJsonLdPayload, socialImageUrl } from './data/seo';

const ProjectDetail = lazy(() => import('./components/ProjectDetail'));
const CustomCursor = lazy(() => import('./components/CustomCursor'));
const CURRENT_YEAR = new Date().getFullYear();
const SLIDES = ['hero', 'quote1', 'work', 'quote2', 'opensource', 'about', 'contact'];

function getInitialSlideIndex() {
  if (typeof window === 'undefined') return 0;
  const initialHash = window.location.hash.replace('#', '');
  const indexFromHash = SLIDES.indexOf(initialHash);
  return indexFromHash > -1 ? indexFromHash : 0;
}

function setDocumentMeta(name, content, attribute = 'name') {
  const selector = `meta[${attribute}="${name}"]`;
  const element = document.head.querySelector(selector);
  if (element) {
    element.setAttribute('content', content);
  }
}

function App() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const [showSplash, setShowSplash] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeIndex, setActiveIndex] = useState(getInitialSlideIndex);
  const [isTransitionLocked, setIsTransitionLocked] = useState(false);
  const [shouldLoadCursor, setShouldLoadCursor] = useState(false);
  const activeIndexRef = useRef(0);
  const isTransitionLockedRef = useRef(false);
  const lastProjectTriggerRef = useRef(null);

  const openProject = useCallback((project, trigger) => {
    lastProjectTriggerRef.current = trigger ?? null;
    setSelectedProject(project);
  }, []);

  const closeProject = useCallback(() => {
    setSelectedProject(null);
    window.setTimeout(() => {
      lastProjectTriggerRef.current?.focus?.();
    }, 0);
  }, []);

  const projectCards = useMemo(
    () => DATA.opensource.map((project, index) => ({
      key: project.name,
      project,
      index,
      onClick: (event) => openProject(project, event.currentTarget),
    })),
    [openProject],
  );

  useEffect(() => {
    const delay = reduceMotion ? 0 : 2200;
    const timer = window.setTimeout(() => setShowSplash(false), delay);
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  useEffect(() => {
    document.documentElement.style.overflow = (showSplash || selectedProject) ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [showSplash, selectedProject]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const finePointerQuery = window.matchMedia('(pointer: fine)');
    const coarsePointerQuery = window.matchMedia('(pointer: coarse)');

    const syncCursorCapability = () => {
      setShouldLoadCursor(finePointerQuery.matches && !coarsePointerQuery.matches && !reduceMotion);
    };

    syncCursorCapability();
    finePointerQuery.addEventListener?.('change', syncCursorCapability);
    coarsePointerQuery.addEventListener?.('change', syncCursorCapability);

    return () => {
      finePointerQuery.removeEventListener?.('change', syncCursorCapability);
      coarsePointerQuery.removeEventListener?.('change', syncCursorCapability);
    };
  }, [reduceMotion]);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    isTransitionLockedRef.current = isTransitionLocked;
  }, [isTransitionLocked]);

  useEffect(() => {
    document.title = defaultMeta.title;
    setDocumentMeta('description', defaultMeta.description);
    setDocumentMeta('author', defaultMeta.siteName);
    setDocumentMeta('theme-color', defaultMeta.themeColor);
    setDocumentMeta('twitter:title', defaultMeta.title);
    setDocumentMeta('twitter:description', defaultMeta.ogDescription);
    setDocumentMeta('twitter:image', socialImageUrl);
    setDocumentMeta('og:title', defaultMeta.title, 'property');
    setDocumentMeta('og:description', defaultMeta.ogDescription, 'property');
    setDocumentMeta('og:url', canonicalUrl, 'property');
    setDocumentMeta('og:image', socialImageUrl, 'property');
    setDocumentMeta('og:image:alt', defaultMeta.imageAlt, 'property');

    const canonicalLink = document.head.querySelector('link[rel="canonical"]');
    canonicalLink?.setAttribute('href', canonicalUrl);

    const jsonLdScript = document.getElementById('seo-json-ld');
    if (jsonLdScript) {
      jsonLdScript.textContent = JSON.stringify(getJsonLdPayload());
    }

    document.documentElement.dataset.appHydrated = 'true';
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
  }, []);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
    window.scrollTo({ top: activeIndex * window.innerHeight, behavior: 'auto' });
  }, [activeIndex]);

  const shouldBypassSlideTransition = useCallback((target, deltaY) => {
    const scroller = target.closest('[data-internal-scroller="true"]');
    if (!scroller) return false;

    const isScrollable = scroller.scrollHeight > scroller.clientHeight;
    if (!isScrollable) return false;

    if (deltaY > 0) {
      const isAtBottom = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 1;
      return !isAtBottom;
    }

    if (deltaY < 0) {
      const isAtTop = scroller.scrollTop <= 0;
      return !isAtTop;
    }

    return false;
  }, []);

  const scrollToSlide = useCallback((index, options = {}) => {
    if (index < 0 || index >= SLIDES.length) return;

    const { behavior = reduceMotion ? 'auto' : 'smooth', lock = true } = options;
    if (lock) {
      setIsTransitionLocked(true);
      isTransitionLockedRef.current = true;
    }

    setActiveIndex(index);
    activeIndexRef.current = index;

    window.scrollTo({
      top: index * window.innerHeight,
      behavior,
    });

    window.history.replaceState(null, '', `#${SLIDES[index]}`);

    if (lock) {
      window.setTimeout(() => {
        setIsTransitionLocked(false);
        isTransitionLockedRef.current = false;
      }, reduceMotion ? 0 : 800);
    }
  }, [reduceMotion]);

  const goToNextSlide = useCallback(() => {
    const nextIdx = activeIndexRef.current + 1;
    if (nextIdx < SLIDES.length) {
      scrollToSlide(nextIdx);
    }
  }, [scrollToSlide]);

  const goToPrevSlide = useCallback(() => {
    const prevIdx = activeIndexRef.current - 1;
    if (prevIdx >= 0) {
      scrollToSlide(prevIdx);
    }
  }, [scrollToSlide]);

  useEffect(() => {
    if (showSplash || selectedProject) return undefined;

    const handleKeyDown = (event) => {
      if (!['ArrowDown', 'ArrowUp', ' '].includes(event.key)) return;
      if (event.target instanceof Element && event.target.closest('button, a, input, textarea, select, [role="dialog"]')) {
        return;
      }

      const deltaY = event.key === 'ArrowUp' ? -100 : 100;
      if (event.target instanceof Element && shouldBypassSlideTransition(event.target, deltaY)) {
        return;
      }

      event.preventDefault();
      if (isTransitionLockedRef.current) return;
      if (deltaY > 0) goToNextSlide();
      if (deltaY < 0) goToPrevSlide();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextSlide, goToPrevSlide, selectedProject, shouldBypassSlideTransition, showSplash]);

  useEffect(() => {
    if (showSplash || selectedProject) return undefined;

    const pointerQuery = window.matchMedia('(pointer: fine)');
    if (!pointerQuery.matches) return undefined;

    const handleWheel = (event) => {
      const deltaY = event.deltaY;
      if (event.target instanceof Element && shouldBypassSlideTransition(event.target, deltaY)) {
        return;
      }

      event.preventDefault();
      if (isTransitionLockedRef.current) return;
      if (deltaY > 0) goToNextSlide();
      if (deltaY < 0) goToPrevSlide();
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [goToNextSlide, goToPrevSlide, selectedProject, shouldBypassSlideTransition, showSplash]);

  useEffect(() => {
    if (showSplash || selectedProject) return undefined;

    const handleResize = () => {
      window.scrollTo({ top: activeIndexRef.current * window.innerHeight, behavior: 'auto' });
    };

    const handleScroll = () => {
      if (isTransitionLockedRef.current) return;
      const nextIndex = Math.max(0, Math.min(SLIDES.length - 1, Math.round(window.scrollY / window.innerHeight)));
      if (nextIndex !== activeIndexRef.current) {
        activeIndexRef.current = nextIndex;
        setActiveIndex(nextIndex);
        window.history.replaceState(null, '', `#${SLIDES[nextIndex]}`);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [selectedProject, showSplash]);

  return (
    <div className="bg-[#0a0a0a] min-h-screen w-full font-sans selection:bg-white selection:text-black">
      <Suspense fallback={null}>{shouldLoadCursor ? <CustomCursor /> : null}</Suspense>

      <AnimatePresence>{showSplash && <SplashScreen key="splash" />}</AnimatePresence>

      <Suspense fallback={null}>
        <AnimatePresence>
          {selectedProject && (
            <ProjectDetail
              key={selectedProject.name}
              project={selectedProject}
              onClose={closeProject}
            />
          )}
        </AnimatePresence>
      </Suspense>

      <main
        id="main-content"
        data-app-shell="true"
        data-splash-active={showSplash ? 'true' : 'false'}
        aria-hidden={isClient && showSplash ? 'true' : undefined}
        className="app-shell"
      >
        <Navbar activeSectionId={SLIDES[activeIndex]} onNavigate={scrollToSlide} />

        <Motion.div
          className="progress-bar fixed top-0 left-0 right-0 h-1 bg-white origin-left z-[100] mix-blend-difference"
          style={{ scaleX }}
        />

        <StackedSection id="hero" zIndex={0} theme="dark" className="pt-24 pb-12 px-6">
          <div className="container mx-auto h-full flex flex-col justify-between relative z-10">
            <Motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="flex justify-between items-start w-full border-t border-white/10 pt-6"
            >
              <div className="flex flex-col">
                <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest mb-1">Ubicación</span>
                <span className="text-white font-serif text-lg tracking-wide">{DATA.profile.location}</span>
              </div>

              <div className="flex flex-col text-right">
                <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest mb-1">Rol</span>
                <span className="text-white font-serif text-lg tracking-wide">{DATA.profile.role}</span>
              </div>
            </Motion.div>

            <div className="flex-grow flex items-center justify-center my-8 md:my-0">
              <AnimatedName
                text={DATA.profile.name}
                className="text-[15vw] font-serif font-medium tracking-tighter text-white mix-blend-screen"
              />
            </div>

            <div className="grid md:grid-cols-12 gap-8 items-end border-b border-white/10 pb-6">
              <Motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 1 }}
                className="md:col-span-3 hidden md:flex items-end"
              >
                <div className="flex items-center gap-4 text-zinc-500 font-mono text-xs uppercase tracking-widest">
                  <div className="h-px w-8 bg-zinc-600" />
                  <span>Scroll</span>
                  <ArrowDown size={14} className="animate-bounce" />
                </div>
              </Motion.div>

              <Motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="md:col-span-6 text-center"
              >
                <p className="text-zinc-400 font-light leading-relaxed text-sm md:text-base max-w-lg mx-auto">
                  De la programación de hardware al desarrollo Full Stack.<br className="hidden md:block" />
                  <span className="text-zinc-200">Una visión sistémica para arquitecturas web complejas.</span>
                </p>
              </Motion.div>

              <div className="md:hidden col-span-12 flex justify-center mt-4">
                <ArrowDown size={20} className="animate-bounce text-zinc-600" />
              </div>
            </div>
          </div>

          <div className="absolute inset-0 bg-[url('/textures/noise.png')] opacity-10 mix-blend-overlay pointer-events-none" />
        </StackedSection>

        <StackedSection id="quote1" zIndex={10} theme="light">
          <AnimatedQuote
            text="No es solo escribir código. Se trata de diseñar sistemas que escalen y transformen negocios. Tu gran proyecto se encuentra a una decisión de distancia."
            theme="light"
          />
        </StackedSection>

        <StackedSection id="work" zIndex={20} theme="dark" sticky={true} className="justify-start py-20 md:py-32">
          <div className="container mx-auto px-6 mb-16">
            <Motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-7xl font-serif mb-6">Trayectoria.</h2>
              <div className="h-1 w-24 bg-white/30" />
            </Motion.div>
          </div>

          <div className="w-full overflow-y-auto max-h-[95vh] internal-scroller" data-internal-scroller="true">
            {DATA.experience.map((job, index) => (
              <ExperienceRow key={index} job={job} index={index} />
            ))}
            <div className="border-t border-white/20" />
          </div>
        </StackedSection>

        <StackedSection id="quote2" zIndex={30} theme="light">
          <AnimatedQuote
            text="La excelencia no es un acto, es un hábito forjado en la resiliencia, la autoexigencia y la perseverancia."
            theme="light"
            author="Filosofía de Trabajo"
          />
        </StackedSection>

        <StackedSection id="opensource" zIndex={40} theme="dark" sticky={true} className="justify-start py-24 md:py-32">
          <div className="container mx-auto px-6 mb-16">
            <Motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-serif mb-6">Labs & Open Source.</h2>
              <p className="text-zinc-400 font-light max-w-xl">
                Proyectos paralelos, herramientas experimentales y contribuciones que mantienen mis habilidades afiladas.
              </p>
              <div className="h-1 w-24 bg-white/30 mt-6" />
            </Motion.div>
          </div>

          <div className="container mx-auto px-6 overflow-y-auto max-h-[50vh] internal-scroller" data-internal-scroller="true">
            <div className="grid md:grid-cols-2 gap-6">
              {projectCards.map(({ key, ...cardProps }) => (
                <ProjectCard
                  key={key}
                  {...cardProps}
                />
              ))}
            </div>
          </div>
        </StackedSection>

        <StackedSection id="about" zIndex={50} theme="light" sticky={true} className="justify-center py-20">
          <div className="container mx-auto px-6">
            <div className="mb-16 md:mb-24">
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif leading-none text-black max-w-5xl">
                Ingeniería, software y criterio de producto. <br />
                <span className="text-zinc-500 text-3xl md:text-4xl lg:text-5xl block mt-4 font-sans font-light">Soluciones técnicas mantenibles enfocadas en la experiencia de uso.</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-12 gap-12 items-start mb-20">
              <div className="md:col-span-8 text-zinc-700 font-light text-lg md:text-xl leading-relaxed space-y-6">
                <p>
                  Mi formación en Ingeniería Automática en la CUJAE me dio una forma de pensar basada en sistemas, procesos, control y optimización. Hoy aplico esa base al desarrollo de software, especialmente en soluciones backend, arquitecturas web e integraciones complejas.
                </p>
                <p>
                  He trabajado desde entornos cercanos al hardware y la automatización hasta aplicaciones web modernas. Esa trayectoria me permite entender tanto las restricciones técnicas de un sistema como la experiencia de las personas que lo usan.
                </p>
              </div>

              <div className="md:col-span-4 border-l border-black/20 pl-6 md:pl-12">
                <h3 className="font-mono text-xs uppercase tracking-[0.2em] mb-4 text-zinc-500 font-bold">Formación</h3>
                <div>
                  <p className="font-serif text-2xl text-black mb-1">{DATA.education.degree}</p>
                  <p className="text-zinc-600 text-sm">{DATA.education.school} — {DATA.education.year}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-black/10 pt-12">
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] mb-8 text-zinc-500 font-bold">Arsenal Tecnológico</h3>

              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-4 text-black">
                    <Code2 size={20} />
                    <span className="font-serif text-xl">Frontend</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {DATA.skills.frontend.map((skill) => (
                      <span key={skill} className="text-xs border border-black/10 bg-black/5 px-3 py-1.5 text-zinc-700 rounded-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-4 text-black">
                    <Database size={20} />
                    <span className="font-serif text-xl">Backend</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {DATA.skills.backend.map((skill) => (
                      <span key={skill} className="text-xs border border-black/10 bg-black/5 px-3 py-1.5 text-zinc-700 rounded-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-4 text-black">
                    <Layers size={20} />
                    <span className="font-serif text-xl">Tools & Cloud</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {DATA.skills.tools.map((skill) => (
                      <span key={skill} className="text-xs border border-black/10 bg-black/5 px-3 py-1.5 text-zinc-700 rounded-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </StackedSection>

        <StackedSection id="contact" zIndex={60} theme="dark" className="justify-center">
          <div className="container mx-auto px-6 text-center">
            <AnimatedQuote
              text="Para materializar tu vision, transformaremos los conceptos complejos en objetivos concretos, moldeando los limites tecnicos para que des tu proximo gran salto."
              theme="dark"
            />

            <div className="mt-20">
              <p className="font-mono text-xs text-zinc-400 uppercase tracking-[0.3em] mb-8 font-bold">Inicia la conversación</p>
              <a href={`mailto:${DATA.profile.email}`} className="group inline-block relative cursor-pointer" data-cursor="hover">
                <h2 className="text-[8vw] md:text-[6vw] font-serif leading-[0.9] transition-colors duration-500 group-hover:text-zinc-300 relative z-10 break-all md:break-normal text-white">
                  {DATA.profile.email}
                </h2>
                <div className="absolute bottom-2 left-0 w-full h-px bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </a>
            </div>

            <footer className="mt-32 flex flex-row justify-between items-center text-zinc-500 text-xs font-mono uppercase tracking-widest border-t border-white/10 pt-4 pb-12">
              <div className="flex">
                <Motion.a
                  whileHover="hover"
                  initial="initial"
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors px-6 py-4 relative"
                  data-cursor="hover"
                >
                  LinkedIn
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                    <Motion.polyline
                      points="1,1 99,1 99,99"
                      fill="none" stroke="currentColor" strokeWidth="1"
                      variants={{ hover: { pathLength: 1 }, initial: { pathLength: 0 } }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    />
                    <Motion.polyline
                      points="1,1 1,99 99,99"
                      fill="none" stroke="currentColor" strokeWidth="1"
                      variants={{ hover: { pathLength: 1 }, initial: { pathLength: 0 } }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    />
                  </svg>
                </Motion.a>
                <Motion.a
                  whileHover="hover"
                  initial="initial"
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors px-6 py-4 relative"
                  data-cursor="hover"
                >
                  GitHub
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                    <Motion.polyline
                      points="1,1 99,1 99,99"
                      fill="none" stroke="currentColor" strokeWidth="1"
                      variants={{ hover: { pathLength: 1 }, initial: { pathLength: 0 } }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    />
                    <Motion.polyline
                      points="1,1 1,99 99,99"
                      fill="none" stroke="currentColor" strokeWidth="1"
                      variants={{ hover: { pathLength: 1 }, initial: { pathLength: 0 } }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    />
                  </svg>
                </Motion.a>
              </div>
              <p className="px-6">© {CURRENT_YEAR} Oriel Arteaga.</p>
            </footer>
          </div>
        </StackedSection>
      </main>
    </div>
  );
}

export default App;
