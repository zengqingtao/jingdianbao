<template>
  <div class="container">
    <div class="currency-box">
      <div class="balance-box">
        <div class="font-bold">京币余额</div>
        <div class="balance">
          <div>账户余额：</div>
          <div class="font-bold">{{jingCurrency}}</div>
        </div>
      </div>
      <div class="gain-box">
        <div class="font-bold">京币获取</div>
        <div class="gain-method-list">
          <div class="comment gain-item" @click="showComment=true">
            <div class="comment-icon">
              <i class="iconfont icon-tucaofankui-"></i>
            </div>
            <div class>吐槽提建议</div>
          </div>
          <div class="sigin gain-item" @click="showSigin = true">
            <i class="iconfont icon-qiandao-"></i>
            <div>签到抽京币</div>
          </div>
        </div>
      </div>
    </div>
    <user-comment v-if="showComment" @closeDialog="showComment = false" @success="checkLogin"></user-comment>
    <user-sigin v-if="showSigin" @closeDialog="showSigin = false"></user-sigin>
  </div>
</template>
<script>
import { checkLogin } from "../../../../api/user";
import userComment from "../../../dialog/comment";
import userSigin from "../../../dialog/sigin";
export default {
  data() {
    return {
      jingCurrency: "",
      showComment: false,
      showSigin: false
    };
  },
  components: {
    userComment,
    userSigin
  },
  created() {
    this.checkLogin();
  },
  methods: {
    async checkLogin() {
      let { data: res } = await checkLogin();
      if (res.code == 200) {
        this.jingCurrency = res.data.jb;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.currency-box {
  color: #333;
  font-size: 14px;
  .font-bold {
    font-weight: bold;
  }
  .balance-box {
    margin-top: 38px;
    line-height: 30px;
    .balance {
      display: flex;
    }
  }
  .gain-box {
    margin-top: 30px;
    .gain-method-list {
      margin-top: 20px;
      display: flex;
      .gain-item + .gain-item {
        margin-left: 10px;
      }
      .gain-item {
        width: 133px;
        height: 179px;
        font-size: 14px;
        color: var(--DBlue);
        text-align: center;
        padding-top: 45px;
        cursor: pointer;
      }
      .comment {
        background: url("../../../../assets/images/personal/comment.png") no-repeat;
        .icon-tucaofankui- {
          font-size: 42px;
        }
        .comment-icon {
          margin: 5px 0;
        }
      }
      .sigin {
        background: url("../../../../assets/images/personal/sigin.png") no-repeat;
        .icon-qiandao- {
          font-size: 50px;
        }
      }
    }
  }
}
</style>