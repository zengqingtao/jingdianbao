<!--竞品监控->查看->评价-->
<template>
  <div class="container">
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="isShowDialog"
      :center="true"
      @close="closeDialog"
      width="700px"
      height="500px"
      class="dialog"
    >
      <div class="search-date">
        <span class="time">时间:</span>
        <el-radio-group v-model="activeRadio" @change="getChartData">
          <el-radio label="1">近7天</el-radio>
          <el-radio label="2">近15天</el-radio>
          <el-radio label="3">近30天</el-radio>
        </el-radio-group>
      </div>
      <div class="my-chart" id="myChart" style="width: 600px;height:300px;"></div>
    </el-dialog>
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
} from "../../api/monitor";
export default {
  data() {
    return {
      isShowDialog: true,
      activeRadio: "1",
      echartsType: 1,
      monitoringId: "",
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
            data: []
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
    type: {
      type: Number
    },
    monitorId: {
      type: String
    }
  },
  created() {
    this.echartsType = this.type;
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
      const params = { id: this.monitoringId, type: this.activeRadio };
      let { data: trendData } = await trendDataApi[this.echartsType]({
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
    },
    closeDialog() {
      this.$emit("closeDialog");
    }
  }
};
</script>
<style lang="scss" scoped>
.dialog {
  .search-date {
      margin-bottom: 20px;
    .time {
      color: #333;
      font-size: 14px;
      margin-right:10px;
    }
    /deep/ .el-radio {
      margin-right: 20px;
    }
    /deep/ .el-radio__label {
      color: #333;
    }
  }
  /deep/ .el-icon-close {
    width: 30px;
    height: 30px;
    line-height: 30px;
    color: #fff !important;
    border: 1px solid #fff;
    border-radius: 50%;
  }

  /deep/ .el-dialog__headerbtn {
    right: -40px;
    top: 0px;
  }
}
</style>