import React, { useEffect, useMemo, useSyncExternalStore } from 'react';
import es from './es';
import en from './en';
import { I18nContext } from './context';
import { format, mergeContent } from './merge';
import { getLang, getServerLang, setLang, subscribeLang } from './store';

const CONTENT = {
  es: { ...es, tr: (text) => text, num: (value) => String(value).replace('.', ',') },
  en: (() => {
    const merged = mergeContent(es, en);
    const dictionary = en.scenes ?? {};
    return { ...merged, tr: (text) => dictionary[text] ?? text, num: (value) => String(value) };
  })(),
};

// useSyncExternalStore keeps hydration on the server language, then switches to the visitor's without a mismatch.
export function LanguageProvider({ children }) {
  const lang = useSyncExternalStore(subscribeLang, getLang, getServerLang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, format, ...CONTENT[lang] }), [lang]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
