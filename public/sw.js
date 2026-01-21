'use strict';

self.addEventListener('install', (event) => {
  console.log('Service Worker: Install');
  // Skip waiting to activate new service worker immediately.
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activate');
  // Take control of all clients immediately.
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Basic network-first strategy
  event.respondWith(
    fetch(event.request).catch(() => {
      // You can add an offline page fallback here
      // For now, just let the browser handle the error
    })
  );
});
