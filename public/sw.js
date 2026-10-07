const CACHE_NAME = "moneymap-cache-v1";

const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicon.png",
  "/logo-icon.png",
  "/pwa-192x192.png",
  "/pwa-512x512.png"
];

// Install: Cache core static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn("PWA pre-cache warning:", err);
      });
    })
  );
  self.skipWaiting();
});

// Activate: Clean up previous caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: Pass through dynamic API / Firebase calls, network-first for pages
self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Never intercept non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Never cache external APIs or Firebase auth endpoints
  if (
    request.url.includes("/api/") ||
    request.url.includes("identitytoolkit.googleapis.com") ||
    request.url.includes("securetoken.googleapis.com") ||
    request.url.includes("firestore.googleapis.com") ||
    request.url.includes("firebaseio.com")
  ) {
    return;
  }

  // Network first with cache fallback
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          networkResponse.type === "basic"
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }

        // SPA navigation fallback for offline reload
        if (request.mode === "navigate") {
          return caches.match("/index.html");
        }
      })
  );
});
