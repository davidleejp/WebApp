// service-worker.js
alert('test version');
self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  alert('Installed');
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
});

// 現状では、この処理を書かないとService Workerが有効と判定されないようです
self.addEventListener('fetch', function(event) {});
