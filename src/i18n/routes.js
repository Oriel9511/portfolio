// Single source of truth for URLs. Used by the browser, by the prerender step and by the SEO build script.
export const SITE = 'https://oriel9511.github.io';
export const BASE = '/portfolio';
export const LANGS = ['es', 'en'];
export const DEFAULT_LANG = 'es';

// Path segment that precedes a project slug, per language.
export const PROJECT_SEGMENT = { es: 'proyectos', en: 'projects' };

const trim = (value) => value.replace(/^\/+|\/+$/g, '');

// Site-relative path ('/', '/en/', '/proyectos/kinet/'), always with a trailing slash.
export function buildPath(lang, slug) {
  const parts = [];
  if (lang === 'en') parts.push('en');
  if (slug) parts.push(PROJECT_SEGMENT[lang], slug);
  return parts.length ? `/${parts.join('/')}/` : '/';
}

export const buildUrl = (lang, slug) => `${SITE}${BASE}${buildPath(lang, slug)}`;

// Parses a site-relative path (base already removed) into { lang, slug }.
export function parsePath(path) {
  const parts = trim(path || '').split('/').filter(Boolean);
  let lang = DEFAULT_LANG;
  if (parts[0] === 'en') {
    lang = 'en';
    parts.shift();
  }
  const isProject = parts[0] === PROJECT_SEGMENT[lang] && parts[1];
  return { lang, slug: isProject ? parts[1] : null };
}

// Removes the deployment base ('/portfolio') from a browser pathname.
export function stripBase(pathname, base = BASE) {
  return pathname.startsWith(base) ? pathname.slice(base.length) || '/' : pathname;
}

export function allRoutes(slugs) {
  return LANGS.flatMap((lang) => [buildPath(lang), ...slugs.map((slug) => buildPath(lang, slug))]);
}
