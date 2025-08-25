import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createRouter } from './router';
import './styles/app.css';
import './styles/facetec-custom.css';

const router = createRouter();

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
