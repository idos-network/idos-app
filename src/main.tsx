import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createRouter } from './router';
import './styles/app.css';
import './styles/facetec-custom.css';
import { env } from './env';
import ReactGA from 'react-ga';

const router = createRouter();

if (env.VITE_GA_TRACKING_ID) {
  ReactGA.initialize(env.VITE_GA_TRACKING_ID);
  router.subscribe("onLoad", ({ toLocation }) => {
    ReactGA.pageview(toLocation.pathname);
  });
}

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
