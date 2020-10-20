const LOGIN_MODAL_TOGGLE = 'LOGIN_MODAL_TOGGLE';
const SERVICE_MODAL_TOGGLE = 'SERVICE_MODAL_TOGGLE';
const CHANGE_RANKING_KEYWORD = 'CHANGE_RANKING_KEYWORD';
const USER_LOGIN_CHANGE = 'USER_LOGIN_CHANGE';
const CHANGE_USERNAME = 'CHANGE_USERNAME';
const CHANGE_PASSWORD = 'CHANGE_PASSWORD';
const CHANGE_VIPTYPE = 'CHANGE_VIPTYPE';
const CHANGE_VIPISNEW = 'CHANGE_VIPISNEW';
const CHANGE_TOKEN = 'CHANGE_TOKEN';
const CHANGE_SHARE_ID = 'CHANGE_SHARE_ID';
const BIND_SHOP_NAME = 'BIND_SHOP_NAME';
const CHANGE_BDQRCODEIMG = 'CHANGE_BDQRCODEIMG'
const CHANGE_LUCKY_BD_IMG = 'CHANGE_LUCKY_BD_IMG'
const CHANGE_BUY_MEMBER_STATUS = 'CHANGE_BUY_MEMBER_STATUS'
const CHANGE_MEMBER_INFO = 'CHANGE_MEMBER_INFO'
const CHANGE_MENUID = 'CHANGE_MENUID'
    // 新版↓
const rank_monitor_keyword = 'rank_monitor_keyword'
const rank_monitor_sku = 'rank_monitor_sku'
const search_index_list_keyword = 'search_index_list_keyword'
const CHANGE_MESSAGE_STATUS = 'CHANGE_MESSAGE_STATUS'
import { addCookie } from "@/utils/cookie";

export default {
    [LOGIN_MODAL_TOGGLE](state, params = { toggle: false, loginType: 1 }) {
        state.loginRegisterType = params.loginType;
        state.loginModalToggle = params.toggle;
    },
    [SERVICE_MODAL_TOGGLE](state, boolean = false) {
        state.serviceModalToggle = boolean;
    },
    [USER_LOGIN_CHANGE](state, boolean = false) {
        state.isLogin = boolean;
    },
    [CHANGE_USERNAME](state, username = '') {
        if (username) {
            addCookie('username', username, 99999);
            state.userName = username;
        } else {
            state.username = '';
        }
    },

    [CHANGE_PASSWORD](state, password = '') {
        state.password = password;
    },
    [CHANGE_SHARE_ID](state, shareId = '') {
        state.shareId = shareId;
    },
    [CHANGE_VIPTYPE](state, vipType) {
        state.vipType = vipType;
    },
    [CHANGE_VIPISNEW](state, vipIsNew) {
        state.vipIsNew = vipIsNew;
    },
    [CHANGE_TOKEN](state, token = '') {
        if (token) {
            addCookie('token', token, 99999);
            state.token = token;
        } else {
            state.token = '';
        }
    },
    // 绑定店铺
    [BIND_SHOP_NAME](state, shopName = '') {
        state.shopName = shopName;
    },
    [CHANGE_BDQRCODEIMG](state, bdQrCodeImg) {
        state.bdQrCodeImg = bdQrCodeImg
    },
    [CHANGE_LUCKY_BD_IMG](state, luckyBdImg) {
        state.luckyBdImg = luckyBdImg
    },
    [CHANGE_BUY_MEMBER_STATUS](state, status) {
        state.buyMemberModalStatus = status
    },
    [CHANGE_MEMBER_INFO](state, memberInfo) {
        state.memberInfo = memberInfo
    },
    [CHANGE_MENUID](state, id) {
        state.menuId = id;
        localStorage.setItem("menuId", id)
    },
    // 新版↓
    // 排名监控的关键词
    [rank_monitor_keyword](state, keyword = '') {
        state.rankMonitorKeyword = keyword;
    },
    // 排名监控的sku
    [rank_monitor_sku](state, sku = '') {
        state.rankMonitorSku = sku;
    },
    // 搜索指数榜关键词
    [search_index_list_keyword](state, keyword = '') {
        state.searchIndexListKeyword = keyword;
    },
    [CHANGE_MESSAGE_STATUS](state, messageInfo) {
        state.messageInfo = messageInfo;
    },
}