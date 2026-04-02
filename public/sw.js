const CACHE_NAME = 'Cherri+-v2'; // Bumped version
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/vite.svg'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting(); // Force the new service worker to become active immediately
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim(); // Take control of all pages immediately
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Bypass Service Worker for API calls and external scripts (like Razorpay)
  // This prevents issues with authentication, data fetching, and third-party integrations.
  if (
    url.pathname.startsWith('/api/') ||
    url.hostname.includes('razorpay.com') ||
    url.hostname !== self.location.hostname
  ) {
    return; // Returning nothing here lets the browser handle the fetch naturally
  }

  // 2. Cache-First strategy for static assets, Network-First or Bypass for everything else
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      // If not in cache, try network
      return fetch(event.request).then((fetchResponse) => {
        // Only cache successful GET requests for local assets
        if (
          event.request.method === 'GET' &&
          fetchResponse.status === 200 &&
          url.hostname === self.location.hostname &&
          !url.pathname.startsWith('/src/') // Don't cache raw source files in development
        ) {
          const responseToCache = fetchResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return fetchResponse;
      }).catch((err) => {
        // IMPORTANT: NEVER return undefined in respondWith.
        // If fetch fails and we have no cache, we should return a fallback or a network error.
        console.error('[SW] Fetch failed:', err);
        // Returning a basic "offline" response is better than a TypeError crash
        if (event.request.mode === 'navigate') {
          return new Response('<h1>Offline</h1><p>Check your internet connection.</p>', {
            headers: { 'Content-Type': 'text/html' }
          });
        }
        // For other requests, just let the error propagate by not returning an invalid object
        throw err;
      });
    })
  );
});
