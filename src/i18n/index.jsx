import React, { useEffect, useMemo, useSyncExternalStore } from 'react';
import { CONTENT } from './content';
import { I18nContext } from './context';
import { format } from './merge';
import { getLang, setLang, subscribeLang, syncUrl } from './store';

// useSyncExternalStore keeps hydration on the server language, then switches to the visitor's without a mismatch.
export function LanguageProvider({ children, route = { lang: 'es' } }) {
  const lang = useSyncExternalStore(subscribeLang, getLang, () => route.lang);

  useEffect(() => {
    document.documentElement.lang = lang;
    syncUrl(lang);
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, format, ...CONTENT[lang] }), [lang]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
