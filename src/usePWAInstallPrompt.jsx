// import { useState, useEffect } from 'react';

// export function usePWAInstallPrompt() {
//   const [deferredPrompt, setDeferredPrompt] = useState(null);
//   const [isAppInstalled, setIsAppInstalled] = useState(false);

//   useEffect(() => {
//     const handleBeforeInstallPrompt = (e) => {
//       e.preventDefault();
//       setDeferredPrompt(e);
//     };

//     const handleAppInstalled = () => {
//       setIsAppInstalled(true);
//     };

//     window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
//     window.addEventListener('appinstalled', handleAppInstalled);

//     if (window.matchMedia('(display-mode: standalone)').matches) {
//       setIsAppInstalled(true);
//     }

//     return () => {
//       window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
//       window.removeEventListener('appinstalled', handleAppInstalled);
//     };
//   }, []);

//   const installApp = async () => {
//     if (!deferredPrompt) return false;
    
//     deferredPrompt.prompt();
//     const { outcome } = await deferredPrompt.userChoice;
//     setDeferredPrompt(null);
//     return outcome === 'accepted';
//   };

//   return { deferredPrompt, isAppInstalled, installApp };
// }