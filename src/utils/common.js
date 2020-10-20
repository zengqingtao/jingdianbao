export function skuReg(skuUrl = '') {
    let reg = new RegExp('(^|\\\\.com|)[1-9]\\d*(^|\\\\.html|)');
    if (!isNaN(skuUrl)) {
        return skuUrl;
    } else {
        if (skuUrl.match(reg)) {
            return skuUrl.match(reg)[0];
        } else {
            return false
        }
    }
}

export const isInt = (str) => {
    let reg = new RegExp('^[1-9]\\d*$');
    return reg.test(str);
};

export const setLocal = (key, value) => {
    if (arguments.length < 2) return false;
    if (typeof value === 'object') {
        value = JSON.stringify(value)
    }
    localStorage.setItem(key, value);
    return true
};

export const getLocal = (key) => {
    if (!key) return;
    return JSON.parse(localStorage.getItem(key)) ? JSON.parse(localStorage.getItem(key)) : [];
};

export const setLocalJson = (name = '', data = '', limit = 5) => {
    if (data) {
        let keywordItem = { value: data };
        let localKeywordList = getLocal(name) || [];
        for (let i = 0; i < localKeywordList.length; i++) {
            if (localKeywordList[i].value === data) return;
        }
        if (localKeywordList.length >= limit) {
            localKeywordList.pop();
        }
        localKeywordList.unshift(keywordItem);
        localStorage.setItem(name, JSON.stringify(localKeywordList));
    }
}

export function GetRequest() {
    let url = location.search; //获取url中"?"符后的字串
    let theRequest = {};
    if (url.indexOf("?") !== -1) {
        let str = url.substr(1);
        let strs = str.split("&");
        for (let i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

export function copyUrl2(url) {
    let oInput = document.createElement('input');
    oInput.value = url;
    document.body.appendChild(oInput);
    oInput.select(); // 选择对象
    document.execCommand("Copy"); // 执行浏览器复制命令
    oInput.className = 'oInput';
    oInput.style.display = 'none';
}

export const getNowDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}年${month}月${day}日`;
};

export const formatTime = timestamp => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
};

const formatNumber = n => {
    n = n.toString();
    return n[1] ? n : '0' + n
};
//获取指定某年某月的总天数
export const getDaysInOneMonth = (year, month) => {
    month = parseInt(month, 10);
    let d = new Date(year, month, 0);
    return d.getDate();
};

//获取每个月第一天是周几
export const getWeekDay = (year, month) => {
    let d = new Date();
    d.setYear(year);
    d.setMonth(month - 1);
    d.setDate(1);
    return d.getDay();
};
export const secondToDate = (result) => {
    let h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
    let m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
    let s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
    return h + ":" + m + ":" + s;
};

export function isPC() {
    let userAgentInfo = navigator.userAgent;
    let Agents = ["Android", "iPhone",
        "SymbianOS", "Windows Phone",
        "iPad", "iPod"
    ];
    let flag = true;
    for (let v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}
export function shopUrlReg(url = '') {
    // 京东
    let regex1 = /^https:\/\/([\w]([\w\-]{0,61}[\w])?\.)+jd\.com/, //https://******.jd.com
        //https://mall.jd.com/index-******.html 或 https://mall.jd.hk/index-******.html
        regex2 = /^https:\/\/mall\.jd\.(com|hk)\/index-([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\.html/,
        // 淘宝天猫 https://******.taobao.com 或 https://******.tmall.com 或 https://******.tmall.hk
        regex3 = /^https:\/\/([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*((\.taobao\.com)|(\.tmall\.com)|(\.tmall\.hk))/,
        // 拼多多 http(https)://mobile.yangkeduo.com/mall_page.html
        regex4 = /(^http:|^https:)\/\/mobile\.yangkeduo\.com\/mall_page\.html/;
    let bool =
        regex1.test(url) ||
        regex2.test(url) ||
        regex3.test(url) ||
        regex4.test(url)
    return bool
}