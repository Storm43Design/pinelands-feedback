/* Pinelands Exco Dashboard — minimal service worker.
   Caches the app shell so it installs and opens instantly.
   Live data is always fetched fresh from the network. */
var CACHE = 'ptm-exco-v1';
var SHELL = ['exco-dashboard.html', 'manifest.json'];

self.addEventListener('install', function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(SHELL); }));
  self.skipWaiting();
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){ return k !== CACHE; })
                             .map(function(k){ return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e){
  var url = e.request.url;
  // Never cache the results endpoint — always live.
  if(url.indexOf('/exec') > -1 || url.indexOf('script.google') > -1){ return; }
  e.respondWith(
    caches.match(e.request).then(function(hit){
      return hit || fetch(e.request);
    })
  );
});
