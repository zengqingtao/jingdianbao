import { ajaxGet, ajaxPost } from "../utils/ajax";
import config from '../config'
import { addCookie, removeCookie } from "@/utils/cookie";

/**
 * 手机登录接口
 * @params String phoneNumber
 * @params String username
 * @params String password
 * @params String verificationCode
 * @params String shareId
 */
export const loginPhone = (params = {}) => {
    return new Promise((resolve, reject) => { //新版：newLogin ，旧版：loginPhone
        ajaxPost(config.serverUrl + 'yushu-server/newLogin', params)
            .then(res => {
                if (res.data.code === 200) {
                    addCookie('token', res.data.data.token);
                    addCookie('username', res.data.data.username);
                }
                resolve(res.data);
            })
            .catch(err => reject(err))
    })
};
/**
 * 注册
 * @params String phoneNumber
 * @params String username
 * @params String password
 * @params String verificationCode
 * @params String shareId
 */
export const register = (params = {}) => {
    return new Promise((resolve, reject) => {
        ajaxPost(config.serverUrl + 'yushu-server/register', params).then(res => {
                resolve(res.data);
            })
            .catch(err => reject(err))
    })
};
/**
 * 检查登陆
 */
export const checkLogin = () => {
    return ajaxGet(config.serverUrl + 'yushu-server/checkLogin');
};
/**
 * 检测是否已经弹框提示新会员功能
 */
export const checkNewVipIsNotified = () => {
    return ajaxGet(config.serverUrl + 'yushu-server/checkNewVipIsNotified');
};
/**
 * 登出接口
 */
export const logout = () => {
    return new Promise((resolve, reject) => {
        ajaxGet(config.serverUrl + 'yushu-server/logout').then(res => {
            if (res.data.code === 200) {
                removeCookie('token');
                removeCookie('username');
                resolve(res.data);
            }
        }).catch(err => reject(err))
    });
};

/**
 * 获取短信验证码
 * @params String phoneNumber
 */
export const getVerificationCode = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-server/msg/getVerificationCode', params);
};

/**
 * 校验验证码
 * @params String phoneNumber
 * @params Number code
 */
export const checkVerificationCode = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-server/msg/checkVerificationCode', params);
};
/**
 * 找回密码,验证码接口
 * @params String phoneNumber
 */
export const getFindPasswordCode = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-server/msg/getFindPasswordCode', params);
};

/**
 * 找回密码接口
 * @params String phoneNumber
 * @params String verificationCode
 * @params String newPassword
 */
export const findPassword = (params = {}) => {
    return ajaxPost(config.serverUrl + 'yushu-server/findPassword', params);
};

/**
 * 修改密码接口
 * @params String password
 * @params String newPassword
 * @params String newPasswordRepeat
 */
export const updatePassword = (params = {}) => {
    return ajaxPost(config.serverUrl + 'yushu-server/updatePassword', params);
};

/**
 * 绑定店铺接口
 * @params String shopName 店铺名
 * @params String shopIndex 店铺主页
 */
export const bindShop = (params = {}) => {
    return ajaxPost(config.serverUrl + 'yushu-server/bindShop', params);
};
/**
 * 修改店铺接口
 * @params String shopName 店铺名
 * @params String shopIndex 店铺主页
 */
export const updateBindShop = (params = {}) => {
    return ajaxPost(config.serverUrl + 'yushu-server/updateBindShop', params);
};

/**
 * 绑定店铺接口
 * @params String shopName 店铺名
 * @params String shopIndex 店铺主页
 */
export const addQuestionnaire = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-operation/questionnaire/add', params);
};



/**
 * 获取公告信息
 */
export const showNotice = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-operation/notice/showNotice', params);
};
/**
 * 获取BD二维码图片
 */
export const getQRCodeInvication = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-operation/qrCodeInvication/getQRCodeInvication', params);
};

/**
 * 获取人气宝展示二维码
 */
export const getQRCode = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-operation/qrCode/getQRCode', params);
};


/**
 * 修改自定义菜单
 */
export const changeUserMenu = (params = {}) => {
    return ajaxPost(config.serverUrl + 'yushu-server/userMenu/changeUserMenu', params);
};
/**
 * 获取用户自定义菜单
 */
export const getUserMenu = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-server/userMenu/getUserMenu', params);
};

/**
 * 获取会员信息
 */
export const getJdbUserVip = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-server/jdbUserVip/getUserVipInfo', params);
};

/**
 * 购买会员信息
 * @params type  Number 购买类型 1标准一个月 2标准一年 3高级半年 4高级一年
 */
export const chargeForBuyVip = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-server/jdbUserVip/chargeForVip', params);
};
/**
 * 查询购买会员抵扣价格
 * @params type  Number 购买类型 1标准一个月 2标准一年 3高级半年 4高级一年
 */
export const getChargeMoney = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-server/jdbUserVip/getChargeMoney', params);
};
/**
 * 验证店铺有效性
 * @params skuUrl  String skuUrl
 */
export const checkShopAndSku = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-server/jdbUserVip/checkShopAndSku', params);
};
/**
 * 获取验证店铺的验证码
 */
export const getSkuCheckCode = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-server/jdbUserVip/getSkuCheckCode', params);
};
/**
 * 获取兑换记录信息
 */
export const getUserVipExchangeInfo = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-server/jdbUserVip/getUserVipExchangeInfo', params);
};
/**
 * 兑换会员
 * @params type 兑换类型 1是7天标准会员 2是30天标准会员 3是30天高级会
 */
export const exchangeJdbVip = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-server/jdbUserVip/exchangeJdbVip', params);
};
/**
 * 获取标准会员过期时间
 */
export const getUserLevel2 = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-server/jdbUserVip/getUserLevel2', params);
};

/**
 * 阿明工具点击记录
 */
export const redirectMingTool = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-server/general/redirectMingTool', params);
};
/**
 * 上传头像
 */
export const uploadHeadImg = (params = {}) => {
    return ajaxPost(config.serverUrl + 'yushu-server/uploadImage', params);
};