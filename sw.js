const CACHE='diario-v1';
const URLS=['/','/manifest.json','https://cdn.tailwindcss.com','https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js','https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.3/jspdf.plugin.autotable.min.js','https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js'];

self.addEventListener('install',function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(c){return c.addAll(URLS)})
  );
  self.skipWaiting();
});

self.addEventListener('activate',function(e){
  e.waitUntil(
    caches.keys().then(function(ks){
      return Promise.all(ks.map(function(k){
        if(k!==CACHE) return caches.delete(k);
        return Promise.resolve();
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch',function(e){
  e.respondWith(
    caches.match(e.request).then(function(r){
      return r || fetch(e.request).catch(function(){
        return new Response('Offline',{status:503});
      });
    })
  );
});