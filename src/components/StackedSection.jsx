import React, { useRef } from 'react';
import { motion as Motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { slideHeight as viewportHeight } from '../experience/viewport';

// `index` places the section on the scroll timeline: rel -1 = arriving, 0 = current, 1 = covered.
const StackedSection = ({ children, className = '', id = '', zIndex = 0, theme = 'dark', index = 0, tone = '', rule = false }) => {
    const ref = useRef(null);
    const reduceMotion = useReducedMotion();
    const { scrollY } = useScroll();
    const rel = useTransform(() => scrollY.get() / viewportHeight() - index);

    const y = useTransform(rel, [-1, 0, 1], ['18vh', '0vh', '-7vh']);
    const scale = useTransform(rel, [-1, 0, 1], [1.07, 1, 0.92]);
    const shade = useTransform(rel, [0, 1], [0, 0.7]);
    const visibility = useTransform(rel, (value) => (Math.abs(value) > 1.02 ? 'hidden' : 'visible'));

    const bgColor = theme === 'light' ? `${tone || 'bg-[#f0f0f0]'} text-black` : 'bg-[#0a0a0a] text-white';
    const shadowClass = zIndex > 0 ? 'shadow-[0_-50px_40px_-20px_rgba(0,0,0,0.5)]' : '';
    const layout = /\bjustify-/.test(className) ? className : `justify-center ${className}`;

    return (
        <Motion.section
            ref={ref}
            id={id}
            data-theme={theme}
            className={`sticky h-[var(--slide-h)] min-h-[var(--slide-h)] max-h-[var(--slide-h)] w-full overflow-hidden ${bgColor} ${shadowClass}`}
            style={{ zIndex, top: 0, visibility: reduceMotion ? undefined : visibility }}
        >
            <Motion.div
                className={`relative flex h-full w-full flex-col will-change-transform ${layout}`}
                style={reduceMotion ? undefined : { y, scale, transformOrigin: '50% 60%' }}
            >
                {children}
            </Motion.div>
            {rule && <span aria-hidden="true" className={`pointer-events-none absolute inset-x-6 top-[100px] z-10 h-px ${theme === 'light' ? 'bg-black/15' : 'bg-white/15'}`} />}
            <Motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-50 bg-black"
                style={{ opacity: reduceMotion ? 0 : shade }}
            />
        </Motion.section>
    );
};

export default StackedSection;
