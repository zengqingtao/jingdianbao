<template>
  <el-container :direction="vertical" class="container">
    <el-header height="90px" class="header">
      <div class="content">
        <img
          class="logo"
          @click="$router.push('/home')"
          src="../../assets/images/login/jdb-logo.png"
          alt
        />
        <p class="title">找回密码</p>
      </div>
    </el-header>
    <el-main class="main">
      <div class="reset-pwd-box">
        <div class="step-box">
          <el-steps
            :active="step"
            finish-status="success"
            process-status="wait"
            :align-center="true"
          >
            <el-step title="验证身份" status="success"></el-step>
            <el-step title="重置登录密码"></el-step>
            <el-step title="重置成功"></el-step>
          </el-steps>
        </div>
        <div class="retrieve-content-box">
          <div class="get-code" v-if="step === 1">
            <el-form ref="phoneForm" :rules="phoneRules" :model="phoneForm">
              <el-form-item prop="phone">
                <el-input v-model="phoneForm.phone" placeholder="请输入手机号" @focus="clearValidatePhone('phone')"></el-input>
              </el-form-item>
              <el-form-item prop="verifyCode">
                <el-input v-model="phoneForm.verifyCode" placeholder="请输入短信验证码" @focus="clearValidatePhone('verifyCode')">
                  <template slot="suffix">
                    <div class="verify-btn">
                      <el-button
                        type="text"
                        :disabled="VerifyDisabled"
                        @click="getVerifyCode"
                      >{{verifyValue}}</el-button>
                    </div>
                  </template>
                </el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="get-code" v-if="step === 2">
            <el-form ref="passwordForm" :rules="passwordRules" :model="passwordForm">
              <el-form-item prop="password">
                <el-input v-model="passwordForm.password" type="password" placeholder="请输入新密码" @focus="clearValidatePwd('password')"></el-input>
              </el-form-item>
              <el-form-item prop="confirmPassword">
                <el-input
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  placeholder="请再次输入密码"
                  @focus="clearValidatePwd('confirmPassword')"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="success-tips" v-if="step === 3">重置成功</div>
          <div class="next-btn" @click="stepBtn">{{step === 3 ? '完成' : '下一步'}}</div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>
<script>
import appFooter from "@/components/footer";
import {
  getFindPasswordCode,
  checkVerificationCode,
  findPassword,
  loginPhone
} from "../../api/user";
import EventBus from "@/utils/eventBus.js";
export default {
  name: "retrievePassword",
  components: { appFooter },
  data() {
    let phoneValidate = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("手机号不能为空"));
      } else if (!/^1[3456789]\d{9}$/.test(value)) {
        callback(new Error("手机号输入有误"));
      } else {
        callback();
      }
    };
    let passwordValidate = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("密码不能为空"));
      } else {
        if (value.length < 6 || value.length > 32)
          return callback(new Error("密码长度必须在6到32位之间"));
        callback();
      }
    };
    let confirmPwdValidate = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.passwordForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      step: 1,
      phoneForm: {
        //手机和验证码
        phone: "",
        verifyCode: ""
      },
      passwordForm: {
        //密码
        password: "",
        confirmPassword: ""
      },
      phoneRules: {
        phone: [{ validator: phoneValidate, trigger: "blur" }],
        verifyCode: [
          { required: true, message: "验证码不能为空", trigger: "blur" }
        ]
      },
      passwordRules: {
        password: [{ validator: passwordValidate, trigger: "blur" }],
        confirmPassword: [{ validator: confirmPwdValidate, trigger: "blur" }]
      },
      VerifyDisabled: false,
      verifyValue: "获取验证码"
    };
  },
  created() {},
  methods: {
    getVerifyCode() {
      //获取验证码
      if (this.phoneForm.phone == "") {
        return this.$message.error("请输入手机号");
      } else if (!/^1[3456789]\d{9}$/.test(this.phoneForm.phone)) {
        return this.$message.error("手机号输入有误");
      }
      let params = {
        phoneNumber: this.phoneForm.phone
      };
      getFindPasswordCode({ params }).then(res => {
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
    stepBtn() {
      //下一步/完成
      if (this.step == 1) {
        this.$refs["phoneForm"].validate(valid => {
          if (valid) {
            let params = {
              phoneNumber: this.phoneForm.phone,
              code: this.phoneForm.verifyCode
            };
            checkVerificationCode({ params }).then(res => {
              if (res.data.code == 200) {
                this.step++;
              } else {
                this.$message.error(res.data.msg);
              }
            });
          }
        });
      } else if (this.step == 2) {
        this.$refs["passwordForm"].validate(valid => {
          if (valid) {
            this.submit();
          }
        });
      } else {
        this.finish();
      }
    },
    async submit() {
      //重置密码
      let params = {
        phoneNumber: this.phoneForm.phone,
        verificationCode: this.phoneForm.verifyCode,
        newPassword: this.passwordForm.password
      };
      let res = await findPassword(params);
      if (res.data.code == 200) {
        this.step++;
      } else {
        this.$message.error(res.data.msg);
      }
    },
    finish() {
      //重置完密码需要跳转到登录页重新登录
      this.$router.push("/login");
    },
    clearValidatePhone(propValue) {
      this.$refs.phoneForm.clearValidate(propValue);
    },
    clearValidatePwd(propValue) {
      this.$refs.passwordForm.clearValidate(propValue);
    },
  }
};
</script>
<style lang="scss" scoped>
.container {
  .header {
    width: 100%;
    box-shadow: 0px 5px 35px 0px rgba(233, 233, 233, 0.53);
    .content {
      width: 1200px;
      height: 90px;
      margin: 0 auto;
      display: flex;
      align-items: flex-end;
      padding-bottom: 15px;
      .logo {
        width: 257px;
        height: 58px;
        display: block;
        cursor: pointer;
      }
      .title{
        font-size: 18px;
        color:#999;
        padding:0 0 10px 10px;
      }
    }
  }
  .main {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin-top: 50px;
    .reset-pwd-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      .step-box {
        margin-bottom: 68px;
        width: 550px;
      }
      .retrieve-content-box {
        width: 420px;
        .verify-btn {
          /deep/ .el-button {
            color: var(--DBlue);
            height:46px;
            padding-right:5px
          }
          /deep/ .el-button:hover {
            color: var(--JBlue);
          }
        }
        .success-tips {
          font-size: 32px;
          color: #30a938;
          font-weight: bold;
          text-align: center;
        }
        .next-btn {
          width: 420px;
          line-height: 46px;
          color: #fff;
          background-color: var(--themeColor);
          border-radius: 4px;
          text-align: center;
          margin-top: 64px;
          cursor: pointer;
        }
      }
      /deep/.el-input {
        width: 470px;
        font-size: 18px;
      }
      /deep/ .el-input__inner {
        height: 46px !important;
      }
      /deep/ input:-webkit-autofill {
        box-shadow: 0 0 0px 1000px white inset !important;
      }
    }
  }
}
@media screen and (max-width: 1680px) {
  .main {
    margin-top: 50px;
  }
}
</style>