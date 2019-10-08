// service-worker.js
// version情報
const swVerb = '1.4';

// workbox-sw.jsをインポート
importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

// インポート失敗
if ( !workbox ) {
  // console.log('Workbox loaded failed');
  throw new Error('Workbox loaded failed');
}

// すぐアクティブ
workbox.core.skipWaiting();
workbox.core.clientsClaim();

/*******************リソースのキャッシュルール設定開始**********************/
// js / css
workbox.routing.registerRoute(
  /\.(js|css)$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'cache-web-resources-v' + swVerb,
  })
);

// WEBページ
workbox.routing.registerRoute(
  /\.(html|xhtml)(\?(\w+)=([^&]*)(&|$))?$/,
  new workbox.strategies.NetworkFirst({
    cacheName: 'cache-web-pages-v' + swVerb
  })
);

// イメージ
workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|webp|svg)$/,
  new workbox.strategies.CacheFirst({
    cacheName: 'cache-web-images-v' + swVerb,
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 120, // 最大ファイル数：120
        maxAgeSeconds: 30 * 24 * 60 * 60, // 最大キャッシュ時間：30日
      }),
    ],
  })
);
/*******************リソースのキャッシュルール設定完了**********************/

// activeイベント：古いcacheを削除する
self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activated');

  var activatePromise = caches.keys().then(
    keys => Promise.all(keys.map(
      key => {
        if( key.includes('cache-web-') && !key.includes(swVerb) ){
          return caches.delete(key);
        } else {
          return Promise.resolve();
        }
      }))
    );
  e.waitUntil(activatePromise);
  return self.clients.claim();
});
/*
self.addEventListener('fetch', function(e) {

  const requestURL = new URL(e.request.url);
  if (!e.request.referrer.includes(requestURL.hostname)) {
    return e.respondWith(fetch(e.request));
  }
})
*/