export const siteUrl = 'https://oriel9511.github.io/portfolio';
export const canonicalUrl = `${siteUrl}/`;
export const socialImageUrl = `${siteUrl}/og-image.png`;

export function getJsonLdPayload({ seo, lang }) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Oriel Arteaga',
      url: canonicalUrl,
      jobTitle: 'Full Stack Developer',
      email: 'mailto:arteaga95.jimenez@gmail.com',
      address: { '@type': 'PostalAddress', addressLocality: 'Montevideo', addressCountry: 'UY' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Oriel Arteaga',
      url: canonicalUrl,
      description: seo.description,
      inLanguage: lang,
    },
  ];
}
