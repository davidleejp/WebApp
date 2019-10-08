// service-worker.js

// workbox-sw.jsをインポート
importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

// インポート失敗
if ( !workbox ) {
  console.log('Workbox loaded failed');
  return;
}

// すぐアクティブ
workbox.skipWaiting();
workbox.clientsClaim();

/*******************リソースのキャッシュルール設定開始**********************/
// js / css
workbox.routing.registerRoute(
  /¥.(js|css)$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'cache-web-resources',
  })
);

// WEBページ
workbox.routing.registerRoute(
  /¥.(html|xhtml)$/,
  new workbox.strategies.NetworkFirst({
    cacheName: 'cache-web-pages'
  })
);

// イメージ
workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|webp|svg)$/,
  new workbox.strategies.CacheFirst({
    cacheName: 'cache-web-images',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 120, // 最大ファイル数：120
        maxAgeSeconds: 30 * 24 * 60 * 60, // 最大キャッシュ時間：30日
      }),
    ],
  })
);
/*******************リソースのキャッシュルール設定完了**********************/

/*
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
  // 待機状態のswがあれば、強制終了
  e.waitUntil(cachePromise);
  return self.skipWaiting();
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
        } else {
          return Promise.resolve();
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

  // APICache対象フラグ
  let apiCacheFlg = cacheRequestUrls.some(url => requestUrl.indexOf(url) > -1);

  if ( apiCacheFlg ) {
    caches.open(cacheName4API).then(
      cache => fetch(e.request).then(
        response => {
          cache.put(event.request, response.clone());
          return response;
      })
    )
  }
  else {
    e.respondWith(
      fetch(requestUrl).then(
        response => {
          // 失敗の場合、Cache対象を優先にリターン
          if ( !response || response.status !== 200 || response.type !== 'basic' ) {
            return caches.open(cacheName4Res).then(cache => cache.match(e.request)) || response
          }
          // cacheに追加
          let responseClone = response.clone();
          caches.open(cacheName4Res).then(
            cache => cache.delete(e.request).then( // 削除
              () => cache.put(e.request, responseClone) // 追加
            )
          );
          // console.log('Cached：' + requestUrl);
          return response;
        }
      ).catch(
        async err => {
          // console.log('Load data from cache');
          const cache = await caches.open(cacheName4Res);
          return await cache.match(e.request);
        }
      )
    )
   }
})

// 異常対処
function OutputErrResponse(errMsg, errNum) {
  console.log('Error occurred');
  if (typeof(errMsg) == 'undefined' || errMsg == '') {
    errMsg = 'Service Unavailable';
    errNum = 503;
  }
  errMsg = '<h1>' + errMsg + '</h1>';
  return new Response(errMsg, {
    status: errNum,
    statusText: 'Service Unavailable',
    headers: new Headers({
      'Content-Type': 'text/html'
    })
  });
}
*/