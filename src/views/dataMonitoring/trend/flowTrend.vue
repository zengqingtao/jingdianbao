<!--流量监控详情（走势）-->
<template>
  <div class="container">
    <div class="module goodsInfo-module">
      <!-- 导航 -->
      <div class="header-nav">
        <div class="--text-mouse-hover" @click="toHome">京店宝首页</div>
        <i class="iconfont icon-iconfonti"></i>
        <div class="--text-mouse-hover" @click="toFlowMonitoring">流量监控</div>
        <i class="iconfont icon-iconfonti"></i>
        <div class="--text-mouse-hover">详情</div>
      </div>
      <div class="goods-info-box" v-if="goodsInfo">
        <div class="left">
          <el-image class="goods-img" :src="goodsInfo.imgUrl"></el-image>
        </div>
        <div class="right">
          <div v-if="goodsInfo.title" class="goods-title">
            <span>{{ goodsInfo.title }}</span>
          </div>
          <div class="goods-sku" v-if="goodsInfo.skuId">
            sku：{{ goodsInfo.skuId }}
          </div>
        </div>
      </div>
    </div>
    <div class="module chart-table-module">
      <div class="cycle-radio-box">
        <el-radio-group v-model="cycle">
          <el-radio-button label="每周"></el-radio-button>
          <el-radio-button label="每月"></el-radio-button>
        </el-radio-group>
      </div>
      <div class="veLine">
        <ve-line
          :data="chartData"
          :settings="chartSettings"
          :legend="legend"
          :colors="colors"
          :data-empty="!chartData.rows ? true : false"
        ></ve-line>
      </div>
    </div>
  </div>
</template>
<script>
import { getFlowMonitorDetail } from "../../../api/monitor";
import EventBus from "@/utils/eventBus.js";
export default {
  data() {
    this.legend = {
      bottom: "10px",
    };
    this.colors = [
      "#10DD2D",
      "#F4AD16",
      "#F64350",
      "#4463FF",
      "#91c7ae",
      "#749f83",
      "#ca8622",
      "#bda29a",
      "#6e7074",
      "#546570",
      "#c4ccd3",
    ];
    this.chartSettings = {
      labelMap: {
        date: "日期",
        visitors: "上周访客数(sku)",
        sales: "上周成交客户数(sku)",
      },
    };
    return {
      goodsInfo: null,
      trendMonitorId: 0,
      cycle: "每周",
      chartData: {
        columns: ["date", "visitors", "sales"],
        rows: [],
      },
      results: [],
    };
  },
  watch: {
    cycle() {
      console.log(this.cycle);
      if (this.cycle === "每周") {
        this.chartData.rows = this.results.weekList;
        this.chartSettings.labelMap.visitors = "上周访客数(sku)";
        this.chartSettings.labelMap.sales = "上周成交客户数(sku)";
      } else {
        this.chartData.rows = this.results.monthList;
        this.chartSettings.labelMap.visitors = "上月访客数(sku)";
        this.chartSettings.labelMap.sales = "上月成交客户数(sku)";
      }
    },
  },
  mounted() {
    this.trendMonitorId = this.$route.query.trendMonitorId;
    this.goodsInfo = this.$route.query;
    this.getFlowMonitorDetail();
  },
  methods: {
    async getFlowMonitorDetail() {
      let params = { flowMonitorId: this.trendMonitorId };
      let { data: res } = await getFlowMonitorDetail({ params });
      if (res.code === 200) {
        this.chartData.rows = res.data.weekList;
        this.results = res.data;
      } else {
        this.$message.error(res.msg);
      }
    },
    toHome() {
      let path = "/home";
      this.$router.push(path);
    },
    toFlowMonitoring() {
      this.$router.push("/dataMonitoring/flowMonitoring");
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}
.module {
  background-color: #fff;
  box-shadow: 0px 3px 24px 0px rgba(168, 168, 236, 0.22);
  border-radius: 10px;
  overflow: hidden;
}
.goodsInfo-module {
  margin-bottom: 10px;
  .header-nav {
    height: 30px;
    background-color: #f4f4f4;
    display: flex;
    align-items: center;
    padding-left: 10px;
    font-size: 14px;
    color: #333;
    div {
      cursor: pointer;
    }
  }
  .goods-info-box {
    display: flex;
    padding: 20px 0 14px 20px;
    .left {
      width: 70px;
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 14px;
      /deep/ .el-image__error {
        font-size: 12px;
      }
      .goods-img {
        width: 55px;
        height: 57px;
      }
    }
    .right {
      .goods-title {
        display: block;
        width: 452px;
        height: 37px;
        line-height: 20px;
        font-size: 14px;
        color: #333;
        display: -webkit-box;
        /* ! autoprefixer: off */
        -webkit-box-orient: vertical;
        /* autoprefixer: on */
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
      .goods-sku {
        color: #999;
        font-size: 14px;
        margin-top: 14px;
      }
    }
  }
}
.chart-table-module {
  flex: 1;
  padding: 20px;
  margin-bottom: 28px;
  .cycle-radio-box {
    display: flex;
    color: #333;
    font-size: 14px;
    /deep/ .el-radio-button {
      margin-right: 6px;
    }
    /deep/ .el-radio-button__inner {
      width: 76px;
      height: 30px;
      border-radius: 2px !important;
      color: #999999 !important;
      border: 1px solid #999 !important;
      background-color: #fff;
      box-shadow: none;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    /deep/ .el-radio-button.is-active .el-radio-button__inner {
      border-color: var(--DBlue) !important;
      background-color: var(--DBlue) !important;
      color: #fff !important;
    }
    /deep/ .el-radio-button.is-active .el-radio-button__inner:hover {
      background-color: var(--JBlue) !important;
      border-color: var(--JBlue) !important;
      color: #fff !important;
    }
    /deep/ .el-radio-button__inner:hover {
      border-color: var(--JBlue) !important;
      color: #fff !important;
      background-color: var(--JBlue) !important;
    }
  }
  .veLine {
    padding: 10px 60px 0 80px;
    position: relative;
  }
}
</style>