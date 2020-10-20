import {ajaxGet, ajaxPost} from "../utils/ajax";
import config from '../config'

/**
 * 获取模块列表
 * @params parentId
 */
export const getJdbProductModule = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-operation/feedback/getJdbProductModule', params);
};

/**
 * 提交吐槽内容
 * @params moduleIds
 * @params content
 */
export const addFeedback = (params = {}) => {
    return ajaxPost(config.serverUrl + 'yushu-operation/feedback/addFeedback', params);
};
/**
 * 京店宝获取吐槽列表
 * @params page 页码
 * @params type 1为活动消息 2系统消息
 * @params time 有时间传时间 没时间不传
 */
export const getFeedbackShowList = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-operation/message/getMessageShowList', params);
};


/**
 * 查看有无反馈消息
 */
export const checkHaveNews = (params = {}) => {
    return ajaxGet(config.serverUrl+'yushu-operation/message/checkHaveNews', params);
};

