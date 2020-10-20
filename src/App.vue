<template>
  <div id="app" v-cloak>
    <router-view></router-view>
  </div>
</template>
<script>
import { GetRequest } from "./utils/common";
import { checkLogin } from "./api/user";
import { getQRCode } from "@/api/user";
export default {
  name: "App",
  created() {
    let req = GetRequest();
    let shareId = req.shareId ? req.shareId : "";
    let isLoginReload = req.isLogin ? req.isLogin : "";
    this.$store.commit("CHANGE_SHARE_ID", shareId);
    this.checkLogin()
    this.getQRCode()
  },
  methods: {
    checkLogin() {
      checkLogin().then(res => {
        if (res.data.code === 200) {
          this.$store.commit("CHANGE_USERNAME", res.data.data.username);
          this.$store.commit("CHANGE_VIPTYPE", res.data.data.vipType);
          this.$store.commit("USER_LOGIN_CHANGE", true);
          this.$store.commit("LOGIN_MODAL_TOGGLE", { toggle: false });
        }
      });
    },
    async getQRCode() {
      let { data: res } = await getQRCode();
      if (res.code === 200) {
        const list = res.data.list;
        this.$store.commit(
          "CHANGE_BDQRCODEIMG",
          list.filter(item => item.type === 8)[0].img
        );
        const haveBdList = Object.keys(res.data).filter(
          item => res.data[item] === 1
        );
        let luckyBdImg;
        const bdMap = {
          jingdianbao: 0,
          renqibao: 1,
          shikebao: 2,
          kanjiabao: 3,
          guanggaobao: 4,
          ruzhubao: 5,
          duanxinbao: 6,
          fuwubao: 7,
          jingdianbao: 8
        };
        if (haveBdList.length) {
          // 判断是有有归属没有就默认人气宝
          const target = haveBdList[0];
          luckyBdImg = list.filter(item => item.type === bdMap[target])[0].img;
          this.$store.commit("CHANGE_LUCKY_BD_IMG", luckyBdImg);
        } else {
          luckyBdImg = list.filter(item => item.type === 1)[0].img;
          this.$store.commit("CHANGE_LUCKY_BD_IMG", luckyBdImg);
        }
      }
    },
  }
};
</script>
<style>
@import "./assets/css/reset.css";
@import url("//at.alicdn.com/t/font_635625_mrwonherzt.css");
@import "./assets/css/common.scss";
</style>

