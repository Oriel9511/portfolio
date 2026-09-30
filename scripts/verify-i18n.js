import process from 'node:process';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const load = async (rel) => (await import(pathToFileURL(join(root, rel)).href)).default;

const es = await load('src/i18n/es.js');
const { mergeContent } = await import(pathToFileURL(join(root, 'src/i18n/merge.js')).href);
const en = await load('src/i18n/en/index.js');

const problems = [];
const fail = (message) => problems.push(message);
const SPANISH_MARKS = /[áéíóúñ¿¡ÁÉÍÓÚÑ]/;
const PROPER_OR_SAME = new Set(['Scroll', 'LinkedIn', 'GitHub', 'Stack', 'WhatsApp · Webchat · Marketplace']);

function walk(base, over, path, { leaf }) {
  if (over === undefined) return;
  if (Array.isArray(base)) {
    if (!Array.isArray(over)) return fail(`${path}: expected an array`);
    if (over.length !== base.length) fail(`${path}: length ${over.length} != ${base.length}`);
    base.forEach((item, i) => walk(item, over[i], `${path}[${i}]`, { leaf }));
    return;
  }
  if (base && typeof base === 'object') {
    Object.keys(over ?? {}).forEach((key) => {
      if (!(key in base)) fail(`${path}.${key}: key does not exist in Spanish`);
      else walk(base[key], over[key], `${path}.${key}`, { leaf });
    });
    return;
  }
  leaf(base, over, path);
}

const checkText = (base, over, path) => {
  if (typeof over !== 'string' || !over.trim()) return fail(`${path}: empty or not a string`);
  if (SPANISH_MARKS.test(over)) fail(`${path}: Spanish characters left in "${over}"`);
  if (over === base && base.length > 24 && !PROPER_OR_SAME.has(base)) fail(`${path}: identical to Spanish`);
};

// ui + seo: every string must be overridden (except language names and a few identical words)
const requireAll = (base, over, path) => {
  if (Array.isArray(base)) return base.forEach((item, i) => requireAll(item, over?.[i], `${path}[${i}]`));
  if (base && typeof base === 'object') return Object.keys(base).forEach((k) => requireAll(base[k], over?.[k], `${path}.${k}`));
  if (path === 'ui.language.es' || path === 'ui.language.en' || path === 'seo.title') return;
  if (over === undefined) fail(`${path}: missing English translation`);
  else checkText(base, over, path);
};
requireAll(es.ui, en.ui, 'ui');
requireAll(es.seo, en.seo, 'seo');
walk(es.ui, en.ui, 'ui', { leaf: () => {} });
if (en.seo.locale !== 'en_US') fail('seo.locale must be en_US');

// data: partial overrides, but strict about shape; projects must be fully translated
walk(es.data, en.data, 'data', { leaf: (base, over, path) => {
  if (typeof over === 'string') checkText(base, over, path);
} });
es.data.opensource.forEach((project, i) => {
  const over = en.data.opensource?.[i];
  const at = `data.opensource[${i}](${project.name})`;
  if (!over) return fail(`${at}: missing translation`);
  ['name', 'desc', 'year', 'role', 'status', 'overview'].forEach((key) => {
    if (project[key] && !over[key]) fail(`${at}.${key}: missing`);
  });
  ['highlights', 'flow', 'facts', 'challenges'].forEach((key) => {
    if (project[key]?.length && over[key]?.length !== project[key].length) fail(`${at}.${key}: length mismatch`);
  });
  if (project.note && !over.note) fail(`${at}.note: missing`);
  if (over.world || over.repo || over.demo) fail(`${at}: non-translatable field overridden`);
});
es.data.experience.forEach((job, i) => {
  const over = en.data.experience?.[i];
  if (!over?.role || !over?.year || !over?.desc) fail(`data.experience[${i}](${job.company}): incomplete translation`);
});

// canvas labels: every tr('…') source string used by a scene must exist in the dictionary
const dict = en.scenes;
const labsDir = join(root, 'src/labs');
const used = new Set();
readdirSync(labsDir).filter((f) => f.endsWith('Scene.js')).forEach((file) => {
  const text = readFileSync(join(labsDir, file), 'utf8');
  [...text.matchAll(/tr\('([^']+)'\)/g)].forEach((m) => used.add(m[1]));
  // labels declared in module-level constants and translated where they are drawn
  const head = text.slice(0, text.indexOf('export const'));
  [...head.matchAll(/'([^'\n]*)'/g)].map((m) => m[1]).filter((k) => /[A-ZÁÉÍÓÚÑ]{2}|¿/.test(k) && !/^(pill|rect|diamond)$/.test(k)).forEach((k) => used.add(k));
  [...text.matchAll(/hud:\s*\[([^\]]*)\]/g)].forEach((m) => [...m[1].matchAll(/'([^']+)'/g)].forEach((k) => used.add(k[1])));
});
const NAMES = new Set(['BIOPASS · BIOMATCH', 'CHAT DOC QUERY', 'KINET · PRE-ALPHA', 'LIMS · LABSTAT', 'PEOPLEFLOW', 'WEBCHAT', 'WHATSAPP', 'ABCDEFGH', 'HEAD-OF-LINE']);
used.forEach((key) => {
  if (NAMES.has(key) && !dict[key]) return;
  if (!dict[key]) fail(`scenes: no translation for "${key}"`);
  else if (SPANISH_MARKS.test(dict[key])) fail(`scenes["${key}"]: Spanish characters left in "${dict[key]}"`);
  else if (dict[key] === key && !NAMES.has(key) && /[A-ZÁÉÍÓÚÑ]{4}/.test(key) && !/^[A-Z0-9 ·→/.\-+]+$/.test(dict[key].replace(/[A-Z]{4,}/g, (w) => w))) fail(`scenes["${key}"]: untranslated`);
  if (dict[key] && dict[key].length > key.length * 1.4 + 4) fail(`scenes["${key}"]: much longer than the source (${dict[key].length} vs ${key.length})`);
});
Object.keys(dict).forEach((key) => {
  if (!used.has(key)) fail(`scenes: "${key}" is not used by any scene`);
});

// nothing inherited from Spanish may still read as Spanish once merged (e.g. `tech` lines)
const merged = mergeContent(es, en);
const scan = (node, path) => {
  if (Array.isArray(node)) return node.forEach((item, i) => scan(item, `${path}[${i}]`));
  if (node && typeof node === 'object') return Object.keys(node).forEach((k) => scan(node[k], `${path}.${k}`));
  if (typeof node === 'string' && SPANISH_MARKS.test(node) && !/(^|\.)(language\.es)$/.test(path)) fail(`${path}: Spanish text left in merged English content ("${node.slice(0, 40)}")`);
};
scan({ ui: merged.ui, seo: merged.seo, data: merged.data }, 'en');

if (problems.length) {
  console.error(`✖ i18n check failed (${problems.length}):\n` + problems.map((p) => `  - ${p}`).join('\n'));
  process.exit(1);
}
console.log(`✔ i18n check passed (${used.size} canvas labels, ${es.data.opensource.length} projects)`);
