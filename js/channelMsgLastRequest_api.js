
const keyLastRequestUrl = 'cache-web-last';
const channelName = 'cacheUpdated';

function getLastRequestURL(){
    return getLocalStorage(keyLastRequestUrl);
}

function getLocalStorage(key) {
    return localStorage.getItem(key);
}

function setLocalStorage(key, val) {
    console.log('key:' + key + '; val:' + val);
    return localStorage.setItem(key, val);
} 

// 最後リクエストURLを保存
window.addEventListener('load', (event) => {
    const updatesChannel = new BroadcastChannel(channelName);
    updatesChannel.onmessage = (event) => {
        const {cacheName, updatedURL} = event.data.payload;
        if (updatedURL && updatedURL !== '') {
            setLocalStorage(keyLastRequestUrl, updatedURL);
        }
    };
})
