import {ajaxGet, ajaxPost} from "../utils/ajax";
import config from '../config';


/**
 * 检查用户的抽奖次数
 */
export const checkUserDraw = (params = {}) => {
    return ajaxGet(config.serverUrl+'yushu-server/active/checkUserDraw', params);
};

/**
 * 获取月签到情况
 */
export const listMonthCheckIn = (params = {}) => {
    return ajaxGet(config.serverUrl+'yushu-server/active/listMonthCheckIn', params);
};

/**
 * 签到
 */
export const userCheckIn = (params = {}) => {
    return ajaxGet(config.serverUrl+'yushu-server/active/userCheckIn', params);
};
/**
 * 抽奖
 */
export const getDrawPrize = (params = {}) => {
    return ajaxGet(config.serverUrl+'yushu-server/active/getDrawPrize', params);
};
/**
 * 奖品列表
 */
export const useRule = (params = {}) => {
    return ajaxGet(config.serverUrl+'yushu-operation/drawRule/useRule', params);
};
/**
 * 获取展示的广告
 */
export const showAdv = (params = {}) => {
    return ajaxGet(config.serverUrl+'yushu-operation/advertisement/show', params);
};
/**
 * 获取展示的广告
 */
export const getTop10EarliestUser = (params = {}) => {
    return ajaxGet(config.serverUrl+'yushu-server/active/getTop10EarliestUser', params);
};
/**
 * 首页滚动获奖内容
 */
export const listNewDrawPrize = (params = {}) => {
    return ajaxGet(config.serverUrl+'yushu-server/active/listNewDrawPrize', params);
};
