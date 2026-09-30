import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { MotionConfig } from 'framer-motion';
import './index.css';
import App from './App.jsx';
import { LanguageProvider } from './i18n';

const container = document.getElementById('root');

const app = (
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </MotionConfig>
  </StrictMode>
);

if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
