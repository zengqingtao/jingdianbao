<template>
  <div class="container">
    <div class="lucky-box">
      <div class="lucky-title">
        <div>恭喜您获得了{{luckText}}</div>
      </div>
      <div
        class="lucky-gold"
        v-if="prizeRate > 1 && drawDay"
      >{{prizeRate || '99'}}倍连续签到{{drawDay || 7}}天奖励</div>
      <div class="lucky-desc" >{{prizeGold?(prizeGold+'个京币已放入您的京币账户'):'请截图并附上注册手机号，联系运营经理获取礼品，礼品将在7天内送出。'}}</div>
      <img class="close-img" @click="closeModal" src="../../assets/images/close.png" alt />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: {
    luckText: {
      type: String
    },
    prizeGold: {
      type: Number,
      default: 0
    },
    prizeRate: {
      type: Number,
      default: 0
    },
    drawDay: {
      type: Number,
      default: 0
    }
  },
  methods: {
    closeModal() {
      this.$emit("closeModal");
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.45);
  user-select: none;
  z-index: 2007;
  display: flex;
  justify-content: center;
  align-items: center;
  .lucky-box {
    width: 430px;
    height: 361px;
    position: relative;
    background: url(https://yushukeji.oss-cn-shenzhen.aliyuncs.com/good_lucky.png)
      no-repeat;
    .lucky-title {
      text-align: center;
      position: absolute;
      top: 190px;
      left: 130px;
      color: #333;
      font-size: 14px;
      width: 206px;
      height: 45px;
      line-height: 45px;
    }
    .lucky-desc {
      position: absolute;
      top: 280px;
      left: 75px;
      width: 330px;
      height: 45px;
      line-height: 30px;
      text-align: center;
      color: #fff;
      font-size: 14px;
    }
    .lucky-gold {
      position: absolute;
      top: 250px;
      left: 90px;
      width: 300px;
      height: 45px;
      line-height: 45px;
      text-align: center;
      color: #fff;
      font-size: 20px;
    }
    .el-icon-circle-close {
      color: #fff;
      font-size: 20px;
    }
    .close-img {
      position: absolute;
      right: 60px;
      top: 65px;
      cursor: pointer;
    }
  }
  // .luck-draw-content{
  //     width: 100%;
  //     height: 100%;
  //     position: relative;
  //     img{
  //         position: absolute;
  //         top: 200px;
  //         left: 18px;
  //     }
  //     .luck-draw-text{
  //         font-size: 14px;
  //         position: absolute;
  //         top: 406px;
  //         left: 50%;
  //         transform: translateX(-50%);
  //     }
  //     .lucky-gold {
  //         position: absolute;
  //         left: 50%;
  //         top: 460px;
  //         transform: translateX(-50%);
  //         width: 100%;
  //         text-align: center;
  //         color: #fff;
  //         font-size: 20px;
  //     }
  //     .lucky-desc {
  //         position: absolute;
  //         left: 50%;
  //         top: 490px;
  //         transform: translateX(-50%);
  //         width: 100%;
  //         text-align: center;
  //         font-size: 14px;
  //         color: #fff;
  //     }
  //     .el-icon-circle-close{
  //         position: absolute;
  //         top: 250px;
  //         right: 100px;
  //         transform: translateX(-50%);
  //         font-size: 32px;
  //         color: #fff;
  //         cursor: pointer;
  //     }
  // }
}
</style>
