const CACHE_NAME = 'cherriplus-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/src/main.jsx',
  '/src/App.jsx',
  '/src/index.css'
];

// Install Event
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install event...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching all assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate Event
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activate event...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Clearing old cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  // Check if we already have the request in cache
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((fetchResponse) => {
        // Optional: Cache new requests on the fly
        // if (event.request.url.startsWith('http')) {
        //   return caches.open(CACHE_NAME).then((cache) => {
        //     cache.put(event.request, fetchResponse.clone());
        //     return fetchResponse;
        //   });
        // }
        return fetchResponse;
      });
    }).catch(() => {
        // Offline fallback if needed
    })
  );
});
