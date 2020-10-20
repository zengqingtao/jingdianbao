<template>
  <div class="container">
    <div class="dialog-box">
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="loginModalShow"
        :center="true"
        width="420px"
        height="408px"
        @close="closeDialog"
      >
        <div class="dialog-content">
          <div class="title">账户登录</div>
          <p class="err-msg">{{errorMsg}}</p>
          <el-input v-model="form.phone" placeholder="请输入手机号" @keyup.enter.native="login"></el-input>
          <el-input
            class="pwd-inp"
            v-model="form.pwd"
            type="password"
            placeholder="请输入密码"
            @keyup.enter.native="login"
          ></el-input>
          <el-button type="primary" onfocus="this.blur()" @click="login">登录</el-button>
          <div class="btn-box">
            <span @click="resetPwd">找回密码</span>
            <span @click="register">免费注册</span>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { loginPhone, logout,getJdbUserVip } from "../../api/user";
export default {
  data() {
    return {
      loginModalShow: true,
      errorMsg: "",
      form: {
        phone: "",
        pwd: ""
      }
    };
  },
  methods: {
    closeDialog() {
      this.$store.commit("LOGIN_MODAL_TOGGLE", { toggle: false });
      this.$emit("closeDialog");
    },
    resetPwd() {
      this.loginModalShow = false;
      this.$router.push("/resetpwd");
    },
    register() {
      this.loginModalShow = false;
      this.$router.push("/register");
    },
    login() {
      //登录
      if (this.form.phone == "") {
        return (this.errorMsg = "手机号不能为空");
      } else if (!/^1[3456789]\d{9}$/.test(this.form.phone)) {
        return (this.errorMsg = "手机号输入有误");
      } else if (this.form.pwd == "") {
        return (this.errorMsg = "密码不能为空");
      } else if (this.form.pwd.length < 6 || this.form.pwd.length > 32) {
        return (this.errorMsg = "密码位数必须在6至32之间");
      } else {
        this.errorMsg = "";
      }
      let params = {
        phoneNumber: this.form.phone,
        password: this.form.pwd,
        username: this.form.phone
      };
      loginPhone(params).then(async res => {
        if (res.code === 200) {
          this.$store.commit("CHANGE_USERNAME", res.data.username);
          this.$store.commit("CHANGE_TOKEN", res.data.token);
          this.$store.commit("USER_LOGIN_CHANGE", true);
          this.$store.commit("LOGIN_MODAL_TOGGLE", { toggle: false });
          await this.getMemberInfo()
          location.reload();
        } else {
          this.errorMsg = res.msg;
        }
      });
    },
    async getMemberInfo() {
      let { data: res } = await getJdbUserVip();
      if (res.code === 200) {
        this.$store.commit("CHANGE_VIPTYPE", res.data.vipLevelCode);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  z-index: 3000;
  box-sizing: border-box;
  .dialog-box {
    position: relative;
    /deep/ .el-dialog__header {
      padding: 0;
    }
    /deep/ .el-dialog--center .el-dialog__body {
      padding: 0 !important;
    }
    /deep/ .el-icon-close {
      width: 30px;
      height: 30px;
      line-height: 30px;
      color: #fff;
      border: 1px solid #fff;
      border-radius: 50%;
    }
    /deep/ .el-dialog__headerbtn {
      right: -40px;
      top: 0px;
    }
    .dialog-content {
      background: url("../../assets/images/login/login-logo.png") no-repeat;
      background-color: #fff;
      background-size: 150px;
      background-position: 270px 0;
      border-radius: 4px;
      padding: 30px 30px 26px;
      display: flex;
      position: relative;
      flex-direction: column;
      align-items: center;
      img {
        position: absolute;
        top: 0;
        right: 0;
        width: 177px;
        height: 125px;
        display: block;
        z-index: 999;
      }
      .title {
        color: #4d75ff;
        font-size: 26px;
        font-weight: bold;
        padding-bottom: 37px;
      }
      .err-msg {
        height: 14px;
        font-size: 14px;
        color: #f56c6c;
      }
      /deep/ .el-input__inner {
        height: 46px;
        font-size: 16px;
        margin-top: 14px;
      }
      /deep/ input:-webkit-autofill {
        box-shadow: 0 0 0px 1000px white inset !important;
      }
      .pwd-inp {
        margin-top: 6px;
      }
      /deep/ .el-button {
        width: 100%;
        height: 46px;
        font-size: 18px;
        font-weight: 400;
        margin-top: 30px;
      }
      /deep/ .el-button:hover {
        background-color: #3159e4;
      }
      .btn-box {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        font-size: 14px;
        color: #666;
        padding-top: 60px;
        span {
          margin-left: 15px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>