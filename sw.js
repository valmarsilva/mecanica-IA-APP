
const CACHE_NAME = 'oficina-ia-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/brandConfig.js'
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Força a ativação imediata do novo SW
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim()); // Assume o controle das abas imediatamente
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
