import React from 'react';
import { renderToString } from 'react-dom/server';
import { MotionConfig } from 'framer-motion';
import App from './App.jsx';
import { LanguageProvider } from './i18n';

export async function prerender() {
  const html = renderToString(
    <MotionConfig reducedMotion="user">
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </MotionConfig>,
  );

  return { html };
}
