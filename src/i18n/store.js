const STORAGE_KEY = 'oa-lang';
const SUPPORTED = ['es', 'en'];
const listeners = new Set();
let current = null;

function detect() {
  const query = new URLSearchParams(window.location.search).get('lang');
  if (SUPPORTED.includes(query)) return query;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (SUPPORTED.includes(stored)) return stored;
  } catch {
    // storage can be blocked; fall through to the browser language
  }

  const browser = (navigator.languages?.[0] ?? navigator.language ?? 'es').toLowerCase();
  return browser.startsWith('es') || browser.startsWith('pt') ? 'es' : 'en';
}

export const getLang = () => {
  if (current === null) current = detect();
  return current;
};

export const getServerLang = () => 'es';

export const subscribeLang = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export function setLang(next) {
  if (!SUPPORTED.includes(next) || next === current) return;
  current = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // preference simply will not persist
  }
  listeners.forEach((listener) => listener());
}
