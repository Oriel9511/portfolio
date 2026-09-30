import React, { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

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

const Navbar = ({ activeSectionId = 'hero', onNavigate }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
                <div id="mobile-navigation" role="dialog" aria-modal="true" aria-label="Mobile navigation" className="fixed inset-0 bg-black z-[90] flex flex-col items-center justify-center gap-8 text-white font-serif text-2xl pointer-events-auto">
                    {Object.entries(SECTION_LABELS).map(([section, label]) => (
                        <button key={section} onClick={() => handleNavClick(section)} aria-current={activeSectionId === section ? 'page' : undefined}>
                            {label}
                        </button>
                    ))}
                </div>
            )}
        </>
    );
};

export default Navbar;
