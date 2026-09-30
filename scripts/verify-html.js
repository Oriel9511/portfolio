/* global process */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distHtmlPath = path.resolve(__dirname, '../dist/index.html');

console.log('Starting static HTML accessibility and SEO verification...');

if (!fs.existsSync(distHtmlPath)) {
  console.error(`Error: Prerendered HTML file not found at ${distHtmlPath}. Run npm run build first.`);
  process.exit(1);
}

const html = fs.readFileSync(distHtmlPath, 'utf-8');
let failures = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ PASS: ${message}`);
  } else {
    console.error(`❌ FAIL: ${message}`);
    failures++;
  }
}

// 1. Check Canonical Link
const hasCanonical = html.includes('<link rel="canonical" href="https://oriel9511.github.io/portfolio/">') ||
                     html.includes('<link rel="canonical" href="https://oriel9511.github.io/portfolio/"');
assert(hasCanonical, 'Canonical URL link tag is present and correct');

// 2. Check Preconnect Links
const preconnect1 = html.includes('rel="preconnect" href="https://fonts.googleapis.com"') || html.includes('href="https://fonts.googleapis.com" rel="preconnect"');
const preconnect2 = html.includes('rel="preconnect" href="https://fonts.gstatic.com"') || html.includes('href="https://fonts.gstatic.com" rel="preconnect"');
assert(preconnect1 && preconnect2, 'Preconnect link tags are present for Google Fonts');

// 3. Check Social Meta Tags
const hasOgTitle = html.includes('property="og:title"') || html.includes('property=\'og:title\'');
const hasOgDesc = html.includes('property="og:description"') || html.includes('property=\'og:description\'');
const hasOgUrl = html.includes('property="og:url"') || html.includes('property=\'og:url\'');
const hasOgImage = html.includes('property="og:image"') || html.includes('property=\'og:image\'');
const hasTwitterCard = html.includes('name="twitter:card"') || html.includes('name=\'twitter:card\'');
assert(hasOgTitle && hasOgDesc && hasOgUrl && hasOgImage && hasTwitterCard, 'Social media OG and Twitter metadata tags are present');

// 4. Check JSON-LD Script
const hasJsonLd = html.includes('id="seo-json-ld"') && html.includes('application/ld+json');
assert(hasJsonLd, 'Structured JSON-LD schema script is present');

if (hasJsonLd) {
  try {
    const jsonLdMatch = html.match(/<script type="application\/ld\+json" id="seo-json-ld">([\s\S]*?)<\/script>/);
    if (jsonLdMatch && jsonLdMatch[1]) {
      const parsed = JSON.parse(jsonLdMatch[1]);
      assert(Array.isArray(parsed) && parsed.length > 0, 'JSON-LD data parses successfully and is a valid array');
    } else {
      assert(false, 'Could not extract JSON-LD script contents');
    }
  } catch (err) {
    assert(false, `JSON-LD parsing error: ${err.message}`);
  }
}

// 5. Check Main Tag Accessibility & Splash Decoupling
const mainMatch = html.match(/<main([^>]*?)>/);
if (mainMatch) {
  const mainAttributes = mainMatch[1];
  const hasAppShell = mainAttributes.includes('data-app-shell="true"');
  const hasSplashActive = mainAttributes.includes('data-splash-active="true"');
  const isAriaHidden = mainAttributes.includes('aria-hidden="true"');
  
  assert(hasAppShell, 'Main landmark has data-app-shell="true"');
  assert(hasSplashActive, 'Main landmark has data-splash-active="true" initially');
  assert(!isAriaHidden, 'Main landmark DOES NOT have aria-hidden="true" in the prerendered HTML (no-JS accessible)');
} else {
  assert(false, 'Could not find <main> landmark element in HTML');
}

// 6. Check Skip to Content Link
const hasSkipLink = html.includes('href="#main-content"') && html.includes('skip-link');
assert(hasSkipLink, 'Skip-to-content link is present for keyboard navigation');

// 7. Check Noscript Fallback Styles
const hasNoscript = html.includes('<noscript>') && html.includes('[data-app-shell]') && html.includes('[data-splash-overlay]');
assert(hasNoscript, 'Noscript stylesheet fallback is present to override splash overlay and app opacity when JS is disabled');

if (failures > 0) {
  console.error(`\nVerification FAILED with ${failures} failure(s).`);
  process.exit(1);
} else {
  console.log('\nVerification PASSED successfully! All accessibility and SEO criteria met.');
  process.exit(0);
}
