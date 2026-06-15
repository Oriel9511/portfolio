import React from 'react';
import { renderToString } from 'react-dom/server';
import { MotionConfig } from 'framer-motion';
import App from './App.jsx';

export async function prerender() {
  const html = renderToString(
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>,
  );

  return { html };
}
