import { StrictMode, createElement as h } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';

const container = document.getElementById('root');
if (!container) {
  throw new Error('index.html is missing <div id="root">');
}
createRoot(container).render(h(StrictMode, null, h(App)));
