import { ajaxGet, ajaxPost } from "../utils/ajax";

import config from '../config';

// 资讯

/**
 * 搜索指数榜
 */
export const searchIndex = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/news/searchIndex', params);
};

/**
 * 添加关键词
 */
export const addKeyword = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/news/addKeyword', params);
};
/**
 * 获取关键词的上限数，已用数，可新增数
 */
export const getKeywordsInfo = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/news/getKeywords', params);
};
/**
 * 删除关键词
 */
export const deleteKeyword = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/news/deleteKeyword', params);
};

/**
 * 根据sku获取对应的关键词
 */
export const getKeywordsBySku = (params = {}) => {
    return ajaxGet(config.serverUrl + '/yushu-jdapi/api/getKeywords', params);
};
/**
 * 搜索书生
 * @params pageNo  页码
 * @params pageSize  一页最大条数
 */
export const getArticleList = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/news/getArticleList', params);
};
/**
 * 运营攻略
 * @params pageNo  页码
 * @params pageSize  一页最大条数
 * @params isTheLatest  是默认排序还是最新发布，默认为默认排序false，最新发布为true
 */
export const strategyList = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/news/strategyList', params);
};