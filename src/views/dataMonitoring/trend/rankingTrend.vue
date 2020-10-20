<template>
  <div class="container">
    <div class="module goodsInfo-module">
      <!-- 导航 -->
      <div class="header-nav">
        <div class="--text-mouse-hover" @click="toHome">京店宝首页</div>
        <i class="iconfont icon-iconfonti"></i>
        <div class="--text-mouse-hover" @click="toRankingMonitoring">排名监控</div>
        <i class="iconfont icon-iconfonti"></i>
        <div class="--text-mouse-hover">排名走势</div>
      </div>
      <div class="goods-info-box" v-if="goodsInfo">
        <div class="left">
          <el-image class="goods-img" :src="goodsInfo.img"></el-image>
        </div>
        <div class="right">
          <div v-if="goodsInfo.skuName" class="goods-title">
            <span>{{goodsInfo.skuName}}</span>
          </div>
          <div class="goods-sku">
            <span v-if="goodsInfo.skuId">sku：{{goodsInfo.skuId}}</span>
            <span v-if="goodsInfo.keyword">关键词：{{goodsInfo.keyword}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="module chart-table-module">
      <div class="date-radio-box">
        <div>时间：</div>
        <el-radio-group v-model="searchDateRadio" @change="_getMonitorData">
          <el-radio :label="7">近7天</el-radio>
          <el-radio :label="15">近15天</el-radio>
          <el-radio :label="30">近30天</el-radio>
        </el-radio-group>
      </div>
      <div class="my-chart-box">
        <div class="my-chart" id="myChart"></div>
      </div>
      <div class="table">
        <el-table :data="tableData">
          <el-table-column prop="date" label="最后更新时间"></el-table-column>
          <el-table-column prop="name" label="电脑端位置">
            <template slot-scope="scope">
              <div>
                <div v-if="scope.row.pcRank">
                  第{{scope.row.pcPage}}页第{{scope.row.pcIndex}}个 总排名第{{scope.row.pcRank}}名
                  <span
                    class="ranking-change is-down"
                    v-if="scope.row.pcTrend<0"
                  >
                    <i class="iconfont icon-tubiaoxiajiangqushi"></i>
                    {{Math.abs(scope.row.pcTrend)}}
                  </span>
                  <span class="ranking-change is-ccc" v-if="scope.row.pcTrend===0">无变动</span>
                  <span class="ranking-change is-up" v-if="scope.row.pcTrend>0">
                    <i class="iconfont icon-tubiaoshangshengqushi"></i>
                    {{Math.abs(scope.row.pcTrend)}}
                  </span>
                </div>
                <div v-if="!scope.row.pcRank">不在排名范围之内</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="手机端位置">
            <template slot-scope="scope">
              <div>
                <div v-if="scope.row.appRank">
                  第{{scope.row.appPage}}页第{{scope.row.appIndex}}个 总排名第{{scope.row.appRank}}名
                  <span
                    class="ranking-change is-down"
                    v-if="scope.row.appTrend<0"
                  >
                    <i class="iconfont icon-tubiaoxiajiangqushi"></i>
                    {{Math.abs(scope.row.appTrend)}}
                  </span>
                  <span class="ranking-change is-ccc" v-if="scope.row.appTrend===0">无变动</span>
                  <span class="ranking-change is-up" v-if="scope.row.appTrend>0">
                    <i class="iconfont icon-tubiaoshangshengqushi"></i>
                    {{Math.abs(scope.row.appTrend)}}
                  </span>
                </div>
                <div v-if="!scope.row.appRank">不在排名范围之内</div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import { searchTrendImageNew } from "../../../api/monitor";
import EventBus from "@/utils/eventBus.js";
export default {
  data() {
    return {
      tableData: [],
      goodsInfo: null,
      chartInterval: 5,
      searchDateRadio: 7,
      trendMonitorId: 0,
      option: {
        tooltip: {
          trigger: "axis",
          formatter(val) {
            let temp1 = "";
            let temp2 = "";
            val.forEach(item => {
              if (item.seriesIndex === 0) {
                if (!Number.isInteger(item.value)) {
                  temp1 = `<div>${item.axisValue}</div><div>${item.marker}移动端排名: 不在查询范围内</div>`;
                } else {
                  temp1 = `<div>${item.axisValue}</div><div>${item.marker}移动端排名: ${item.value}</div>`;
                }
              } else if (item.seriesIndex === 1) {
                if (!Number.isInteger(item.value)) {
                  temp2 = `<div>${item.marker}PC端排名: 不在查询范围内</div>`;
                } else {
                  temp2 = `<div>${item.marker}PC端排名: ${item.value}</div>`;
                }
              }
            });
            return temp1 + temp2;
          }
        },
        legend: {
          data: [
            {
              name: "移动端"
            },
            {
              name: "PC端"
            }
          ],
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
          inverse: true,
          min: "dataMin",
          max: "dataMax",
          minInterval: 1,
          splitNumber: 5,
          interval: this.chartInterval,
          axisLabel: {
            formatter: function(val, index) {
              let arr = [];
              if (index === 0 && val < 1) {
                return [``];
              } else if (index === 0 && val > 1) {
                return [`第${Math.floor(val)}名`];
              } else if (!Number.isInteger(val)) {
                arr.push(`不在查询范围内`);
              } else {
                arr.push(`第${val}名`);
              }
              return arr;
            }
          }
        },
        series: [
          {
            name: "移动端",
            type: "line",
            smooth: true,
            data: []
          },
          {
            name: "PC端",
            type: "line",
            smooth: true,
            data: []
          }
        ],
        backgroundColor: "#fff",
        textStyle: {
          color: "#333"
        },
        color: ["#f30213", "#4463ff"]
      }
    };
  },
  created() {
    this.trendMonitorId = this.$route.query.trendMonitorId;
    this._getMonitorData();
  },
  methods: {
    async _getMonitorData() {
      const params = {
        monitorId: this.trendMonitorId,
        num: this.searchDateRadio
      };
      let { data: searchRes } = await searchTrendImageNew({ params });
      if (searchRes.code === 200) {
        let chartResults = searchRes.trend;
        this.option.xAxis.data = chartResults.map(item => {
          return item.date;
        });
        this.tableData = searchRes.trendData;
        this.goodsInfo = searchRes.data;
        //处理PC端和移动端的数据
        let appRankList = chartResults.map(item => {
          return item.appRank;
        });
        let pcRankList = chartResults.map(item => {
          return item.pcRank;
        });
        //所有数据的最大值
        let maxData = Number(
          Math.max(...appRankList, ...pcRankList).toFixed(1)
        );
        let minData = Number(
          Math.min(...appRankList, ...pcRankList).toFixed(1)
        );
        maxData = (maxData + this.getChartYLimit(minData, maxData)).toFixed(1);
        this.option.series[0].data = appRankList.map(item => {
          return item === 0 ? maxData : item;
        });
        this.option.series[1].data = pcRankList.map(item => {
          return item === 0 ? maxData : item;
        });
        this.drawCharts();
      }
    },
    //动态计算不在排名范围内
    getChartYLimit(min, max) {
      if (max === 0) return 1.5;
      let limitData = +((max - min) / 6).toFixed(2);
      this.chartInterval = limitData.toFixed(0);
      return limitData;
    },
    drawCharts() {
      let myChart = this.$echart.init(document.getElementById("myChart"));
      let option = this.option;
      myChart.setOption(option);
    },
    toHome() {
      let path = "/home";
      this.$router.push(path);
    },
    toRankingMonitoring() {
      this.$router.push("/dataMonitoring/rankingMonitoring");
    }
  }
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
        span+span{
          margin-left:10px
        }
      }
    }
  }
}
.chart-table-module {
  flex: 1;
  padding: 20px;
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
  .table {
    padding-top: 36px;
    /deep/ .el-table {
      border: 1px solid #ebeef5;
      border-bottom: 0;
      .cell {
        padding-left: 30px;
      }
    }
    .ranking-change {
      &.is-up {
        color: #e92312;
      }
      &.is-down {
        color: #00ff00;
      }
      &.is-ccc {
        color: #808080;
      }
    }
  }
}
</style>