import { ajaxGet, ajaxPost } from "../utils/ajax";
import config from '../config'


/**
 * 获取类目
 */
export const getItemCategory = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/miaosha/getItemCategory', params);
};

/**
 * 获取三级类目饼图
 * @params Int dateType 日期类型 1昨天 2近七天 3近30天
 * @params String firstCategory 一级类目
 * @params String secondCategory 二级类目
 * @params String thirdCategory 三级类目
 */
export const getThirdCategoryPieChart = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/miaosha/getThirdCategoryPieChart', params);
};

/**
 * 获取秒杀列表
 * @params Int page 页码 默认1
 * @params Int dateType 日期类型 1昨天 2近七天 3近30天
 * @params String firstCategory 一级类目
 * @params String secondCategory 二级类目
 * @params String thirdCategory 三级类目
 */
export const getMiaoshaList = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/miaosha/getMiaoshaList', params);
};
/**
 * 获取秒杀分析详情
 * @params Int id 秒杀商品id，秒杀列表中的id
 */
export const getMiaoshaDetail = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/miaosha/getMiaoshaDetail', params);
};
/**
 * 模拟商智登陆
 * @params String username
 * @params String password
 * @params Int id 秒杀id
 */
export const searchSzSaleNum = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/miaosha/searchSzSaleNum', params);
};
/**
 * 竞品关键词分析
 * @params String sku 
 */
export const competingKeyword = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-jdapi/api/competingKeyword', params);
};