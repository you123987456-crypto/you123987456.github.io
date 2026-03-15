// Minimal offline cache for index + both tools
const CACHE_NAME = 'local-tools-pwa-v2'; // ※更新反映のためバージョンを変えるの推奨
const ASSETS = [
  './',
  './index.html',
  './NumberPlace.html',
  './diary.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event)=>{
  event.waitUntil((async()=>{
    const cache = await caches.open(CACHE_NAME);
    // iconが無い場合 addAll が失敗するので、無いならASSETSから2行消してください
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
    // あなたの元SWと同じく、クエリ（?slot=... など）を無視してキャッシュ一致させる
    const cached = await caches.match(req, {ignoreSearch:true});
    if(cached) return cached;
    try{
      const fresh = await fetch(req);
      return fresh;
    }catch(e){
      // fallback to index
      return caches.match('./index.html', {ignoreSearch:true});
    }
  })());
});
