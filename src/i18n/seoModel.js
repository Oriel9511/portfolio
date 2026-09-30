import { CONTENT } from './content.js';
import { LANGS, buildUrl } from './routes.js';

const OG_LOCALE = { es: 'es_UY', en: 'en_US' };
const IMAGE = { url: 'https://oriel9511.github.io/portfolio/og-image.png', width: 1200, height: 630 };

const projectOf = (lang, slug) => CONTENT[lang].data.opensource.find((item) => item.slug === slug);

// Everything a page needs in <head>, derived from the same content the UI renders.
export function pageMeta(lang, slug = null) {
  const content = CONTENT[lang];
  const project = slug ? projectOf(lang, slug) : null;
  const { profile, education, skills } = content.data;
  const canonical = buildUrl(lang, slug);

  const title = project ? `${project.name} — Oriel Arteaga` : content.seo.title;
  const description = project ? `${project.desc} ${project.role}.` : content.seo.description;
  const ogDescription = project ? project.desc : content.seo.ogDescription;

  const person = {
    '@type': 'Person',
    '@id': `${buildUrl(lang)}#person`,
    name: profile.name,
    jobTitle: profile.role,
    url: buildUrl(lang),
    email: `mailto:${profile.email}`,
    address: { '@type': 'PostalAddress', addressLocality: 'Montevideo', addressCountry: 'UY' },
    sameAs: [profile.linkedin, profile.github].filter(Boolean),
    alumniOf: { '@type': 'CollegeOrUniversity', name: education.school },
    worksFor: { '@type': 'Organization', name: content.data.experience[0].company },
    knowsAbout: [...skills.languages, ...skills.platforms],
  };

  const alternates = LANGS.map((code) => ({ hreflang: code, href: buildUrl(code, slug) }));
  alternates.push({ hreflang: 'x-default', href: buildUrl('es', slug) });

  const jsonLd = project
    ? {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: project.name,
        description: project.desc,
        url: canonical,
        inLanguage: lang,
        keywords: project.tech,
        author: { '@id': person['@id'] },
        isPartOf: { '@type': 'WebSite', name: 'Oriel Arteaga', url: buildUrl(lang) },
      }
    : {
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        url: canonical,
        name: title,
        description,
        inLanguage: lang,
        mainEntity: person,
        isPartOf: { '@type': 'WebSite', name: 'Oriel Arteaga', url: buildUrl(lang) },
      };

  return {
    lang,
    slug,
    title,
    description,
    ogDescription,
    canonical,
    alternates,
    locale: OG_LOCALE[lang],
    otherLocale: OG_LOCALE[lang === 'es' ? 'en' : 'es'],
    imageAlt: content.seo.imageAlt,
    image: IMAGE,
    jsonLd,
  };
}
