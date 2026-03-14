// Minimal offline cache for index + main tool
const CACHE_NAME = 'numberplace-pwa-v1';
const ASSETS = [
  './',
  './index.html',
  './NumberPlace.html',
  './manifest.json'
];

self.addEventListener('install', (event)=>{
  event.waitUntil((async()=>{
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(ASSETS);
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (event)=>{
  event.waitUntil((async()=>{
    const keys = await caches.keys();
    await Promise.all(keys.map(k => (k===CACHE_NAME)?null:caches.delete(k)));
    self.clients.claim();
  })());
});

self.addEventListener('fetch', (event)=>{
  const req = event.request;
  event.respondWith((async()=>{
    const cached = await caches.match(req, {ignoreSearch:true});
    if(cached) return cached;
    try{
      const fresh = await fetch(req);
      return fresh;
    }catch(e){
      // fallback to index
      return caches.match('./index.html');
    }
  })());
});
