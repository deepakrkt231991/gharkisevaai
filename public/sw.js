const CACHE_NAME = 'grihseva-ai-pwa-cache-v1';

// On install, we don't pre-cache anything to keep it simple and avoid caching old data.
// The app will be cached on first visit.
self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
});

// On fetch, use a cache-then-network strategy
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((r) => {
      return r || fetch(e.request).then((response) => {
        return caches.open(CACHE_NAME).then((cache) => {
          // Do not cache API calls from genkit or other dynamic resources
          if (!e.request.url.includes('/genkit.dev') && e.request.method === 'GET') {
            cache.put(e.request, response.clone());
          }
          return response;
        });
      });
    })
  );
});

// On activate, clean up old caches
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if(key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            }));
        })
    );
});
