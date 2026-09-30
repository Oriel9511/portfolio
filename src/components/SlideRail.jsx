import React from 'react';
import { useI18n } from '../i18n/context';


// Right-edge scene ticks; blended with difference so it reads on both themes.
const SlideRail = ({ slides, activeIndex, onNavigate }) => {
  const { ui } = useI18n();
  const LABELS = ui.rail;

  return (
  <nav
    data-bg-inert="true"
    aria-label={ui.nav.sections}
    className="fixed right-3 top-1/2 z-[95] hidden -translate-y-1/2 flex-col items-end gap-3 mix-blend-difference md:flex"
  >
    {slides.map((id, i) => {
      const active = i === activeIndex;
      return (
        <button
          key={id}
          type="button"
          onClick={() => onNavigate(i)}
          aria-label={LABELS[id]}
          aria-current={active ? 'true' : undefined}
          data-cursor="hover"
          className="group flex items-center gap-3 py-1 pl-4"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white transition-all duration-500 translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-70 group-focus-visible:translate-x-0 group-focus-visible:opacity-70">
            {LABELS[id]}
          </span>
          <span className={`block h-px bg-white transition-all duration-500 ease-out ${active ? 'w-8 opacity-100' : 'w-3 opacity-40 group-hover:w-5 group-hover:opacity-80'}`} />
        </button>
      );
    })}
  </nav>
  );
};

export default SlideRail;
