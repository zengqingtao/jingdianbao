<template>
  <div class="container">
    <notice-group></notice-group>
    <div class="app-header">
      <div class="header-top">
        <div class="header-top-content">
          <div class="user-message" v-if="token!=''">
            <span>做京东用京店宝</span>
            <div class="username">
              {{userName}}
              <div class="vip-type" v-show="vipTypeToText">
                ({{vipTypeToText}}
                <span class="blue" v-if="$store.state.vipIsNew">New</span>)
              </div>
            </div>
            <span class="handle-btn" @click="showLogout = true">退出</span>
          </div>
          <div v-else class="user-message">
            <span>做京东用京店宝</span>
            <span class="username handle-btn" @click="login">请登录</span>
            <span class="handle-btn" @click="$router.push('/register')">免费注册</span>
          </div>
          <div class="btn-box">
            <div class="btn-box-item" @click="jump('/member')">会员中心</div>
            <div class="btn-box-item my-center" @click="toPersonal">
              <div>个人中心</div>
              <div class="point" v-if="messageInfo.active||messageInfo.system"></div>
            </div>
            <div class="btn-box-item contact-us">
              联系我们
              <div class="code-group-box">
                <div class="code-group">
                  <div class="code-item">
                    <div>咨询/投诉,联系我们</div>
                    <img :src="bdQrCodeImg" alt />
                    <div>扫一扫 加微信</div>
                  </div>
                  <div class="code-item">
                    <div>产品讲解/运营知识</div>
                    <img
                      src="https://yushukeji.oss-cn-shenzhen.aliyuncs.com/jdb_contact_us.jpg?123456"
                      alt
                    />
                    <div>扫一扫 关注公众号</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="header-nav">
        <div class="header-nav-content">
          <img
            class="logo"
            src="../assets/images/header/logo.png"
            @click="$router.push('/home')"
            alt
          />
          <div class="nav-box">
            <span class="nav-box-item" v-for="(item,index) in navList" :key="index">
              <a
                v-if="!item.imgUrl"
                :href="item.url"
                target="_blank"
                v-baidu-count="{
                  event: '外部跳转转化',
                  value: '上方导航栏',
                  label: `上方导航-${item.title}`
                }"
              >{{item.title}}</a>
              <a
                class="ypk-box"
                v-if="item.imgUrl"
                :href="item.url"
                target="_blank"
                v-baidu-count="{
                  event: '外部跳转转化',
                  value: '上方导航栏',
                  label: '上方导航-有品库'
                }"
              >
                <img :src="item.imgUrl" alt />
                <span>{{item.title}}</span>
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
    <!-- 弹框 -->
    <is-logout v-if="showLogout" @closeDialog="showLogout = false"></is-logout>
  </div>
</template>
<script>
import config from "../config";
import ypkImg from "../assets/images/header/ypk.png";
import { mapState } from "vuex";
import { getCookie } from "@/utils/cookie";
import EventBus from "@/utils/eventBus.js";

import isLogout from "../views/dialog/isLogout";
import { checkHaveNews } from "../api/feedback";
import noticeGroup from "./noticeGroup";
export default {
  data() {
    return {
      navList: [
        { title: "有品库", url: config.ypkUrl,imgUrl: ypkImg },
        { title: "人气宝", url: config.rqbUrl},
        { title: "流量集市", url: config.jkjsUrl},
        { title: "广告宝", url: config.ggbUrl},
        { title: "店长管家", url: config.dzgjUrl}
      ],
      showLogout: false
    };
  },
  computed: {
    ...mapState(["userName", "token", "bdQrCodeImg", "messageInfo", "isLogin"]),
    vipTypeToText() {
      const textMap = {
        1: "普通会员",
        2: "标准会员",
        3: "高级会员",
        default: "",
      };
      return textMap[this.$store.state.vipType];
    },
  },
  components: { isLogout, noticeGroup },
  mounted() {
    this.checkHaveNew();
  },
  methods: {
    //   检查是否有新消息
    async checkHaveNew() {
      let { data: res } = await checkHaveNews();
      if (res.code == 200) {
        let messageInfo = {
          active: res.data.active,
          system: res.data.system,
        };
        this.$store.commit("CHANGE_MESSAGE_STATUS", messageInfo);
      }
    },
    login() {
      let url = location.href;
      this.$router.push({
        path: "/login",
        query: {
          url,
        },
      });
    },
    logout() {
      logout().then((res) => {
        if (res.code == 200) {
          this.$store.commit("CHANGE_USERNAME", "");
          this.$store.commit("CHANGE_PASSWORD", "");
          this.$store.commit("USER_LOGIN_CHANGE", false);
          let url = location.href;
          url = url.split("#")[0] + "#/";
          location.href = url;
          location.reload();
        } else {
          this.$message.error("退出失败");
        }
      });
    },
    toPersonal() {
      if (this.isLogin) {
        this.$router.push("/personal");
      } else {
        this.$store.commit("LOGIN_MODAL_TOGGLE", {
          toggle: true,
          loginType: 2,
        });
      }
    },
    jump(path) {
      let url = location.href;
      url = url.split("#")[0] + "#";
      window.open(url + path);
    },
  },
};
</script>
<style lang="scss" scoped>
.app-header {
  position: sticky;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1000;
  margin-bottom: 20px;
  .header-top {
    width: 100%;
    background-color: #eee;
    .header-top-content {
      width: 1200px;
      margin: 0 auto;
      height: 30px;
      display: flex;
      justify-content: space-between;
      line-height: 30px;
      font-size: 12px;
      .user-message {
        display: flex;
        .username {
          display: flex;
          padding: 0 10px 0;
          .vip-type {
            padding-left: 3px;
            .blue {
              color: #4d75ff;
            }
          }
        }
        .handle-btn {
          color: var(--themeColor);
          cursor: pointer;
        }
      }
      .btn-box {
        display: flex;
        .my-center {
          margin: 0 20px;
          position: relative;
          .point {
            position: absolute;
            top: 5px;
            right: -4px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: #f00;
          }
        }
        .btn-box-item {
          cursor: pointer;
        }
        .btn-box-item:hover {
          color: var(--DBlue);
        }

        .contact-us {
          position: relative;
          &:hover {
            .code-group-box {
              display: block;
            }
          }
          .code-group-box {
            display: none;
            .code-group {
              position: absolute;
              right: 0;
              z-index: 10;
              background-color: #fff;
              box-shadow: 0px 2px 10px 0px rgba(146, 158, 177, 0.21);
              width: 310px;
              height: 180px;
              display: flex;
              padding: 20px 30px 15px;
              justify-content: space-between;
              .code-item {
                text-align: center;
                color: #333;
                font-size: 12px;
                line-height: 10px;
                img {
                  width: 90px;
                  height: 90px;
                  margin: 13px 0;
                }
              }
            }
          }
        }
      }
    }
  }
}
.header-nav {
  width: 100%;
  background-color: var(--themeColor);
  .header-nav-content {
    position: relative;
    display: flex;
    align-items: center;
    margin: 0 auto;
    width: 1200px;
    height: 70px;
    line-height: 70px;
    .logo {
      height: 35px;
      box-sizing: border-box;
      padding: 0 46px 0 32px;
      margin-right: 10px;
      cursor: pointer;
    }
    .nav-box {
      color: #fff;
      display: flex;
      align-items: center;
      .nav-box-item {
        margin-right: 35px;
        .ypk-box {
          display: flex;
          align-items: center;
          img {
            width: 14px;
            height: 14px;
            margin-right: 2px;
          }
        }
        a {
          font-size: 14px;
          font-weight: 400px;
          color: #fff;
        }
      }
    }
  }
}
</style>