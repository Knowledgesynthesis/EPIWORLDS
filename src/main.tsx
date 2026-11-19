import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { applyTheme, useThemeStore } from './stores/useThemeStore';
import './index.css';

// Keep <html class> in sync with the chosen theme and, for "system", with the OS.
applyTheme(useThemeStore.getState().theme);
useThemeStore.subscribe((s) => applyTheme(s.theme));
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (useThemeStore.getState().theme === 'system') applyTheme('system');
});

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => undefined);
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
