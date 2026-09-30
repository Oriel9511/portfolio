import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const load = async (rel) => import(pathToFileURL(path.join(root, rel)).href);

const { CONTENT } = await load('src/i18n/content.js');
const { pageMeta } = await load('src/i18n/seoModel.js');
const { LANGS, allRoutes, buildUrl } = await load('src/i18n/routes.js');

console.log('Verifying prerendered pages: content, SEO tags, accessibility and fallbacks...');
if (!fs.existsSync(path.join(dist, 'index.html'))) {
  console.error('Error: dist/index.html not found. Run npm run build first.');
  process.exit(1);
}

let failures = 0;
const assert = (condition, message) => {
  if (condition) return;
  console.error(`❌ FAIL: ${message}`);
  failures += 1;
};

const slugs = CONTENT.es.data.opensource.map((project) => project.slug);
const routes = allRoutes(slugs);
const decode = (value) => value.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<');
const attr = (html, pattern) => {
  const match = html.match(pattern);
  return match ? decode(match[1]) : null;
};
const stripTags = (html) => html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const normalize = (value) => decode(value).replace(/&#x27;/g, "'").replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim();

routes.forEach((route) => {
  const file = path.join(dist, route === '/' ? '' : route, 'index.html');
  const label = `page ${route}`;
  if (!fs.existsSync(file)) return assert(false, `${label}: file missing`);
  const html = fs.readFileSync(file, 'utf8');

  const lang = route.startsWith('/en') ? 'en' : 'es';
  const slug = route.split('/').filter(Boolean).at(-1);
  const project = CONTENT[lang].data.opensource.find((item) => item.slug === slug);
  const meta = pageMeta(lang, project ? project.slug : null);

  // head
  assert(html.includes(`<html lang="${lang}"`), `${label}: <html lang="${lang}">`);
  assert(attr(html, /<link rel="canonical" href="([^"]+)"/) === meta.canonical, `${label}: canonical is ${meta.canonical}`);
  assert(normalize(attr(html, /<title>([^<]*)<\/title>/) ?? '') === normalize(meta.title), `${label}: title`);
  assert(normalize(attr(html, /<meta name="description" content="([^"]*)"/) ?? '') === normalize(meta.description), `${label}: description`);
  assert((html.match(/<title>/g) ?? []).length === 1, `${label}: exactly one <title>`);
  assert((html.match(/rel="canonical"/g) ?? []).length === 1, `${label}: exactly one canonical`);
  meta.alternates.forEach((alt) => assert(html.includes(`hreflang="${alt.hreflang}" href="${alt.href}"`), `${label}: hreflang ${alt.hreflang}`));
  ['og:title', 'og:description', 'og:url', 'og:image', 'og:image:width', 'og:image:height', 'og:image:alt', 'og:locale'].forEach((p) => assert(html.includes(`property="${p}"`), `${label}: ${p}`));
  ['twitter:card', 'twitter:image', 'twitter:image:alt'].forEach((n) => assert(html.includes(`name="${n}"`), `${label}: ${n}`));
  assert(!html.includes('fonts.googleapis.com') && !html.includes('fonts.gstatic.com'), `${label}: no third-party font requests`);
  assert(html.includes('rel="manifest"') && html.includes('apple-touch-icon'), `${label}: manifest and apple-touch-icon`);

  // structured data
  try {
    const ld = JSON.parse(html.match(/<script type="application\/ld\+json" id="seo-json-ld">([\s\S]*?)<\/script>/)[1]);
    assert(ld['@type'] === (project ? 'CreativeWork' : 'ProfilePage'), `${label}: JSON-LD @type`);
    assert(ld.url === meta.canonical && ld.inLanguage === lang, `${label}: JSON-LD url/language`);
    if (!project) assert(ld.mainEntity?.sameAs?.length >= 2, `${label}: Person.sameAs`);
  } catch (error) {
    assert(false, `${label}: JSON-LD invalid (${error.message})`);
  }

  // body: headings, landmarks, real content in the language of the URL
  assert((html.match(/<h1[\s>]/g) ?? []).length === 1, `${label}: exactly one <h1>`);
  assert(/<main[^>]*data-app-shell="true"/.test(html) && !/<main[^>]*aria-hidden="true"/.test(html), `${label}: main landmark visible to crawlers`);
  assert(html.includes('href="#main-content"') && html.includes('skip-link'), `${label}: skip link`);
  assert(html.includes('/fallback.css'), `${label}: no-JS fallback stylesheet`);
  const text = normalize(stripTags(html));
  const ui = CONTENT[lang].ui;
  assert(text.includes(normalize(ui.hero.subtitleLead)), `${label}: hero copy in ${lang}`);
  CONTENT[lang].data.opensource.forEach((item) => assert(text.includes(normalize(item.name)), `${label}: project name "${item.name}"`));
  if (project) {
    assert(/role="dialog"/.test(html), `${label}: project detail is present in the HTML`);
    assert(text.includes(normalize(project.overview)), `${label}: full overview text`);
    project.highlights.forEach((h) => assert(text.includes(normalize(h)), `${label}: highlight "${h.slice(0, 30)}…"`));
    assert(text.includes(normalize(ui.detail.howItWorks)), `${label}: detail labels translated`);
  }
  const other = CONTENT[lang === 'es' ? 'en' : 'es'].ui.hero.subtitleLead;
  assert(!text.includes(normalize(other)), `${label}: no text from the other language`);

  // project links must be real, crawlable anchors
  if (!project) {
    slugs.forEach((s) => assert(html.includes(`href="${buildUrl(lang, s).replace('https://oriel9511.github.io', '')}"`), `${label}: crawlable link to ${s}`));
  }
});

// sitemap
const sitemap = fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8');
routes.forEach((route) => {
  const lang = route.startsWith('/en') ? 'en' : 'es';
  const slug = route.split('/').filter(Boolean).at(-1);
  const project = CONTENT[lang].data.opensource.find((item) => item.slug === slug);
  assert(sitemap.includes(`<loc>${buildUrl(lang, project ? slug : null)}</loc>`), `sitemap: ${route}`);
});
assert((sitemap.match(/<url>/g) ?? []).length === routes.length, `sitemap has ${routes.length} URLs`);
LANGS.forEach((code) => assert(sitemap.includes(`hreflang="${code}"`), `sitemap: hreflang ${code}`));

// 404 + assets
const notFound = fs.readFileSync(path.join(dist, '404.html'), 'utf8');
assert(notFound.includes('noindex') && notFound.includes('/portfolio/'), '404.html is noindex and links home');
['favicon-32.png', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png', 'og-image.png', 'manifest.webmanifest', 'fallback.css'].forEach((file) => assert(fs.existsSync(path.join(dist, file)), `asset ${file} is published`));
const og = fs.statSync(path.join(dist, 'og-image.png')).size;
assert(og < 300 * 1024, `og-image.png stays small (${Math.round(og / 1024)} kB)`);
const jsFiles = fs.readdirSync(path.join(dist, 'assets')).filter((f) => f.endsWith('.js'));
const entry = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
assert(!/(server|static)\.browser/.test(entry), 'client entry does not preload the server renderer');
assert(jsFiles.length > 0, 'JS chunks were emitted');

if (failures > 0) {
  console.error(`\nVerification FAILED with ${failures} failure(s).`);
  process.exit(1);
}
console.log(`\n✔ Verification passed: ${routes.length} pages checked (content, SEO tags, JSON-LD, hreflang, sitemap, 404, assets).`);
