
<template>
  <div class="login-modal">
    <div class="title">账户登录</div>
    <p class="err-msg">{{errorMsg}}</p>
    <el-input v-model="form.phone" placeholder="请输入手机号" @keyup.enter.native="login"></el-input>
    <el-input v-model="form.pwd" type="password" placeholder="请输入密码" @keyup.enter.native="login"></el-input>
    <el-button type="primary" class="--btn-primary" onfocus="this.blur()" @click="login">登录</el-button>
    <div class="btn-box">
      <span @click="$router.push('/register')">注册账号</span>
      <span @click="$router.push('/resetpwd')">忘记密码</span>
    </div>
  </div>
</template>
<script>
import EventBus from "@/utils/eventBus.js";
import { loginPhone, logout, getJdbUserVip } from "../../api/user";
export default {
  data() {
    return {
      errorMsg: "",
      form: {
        phone: "",
        pwd: ""
      }
    };
  },
  methods: {
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
          // 登录做三个存储 用户名  token  已登录bool
          this.$store.commit("CHANGE_USERNAME", res.data.username);
          this.$store.commit("CHANGE_TOKEN", res.data.token);
          this.$store.commit("USER_LOGIN_CHANGE", true);
          let path = location.href;
          path = path.split("#")[0];
          let url = this.$route.query.url ? this.$route.query.url : path;
          await this.getMemberInfo();
          location.href = url;
          // EventBus.$emit("login")
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
.login-modal {
  width: 420px;
  height: 480px;
  background-color: #fff;
  border-radius: 4px;
  display: flex;
  position: relative;
  padding: 69px 30px 0;
  flex-direction: column;
  align-items: center;
  background: url("../../assets/images/login/login-logo.png") no-repeat;
  background-color: #fff;
  background-size: 150px;
  background-position: 270px 0;
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
    padding-bottom: 45px;
  }
  .err-msg {
    height: 14px;
    margin-top: -20px;
    font-size: 14px;
    color: #f56c6c;
  }
  /deep/ .el-input__inner {
    height: 46px;
    font-size: 16px;
    margin-top: 20px;
  }
  /deep/ input:-webkit-autofill {
    box-shadow: 0 0 0px 1000px white inset !important;
  }

  /deep/ .el-button {
    width: 100%;
    margin-top: 70px;
  }
  .btn-box {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    font-size: 16px;
    color: #999;
    padding-top: 50px;
    span {
      margin-left: 15px;
      cursor: pointer;
    }
  }
}
</style>
