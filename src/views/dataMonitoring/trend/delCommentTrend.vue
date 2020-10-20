<template>
  <div class="container">
    <div class="module goodsInfo-module">
      <!-- 导航 -->
      <div class="header-nav">
        <div class="--text-mouse-hover" @click="toHome">京店宝首页</div>
        <i class="iconfont icon-iconfonti"></i>
        <div class="--text-mouse-hover" @click="togglePage">删评监控</div>
        <i class="iconfont icon-iconfonti"></i>
        <div class="--text-mouse-hover">删评走势</div>
      </div>
      <div class="goods-info-box" v-if="goodsInfo">
        <div class="left">
          <img class="goods-img" :src="goodsInfo.img" />
        </div>
        <div class="right">
          <div v-if="goodsInfo.skuName" class="goods-title">
            <span>{{goodsInfo.skuName}}</span>
          </div>
          <div class="goods-sku" v-if="goodsInfo.skuId">sku：{{goodsInfo.skuId}}</div>
        </div>
      </div>
    </div>
    <div class="module my-chart-module">
      <div class="date-radio-box">
        <div>时间：</div>
        <el-radio-group v-model="searchDateRadio" @change="getMonitorTrend">
          <el-radio :label="15">近15天</el-radio>
          <el-radio :label="30">近30天</el-radio>
          <el-radio :label="60">近60天</el-radio>
          <el-radio :label="90">近90天</el-radio>
        </el-radio-group>
      </div>
      <div class="my-chart-box">
        <div class="my-chart" id="myChart"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { searchDeleteCommetAll } from "../../../api/monitor";
import EventBus from "@/utils/eventBus.js";
export default {
  data() {
    return {
      goodsInfo: {
        img: "",
        skuName: "",
        skuId: ""
      },
      monitorId: 0,
      searchDateRadio: 15,
      chartOptions: {
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["显示", "忽略", "删除"],
          textStyle: {
            color: "#333"
          }
        },
        grid: {
          bottom: "2%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: "value",
          minInterval: 1
        },
        series: [
          {
            name: "显示",
            type: "line",
            data: [],
            smooth: true
          },
          {
            name: "忽略",
            type: "line",
            data: [],
            smooth: true
          },
          {
            name: "删除",
            type: "line",
            data: [],
            smooth: true
          }
        ],
        backgroundColor: "#fff",
        textStyle: {
          color: "#333"
        },
        color: ["#95C9B1", "#fff000", "#C23531"]
      }
    };
  },
  created() {
    this.monitorId = this.$route.query.trendMonitorId;
    this.getMonitorTrend();
  },
  methods: {
    async getMonitorTrend() {
      let params = {
        skuId: this.monitorId,
        times: this.searchDateRadio
      };
      let { data: listRes } = await searchDeleteCommetAll({ params });
      if (listRes.code === 200) {
        this.goodsInfo.img = listRes.data.img;
        this.goodsInfo.skuName = listRes.data.skuName;
        this.goodsInfo.skuId = this.monitorId;
        this.chartOptions.xAxis.data = [];
        this.chartOptions.series[0].data = [];
        this.chartOptions.series[1].data = [];
        this.chartOptions.series[2].data = [];
        for (let [index, item] of listRes.data.comment.entries()) {
          this.chartOptions.xAxis.data.push(item.date);
          this.chartOptions.series[0].data.push(item.leaveReview);
          this.chartOptions.series[1].data.push(item.ignoreCount);
          this.chartOptions.series[2].data.push(item.deleteCount);
        }
        this.drawCharts();
      }
    },
    drawCharts() {
      let myChart = this.$echart.init(document.getElementById("myChart"));
      let option = this.chartOptions;
      myChart.setOption(option);
    },
    toHome() {
      let path = "/home";
      this.$router.push(path);
    },
    togglePage() {
      this.$router.push("/dataMonitoring/delCommentMonitoring");
    }
  }
};
</script>
<style lang="scss" scoped>
.container{
  min-height: 100%;
  display: flex;
  flex-direction: column;
}
.module {
  background-color: #fff;
  box-shadow: 0px 3px 24px 0px rgba(168,168,236,0.22);
  border-radius: 10px;
  overflow: hidden;
}
.module + .module {
  margin-top: 10px;
}
.goodsInfo-module {
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
        -webkit-box-orient: vertical;
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
.my-chart-module {
  flex: 1;
  padding: 20px 20px 30px;
  margin-bottom: 28px;
  .date-radio-box {
    padding-bottom: 37px;
    display: flex;
    color: #333;
    font-size: 14px;
    /deep/ .el-radio {
      margin-right: 20px;
    }
    /deep/ .el-radio__input.is-checked + .el-radio__label {
      color: #333;
    }
  }
  .my-chart-box {
    display: flex;
    justify-content: center;
    .my-chart {
      width: 915px;
      height: 400px;
      margin-left: 50px;
    }
  }
}
</style>