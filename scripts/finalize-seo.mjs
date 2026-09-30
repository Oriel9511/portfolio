import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const load = async (rel) => import(pathToFileURL(join(root, rel)).href);

const { CONTENT } = await load('src/i18n/content.js');
const { pageMeta } = await load('src/i18n/seoModel.js');
const { LANGS, allRoutes, buildUrl, parsePath } = await load('src/i18n/routes.js');

const slugs = CONTENT.es.data.opensource.map((project) => project.slug);
const escapeAttr = (value) => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const escapeText = (value) => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const jsonScript = (value) => JSON.stringify(value).replace(/</g, '\\u003c');

// Tags that this script owns; they are removed from the template output and regenerated per page.
const OWNED = [
  /<title>[\s\S]*?<\/title>\s*/i,
  /<meta\s+name="(?:description|author|robots|twitter:[^"]*)"[^>]*>\s*/gi,
  /<meta\s+property="og:[^"]*"[^>]*>\s*/gi,
  /<link\s+rel="canonical"[^>]*>\s*/gi,
  /<link\s+rel="alternate"\s+hreflang[^>]*>\s*/gi,
  /<script\s+type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>\s*/gi,
];

function headBlock(meta) {
  const m = (attrs) => `  <meta ${attrs} />`;
  const lines = [
    `  <title>${escapeText(meta.title)}</title>`,
    m(`name="description" content="${escapeAttr(meta.description)}"`),
    m('name="author" content="Oriel Arteaga"'),
    m('name="robots" content="index,follow,max-image-preview:large"'),
    `  <link rel="canonical" href="${escapeAttr(meta.canonical)}" />`,
    ...meta.alternates.map((a) => `  <link rel="alternate" hreflang="${a.hreflang}" href="${escapeAttr(a.href)}" />`),
    m('property="og:type" content="website"'),
    m('property="og:site_name" content="Oriel Arteaga"'),
    m(`property="og:title" content="${escapeAttr(meta.title)}"`),
    m(`property="og:description" content="${escapeAttr(meta.ogDescription)}"`),
    m(`property="og:url" content="${escapeAttr(meta.canonical)}"`),
    m(`property="og:locale" content="${meta.locale}"`),
    m(`property="og:locale:alternate" content="${meta.otherLocale}"`),
    m(`property="og:image" content="${meta.image.url}"`),
    m('property="og:image:type" content="image/png"'),
    m(`property="og:image:width" content="${meta.image.width}"`),
    m(`property="og:image:height" content="${meta.image.height}"`),
    m(`property="og:image:alt" content="${escapeAttr(meta.imageAlt)}"`),
    m('name="twitter:card" content="summary_large_image"'),
    m(`name="twitter:title" content="${escapeAttr(meta.title)}"`),
    m(`name="twitter:description" content="${escapeAttr(meta.ogDescription)}"`),
    m(`name="twitter:image" content="${meta.image.url}"`),
    m(`name="twitter:image:alt" content="${escapeAttr(meta.imageAlt)}"`),
    `  <script type="application/ld+json" id="seo-json-ld">${jsonScript(meta.jsonLd)}</script>`,
  ];
  return `${lines.join('\n')}\n`;
}

function finalizePage(route) {
  const { lang, slug } = parsePath(route);
  const file = join(dist, route === '/' ? '' : route, 'index.html');
  let html = readFileSync(file, 'utf8');
  OWNED.forEach((pattern) => {
    html = html.replace(pattern, '');
  });
  html = html.replace(/<html lang="[^"]*"/i, `<html lang="${lang}"`);
  const marker = html.search(/<meta\s+name="theme-color"[^>]*>/i);
  if (marker < 0) throw new Error(`${route}: theme-color meta not found to anchor the SEO block`);
  html = html.replace(/(<meta\s+name="theme-color"[^>]*>\s*)/i, `$1${headBlock(pageMeta(lang, slug))}`);
  writeFileSync(file, html);
}

const routes = allRoutes(slugs);
routes.forEach(finalizePage);

// sitemap with reciprocal language alternates
const today = new Date().toISOString().slice(0, 10);
const urlEntry = (lang, slug) => {
  const alternates = [...LANGS.map((code) => ({ hreflang: code, href: buildUrl(code, slug) })), { hreflang: 'x-default', href: buildUrl('es', slug) }];
  return [
    '  <url>',
    `    <loc>${buildUrl(lang, slug)}</loc>`,
    `    <lastmod>${today}</lastmod>`,
    ...alternates.map((a) => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${a.href}" />`),
    '  </url>',
  ].join('\n');
};
const entries = LANGS.flatMap((lang) => [urlEntry(lang, null), ...slugs.map((slug) => urlEntry(lang, slug))]);
writeFileSync(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`,
);

// GitHub Pages serves this file (with a real 404 status) for unknown paths under /portfolio/
writeFileSync(
  join(dist, '404.html'),
  `<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex" />
  <meta name="theme-color" content="#0a0a0a" />
  <title>404 — Oriel Arteaga</title>
  <style>
    html,body{margin:0;height:100%;background:#0a0a0a;color:#fff;font-family:Georgia,'Times New Roman',serif}
    main{min-height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.25rem;text-align:center;padding:0 1.5rem}
    h1{font-weight:400;font-size:clamp(3rem,12vw,7rem);letter-spacing:-.04em;margin:0}
    p{margin:0;color:#a1a1aa;font-family:ui-monospace,Menlo,monospace;font-size:.75rem;letter-spacing:.25em;text-transform:uppercase}
    a{color:#fff;font-family:ui-monospace,Menlo,monospace;font-size:.75rem;letter-spacing:.25em;text-transform:uppercase;border-bottom:1px solid #fff;padding-bottom:.25rem;text-decoration:none}
  </style>
</head>
<body>
  <main>
    <h1>404</h1>
    <p>Página no encontrada · Page not found</p>
    <a href="/portfolio/">Inicio · Home</a>
  </main>
</body>
</html>
`,
);

console.log(`✔ SEO finalized: ${routes.length} pages, sitemap.xml (${entries.length} URLs), 404.html`);
process.exit(0);
