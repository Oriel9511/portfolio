import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion as Motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const SECTION_INDICES = {
    hero: 0,
    work: 2,
    opensource: 4,
    about: 5,
    contact: 6
};

const Navbar = ({ activeSectionId = 'hero', onNavigate }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);
    const rafId = useRef(null);

    const isDarkBg = ['hero', 'work', 'opensource', 'contact'].includes(activeSectionId);

    // ── Scroll handler: navbar show/hide ──────────────────
    const handleScroll = useCallback(() => {
        if (rafId.current) return;
        rafId.current = requestAnimationFrame(() => {
            const currentScrollY = window.scrollY;

            // Navbar visibility
            if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            lastScrollY.current = currentScrollY;

            rafId.current = null;
        });
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (rafId.current) cancelAnimationFrame(rafId.current);
        };
    }, [handleScroll]);

    const textColor = isDarkBg ? 'text-white' : 'text-black';
    const logoColor = textColor;

    const handleNavClick = (sectionId) => {
        setIsMobileMenuOpen(false);
        const index = SECTION_INDICES[sectionId];
        if (index !== undefined && onNavigate) {
            onNavigate(index);
        }
    };

    const visibilityClass = isVisible ? 'translate-y-0' : '-translate-y-full';

    return (
        <>
            <nav
                className={`fixed top-0 left-0 w-full z-[100] px-6 py-6 md:py-8 flex justify-between items-center transition-all duration-500 ease-in-out ${visibilityClass} pointer-events-none`}
            >
                <Motion.button
                    whileHover="hover"
                    initial="initial"
                    onClick={() => handleNavClick('hero')}
                    className={`text-2xl font-bold tracking-tighter font-serif z-[101] pointer-events-auto transition-colors duration-300 ${logoColor} p-4 -ml-4 relative`}
                    data-cursor="hover"
                >
                    OA.
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                        <Motion.polyline
                            points="1,1 99,1 99,99"
                            fill="none" stroke="currentColor" strokeWidth="2"
                            variants={{ hover: { pathLength: 1 }, initial: { pathLength: 0 } }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                        />
                        <Motion.polyline
                            points="1,1 1,99 99,99"
                            fill="none" stroke="currentColor" strokeWidth="2"
                            variants={{ hover: { pathLength: 1 }, initial: { pathLength: 0 } }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                        />
                    </svg>
                </Motion.button>

                <div className={`hidden md:flex gap-2 text-xs font-mono uppercase tracking-[0.2em] font-bold pointer-events-auto transition-colors duration-300 ${textColor}`}>
                    {['work', 'opensource', 'about', 'contact'].map((section) => {
                        const isActive = activeSectionId === section;
                        const activeClass = isActive 
                            ? (isDarkBg ? 'text-white font-bold active' : 'text-black font-bold active')
                            : (section === 'contact' ? 'text-zinc-400' : (isDarkBg ? 'text-white/60' : 'text-black/60'));
                        
                        return (
                            <Motion.button
                                key={section}
                                whileHover="hover"
                                initial="initial"
                                onClick={() => handleNavClick(section)}
                                className={`relative px-6 py-4 hover:opacity-80 transition-opacity ${activeClass}`}
                                data-cursor="hover"
                            >
                                {section === 'work' ? 'Experiencia' :
                                    section === 'opensource' ? 'Labs' :
                                        section === 'about' ? 'Perfil' : 'Contacto'}
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
                            </Motion.button>
                        );
                    })}
                </div>

                <Motion.button
                    whileHover="hover"
                    initial="initial"
                    className={`md:hidden z-[101] pointer-events-auto transition-colors duration-300 ${isMobileMenuOpen ? 'text-white' : textColor} p-4 -mr-4 relative`}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    data-cursor="hover"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                        <Motion.polyline
                            points="1,1 99,1 99,99"
                            fill="none" stroke="currentColor" strokeWidth="2"
                            variants={{ hover: { pathLength: 1 }, initial: { pathLength: 0 } }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                        />
                        <Motion.polyline
                            points="1,1 1,99 99,99"
                            fill="none" stroke="currentColor" strokeWidth="2"
                            variants={{ hover: { pathLength: 1 }, initial: { pathLength: 0 } }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                        />
                    </svg>
                </Motion.button>
            </nav>

            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-black z-[90] flex flex-col items-center justify-center gap-8 text-white font-serif text-2xl pointer-events-auto">
                    <button onClick={() => handleNavClick('work')}>Experiencia</button>
                    <button onClick={() => handleNavClick('opensource')}>Labs</button>
                    <button onClick={() => handleNavClick('about')}>Perfil</button>
                    <button onClick={() => handleNavClick('contact')}>Contacto</button>
                </div>
            )}
        </>
    );
};

export default Navbar;
