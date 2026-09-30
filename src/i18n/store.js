import { BASE, DEFAULT_LANG, buildPath, parsePath, stripBase } from './routes.js';

const STORAGE_KEY = 'oa-lang';
const SUPPORTED = ['es', 'en'];
const listeners = new Set();
let current = null;

export const routeFromLocation = () => parsePath(stripBase(window.location.pathname));

// The URL is the source of truth for language (it is what gets indexed); ?lang= and a remembered explicit
// choice only apply on the default-language URLs. Browser language is deliberately NOT used: crawlers must
// see exactly the language of the URL they asked for.
function detect() {
  const query = new URLSearchParams(window.location.search).get('lang');
  if (SUPPORTED.includes(query)) return query;

  const routeLang = routeFromLocation().lang;
  if (routeLang !== DEFAULT_LANG) return routeLang;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (SUPPORTED.includes(stored)) return stored;
  } catch {
    // storage can be blocked; the URL language stands
  }
  return routeLang;
}

export const getLang = () => {
  if (current === null) current = detect();
  return current;
};

export const subscribeLang = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

// Keeps the address bar on the canonical URL of the current language (same project, same slide).
export function syncUrl(lang) {
  const { slug, lang: urlLang } = routeFromLocation();
  const search = new URLSearchParams(window.location.search);
  const hadQuery = search.has('lang');
  search.delete('lang');
  if (urlLang === lang && !hadQuery) return;
  const query = search.toString();
  window.history.replaceState(window.history.state, '', `${BASE}${buildPath(lang, slug)}${query ? `?${query}` : ''}${window.location.hash}`);
}

export function setLang(next) {
  if (!SUPPORTED.includes(next) || next === current) return;
  current = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // preference simply will not persist
  }
  syncUrl(next);
  listeners.forEach((listener) => listener());
}
