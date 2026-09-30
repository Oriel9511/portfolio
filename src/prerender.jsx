import React from 'react';
import { MotionConfig } from 'framer-motion';
import App from './App.jsx';
import { LanguageProvider } from './i18n';
import { CONTENT } from './i18n/content';
import { allRoutes, parsePath, stripBase } from './i18n/routes';

const SLUGS = CONTENT.es.data.opensource.map((project) => project.slug);

// One static HTML file per language and per project, so every URL has real, crawlable content.
export async function prerender(data) {
  // react-dom/static waits for every Suspense boundary (lazy project detail included) before finishing.
  // Loaded on demand so the server renderer never ships in the client entry chunk.
  const { prerender: renderStatic } = await import('react-dom/static');
  const route = parsePath(stripBase(data.url));

  const { prelude } = await renderStatic(
    <MotionConfig reducedMotion="user">
      <LanguageProvider route={route}>
        <App initialProjectSlug={route.slug} />
      </LanguageProvider>
    </MotionConfig>,
  );
  const html = await new Response(prelude).text();

  return { html, links: new Set(allRoutes(SLUGS)) };
}
