import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion as Motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, Code2, Database, Layers } from 'lucide-react';
import Navbar from './components/Navbar';
import ExperienceRow from './components/ExperienceRow';
import ProjectCard from './components/ProjectCard';
import ProjectDetail from './components/ProjectDetail';
import StackedSection from './components/StackedSection';
import AnimatedQuote from './components/AnimatedQuote';
import SplitText from './components/SplitText';
import SplashScreen from './components/SplashScreen';
import CustomCursor from './components/CustomCursor';
import MagneticButton from './components/MagneticButton';
import Marquee from './components/Marquee';
import SectionDivider from './components/SectionDivider';
import AnimatedCounter from './components/AnimatedCounter';
import MagneticWrap from './components/MagneticWrap';
import { DATA } from './data/portfolioData';

const CURRENT_YEAR = new Date().getFullYear();

function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const [showSplash, setShowSplash] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const openProject = useCallback((project) => setSelectedProject(project), []);
  const closeProject = useCallback(() => setSelectedProject(null), []);
  const projectCards = useMemo(
    () => DATA.opensource.map((project, index) => ({
      key: project.name,
      project,
      index,
      onClick: () => openProject(project),
    })),
    [openProject],
  );

  // Splash timer
  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 2200);
    return () => clearTimeout(t);
  }, []);

  // Centralized scroll lock — one single owner
  useEffect(() => {
    document.documentElement.style.overflow =
      (showSplash || selectedProject) ? 'hidden' : '';
    return () => { document.documentElement.style.overflow = ''; };
  }, [showSplash, selectedProject]);

  return (
    <div className="bg-[#0a0a0a] min-h-screen w-full font-sans selection:bg-white selection:text-black">
      <CustomCursor />

      {/* Splash Intro */}
      <AnimatePresence>{showSplash && <SplashScreen key="splash" />}</AnimatePresence>

      {/* Project Detail Slide-Over */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetail
            key={selectedProject.name}
            project={selectedProject}
            onClose={closeProject}
          />
        )}
      </AnimatePresence>

      {!showSplash && (
        <main>
          <Navbar />

          {/* Progress Bar */}
          <Motion.div
            className="progress-bar fixed top-0 left-0 right-0 h-1 bg-white origin-left z-[100] mix-blend-difference"
            style={{ scaleX }}
          />

          {/* --- LAYER 1: HERO (Dark) - BALANCED --- */}
          <StackedSection id="hero" zIndex={0} theme="dark" className="pt-24 pb-12 px-6">
            <div className="container mx-auto h-full flex flex-col justify-between relative z-10">

              {/* TOP: Location & Meta */}
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

              {/* MIDDLE: Name */}
              <div className="flex-grow flex items-center justify-center my-8 md:my-0">
                <SplitText
                  text={DATA.profile.name}
                  as="h1"
                  className="text-[15vw] font-serif font-medium tracking-tighter text-white mix-blend-screen"
                />
              </div>

              {/* BOTTOM: Balanced Tripod Layout */}
              <div className="grid md:grid-cols-12 gap-8 items-end border-b border-white/10 pb-6">

                {/* Left: Scroll Indicator */}
                <Motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 1 }}
                  className="md:col-span-3 hidden md:flex items-end"
                >
                  <div className="flex items-center gap-4 text-zinc-500 font-mono text-xs uppercase tracking-widest">
                    <div className="h-px w-8 bg-zinc-600"></div>
                    <span>Scroll</span>
                    <ArrowDown size={14} className="animate-bounce" />
                  </div>
                </Motion.div>

                {/* Center: Tagline (The Anchor) */}
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

                {/* Mobile Scroll (Visible only on mobile) */}
                <div className="md:hidden col-span-12 flex justify-center mt-4">
                  <ArrowDown size={20} className="animate-bounce text-zinc-600" />
                </div>
              </div>

            </div>

            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('/textures/noise.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
          </StackedSection>

          {/* --- DIVIDER: HERO -> QUOTE 1 --- */}
          <SectionDivider from="#0a0a0a" to="#f0f0f0" />

          {/* --- LAYER 2: QUOTE 1 (Light) --- */}
          <StackedSection id="quote1" zIndex={10} theme="light" sticky={false}>
            <AnimatedQuote
              text="No es solo escribir código. Se trata de diseñar sistemas que escalen y transformen negocios. Tu gran proyecto se encuentra a una decisión de distancia."
              theme="light"
            />
          </StackedSection>

          {/* --- DIVIDER: QUOTE 1 -> WORK --- */}
          <SectionDivider from="#f0f0f0" to="#0a0a0a" />

          {/* --- LAYER 3: WORK (Dark) --- */}
          <StackedSection id="work" zIndex={20} theme="dark" sticky={true} className="justify-start py-24 md:py-32">
            <div className="container mx-auto px-6 mb-16">
              <Motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
              >
                <SplitText
                  text="Trayectoria."
                  as="h2"
                  className="text-5xl md:text-7xl font-serif mb-6"
                />
                <div className="h-1 w-24 bg-white/30"></div>
              </Motion.div>
            </div>

            <div className="w-full">
              {DATA.experience.map((job, index) => (
                <ExperienceRow key={index} job={job} index={index} />
              ))}
              <div className="border-t border-white/20"></div>
            </div>
          </StackedSection>

          {/* --- DIVIDER: WORK -> STATS --- */}
          <SectionDivider from="#0a0a0a" to="#f0f0f0" />

          {/* --- LAYER 3.5: STATS (Light) --- */}
          <StackedSection id="stats" zIndex={25} theme="light" sticky={false} className="py-20 justify-start">
            <div className="container mx-auto px-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-black/10 pt-12">
                {[
                  { to: 6,  suffix: '+', label: 'Años de experiencia' },
                  { to: 30, suffix: '+', label: 'Proyectos entregados' },
                  { to: 4,  suffix: '',  label: 'Empresas' },
                  { to: 12, suffix: '',  label: 'Stack technologies' },
                ].map((s, i) => (
                  <div key={i} className="flex flex-col">
                    <AnimatedCounter to={s.to} suffix={s.suffix} />
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500 mt-3">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </StackedSection>

          {/* --- LAYER 4: QUOTE 2 (Light) --- */}
          <StackedSection id="quote2" zIndex={30} theme="light" sticky={false}>
            <AnimatedQuote
              text="La excelencia no es un acto, es un hábito forjado en la resiliencia, la autoexigencia y la perseverancia."
              theme="light"
              author="Filosofía de Trabajo"
            />
          </StackedSection>

          {/* --- DIVIDER: QUOTE 2 -> SKILLS MARQUEE --- */}
          <SectionDivider from="#f0f0f0" to="#0a0a0a" />

          {/* --- LAYER 4.5: SKILLS MARQUEE (Dark) --- */}
          <StackedSection id="skills-marquee" zIndex={35} theme="dark" sticky={false} className="py-0">
            <Marquee
              items={[...DATA.skills.frontend, ...DATA.skills.backend, ...DATA.skills.tools]}
              dark
              separator="·"
            />
          </StackedSection>

          {/* --- LAYER 5: OPEN SOURCE / PROJECTS (Dark) --- */}
          <StackedSection id="opensource" zIndex={40} theme="dark" sticky={true} className="justify-start py-24 md:py-32">
            <div className="container mx-auto px-6 mb-16">
              <Motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
              >
                <SplitText
                  text="Labs & Open Source."
                  as="h2"
                  className="text-4xl md:text-6xl font-serif mb-6"
                />
                <p className="text-zinc-400 font-light max-w-xl">
                  Proyectos paralelos, herramientas experimentales y contribuciones que mantienen mis habilidades afiladas.
                </p>
                <div className="h-1 w-24 bg-white/30 mt-6"></div>
              </Motion.div>
            </div>

            <div className="container mx-auto px-6 grid md:grid-cols-2 gap-8">
              {projectCards.map(({ key, ...cardProps }) => (
                <ProjectCard
                  key={key}
                  {...cardProps}
                />
              ))}
            </div>
          </StackedSection>

          {/* --- DIVIDER: OPEN SOURCE -> ABOUT --- */}
          <SectionDivider from="#0a0a0a" to="#f0f0f0" />

          {/* --- LAYER 6: ABOUT (Light) --- */}
          <StackedSection id="about" zIndex={50} theme="light" sticky={true} className="justify-center py-20">
            <div className="container mx-auto px-6">

              <div className="mb-16 md:mb-24">
                <SplitText
                  text="La lógica del ingeniero. La creatividad del desarrollador."
                  as="h2"
                  className="text-4xl md:text-6xl lg:text-7xl font-serif leading-none text-black max-w-5xl"
                  highlightLastWord
                />
              </div>

              <div className="grid md:grid-cols-12 gap-12 items-start mb-20">

                {/* Bio Text */}
                <div className="md:col-span-8 text-zinc-700 font-light text-lg md:text-xl leading-relaxed space-y-6">
                  <p>
                    Mi formación en Ingeniería Automática ({DATA.education.school}) me enseó a ver el mundo en sistemas, bucles de control y optimización. Hoy aplico esa misma mentalidad rigurosa al desarrollo de software full stack.
                  </p>
                  <p>
                    He evolucionado desde programar hardware hasta orquestar arquitecturas web complejas, lo que me da una ventaja única: entiendo la máquina desde el bit más bajo hasta la interfaz de usuario más alta.
                  </p>
                </div>

                {/* Education Side Note */}
                <div className="md:col-span-4 border-l border-black/20 pl-6 md:pl-12">
                  <h3 className="font-mono text-xs uppercase tracking-[0.2em] mb-4 text-zinc-500 font-bold">Formación</h3>
                  <div>
                    <p className="font-serif text-2xl text-black mb-1">{DATA.education.degree}</p>
                    <p className="text-zinc-600 text-sm">{DATA.education.school} — {DATA.education.year}</p>
                  </div>
                </div>
              </div>

              {/* ARSENAL TECNOLOGICO - FULL WIDTH GRID */}
              <div className="border-t border-black/10 pt-12">
                <h3 className="font-mono text-xs uppercase tracking-[0.2em] mb-8 text-zinc-500 font-bold">Arsenal Tecnológico</h3>

                <div className="grid md:grid-cols-3 gap-8">
                  {/* Frontend */}
                  <div>
                    <div className="flex items-center gap-2 mb-4 text-black">
                      <Code2 size={20} />
                      <span className="font-serif text-xl">Frontend</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {DATA.skills.frontend.map(s => (
                        <span key={s} className="text-xs border border-black/10 bg-black/5 px-3 py-1.5 text-zinc-700 rounded-sm">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Backend */}
                  <div>
                    <div className="flex items-center gap-2 mb-4 text-black">
                      <Database size={20} />
                      <span className="font-serif text-xl">Backend</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {DATA.skills.backend.map(s => (
                        <span key={s} className="text-xs border border-black/10 bg-black/5 px-3 py-1.5 text-zinc-700 rounded-sm">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tools */}
                  <div>
                    <div className="flex items-center gap-2 mb-4 text-black">
                      <Layers size={20} />
                      <span className="font-serif text-xl">Tools & Cloud</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {DATA.skills.tools.map(s => (
                        <span key={s} className="text-xs border border-black/10 bg-black/5 px-3 py-1.5 text-zinc-700 rounded-sm">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </StackedSection>

          {/* --- DIVIDER: ABOUT -> CONTACT --- */}
          <SectionDivider from="#f0f0f0" to="#0a0a0a" />

          {/* --- LAYER 7: CONTACT (Dark) --- */}
          <StackedSection id="contact" zIndex={60} theme="dark" className="justify-center">
            <div className="container mx-auto px-6 text-center">
              <AnimatedQuote
                text="Para materializar tu vision, transformaremos los conceptos complejos en objetivos concretos, moldeando los limites tecnicos para que des tu proximo gran salto."
                theme="dark"
              />

              <div className="mt-20">
                <p className="font-mono text-xs text-zinc-400 uppercase tracking-[0.3em] mb-8 font-bold">Inicia la conversación</p>
                <MagneticButton
                  strength={0.15}
                  scale={1.02}
                  as="a"
                  href={`mailto:${DATA.profile.email}`}
                  className="group inline-block relative cursor-pointer"
                  data-cursor="hover"
                >
                  <h2 className="text-[8vw] md:text-[6vw] font-serif leading-[0.9] transition-colors duration-500 group-hover:text-zinc-300 relative z-10 break-all md:break-normal text-white">
                    {DATA.profile.email}
                  </h2>
                  <div className="absolute bottom-2 left-0 w-full h-px bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </MagneticButton>
              </div>

              <footer className="mt-32 flex flex-row justify-between items-center text-zinc-500 text-xs font-mono uppercase tracking-widest border-t border-white/10 pt-4 pb-12">
                <div className="flex">
                  <MagneticWrap strength={0.15}>
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
                  </MagneticWrap>
                  <MagneticWrap strength={0.15}>
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
                  </MagneticWrap>
                </div>
                <p className="px-6">© {CURRENT_YEAR} Oriel Arteaga.</p>
              </footer>
            </div>
          </StackedSection>

        </main>
      )}

      {/* Film Grain overlay */}
      <div className="film-grain" />
    </div>
  );
}

export default App;
