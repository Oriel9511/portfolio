import React from 'react';
import { useI18n } from '../i18n/context';

const OPTIONS = ['es', 'en'];

// Two-state segmented control; the active language is lit, the other one is a quiet, focusable button.
const LanguageSwitch = ({ className = '' }) => {
  const { lang, setLang, ui } = useI18n();

  return (
    <div role="group" aria-label={ui.language.label} className={`flex items-center font-mono text-xs font-bold uppercase tracking-[0.2em] ${className}`}>
      {OPTIONS.map((code, i) => {
        const active = lang === code;
        return (
          <React.Fragment key={code}>
            {i > 0 && <span aria-hidden="true" className="h-3 w-px bg-current opacity-30" />}
            <button
              type="button"
              lang={code}
              onClick={() => setLang(code)}
              aria-pressed={active}
              aria-label={ui.language[code]}
              data-cursor="hover"
              className={`px-3 py-2 uppercase transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-45 hover:opacity-80'}`}
            >
              {code}
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default LanguageSwitch;
