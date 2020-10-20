import axios from 'axios';
import config from '../../config';
import { getCookie } from "./cookie";
const CryptoJS = require('crypto-js');
import { Encrypt } from "./secret";

const SecurityKey = CryptoJS.MD5(Math.round(new Date() / 1000).toString().slice(1)).toString();
export const ajaxGet = (url = "", params = {}, ) => {
    let token = getCookie('token') ? getCookie('token') : '';
    return axios({
        method: "GET",
        url,
        params: params.params,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "token": token,
            "os-type": 1,
            SecurityKey,
            SecurityCode: Encrypt(SecurityKey),
        },
    });
};

export const ajaxPost = (url, params, formData = '') => {
    let token = getCookie('token') ? getCookie('token') : '';
    return axios({
        method: "POST",
        url,
        data: params,
        headers: {
            'Content-Type': formData === '' ? 'application/json;charset=UTF-8' : formData,
            "token": token,
            "os-type": 1,
            SecurityKey,
            SecurityCode: Encrypt(SecurityKey),
        },
    });
};