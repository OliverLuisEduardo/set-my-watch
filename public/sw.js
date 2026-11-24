/**
 * Service worker mínimo, só para o app ser instalável. De propósito, NÃO
 * cacheia nada: com deploy contínuo, um bundle antigo em cache prenderia o
 * aparelho numa versão velha. Todo fetch vai direto para a rede.
 */
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
