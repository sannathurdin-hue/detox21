const CACHE = 'detox21-v4';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

// Navigations (the app shell / index.html) always try the network first so
// deployed fixes show up immediately — the cache is only an offline fallback.
// Other static assets (icons, manifest) are cache-first since they rarely change.
self.addEventListener('fetch', e => {
  const isNavigation = e.request.mode === 'navigate' || e.request.url.endsWith('/index.html');

  if (isNavigation) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
          return res;
        })
        .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
