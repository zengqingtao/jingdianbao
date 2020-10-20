<template>
  <div class="container">
    <div class="app-header">
      <div class="header-top">
        <div class="header-top-content">
          <div class="left --text-mouse-hover" @click="toHome">京店宝首页</div>
          <div class="right">
            <div class="user-msg-box" v-if="token!=''">
              <div class="personal" @click="toPersonal">个人中心</div>
              <div class="username">
                {{userName}}
                <div class="vip-type" v-show="vipTypeToText">
                  ({{vipTypeToText}}
                  <span class="blue" v-if="$store.state.vipIsNew">New</span>)
                </div>
              </div>
              <span class="handle-btn" @click="showLogout = true">退出</span>
            </div>
            <div class="user-msg-box" v-else>
              <span class="member personal" @click="toPersonal">个人中心</span>
              <span class="username handle-btn" @click="login">请登录</span>
              <span class="handle-btn" @click="$router.push('/register')">免费注册</span>
            </div>
          </div>
        </div>
      </div>
      <div class="header-nav">
        <div class="header-nav-content">
          <img class="logo" src="../../assets/images/header/logo.png" @click="toHome" alt />
          <div class="nav-box">
            <span class="nav-box-item" @click="$router.push('/member')">会员介绍</span>
            <span class="nav-box-item" @click="$router.push('/member/privilege')">我的特权</span>
            <el-dropdown @command="handleCommand">
              <div class="nav-box-item invit">
                <div>邀请注册</div>
                <div class="tips">送会员</div>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  command="/member/memberExchange"
                  v-baidu-count="{
                  event: '消费',
                  value: '邀请注册',
                  label: '邀请注册'
                }"
                >会员兑换</el-dropdown-item>
                <el-dropdown-item
                  command="/member/invitationDetails"
                  v-baidu-count="{
                  event: '消费',
                  value: '邀请注册',
                  label: '邀请注册'
                }"
                >邀请明细</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
    </div>
    <!-- 退出 -->
    <is-logout v-if="showLogout" @closeDialog="showLogout = false"></is-logout>
  </div>
</template>
<script>
import config from "../../config";
import ypkImg from "../../assets/images/header/ypk.png";
import { mapState } from "vuex";
import { getCookie } from "@/utils/cookie";
import EventBus from "@/utils/eventBus.js";
import isLogout from "../../views/dialog/isLogout";
export default {
  data() {
    return {
      apiConfig: config,
      showLogout: false
    };
  },
  computed: {
    ...mapState(["isLogin", "userName", "token"]),
    vipTypeToText() {
      // const textMap = {
      //   1: '基础会员',
      //   2: '试用会员',
      //   3: '金牌会员',
      //   4: '钻石会员',
      //   5: '皇冠会员',
      //   default: ""
      // };
      const textMap = {
        1: "普通会员",
        2: "标准会员",
        3: "高级会员",
        default: ""
      };
      return textMap[this.$store.state.vipType];
    }
  },
  components: {
    isLogout
  },
  created() {
    // 监听登录是否是从登录页登录，登录页登录需要刷新一下首页才能显示用户信息
    // EventBus.$on("login", () => {
    // location.reload();
    // });
  },
  methods: {
    handleCommand(path) {
      if (this.isLogin) {
        this.$router.push(path);
      } else {
        this.$store.commit("LOGIN_MODAL_TOGGLE", {
          toggle: true,
          loginType: 2
        });
      }
    },
    toPersonal() {
      if (this.isLogin) {
        this.$router.push("/personal")
      } else {
        this.$store.commit("LOGIN_MODAL_TOGGLE", {
          toggle: true,
          loginType: 2
        });
      }
    },
    login() {
      let url = location.href;
      this.$router.push({
        path: "/login",
        query: {
          url
        }
      });
    },
    toHome() {  
      this.$router.push("/home")
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/ .el-dropdown-menu__item:hover {
  color: var(--DBlue) !important;
}
.app-header {
  position: sticky;
  width: 100%;
  top: 0;
  left: 0;
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
      .left {
        cursor: pointer;
      }
      .right {
        .user-msg-box {
          display: flex;
          .personal {
            cursor: pointer;
            &:hover {
              color: var(--DBlue);
            }
          }
          .username {
            display: flex;
            padding: 0 10px 0 20px;
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
        .me-center {
          margin: 0 20px;
        }
        span {
          cursor: pointer;
        }
        span:hover {
          color: var(--DBlue);
        }
      }
    }
  }
}
.header-nav {
  width: 100%;
  background-color: var(--themeColor);
  .header-nav-content {
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
        color: #fff;
        margin-right: 35px;
        font-size: 14px;
        cursor: pointer;
      }
      .nav-box-item:nth-child(2) {
        margin-right: 14px;
      }
      .invit {
        text-align: center;
        margin-right: 0;
        width: 100px;
        height: 18px;
        line-height: 18px;
        position: relative;
        .tips {
          position: absolute;
          top: -10px;
          right: -20px;
          width: 50px;
          height: 18px;
          line-height: 18px;
          background-color: #ff0;
          border-radius: 9px;
          color: #333;
          font-size: 10px;
        }
      }
    }
  }
}
// 权限不够弹框
.logoutDialog {
  .error-msg {
    text-align: center;
    line-height: 20px;
    color: var(--JBlue);
  }
  /deep/ .el-icon-close {
    width: 30px;
    height: 30px;
    line-height: 30px;
    color: #fff !important;
    border: 1px solid #fff;
    border-radius: 50%;
  }

  /deep/ .el-dialog__headerbtn {
    right: -40px;
    top: 0px;
  }
}
</style>