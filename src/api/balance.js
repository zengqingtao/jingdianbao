import { ajaxGet, ajaxPost } from "../utils/ajax";

import config from '../config';

/**
 * 用户充值余额
 * @params page
 * @params userId   用户id
 * @params amount   充值金额
 * @params accountType   账户类型
 */
export const recharge = (params = {}) => {
    return ajaxPost(config.serverUrl + 'yushu-pay/order/recharge', params);
};


/**
 * 查询余额
 * @params userId   用户id
 */
export const balance = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-payreport/search/getAccountBalance', params);
};


/**
 * 查询余额明細
 * @params accountType   账户类型 1京店宝账户 2押金账户
 * @params endTime 结束时间
 * @params orderFrom   订单所属产品
 * @params orderType   收支类型 充值0,消费1,消费退款2,转账3,赠送4
 * @params page   页码
 * @params startTime   开始时间
 */
export const searchOrder = (params = {}) => {
    return ajaxPost(config.serverUrl + 'yushu-payreport/search/listOrder', params);
};


/**
 * 押金余额转到京店宝账户
 * @params amount 转款金额
 */
export const depositToBalance = (params = {}) => {
    return ajaxPost(config.serverUrl + 'yushu-pay/order/toJingdinabao', params);
};

/**
 * 获取押金转账户余额申请列表
 */
export const getDepositApply = (params = {}) => {
    return ajaxPost(config.serverUrl + 'yushu-pay/order/getDepositApply', params);
};

/**
 * 撤回押金转账户余额
 * @params orderId 订单id
 */
export const toJingdinbaoCancel = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-pay/order/toJingdinbaoCancel', params);
};

/**
 * 查询押金余额与冻结资金
 */
export const getDepositBalance = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-payreport/search/getDepositBalance', params);
};

/**
 * 购买会员余额查询
 * @params userId   用户id
 */
export const getBalanceMoney = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-server/jdbUserVip/getBalanceMoney', params);
};
/**
 * 购买会员
 * @params userId   用户id
 */
export const balancePayJdbVip = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-server/jdbUserVip/balancePayJdbVip', params);
};