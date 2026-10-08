import { StrictMode, createElement as h } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';

const root = createRoot(document.getElementById('root'));
root.render(h(StrictMode, null, h(App)));
