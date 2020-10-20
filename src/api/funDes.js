import { ajaxGet, ajaxPost } from "../utils/ajax";
import config from '../config'
/**
 * 功能说明
 * @params String menuId 菜单编号
 */
export const funDes = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/news/getOneContent', params);
};
/**
 * 热门功能使用用户数
 * @params String
 */
export const userNum = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-bi-system/userAnaly/userNum', params);
};