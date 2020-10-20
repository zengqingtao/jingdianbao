import Cookies from 'js-cookie';

const path = '/';
const jdbDomain = '.jingdianbao.cn';

function getDomain() {
    if (window.location.hostname !== 'localhost') {
        return `.${document.domain.split('.').slice(-2).join('.')}`
    } else {
        return document.domain.split('.').slice(-2).join('.');
    }
}

export function addCookie(name, value, day) {
    Cookies.set(name, value, { expires: day, domain: getDomain() });
}

export function getCookie(name) {
    let value = unescape(Cookies.get(name));
    if (!value || value === 'undefined') {
        value = '';
    }
    return value
}

export function removeCookie(name) {
    Cookies.remove(name, { domain: getDomain() });
    Cookies.remove(name, { domain: jdbDomain });
}