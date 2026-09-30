import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import MobileMenu from './MobileMenu';
import { experience } from '../experience/store';

const SECTION_INDICES = {
    hero: 0,
    work: 2,
    opensource: 4,
    about: 5,
    contact: 6
};

const SECTION_LABELS = {
    work: 'Experiencia',
    opensource: 'Labs',
    about: 'Perfil',
    contact: 'Contacto'
};

const GLYPH_SPRING = { type: 'spring', stiffness: 260, damping: 22 };
const GLYPH_STYLE = { transformBox: 'view-box', transformOrigin: '13px 13px' };

const MenuGlyph = ({ open }) => (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
        <Motion.line x1="4" y1="13" x2="22" y2="13" style={GLYPH_STYLE} animate={{ y: open ? 0 : -4, rotate: open ? 45 : 0 }} transition={GLYPH_SPRING} />
        <Motion.line x1="4" y1="13" x2="22" y2="13" style={GLYPH_STYLE} animate={{ y: open ? 0 : 4, rotate: open ? -45 : 0 }} transition={GLYPH_SPRING} />
    </svg>
);

const Navbar = ({ activeSectionId = 'hero', onNavigate }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        experience.covered = isMobileMenuOpen;
        if (!isMobileMenuOpen) return undefined;
        const onKey = (event) => event.key === 'Escape' && setIsMobileMenuOpen(false);
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isMobileMenuOpen]);

    const textColor = 'text-white';
    const logoColor = textColor;

    const handleNavClick = (sectionId) => {
        setIsMobileMenuOpen(false);
        const index = SECTION_INDICES[sectionId];
        if (index !== undefined && onNavigate) {
            onNavigate(index);
        }
    };

    return (
        <>
            <a href="#main-content" className="skip-link">Skip to content</a>

            <nav
                aria-label="Primary"
                className={`fixed top-0 left-0 w-full z-[100] px-6 py-6 md:py-8 flex justify-between items-center mix-blend-difference pointer-events-none`}
            >
                <Motion.button
                    whileHover="hover"
                    initial="initial"
                    onClick={() => handleNavClick('hero')}
                    className={`text-2xl font-bold tracking-tighter font-serif z-[101] pointer-events-auto transition-colors duration-300 ${logoColor} p-4 -ml-4 relative`}
                    data-cursor="hover"
                    aria-label="Go to hero section"
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
                        const activeClass = isActive ? 'font-bold active' : 'opacity-60';

                        return (
                            <Motion.button
                                key={section}
                                whileHover="hover"
                                initial="initial"
                                onClick={() => handleNavClick(section)}
                                className={`relative px-6 py-4 hover:opacity-80 transition-opacity ${activeClass}`}
                                data-cursor="hover"
                                aria-current={isActive ? 'page' : undefined}
                            >
                                {SECTION_LABELS[section]}
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
                    aria-expanded={isMobileMenuOpen}
                    aria-controls="mobile-navigation"
                    aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                >
                    <MenuGlyph open={isMobileMenuOpen} />
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

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <MobileMenu
                        items={[{ id: 'hero', label: 'Inicio' }, ...Object.entries(SECTION_LABELS).map(([id, label]) => ({ id, label }))]}
                        activeId={activeSectionId}
                        onNavigate={handleNavClick}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
