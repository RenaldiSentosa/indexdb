const CACHE_NAME = 'crud-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json'
];

// Pasang Service Worker dan simpan aset ke Cache Storage
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Mengunduh aset ke dalam cache...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Aktivasi dan bersihkan cache lama jika ada update
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Strategi: Ambil dari Cache dulu, jika gagal baru ambil dari jaringan (Network)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});
