export const siteUrl = 'https://orielarteaga.dev';
export const canonicalUrl = `${siteUrl}/`;
export const socialImageUrl = `${siteUrl}/og-image.png`;

export const defaultMeta = {
  title: 'Oriel Arteaga — Full Stack Developer',
  description:
    'Portfolio de Oriel Arteaga, Full Stack Developer en Montevideo. Ingeniero en Automática especializado en arquitecturas web escalables con React, .NET, Node.js y Azure.',
  ogDescription:
    'De la ingeniería de hardware al desarrollo Full Stack. Una visión sistémica para arquitecturas web complejas.',
  siteName: 'Oriel Arteaga',
  locale: 'es_UY',
  themeColor: '#0a0a0a',
  imageAlt: 'Oriel Arteaga portfolio preview',
};

export function createPersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Oriel Arteaga',
    url: canonicalUrl,
    jobTitle: 'Full Stack Developer',
    email: 'mailto:arteaga95.jimenez@gmail.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Montevideo',
      addressCountry: 'UY',
    },
  };
}

export function createWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: defaultMeta.siteName,
    url: canonicalUrl,
    description: defaultMeta.description,
    inLanguage: 'es',
  };
}

export function getJsonLdPayload() {
  return [createPersonSchema(), createWebsiteSchema()];
}
