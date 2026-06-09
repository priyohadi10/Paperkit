import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // vite-plugin-pwa handles registration automatically
  });
}

// Handle PWA install prompt
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  // Store the event for later use
  const event = e as Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

  // Dispatch a custom event that the app can listen to
  window.dispatchEvent(new CustomEvent('pwaInstallable', { detail: event }));
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
