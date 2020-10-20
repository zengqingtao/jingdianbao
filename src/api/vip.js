import {ajaxGet, ajaxPost} from "../common/js/ajax";
import config from '../config';


/**
 * 发起充值
 */
export const chargeForVip = (params) => {
    return ajaxGet(config.serverUrl + 'yushu-server/vipOrder/chargeForVip',params);
};
