
const keyLastRequestUrl = 'cache-web-last';


// LocalStorageから最終リクエストのURLを取得
var lastRequestUrl = '';
function getLastRequestURL() {
    try {
        if (lastRequestUrl && lastRequestUrl !== '') {
            return lastRequestUrl;
        }
        return getLocalStorage(keyLastRequestUrl);
    } catch(err) {
        console.log(err);
        return undefined;
    }
}

// 最終リクエストのURLをLocalStorageに保存
function setLastRequestURL(url) {
    setLocalStorage(keyLastRequestUrl, url)
}

// LocalStorage情報取得
function getLocalStorage(key) {
    let val = localStorage.getItem(key);
    if (!val) return val;
    let data = JSON.parse(val);
    if (new Date(data.expire) < new Date()) {
        localStorage.removeItem(key);
        return undefined;
    }
    return data.value;
}

// LocalStorage設定
function setLocalStorage(key, val, expire) {
    if (!expire || isNaN(Date.parse(expire))) {
        expire = new Date();
        expire.setMonth(expire.getMonth() + 1); // 有効期間1ヶ月
        // console.log(expire);
    }
    let data = {
        value: val,
        expire: new Date(expire)
    }
    localStorage.setItem(key, JSON.stringify(data));
} 

// on / off Lineの対応
function updateOnlineStatus() {
    let onlineFlg = navigator.onLine;
    console.log('onLine status:', onlineFlg);
}

// 画面起動時、該当画面のURLをLocalStorageに保存する
window.addEventListener('load', (event) => {
    lastRequestUrl = getLastRequestURL(keyLastRequestUrl);
    setLastRequestURL(location.href || '');
});

// オンラインイベント
window.addEventListener('online', updateOnlineStatus);

// オフラインイベント
window.addEventListener('offline', updateOnlineStatus);