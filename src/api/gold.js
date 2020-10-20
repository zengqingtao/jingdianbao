import {ajaxGet, ajaxPost} from "../utils/ajax";
import config from '../config'

/**
 * 购买sku的忽略评价数
 * @params skuId
 */
export const buySkuComment = (params = {}) => {
    return ajaxPost(config.serverUrl + 'yushu-server/jb/buySkuComment', params);
};



/**
 * 购买sku的销量查询
 * @params skuId
 * @params type 1:购买30天销量 2.购买全部销量
 */
export const buySkuSale = (params = {}) => {
    return ajaxPost(config.serverUrl + 'yushu-server/jb/buySkuSale', params);
};


/**
 * 充值京币
 * @params type 充值套餐类型: 1-十元套餐 2-二十元套餐 3-三十元套餐 4-5十元套餐
 */
export const requestPay = (params = {}) => {
    return ajaxPost(config.serverUrl + 'yushu-server/pay/requestPay', params);
};

/**
 * 获取分享链接
 */
export const getUserShareUrl = () => {
    return ajaxGet(config.serverUrl + 'yushu-server/getUserShareUrl');
};

/**
 * 查询充值订单状态
 * @params orderNo 订单号
 */
export const queryOrderStatus = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-server/pay/queryOrderStatus', params);
};


/**
 * 获取收支明细
 * @params page
 * @params type 类型 0为全部 1为收入 2为支出
 * @params startTime
 * @params endTime
 */
export const getUserJbLog = (params = {}) => {
    return ajaxPost(config.serverUrl + 'yushu-server/jb/getUserJbLog', params);
};

