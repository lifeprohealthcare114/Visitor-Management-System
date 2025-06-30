import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import './App.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

serviceWorkerRegistration.register({
  onSuccess: (registration) => {
    console.log('ServiceWorker registration successful');
  },
  onUpdate: (registration) => {
    if (window.confirm('New version available! Update now?')) {
      const worker = registration.waiting;
      if (worker) {
        worker.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    }
  },
});

reportWebVitals();