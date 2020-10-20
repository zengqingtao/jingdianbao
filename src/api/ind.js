import {ajaxGet, ajaxPost} from "../utils/ajax";
import config from '../config';

/**
 * 获取兑换列表
 */
export const listUserInviteConsumeRecord = (params) => {
    return ajaxGet(config.serverUrl + 'yushu-server/invite/listUserInviteConsumeRecord',params);
};
/**
 * 获取邀请列表
 */
export const listUserInviteRecord = (params) => {
    return ajaxGet(config.serverUrl + 'yushu-server/invite/listUserInviteRecord',params);
};
