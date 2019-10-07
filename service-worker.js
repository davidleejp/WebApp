// service-worker.js

// ドメイン名称
var domainNM = 'davidleetre.github.io';
// リソースCacheName
var cacheName4Res = 'KDKApp_V1';
// WebAPI CacheName
var cacheName4API = 'KDKApi_V1';

// cache必要なリソース
var cacheResources = [
  '/WebApp/', 
  '/WebApp/login.html', 
  '/WebApp/manifest.json', 
  '/WebApp/PwaTest.html', 
  '/WebApp/PwaTest2.html', 
  '/WebApp/js/audio_api.js', 
  '/WebApp/image/lifecycle.gif'
];

// cache必要なWEBAPI　url
var cacheRequestUrls = [
  '/WebApp/webdata.html'
];

// installイベント：必要なリソースをcacheに投入する
self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  console.log('[ServiceWorker] Cache Start');
  // cacheResources.map(url => new Request(url, {credentials: 'same-origin'}))
  var cachePromise = caches.open(cacheName4Res).then(
    cache => cache.addAll(cacheResources)
  );
  e.waitUntil(cachePromise);
  console.log('[ServiceWorker] Cache Ended');
});

// activeイベント：cacheのkeysにより、cacheのリソースを更新する
self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');

  var cachePromise = caches.keys().then(
    keys => Promise.all(keys.map(
      key => {
        if( key !== cacheName4Res ){
          return caches.delete(key);
        }
      }))
    );
  e.waitUntil(cachePromise);
  return self.clients.claim();
});

// fetchイベント：リソースをアクセスすると、cacheにある場合、そのまま返す、存在しない場合、WEBサーバーへアクセス
self.addEventListener('fetch', function(e) {
  let requestUrl = e.request.url;
  console.log('[ServiceWorker] Fetch：' + requestUrl);
  if ( !requestUrl.match( domainNM ) ) return;

  let needCache = cacheRequestUrls.some(url => requestUrl.indexOf(url) > -1);
  if ( needCache ) {
    caches.open(cacheName4API).then(
      cache => fetch(e.request).then(
        response => {
          cache.put(requestUrl, response.clone());
          return response;
      })
    )
  }
  else {
    e.respondWith(caches.match(requestUrl).then(
      cacheResponse => {
        // 存在する場合、リターン
        if (cacheResponse) {
          return cacheResponse;
        }
        // cacheに追加
        fetch(e.request).then(
          response => {
            // responseチェック
            if ( !response || response.status !== 200 || response.type !== 'basic' ) {
              return response;
            }
            
            // cacheに追加
            var response2Cache = response.clone();
            caches.open(cacheName4Res).then(cache => cache.put(requestUrl, response2Cache));
            return response;
          }
        );
      }).catch(
      err => {
      console.log ('cache not exists')
      return fetch(e.request);
    })
    );
  }
});
