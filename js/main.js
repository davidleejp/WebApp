
const keyLastRequestUrl = 'cache-web-last';

var lastRequestUrl = '';
function getLastRequestURL(){
    if (lastRequestUrl && lastRequestUrl !== '') {
        return lastRequestUrl;
    }
    return getLocalStorage(keyLastRequestUrl);
}

function getLocalStorage(key) {
    return localStorage.getItem(key);
}

function setLocalStorage(key, val) {
    console.log('key:' + key + '; val:' + val);
    return localStorage.setItem(key, val);
} 

// 本画面のURLをLocalStorageに保存する
window.addEventListener('load', (event) => {
    lastRequestUrl = getLastRequestURL(keyLastRequestUrl);
    setLocalStorage(keyLastRequestUrl, location.href || '');
})