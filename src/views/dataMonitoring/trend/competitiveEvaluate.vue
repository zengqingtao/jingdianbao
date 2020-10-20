<!--竞品监控->查看->评价-->
<template>
  <div class="container">
    <div class="radio-group">
      <div class="title">评价类型：</div>
      <el-radio-group v-model="evaluateType" size="small" @change="getChartData">
        <el-radio-button label="1">总评价</el-radio-button>
        <el-radio-button label="2">忽略评价</el-radio-button>
        <el-radio-button label="3">好评</el-radio-button>
        <el-radio-button label="4">中评</el-radio-button>
        <el-radio-button label="5">差评</el-radio-button>
        <el-radio-button label="6">晒单</el-radio-button>
      </el-radio-group>
    </div>
    <div class="radio-group">
      <div class="title">时间：</div>
      <el-radio-group v-model="timeType" @change="getChartData">
        <el-radio-button label="1">近7天</el-radio-button>
        <el-radio-button label="2">近15天</el-radio-button>
        <el-radio-button label="3">近30天</el-radio-button>
      </el-radio-group>
    </div>
    <div class="my-chart" id="myChart" style="width: 724px;height:402px;"></div>
  </div>
</template>
<script>
import {
  getMonitorCommentData,
  getMonitorIgnoreCommentData,
  getMonitorGoodCommentsData,
  getMonitorNormalCommentsData,
  getMonitorBadCommentsData,
  getMonitorPicCommentsData
} from "../../../api/monitor";
export default {
  data() {
    return {
      timeType: "1",
      monitoringId: "",
      evaluateType: "1",
      option: {
        tooltip: {
          trigger: "axis"
        },
        legend: {
          textStyle: {
            color: "#333"
          },
          data: [
            {
              name: "趋势"
            }
          ]
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
          type: "value"
        },
        series: [
          {
            name: "趋势",
            type: "line",
            data: [],
            smooth: true
          }
        ],
        textStyle: {
          color: "#333"
        },
        color: ["#f30213", "#4463ff"]
      }
    };
  },
  props: {
    monitorId: {
      type: String
    }
  },
  created() {
    this.monitoringId = this.monitorId;
    this.getChartData();
  },
  methods: {
    async getChartData() {
      const trendDataApi = {
        "1": getMonitorCommentData, //查看总评价变化趋势
        "2": getMonitorIgnoreCommentData, //查看监控忽略评价变化趋势
        "3": getMonitorGoodCommentsData, //查看监控好评变化趋势
        "4": getMonitorNormalCommentsData, //查看监控中评变化趋势
        "5": getMonitorBadCommentsData, //查看监控差评变化趋势
        "6": getMonitorPicCommentsData //查看监控晒单变化趋势
      };
      const params = { id: this.monitoringId, type: this.timeType };
      let { data: trendData } = await trendDataApi[this.evaluateType]({
        params
      });
      if (trendData.code === 200) {
        this.option.xAxis.data = trendData.data.searchTimes;
        this.option.series[0].data = trendData.data.indicators;
        this.drawCharts();
      }
    },
    drawCharts() {
      let myChart = this.$echart.init(document.getElementById("myChart"));
      let option = this.option;
      myChart.setOption(option);
    }
  }
};
</script>
<style lang="scss" scoped>
.radio-group + .radio-group {
  margin-top: 10px;
}
.radio-group {
  display: flex;
  align-items: center;
  .title {
    width: 80px;
    text-align: end;
    color: #333;
    font-size: 12px;
  }
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
.my-chart {
  margin-top: 39px;
}
</style>