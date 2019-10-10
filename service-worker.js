// service-worker.js
// version情報
const swVerb = '2.8';

// workbox-sw.jsをインポート
importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

// インポート失敗
if ( !workbox ) {
  throw new Error('Workbox loaded failed');
}

// すぐアクティブ
workbox.core.skipWaiting();
workbox.core.clientsClaim();

/*******************リソースのキャッシュルール設定開始**********************/
// js / css / json
workbox.routing.registerRoute(
  /\.(js|css|json)(\?\w+=[\w|\.]+)?$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'cache-web-resources-v' + swVerb,
  })
);

// WEBページ
workbox.routing.registerRoute(
  /\.(html|xhtml)(\?)?[\w+=\w{0,}&?]{0,}$/,
  new workbox.strategies.NetworkFirst({
    cacheName: 'cache-web-pages-v' + swVerb,
    networkTimeoutSeconds: 3
    // plugins: [
    //   new workbox.broadcastUpdate.Plugin({
    //     'channelName': 'cacheUpdated',
    //   }),
    // ]
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

/*******************異常処理開始********************************************/
workbox.routing.setCatchHandler(({event}) => {
  switch (event.request.destination) {
    case 'document':
      return caches.match(OFFLINE_PAGE);
    break;
    // case 'image':
    //   return caches.match(FALLBACK_IMAGE_URL);
    // break;

    // case 'font':
    //   return caches.match(FALLBACK_FONT_URL);
    // break;
    default:
      // If we don't have a fallback, just return an error response.
      return Response.error();
  }
});
/*******************異常処理完了********************************************/


/*******************事前キャッシュル設定開始********************************/
const precacheName ='cache-web-pre-v' + swVerb;
const OFFLINE_PAGE = './offline.html';
const precacheUrls = [
  OFFLINE_PAGE
];
// installイベント：必要なリソースをcacheに投入する
self.addEventListener('install', function(e) {
  let cachePromise = caches.open(precacheName).then(
    cache => cache.addAll(precacheUrls)
  );
  // 待機状態のswがあれば、強制終了
  e.waitUntil(cachePromise);
});
/*******************事前キャッシュル設定完了********************************/

// activeイベント：古いcacheを削除する
self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activated');

  let activatePromise = caches.keys().then(
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

self.addEventListener('fetch', function(e) {

  const requestURL = new URL(e.request.url);
  if (!e.request.referrer.includes(requestURL.hostname)) {
    return e.respondWith(fetch(e.request));
  }
})