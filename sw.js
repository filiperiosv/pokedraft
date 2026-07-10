const CACHE = 'pokedraft-v1';
const ASSETS = ['/', '/index.html', '/style.css', '/script.js', '/icon.svg',
  '/badges/boulder.png', '/badges/cascade.png', '/badges/thunder.png',
  '/badges/rainbow.png', '/badges/soul.png', '/badges/marsh.png',
  '/badges/volcano.png', '/badges/earth.png', '/badges/zephyr.png',
  '/badges/hive.png', '/badges/plain.png', '/badges/fog.png',
  '/badges/storm.png', '/badges/mineral.png', '/badges/glacier.png',
  '/badges/rising.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Network-first: busca versão nova da rede, cai no cache só se offline
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
