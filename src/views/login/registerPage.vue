<template>
  <div class="register-modal">
    <div class="title">注册账户</div>
    <el-input v-model="form.phone" placeholder="请输入手机号" type="number"></el-input>
    <el-input v-model="form.pwd" type="password" placeholder="请输入密码"></el-input>
    <el-input v-model="form.verifyCode" type="number" placeholder="请输入短信验证码">
      <template slot="suffix">
        <div class="verify-btn">
          <el-button
            type="text"
            style="height:46px;paddingRight:5px"
            @click="getVerifyCode"
            :disabled="VerifyDisabled"
          >{{verifyValue}}</el-button>
        </div>
      </template>
    </el-input>
    <el-input v-model="form.addr" placeholder="请输入店铺地址（必填）">
      <template slot="suffix">
        <div class="suffix">
          <el-tooltip tabindex="-1" popper-class="tooltip" placement="top">
            <i class="iconfont icon-wenhao"></i>
            <div slot="content" class="tooltip-content-box">
              <p>店铺链接格式参考：</p>
              <div class="mall-box">
                <div class="mall-name">京东：</div>
                <div>
                  <div>https://******.jd.com</div>
                  <div>https://mall.jd.com/index-******.html</div>
                  <div>https://mall.jd.hk/index-******.html</div>
                </div>
              </div>
              <div class="mall-box">
                <div class="mall-name">淘宝天猫：</div>
                <div>
                  <div>https://******.taobao.com</div>
                  <div>https://******.tmall.com</div>
                  <div>https://******.tmall.hk</div>
                </div>
              </div>
              <div class="mall-box">
                <div class="mall-name">拼多多：</div>
                <div>
                  <div>http://mobile.yangkeduo.com/mall_</div>
                  <div>page.html?mall_id=****</div>
                </div>
              </div>
            </div>
          </el-tooltip>
        </div>
      </template>
    </el-input>
    <el-input
      v-model="form.recommendCode"
      class="recommend-code"
      placeholder="填写好友/运营经理/讲师的推荐码，必填（任意一个即可）"
    ></el-input>
    <div class="perate-box">
      <img :src="bdCodeSrc" alt />
      <div class="perate-text">
        <p>添加运营经理</p>
        <p>免费制定首页计划和广告推广</p>
        <p>计划+领取推荐码</p>
      </div>
    </div>
    <div class="agreement">
      <el-checkbox v-model="form.agreeChecked"></el-checkbox>
      <p @click="form.agreeChecked=!form.agreeChecked">
        我已阅读并同意
        <span @click="openServiceModal">软件许可协议</span>
      </p>
    </div>
    <el-button
      type="primary"
      class="--btn-primary"
      onfocus="this.blur()"
      :loading="registerLoading"
      @click="register"
    >注 册</el-button>
    <div class="btn">
      <span>已有账号？</span>
      <span @click="$router.push('/login')">立即登录</span>
    </div>
  </div>
</template>

<script>
import EventBus from "@/utils/eventBus.js";
import {
  register,
  loginPhone,
  getVerificationCode,
  getQRCodeInvication,
  getJdbUserVip,
} from "../../api/user";
import { shopUrlReg } from "../../utils/common";
export default {
  name: "registerModal",
  data() {
    return {
      form: {
        phone: "", //手机号
        pwd: "", //密码
        verifyCode: "", //验证码
        addr: "", //店铺地址
        recommendCode: "", //推荐码
        agreeChecked: false, //是否同意软件许可协议
      },
      errorMsg: "",
      verifyValue: "获取验证码",
      VerifyDisabled: false,
      bdCodeSrc: "", //运营经理二维码
      registerLoading: false,
    };
  },
  created() {
    this.getBdCodeSrc();
  },
  methods: {
    async getBdCodeSrc() {
      let { data: results } = await getQRCodeInvication({ params: {} });
      const CALLBACK = {
        200: () => {
          this.bdCodeSrc = results.data.img;
        },
        default: () => {},
      };
      CALLBACK[results.code] ? CALLBACK[results.code]() : CALLBACK["default"]();
    },
    openServiceModal() {
      this.$store.commit("SERVICE_MODAL_TOGGLE", true);
    },
    getVerifyCode() {
      //获取验证码
      if (this.form.phone === "") {
        return this.$message.error("手机号不能为空")
      } else if (!/^1[3456789]\d{9}$/.test(this.form.phone)) {
        return this.$message.error("手机号输入有误")
      }
      const params = { phoneNumber: this.form.phone };
      getVerificationCode({ params }).then((res) => {
        if (res.data.code == 200) {
          this.VerificationCountDown();
          this.$message.success("验证码已发送，请注意查收");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 点击发送验证码按钮变更倒计时
    VerificationCountDown() {
      let timer = null;
      let countDownTime = 60; //秒
      this.VerifyDisabled = true;
      timer = setInterval(() => {
        if (countDownTime <= 0) {
          this.verifyValue = "获取验证码";
          this.VerifyDisabled = false;
          clearInterval(timer);
          return;
        }
        --countDownTime;
        this.verifyValue = countDownTime + "秒重发";
      }, 1000);
    },
    async veriftyForm() {
      //验证注册表单
      for (let i in this.form) {
        switch (i) {
          case "phone":
            if (this.form.phone === "") {
              return (this.errorMsg = "手机号不能为空");
            } else if (!/^1[3456789]\d{9}$/.test(this.form.phone)) {
              return (this.errorMsg = "手机号输入有误");
            }
            break;
          case "pwd":
            if (this.form.pwd === "") {
              return (this.errorMsg = "密码不能为空");
            } else if (this.form.pwd.length < 6 || this.form.pwd.length > 32) {
              return (this.errorMsg = "密码位数必须在6和32位之间");
            }
            break;
          case "verifyCode":
            if (this.form.verifyCode === "") {
              return (this.errorMsg = "验证码不能为空");
            }
            break;
          case "addr":
            if (this.form.addr === "") {
              return (this.errorMsg = "店铺地址不能为空");
            } else {
              let bool = await shopUrlReg(this.form.addr);
              if (!bool) return (this.errorMsg = "店铺链接错误");
            }
            break;
          case "recommendCode":
            if (this.form.recommendCode === "") {
              return (this.errorMsg = "推荐码不能为空");
            }
            break;
          default:
            if (!this.form.agreeChecked) {
              return (this.errorMsg = "请同意软件许可协议");
            }
            break;
        }
      }
      this.errorMsg = "";
    },
    async register() {
      //注册
      await this.veriftyForm();
      if (this.form.phone != "" && this.errorMsg == "") {
        this.registerLoading = true;
        const params = {
          username: this.form.phone,
          phoneNumber: this.form.phone,
          verificationCode: this.form.verifyCode,
          password: this.form.pwd,
          invitationCode: this.form.recommendCode,
          shopUrl: this.form.addr,
        };
        register(params).then((res) => {
          this.registerLoading = false;
          if (res.code == 200) {
            this.login();
          } else {
            this.$message.error(res.msg);
          }
        });
      } else {
        this.$message.error(this.errorMsg);
      }
    },
    // 登录
    login() {
      const params = {
        username: this.form.phone,
        phoneNumber: this.form.phone,
        verificationCode: this.form.verifyCode,
        password: this.form.pwd,
        invitationCode: this.form.recommendCode,
        shopUrl: this.form.addr,
      };
      loginPhone(params).then(async (res) => {
        if (res.code == 200) {
          this.$store.commit("CHANGE_USERNAME", res.data.username);
          this.$store.commit("CHANGE_TOKEN", res.data.token);
          this.$store.commit("USER_LOGIN_CHANGE", true);
          await this.getMemberInfo();
          this.$router.push("/home");
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    async getMemberInfo() {
      let { data: res } = await getJdbUserVip();
      if (res.code === 200) {
        this.$store.commit("CHANGE_VIPTYPE", res.data.vipLevelCode);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.register-modal {
  width: 420px;
  height: 553px;
  background-color: #fff;
  display: flex;
  position: relative;
  padding: 20px 30px 0;
  flex-direction: column;
  align-items: center;
  .bg {
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
    padding-bottom: 15px;
  }
  .err-msg {
    font-size: 14px;
    color: #f56c6c;
    padding-bottom: 10px;
  }
  .verify-btn {
    /deep/ .el-button {
      color: var(--DBlue);
    }
    /deep/ .el-button:hover {
      color: var(--JBlue);
    }
  }
  // 店铺地址格式提示
  .suffix {
    cursor: pointer;
    width: 30px;
    line-height: 46px;
    text-align: center;
  }
  /deep/ .el-input__inner {
    height: 46px;
    font-size: 16px;
    margin-bottom: 10px;
  }
  /deep/ input:-webkit-autofill {
    box-shadow: 0 0 0px 1000px white inset !important;
  }

  .recommend-code {
    .el-input__inner {
      &::placeholder {
        font-size: 12px;
      }
    }
  }
  .perate-box {
    display: flex;
    width: 100%;
    padding: 7px 9px 6px;
    align-items: center;
    border: 1px solid #d3d3d3;
    border-radius: 4px;
    img {
      width: 67px;
      height: 65px;
      display: block;
      margin-right: 6px;
    }
    .perate-text {
      line-height: 18px;
      font-size: 14px;
    }
  }
  .agreement {
    width: 100%;
    display: flex;
    align-items: center;
    font-size: 12px;
    padding: 10px 0;
    span {
      color: var(--DBlue);
      cursor: pointer;
      text-decoration: underline;
    }
    span:hover {
      color: var(--JBlue);
    }
    .el-checkbox {
      margin-right: 5px;
    }
  }
  .el-button {
    width: 100%;
  }
  .btn {
    font-size: 14px;
    color: #666;
    padding-top: 12px;
    span {
      &:last-child {
        color: var(--DBlue);
        cursor: pointer;
      }
      &:last-child:hover {
        color: var(--JBlue);
      }
    }
  }
}
// 店铺地址格式提示
.tooltip-content-box {
  .mall-box {
    display: flex !important;
    padding: 5px 0;
    .mall-name {
      width: 75px;
      line-height: 20px;
      text-align: end;
    }
    div:last-child {
      div {
        line-height: 20px;
      }
    }
  }
  .mall-box + .mall-box {
    padding-top: 0;
  }
}
</style>