
const keyLastRequestUrl = 'cache-web-last';

var lastRequestUrl = '';
function getLastRequestURL(){
    if (lastRequestUrl && lastRequestUrl !== '') {
        return lastRequestUrl;
    }
    return getLocalStorage(keyLastRequestUrl);
}

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

function setLocalStorage(key, val, expire) {
    if (!expire || isNaN(Date.parse(expire))) {
        expire = new Date();
        expire.setMonth(expire.getMonth() + 1);
        console.log(expire);
    }
    let data = {
        value: val,
        expire: new Date(expire)
    }
    localStorage.setItem(key, JSON.stringify(data));
} 

// 本画面のURLをLocalStorageに保存する
window.addEventListener('load', (event) => {
    lastRequestUrl = getLastRequestURL(keyLastRequestUrl);
    setLocalStorage(keyLastRequestUrl, location.href || '');
})