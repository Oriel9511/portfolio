import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { MotionConfig } from 'framer-motion';
import './index.css';
import App from './App.jsx';
import { LanguageProvider } from './i18n';
import { routeFromLocation } from './i18n/store';

const container = document.getElementById('root');
const route = routeFromLocation();

const app = (
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <LanguageProvider route={route}>
        <App initialProjectSlug={route.slug} />
      </LanguageProvider>
    </MotionConfig>
  </StrictMode>
);

if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
