const CACHE_NAME = 'retail-app-cache-v1';
const urlsToCache = [
  '/',
  'index.html',
  'receipt.html',
  'sales.html',
  'inventory.html',
  'style.css',
  'dashboard.js',
  'receipt.js',
  'sales.js',
  'inventory.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',ww
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNdNe6M2wE9N0Q3iGBZZHkGa5sA4XGhOi6DQ&s'
];

// Install the service worker and cache the app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Serve cached content when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});