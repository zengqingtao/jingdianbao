export default class Socket {
    constructor(wsUrl) {
        this.websock = null;
        this._init(wsUrl)
    }

    _init(wsUrl) {
        this.websock = new WebSocket(wsUrl);
    }

    onOpen() {
        return new Promise((resolve, reject) => {
            this.websock.onopen = function () {
                resolve({code: 200, data: "", msg: "连接成功"});
            }
        })
    }

    onError() {
        return new Promise((resolve, reject) => {
            this.websock.onerror = function (e) {
                reject(e);
            }
        })
    }

    //接收
    onMessage(cb) {
        this.websock.onmessage = (e)=>{
            try {
                cb(JSON.parse(e.data));
            }catch (e) {

            }
        };
    }

    onClose() {
        return new Promise((resolve, reject) => {
            this.websock.onclose = function (e) {
                resolve({code: e.code, data: "", msg: "连接关闭"});
            }
        })
    }

    onSend(sendData) {
        this.websock.send(sendData);
    }
}