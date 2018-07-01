let cacheName = 'v2';
let cacheFiles = [
    './',
    './index.html',
    './css/styles.css',
    './js/idb.js',
    './js/app.js',
    './js/scripts.js'
];

self.addEventListener('install', (e) => {
    console.log("[ServiceWorker] installed");

    e.waitUntil(
        caches.open(cacheName).then((cache) => {
            console.log('[ServiceWorker] Caching cacheFiles');
            return cache.addAll(cacheFiles);
        })
    );
});

self.addEventListener('activate', (e) => {
    console.log("[ServiceWorker] Activated");

    e.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(cacheNames.map((thisCasheName) => {
                if (thisCasheName !== cacheName) {
                    console.log("[ServiceWorker] Removing cache files from", thisCasheName);
                    return caches.delete(thisCasheName);
                }
            }))
        })
    )
});

self.addEventListener('fetch', (e) => {
    console.log("[ServiceWorker] Fetching", e.request.url);

    e.respondWith(
        caches.match(e.request).then((response) => {
            if(response) return response;
            return fetch(e.request);
        })
    );

});