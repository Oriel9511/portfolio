import React, { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion as Motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import Navbar from './components/Navbar';
import SlideRail from './components/SlideRail';
import SplashScreen from './components/SplashScreen';
import HeroSection from './sections/HeroSection';
import QuoteSection from './sections/QuoteSection';
import WorkSection from './sections/WorkSection';
import LabsSection from './sections/LabsSection';
import AboutSection from './sections/AboutSection';
import ContactSection from './sections/ContactSection';
import { useSlideController } from './experience/useSlideController';
import { experience } from './experience/store';
import { useI18n } from './i18n/context';
import { canonicalUrl, getJsonLdPayload, socialImageUrl } from './data/seo';

const ProjectDetail = lazy(() => import('./components/ProjectDetail'));
const CustomCursor = lazy(() => import('./components/CustomCursor'));
const FieldCanvas = lazy(() => import('./components/FieldCanvas'));
const SLIDES = ['hero', 'quote1', 'work', 'quote2', 'opensource', 'about', 'contact'];

function setDocumentMeta(name, content, attribute = 'name') {
  const selector = `meta[${attribute}="${name}"]`;
  const element = document.head.querySelector(selector);
  if (element) {
    element.setAttribute('content', content);
  }
}

function App() {
  const reduceMotion = useReducedMotion();
  const { lang, ui, seo, data } = useI18n();
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const [showSplash, setShowSplash] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [selectedWorld, setSelectedWorld] = useState(null);
  const [projectOrigin, setProjectOrigin] = useState(null);
  const [shouldLoadCursor, setShouldLoadCursor] = useState(false);
  const lastProjectTriggerRef = useRef(null);
  const selectedProject = data.opensource.find((item) => item.world === selectedWorld) ?? null;
  const hasProject = selectedWorld !== null;

  const { activeIndex, scrollToSlide } = useSlideController(SLIDES, {
    paused: showSplash || hasProject,
    reduceMotion,
  });

  const openProject = useCallback((project, trigger, origin) => {
    lastProjectTriggerRef.current = trigger ?? null;
    setProjectOrigin(origin ?? null);
    setSelectedWorld(project.world);
  }, []);

  const closeProject = useCallback(() => {
    setSelectedWorld(null);
    window.setTimeout(() => {
      lastProjectTriggerRef.current?.focus?.();
    }, 0);
  }, []);

  useEffect(() => {
    const delay = reduceMotion ? 0 : 2200;
    const timer = window.setTimeout(() => setShowSplash(false), delay);
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  useEffect(() => {
    document.documentElement.style.overflow = (showSplash || hasProject) ? 'hidden' : '';
    experience.covered = hasProject;
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [showSplash, hasProject]);

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
    document.title = seo.title;
    setDocumentMeta('description', seo.description);
    setDocumentMeta('author', 'Oriel Arteaga');
    setDocumentMeta('theme-color', '#0a0a0a');
    setDocumentMeta('twitter:title', seo.title);
    setDocumentMeta('twitter:description', seo.ogDescription);
    setDocumentMeta('twitter:image', socialImageUrl);
    setDocumentMeta('og:title', seo.title, 'property');
    setDocumentMeta('og:description', seo.ogDescription, 'property');
    setDocumentMeta('og:url', canonicalUrl, 'property');
    setDocumentMeta('og:image', socialImageUrl, 'property');
    setDocumentMeta('og:image:alt', seo.imageAlt, 'property');
    setDocumentMeta('og:locale', seo.locale, 'property');

    const canonicalLink = document.head.querySelector('link[rel="canonical"]');
    canonicalLink?.setAttribute('href', canonicalUrl);

    const jsonLdScript = document.getElementById('seo-json-ld');
    if (jsonLdScript) {
      jsonLdScript.textContent = JSON.stringify(getJsonLdPayload({ seo, lang }));
    }
  }, [lang, seo]);

  useEffect(() => {
    document.documentElement.dataset.appHydrated = 'true';
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] font-sans selection:bg-white selection:text-black">
      <Suspense fallback={null}>{shouldLoadCursor ? <CustomCursor /> : null}</Suspense>
      <Suspense fallback={null}>{isClient ? <FieldCanvas visible={!showSplash} /> : null}</Suspense>

      <AnimatePresence>{showSplash && <SplashScreen key="splash" />}</AnimatePresence>

      <Suspense fallback={null}>
        <AnimatePresence>
          {selectedProject && (
            <ProjectDetail
              key={selectedProject.world}
              project={selectedProject}
              origin={projectOrigin}
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
        <SlideRail slides={SLIDES} activeIndex={activeIndex} onNavigate={scrollToSlide} />

        <Motion.div
          className="progress-bar fixed top-0 left-0 right-0 z-[100] h-1 origin-left bg-white mix-blend-difference"
          style={{ scaleX }}
        />

        <HeroSection index={0} play={!showSplash} />
        <QuoteSection id="quote1" index={1} zIndex={10} text={ui.quotes.vision} framed tone="bg-[#f8f8f8]" />
        <WorkSection index={2} />
        <QuoteSection id="quote2" index={3} zIndex={30} text={ui.quotes.philosophy} author={ui.quotes.philosophyAuthor} />
        <LabsSection index={4} paused={hasProject} onOpenProject={openProject} />
        <AboutSection index={5} />
        <ContactSection index={6} />
      </main>
    </div>
  );
}

export default App;
