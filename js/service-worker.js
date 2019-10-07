// service-worker.js

// CacheName
const cacheName = 'KDKApp_V1';

// Cache Resources
const cacheResources = [
  '/' ,
  './PwaTest.html' ,
  './js/audio_api.js'
]

// installイベント：必要なリソースをcacheに投入する
self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');

  var cachePromise = caches.open(cacheName).then(
    cache => cache.addAll(
      cacheResources.map(url => new Request(url, {credentials: 'same-origin'}))
      )
  );
  e.waitUntil(cachePromise);
});

// activeイベント：cacheのkeysにより、cacheのリソースを更新する
self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');

  var cachePromise = caches.keys().then(
    keys => Promise.all(keys.map(
      key => {
        if( key !== cacheName ){
          return caches.delete(key);
        }
      }))
    );
  e.waitUntil(cachePromise);
  return self.clients.claim();
});

// fetchイベント：リソースをアクセスすると、cacheにある場合、そのまま返す、存在しない場合、WEBサーバーへアクセス
self.addEventListener('fetch', function(e) {
  console.log('[ServiceWorker] Fetch');

  e.responseWith(caches.match(e.request).then(
      cache => cache || fetch(e.request)
    ).catch(
      err => {
      console.log ('cache not exists')
      return fetch(e.request);
    }));
});
