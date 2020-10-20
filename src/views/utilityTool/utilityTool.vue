<template>
  <div class="container">
    <div class="module">
      <div class="tips">
        友情链接（实用工具的产品，都是第三方服务，属于友情链接，不支持用京店宝账号余额消费）
      </div>
      <ul class="ul-box">
        <li v-for="(item, index) in list" :key="index">
          <div class="icon-box" @click="openUrl(item)">
            <i v-if="item.icon" class="iconfont" :class="item.icon"></i>
            <img v-else :src="item.imgUrl" />
          </div>
          <div class="center-box">
            <div class="title" @click="openUrl(item)">{{ item.title }}</div>
            <div class="content">{{ item.content }}</div>
          </div>
          <div class="btn-group">
            <el-button
              type="primary"
              class="--btn-primary"
              onfocus="this.blur()"
              @click="openUrl(item)"
              >打开</el-button
            >
            <el-button
              v-if="item.isShowCoupon"
              type="primary"
              class="--btn-primary"
              onfocus="this.blur()"
              @click="showGetCoupon = true"
              >领优惠券</el-button
            >
          </div>
        </li>
      </ul>
    </div>
    <get-coupon
      v-if="showGetCoupon"
      @closeDialog="showGetCoupon = false"
    ></get-coupon>
  </div>
</template>
<script>
import liwu from "../../assets/images/utilityTool/liwu.png";
import getCoupon from "../dialog/getCoupon";
import Config from "../../config";
import { mapState } from "vuex";
export default {
  data() {
    return {
      showGetCoupon: false,
      list: [
        {
          title: "京礼金",
          imgUrl: liwu,
          content:
            "【京礼金】：京东官方授权帮助商家引流曝光和提高销量，真实用户下单，高质量评价晒图，无任何稽查风险。想了解更多信息，右侧点击【打开】访问官网了解。",
          interfaceName: "https://www.jdyoupinku.com/#/freeSheet",
          isShowCoupon: false,
          isRedirect: false,
        },
        {
          title: "阿明工具",
          icon: "icon-aminggongju",
          content:
            "阿明工具，包括了 京东快车工具和京东详情页工具。 京东快车工具：京东快车工具可以帮您高效管理快车推广，省时省力，自营和pop均可使用。京东详情页工具：查看任意关键词市场数据，任意商品详情页下载，评论下载与分析。想了解更多信息，右侧点击【打开】访问官网了解。（可向运营经理领取免费优惠券）",
          interfaceName: "yushu-server/general/redirectMingTool",
          isShowCoupon: true,
          isRedirect: true,
        },
        {
          title: "买家秀",
          icon: "icon-ha",
          content:
            "【买家秀】快速提升商品转化——宝贝转化神器，支持淘宝买家秀、京东买家秀、拼多多买家秀，寄拍、赠拍随你选，海量模特在线实时接单。想了解更多信息，右侧点击【打开】访问官网了解。",
          interfaceName: "yushu-server/general/redirectBuyerShow",
          isShowCoupon: false,
          isRedirect: true,
        }
      ],
    };
  },
  components: {
    getCoupon,
  },
  computed: {
    ...mapState(["token", "isLogin"]),
  },
  methods: {
    openUrl(item) {
      if (this.isLogin) {
        let url = item.isRedirect
          ? Config.serverUrl + item.interfaceName + "?token=" + this.token
          : item.interfaceName;
        window.open(url);
      } else {
        this.$store.commit("LOGIN_MODAL_TOGGLE", {
          toggle: true,
          loginType: 2,
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
}
.module {
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 3px 24px 0px rgba(168, 168, 236, 0.22);
  padding: 20px;
  .tips {
    color: #666;
    font-size: 14px;
  }
  .ul-box {
    padding-top: 40px;
    color: #333;
    li + li {
      margin-top: 50px;
    }
    li {
      display: flex;
      .icon-box {
        width: 62px;
        height: 62px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #f4f4f4;
        cursor: pointer;
        .iconfont {
          font-size: 35px;
          color: var(--DBlue);
        }
        .icon-kongbao_huaban {
          font-weight: bold;
          color: #ea344a;
        }
        .icon-ha {
          color: #000;
        }
        .img{
          width: 40px;
          height: 40px;
        }
      }
      .center-box {
        width: 701px;
        margin: 0 60px 0 15px;
        .title {
          font-size: 18px;
          font-weight: bold;
          padding-bottom: 5px;
          cursor: pointer;
        }
        .content {
          font-size: 14px;
          color: #666;
          line-height: 22px;
        }
      }
      .btn-group {
        text-align: end;
        margin-top: 20px;
        flex: 1;
        /deep/ .el-button {
          width: 80px;
          height: 30px;
          padding: 0;
          border-radius: 2px;
        }
        /deep/ .el-button + .el-button {
          margin-top: 10px;
        }
      }
    }
  }
}
</style>