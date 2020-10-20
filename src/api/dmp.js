import { ajaxGet, ajaxPost } from "../utils/ajax";
import config from '../config'
/**
 * 排名查询--dmp查询
 * @params String sku
 * @params Int dataType // 0: 访客数 1:下单量 2:转化率
 * @params int filterType //0：年龄 1：性别 2：操作系统 3：下单端口 4：地域排名
 * @params int flowFilterType //查流量的分类 0: 行业 1:店铺 2:单品
 * @params int moudle // 0: 行业 1:店铺 2:单品
 * @params int isFast // 1快速 0普通
 */
export const searchDmpMultiDateData = (params = {}) => {
    return ajaxPost(config.serverUrl + 'yushu-composite/dmp/searchDmpMultiDateData', params);
};
/**
 * 获取京麦二维码
 */
export const getDmpQrCode = () => {
        return ajaxGet(config.serverUrl + 'yushu-composite/dmp/getDmpQrCode')
    }
    /**
     *检测是否已经登陆
     */
export const checkDmpLoginSuccess = () => {
        return ajaxGet(config.serverUrl + 'yushu-composite/dmp/checkDmpLoginSuccess')
    }
    /**
     *检测当天是否登陆
     */
export const checkTodayIsLogin = () => {
        return ajaxGet(config.serverUrl + 'yushu-composite/dmp/checkTodayIsLogin')
    }
    /**
     *检测请求是否需要message显示显示快速请求
     */
export const checkIsNotifySpeed = () => {
        return ajaxGet(config.serverUrl + 'yushu-composite/dmp/checkIsNotifySpeed')
    }
    /**
     *查权重
     @params String keyword 关键词
     */
export const searchWeights = (params = {}) => {
    return ajaxPost(config.serverUrl + 'yushu-composite/dmp/searchWeights', params)
};
/**
 *查权重
 @params String sku 
 @params String keyword 关键词
 */
export const searchAnaly = (params = {}) => {
    return ajaxPost(config.serverUrl + 'yushu-composite/dmp/searchAnaly', params)
};
/**
 @description 关键词分析
 @params channel String 渠道：'全部渠道': 99, 'APP': 2, 'PC': 20, '微信': 3, '手Q': 4, 'M端': 1
 @params dayOption String 时间范围：近七天:0,近30天:1,近六个月:2,按日:3,按周:4,按月:5
 @params keyword String 关键词 
 */
export const keyWordAnaly = (params = {}) => {
    return ajaxPost(config.serverUrl + 'yushu-composite/dmp/keyWordAnaly', params)
};