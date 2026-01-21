const CACHE_NAME = `grihseva-ai-cache-v${new Date().toISOString()}`;
const URLS_TO_CACHE = [
  '/',
  '/manifest.json',
];

self.addEventListener('install', (event) => {
  // Don't skip waiting here, let the user decide.
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      await self.clients.claim();
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((name) => name.startsWith('grihseva-ai-cache-') && name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })()
  );
});

self.addEventListener('fetch', (event) => {
    // Stale-while-revalidate strategy
    event.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.match(event.request).then((cachedResponse) => {
                const fetchedResponsePromise = fetch(event.request).then((networkResponse) => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
                return cachedResponse || fetchedResponsePromise;
            });
        })
    );
});


self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
