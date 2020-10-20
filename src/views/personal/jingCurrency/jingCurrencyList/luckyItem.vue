<template>
  <div class="lucky">
    <div class="lucky-header">
      <div>{{nowDate}}</div>
      <div class="check-rules" @click="signInRulesGroupToggle = true">查看规则>></div>
    </div>
    <div class="lucky-second">您今天剩余{{userDrawSecond}}次抽奖机会</div>
    <div class="draw-box">
      <lucky-draw
        :lottery-start="lotteryStart"
        :lottery-prizenum="prizeNum"
        :lottery-prizeno="prizeNo"
        :lottery-width="['85%','35%']"
        lottery-bg="https://yushukeji.oss-cn-shenzhen.aliyuncs.com/base.png"
        :content-bg="prizeListImg"
        pointer-bg="https://yushukeji.oss-cn-shenzhen.aliyuncs.com/start.png"
        @lotteryClick="lotteryClick"
        @lotteryDone="lotteryDone"
      ></lucky-draw>
    </div>
    <div class="bd-code" ><span class="bd-code-btn" @click="bdCodeGroupToggle = true">点此</span>添加运营经理微信更可领取今日份附赠大礼包</div>
    <transition name="el-fade-in-linear">
      <div class="rules-group" v-if="signInRulesGroupToggle">
        <div class="rules-content">
          <i class="el-icon-close" @click="signInRulesGroupToggle = false"></i>
          <div class="rules-title">签到抽奖规则</div>
          <div class="rules-item">1、当月连续签到7天，第7天当天转盘赠送京币X2倍</div>
          <div class="rules-item">2、当月连续签到15天，第15天当天转盘赠送京币X3倍</div>
          <div class="rules-item">3、当月连续签到28天，第28天当天转盘赠送京币X5倍</div>
          <div class="rules-item">4、当月连续签到满28天，意味着该用户在当月第7/15/28天抽奖的时候分别可以获得当天抽奖所得京币的2/3/5倍京币。</div>
        </div>
      </div>
    </transition>
    <transition name="el-fade-in-linear">
      <div class="bd-code-group" v-if="bdCodeGroupToggle">
        <div class="bd-code-content">
          <i class="el-icon-close icon-close" @click="bdCodeGroupToggle = false"></i>
          <div class="bd-code-title">今日份大礼包</div>
          <div class="bd-code-desc-group">
            <div class="desc-item">人气上首位玩法</div>
            <div class="desc-item">爆款全面透视监控表</div>
            <div class="desc-item">快车质量分提升方案</div>
          </div>
          <img class="bd-code-img" :src="luckyBdImg" alt="运营经理" />
          <div class="bd-code-desc">运营经理</div>
        </div>
      </div>
    </transition>
    <transition name="el-fade-in-linear">
      <luck-draw-success
        v-if="lucyDrawSuccessToggle"
        :luckText="prizeDesc? prizeDesc:`${prizeGold}京币`"
        :prize-gold="prizeGold"
        :prize-rate="prizeRate"
        :draw-day="drawDay"
        @closeModal="lucyDrawSuccessToggle = false"
      ></luck-draw-success>
    </transition>
  </div>
</template>
<script>
import luckyDraw from "./luck-draw";
import luckDrawSuccess from "../../../dialog/luckyDrawSuccess";
import { getNowDate } from "../../../../utils/common";
import {
  checkUserDraw,
  useRule,
  getDrawPrize,
  showAdv
} from "../../../../api/signIn";
import { mapState } from "vuex";

export default {
  data() {
    return {
      nowDate: getNowDate(),
      lotteryStart: 0,
      prizeNo: 1,
      prizeNum: 8,
      prizeList: [],
      prizeListImg: "",
      signInRulesGroupToggle: false,
      bdCodeGroupToggle: false,
      lucyDrawSuccessToggle: false,
      userDrawSecond: 0,
      prizeGold: 0, //中奖金币个数
      prizeRate: 0, //中奖倍数
      drawDay: 0, //连续签到天数
      prizeDesc: "", //如果奖品非京币的描述
      advInfo: {}, //广告相关
      rqbCodeImg: "" //人气宝BD二维码
    };
  },
  computed: {
    ...mapState(["luckyBdImg"])
  },
  created() {
    this.checkUserDrawSecond();
    this.getDrawRules();
    this.getShowAdv();
  },
  methods: {
    async checkUserDrawSecond() {
      let { data: results } = await checkUserDraw();
      if (results.code === 200) {
        this.userDrawSecond = results.data.times;
      }
    },
    async getDrawRules() {
      let { data: results } = await useRule();
      if (results.code === 200) {
        this.prizeNum = results.data.list.length;
        this.prizeList = results.data.list;
        this.prizeListImg = results.data.img;
      }
    },
    async getShowAdv() {
      let { data: results } = await showAdv();
      if (results.code === 200) {
        this.advInfo = results.data;
      }
    },
    async lotteryClick() {
      if (!this.userDrawSecond) return;
      let { data: results } = await getDrawPrize();
      const CALLBACK = {
        200: () => {
          this.prizeNo = results.data.index;
          this.prizeGold = results.data.jbNum;
          this.prizeRate = results.data.rate;
          this.drawDay = results.data.day;
          this.prizeDesc = results.data.prize;
          this.lotteryStart = 1;
        },
        default: () => {}
      };
      CALLBACK[results.code] ? CALLBACK[results.code]() : CALLBACK["default"]();
    },
    lotteryDone(res) {
      this.lotteryStart = 0;
      this.lucyDrawSuccessToggle = true;
      this.checkUserDrawSecond();
    }
  },
  components: { luckyDraw, luckDrawSuccess }
};
</script>
<style type="text/scss" lang="scss" scoped>
.lucky {
  user-select: none;
  .lucky-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #333;
    padding: 20px 0 10px;
    .check-rules {
      color: #3489fe;
      font-size: 14px;
      cursor: pointer;
      user-select: none;
    }
    .check-rules:hover {
      color: var(--JBlue);
    }
  }
  .draw-box{
      display: flex;
      justify-content: center;
  }
  .lucky-second {
    text-align: center;
    color: #333;
    font-size: 14px;
    padding: 5px 0 15px 0;
  }
  .rules-group {
    width: 424px;
    height: 217px;
    background-color: #fff;
    border: 1px solid #eee;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    .rules-content {
      width: 100%;
      height: 100%;
      position: relative;
      padding: 0 30px;
      box-sizing: border-box;
      .el-icon-close {
        position: absolute;
        right: 10px;
        top: 10px;
        color: #333 !important;
        font-size: 18px;
        cursor: pointer;
      }
      .rules-title {
        padding: 19px 0;
        text-align: center;
        color: #333;
      }
      .rules-item {
        margin-bottom: 10px;
        color: #333;
        font-size: 14px;
        line-height: 18px;
      }
    }
  }
  .lucky-gold-group {
    padding-top: 10px;
    text-align: center;
    min-height: 46px;
    .lucky-gold {
      color: #333;
      font-size: 20px;
    }
    .lucky-desc {
      font-size: 14px;
      color: #333;
      margin-top: 5px;
    }
  }
  .bd-code {
    text-align: center;
    user-select: none;
    color: #333;
    margin-top: 50px;
    font-size: 14px;
    .bd-code-btn{
        cursor: pointer;
        color:var(--DBlue)
    }
    .bd-code-btn:hover{
        color:var(--JBlue)
    }
  }
  .bd-code-group {
    width: 246px;
    height: 295px;
    background-color: #fff;
    border: solid 1px #eee;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    color: #333;
    .bd-code-content {
      width: 100%;
      height: 100%;
      position: relative;
      padding: 0 30px;
      box-sizing: border-box;
      text-align: center;
      .el-icon-close {
        position: absolute;
        right: 10px;
        top: 10px;
        color: #333;
        font-size: 18px;
        cursor: pointer;
      }
      .icon-close {
        color: #333 !important;
      }
      .bd-code-title {
        padding: 19px 0;
        color: #333;
      }
      .bd-code-desc-group {
        font-size: 14px;
        .desc-item {
          margin-bottom: 4px;
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
      .bd-code-img {
        width: 132px;
        height: 132px;
        margin-top: 14px;
      }
      .bd-code-desc {
        font-size: 14px;
        margin-top: 10px;
      }
    }
  }
}
</style>