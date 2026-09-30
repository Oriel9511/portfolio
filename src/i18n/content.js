import es from './es.js';
import en from './en/index.js';
import { format, mergeContent } from './merge.js';

// Fully merged content per language, plus the helpers scenes and UI need. Pure JS so Node scripts can import it.
export const CONTENT = {
  es: { ...es, tr: (text) => text, num: (value) => String(value).replace('.', ',') },
  en: (() => {
    const merged = mergeContent(es, en);
    const dictionary = en.scenes ?? {};
    return { ...merged, tr: (text) => dictionary[text] ?? text, num: (value) => String(value) };
  })(),
};

export { format };
