// 写真ファイルの操作API

const MAX_WIDTH = 1024;
const MAX_HEIGHT = 768;
const COMPRESS_LEVEL = 0.8;


var resize;
// 写真サイズ取得
function getSize() {
    return resize;
}

// サイズ調整
function imgResize(file, callback) {
    var fileReader = new FileReader();
    fileReader.onload = function() {
        let imgObj = new Image();
        imgObj.src = this.result;
        imgObj.onload = function() {

            let maxSize = {
                width: MAX_WIDTH,
                height: MAX_HEIGHT,
                level: COMPRESS_LEVEL
            };
            let normalSize = {width: this.naturalWidth, height: this.naturalHeight};
            resize = getResize(normalSize, maxSize);
            if (!resize.resized) return callback(file);
            
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            if (window.navigator.userAgent.indexOf('iPhone') > 0) {
                canvas.width = resize.height;
                canvas.height = resize.width;
                ctx.rorate(90 * Math.PI / 180);
                ctx.drawImage(imgObj, 0, -resize.height, resize.width, resize.height);
                resize = {width: resize.height, height: resize.height};
            } else {
                canvas.width = resize.width;
                canvas.height = resize.height;
                ctx.drawImage(imgObj, 0, 0, resize.width, resize.height);
            }
            let base64 = canvas.toDataURL('image/jpeg', maxSize.level);
            convertBlob(window.atob(base64.split(',')[1]), callback);
        }
    };
    fileReader.readAsDataURL(file);
}

// Blobへの転換処理
function convertBlob(base64, callback) {
    let buffer = new ArrayBuffer(base64.length);
    let ubuffer = new Uint8Array(buffer);
    for (let i = 0; i < base64.length; i++) {
        ubuffer[i] = base64.charCodeAt(i)
    }
    let blob;
    try {
        blob = new Blob([buffer], { type: 'image/jpg' });
    } catch (e) {
        window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
        if (e.name === 'TypeError' && window.BlobBuilder) {
            let blobBuilder = new BlobBuilder();
            blobBuilder.append(buffer);
            blob = blobBuilder.getBlob('image/jpg');
        }
    }
    callback(new window.File([blob], getGuid() + '.jpg', { type: 'image/jpg' }));
}

// 指定最大サイズにより、写真の等比率サイズを算出
function getResize(normalSize, maxSize) {
    const {width, height} = normalSize;
    if (width > maxSize.width || height > maxSize.height) {
        let multiple = Math.max(width / maxSize.width, height / maxSize.height);
        return {width: parseInt(width / multiple), height: parseInt(height / multiple), resized: true};
    }
    return {width: normalSize.width, height: normalSize.height, resized: false};
}

// GUID文字列取得
function getGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
}

// YYYYMMDDHHmmssfff文字列取得
function getDateTimeFormatString() {
    var now = new Date();
    var res = '' + now.getFullYear() + padZero(now.getMonth() + 1) + padZero(now.getDate()) + padZero(now.getHours()) + 
        padZero(now.getMinutes()) + padZero(now.getSeconds());
    return res;
}

//先頭ゼロ付加
function padZero(num) {
    return (num < 10 ? '0' : '') + num;
}