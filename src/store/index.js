import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
import { getCookie } from "@/utils/cookie";

Vue.use(Vuex);
const state = {
    loginModalToggle: false,
    loginRegisterType: 1,
    serviceModalToggle: false,
    isLogin: false,
    userName: getCookie('username') || '未知用户',
    shopName: '',
    password: "",
    shareId: '',
    vipType: -1,
    vipIsNew: false,
    token: getCookie('token') || '',
    bdQrCodeImg: '',
    luckyBdImg: '',
    buyMemberModalStatus: 0, //购买会员状态 0关闭2标准3高级
    memberInfo: {},
    messageInfo: {}, //吐槽与系统消息
};

export default new Vuex.Store({
    state,
    actions,
    mutations
})