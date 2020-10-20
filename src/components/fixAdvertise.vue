<template>
  <div class="container">
    <div class="list">
      <div class="list-item">
        <img class="transform-img" :src="bdQrCodeImg" alt />
        <img class="qrCode-img" :src="bdQrCodeImg" alt />
        <span class="title">运营经理</span>
      </div>
      <div class="list-item" @click="jump('/member/memberExchange')">
        <i class="iconfont icon-huangguan_huaban"></i>
        <span class="title">邀请注册</span>
        <span class="title">送会员</span>
      </div>
      <div class="list-item" @click="showComment = true">
        <i class="iconfont icon-tucaofankui-"></i>
        <span class="title">吐槽</span>
      </div>
      <div class="list-item" @click="showSigin = true">
        <i class="iconfont icon-qiandao-"></i>
        <span class="title">签到</span>
        <span class="title">送京币</span>
      </div>
      <user-comment v-if="showComment" @closeDialog="showComment = false" @success="comment"></user-comment>
      <user-sigin v-if="showSigin" @closeDialog="showSigin = false"></user-sigin>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import userComment from "../views/dialog/comment";
import userSigin from "../views/dialog/sigin";
export default {
  data() {
    return {
      showComment: false,
      showSigin: false,
    };
  },
  computed: {
    ...mapState(["bdQrCodeImg"])
  },
  components: {
    userComment,
    userSigin
  },
  methods: {
    jump(path) {
      let url = location.href;
      url = url.split("#")[0] + "#";
      window.open(url + path);
    },
  }
};
</script>
<style lang="scss" scoped>
.container {
  width: 60px;
  height: 300px;
  padding: 10px 5px;
  background-color: #fff;
  box-shadow: 0px 2px 10px 0px rgba(146, 158, 177, 0.21);
  .list {
    display: flex;
    flex-flow: column;

    .list-item + .list-item {
      margin-top: 13px;
    }
    .list-item {
      display: flex;
      flex-flow: column;
      text-align: center;
      position: relative;
      cursor: pointer;
      &:hover {
        .title,
        .iconfont {
          color: var(--JBlue);
        }
        .transform-img {
          display: block;
        }
      }
      .transform-img {
        position: absolute;
        top: -10px;
        left: -168px;
        width: 160px;
        height: 160px;
        box-shadow: 0px 2px 10px 2px rgba(146, 158, 177, 0.21);
        display: none;
      }
      .qrCode-img {
        width: 50px;
        height: 50px;
      }
      .iconfont {
        height: 30px;
        color: #333;
        font-size: 36px;
      }
      //   邀请注册
      .icon-huangguan_huaban {
        font-size: 40px;
      }
      //   吐槽
      .icon-tucaofankui- {
        font-size: 30px;
      }
      //   签到
      .icon-qiandao- {
        font-size: 36px;
      }
      .title {
        display: block;
        line-height: 13px;
        padding-top: 3px;
        font-size: 12px !important;
        color: #333;
      }
    }
  }
}
</style>