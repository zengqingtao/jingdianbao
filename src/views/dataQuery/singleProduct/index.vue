<!--查单品-->
<template>
  <div class="container">
    <!-- 即时查询 -->
    <div class="modul instant-query">
      <div class="query-options">
        <el-form
          class="form"
          ref="form"
          :rules="formRules"
          :model="form"
          label-width="90px"
          @submit.native.prevent
        >
          <el-form-item label="查看端口：">
            <el-radio-group v-model="form.queryPort" size="small">
              <el-radio-button label="0">年龄</el-radio-button>
              <el-radio-button label="1">性别</el-radio-button>
              <el-radio-button label="2">操作系统</el-radio-button>
              <el-radio-button label="3">下单端口</el-radio-button>
              <el-radio-button label="4">地域排名</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="SKU：" prop="sku">
            <el-input
              v-model="form.sku"
              size="small"
              placeholder="请输入要查询的SKU链接或者SKU"
              @focus="clearValidate('sku')"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="progress" v-if="progressToggle">
          <div class="tips">因查询的数据量过大，请耐心等待</div>
          <el-progress :progress="progressNumber" class="ranking-progress"></el-progress>
        </div>
        <div class="btn-group">
          <el-button
            class="btn-primary"
            onfocus="this.blur()"
            type="primary"
            v-if="!progressToggle"
            @click="checkLogin(0)"
          >查询</el-button>
          <el-button class="btn-none" type v-if="progressToggle" @click="cancelProgress">取消</el-button>
          <el-button class="btn-none" type v-if="!progressToggle" @click="reset">重置</el-button>
        </div>
      </div>
      <div class="query-results" v-if="allData">
        <el-radio-group class="radio-group" v-model="days" size="small" @change="changeDays">
          <el-radio-button label="1">7天</el-radio-button>
          <el-radio-button label="2">15天</el-radio-button>
          <el-radio-button label="3">30天</el-radio-button>
        </el-radio-group>
        <!-- 访客数 -->
        <div class="data-area" v-if="!isArea">
          <div class="chart">
            <div class="chart-title">访客数</div>
            <div v-if="!currentChooseNullData">
              <div class="category">商品名称：{{description}}</div>
              <div class="my-chart" id="visitor-chart"></div>
            </div>
            <!-- 没数据 -->
            <div class="null-img" v-if="currentChooseNullData">
              <img src="../../../assets/images/null.png" alt />
            </div>
          </div>
        </div>
        <!-- 表格 -->
        <div>
          <div class="table-category" v-if="form.queryPort=='4'">商品名称：{{description}}</div>
          <div class="table" v-if="visitorTableData.length !== 0">
            <div class="flex-box">
              <div class="table-item" v-for="(item,index) in visitorTableData" :key="index">
                <p class="first">{{item.name}}</p>
                <p class="second">{{item.value}}人</p>
              </div>
            </div>
          </div>
          <div class="table" v-else>
            <p class="null-data">暂无数据</p>
          </div>
        </div>
        <!-- 下单量 -->
        <div class="data-area order-chart-box" v-if="!isArea">
          <div class="chart" ref="chart">
            <div class="chart-title">下单量</div>
            <div v-if="!currentChooseNullData">
              <div class="my-chart" id="order-chart"></div>
            </div>
            <!-- 没数据 -->
            <div class="null-img" v-if="currentChooseNullData">
              <img src="../../../assets/images/null.png" alt />
            </div>
          </div>
        </div>
        <!-- 表格 -->
        <div>
          <div class="table" v-if="orderTableData.length !== 0">
            <div class="flex-box">
              <div class="table-item" v-for="(item,index) in orderTableData" :key="index">
                <p class="first">{{item.name}}</p>
                <p class="second">{{item.value}}单</p>
              </div>
            </div>
          </div>
          <div class="table" v-else>
            <p class="null-data">暂无数据</p>
          </div>
        </div>
        <!-- 转化率 -->
        <div>
          <!-- 表格 -->
          <div class="trasform-rate" v-if="rateTableData.length !== 0">转化率</div>
          <div class="table order-table" v-if="rateTableData.length !== 0">
            <div class="flex-box">
              <div class="table-item" v-for="(item,index) in rateTableData" :key="index">
                <p class="first">{{item.name}}</p>
                <p class="second">{{item.value}}%</p>
              </div>
            </div>
          </div>
          <div class="table" v-else>
            <p class="null-data">暂无数据</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 弹框 -->
    <up-grade :errorMsg="errorMsg" v-if="isShowUpGrade" @closeDialog="isShowUpGrade = false"></up-grade>
  </div>
</template>
<script>
import Config from "../../../config";
import elProgress from "../../../components/progress";
import { skuReg } from "@/utils/common";
import upGrade from "../../dialog/upGrade";
import {
  searchDmpMultiDateData,
  checkTodayIsLogin,
  checkIsNotifySpeed
} from "@/api/dmp.js";
import { mapState } from "vuex";

let timer = null;
export default {
  name: "industry",
  data() {
    let skuValidate = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("SKU不能为空"));
      } else if (!skuReg(this.form.sku)) {
        callback(new Error("SKU链接格式不正确"));
      } else {
        callback();
      }
    };
    return {
      Config,
      form: {
        queryPort: "0",
        sku: ""
      },
      formRules: {
        sku: [{ validator: skuValidate, trigger: ["blur"] }]
      },
      module: 2, //0行业，1店铺，2单品
      isArea: false, // 是否是地域
      currentChooseNullData: false, // 当前选择的天数没数据
      allData: false, // 全部没数据
      description: "", //三级类目
      last7Result: {},
      last15Result: {},
      last30Result: {},
      visitorChartOption: {
        // 访客数echart数据
        // title: {
        //   text: "访客数",
        //   x: "center"
        // },
        color: [
          "#f1a02d",
          "#ff7c00",
          "#1e8420",
          "#a577ed",
          "#c31e2f",
          "#228fa8",
          "#7090eb",
          "#a577ed",
          "#c31e2f",
          "#776718"
        ],
        tooltip: { trigger: "item", formatter: "{a} <br/>{b} : {c} ({d}%)" },
        legend: {
          orient: "vertical",
          left: 0,
          top: 50,
          data: [],
          textStyle: { color: "#333" }
        },
        series: [
          {
            name: "查单品",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [],
            label: {
              normal: {
                formatter: "{b}:{c}: ({d}%)",
                textStyle: {
                  color: "#333"
                }
              }
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 0, //鼠标移入饼状图显示的阴影大小
                shadowOffsetX: 0,
                shadowColor: "#333"
              },
              normal: {
                label: {
                  show: true,
                  formatter: "{b} : {c} ({d}%)"
                },
                labelLine: { show: true }
              }
            },
            minAngle: 5
          }
        ]
      },
      orderChartOption: {
        // 下单量echart数据
        // title: {
        //   text: "下单量",
        //   x: "center"
        // },
        color: [
          "#f1a02d",
          "#ff7c00",
          "#1e8420",
          "#a577ed",
          "#c31e2f",
          "#228fa8",
          "#7090eb",
          "#a577ed",
          "#c31e2f",
          "#776718"
        ],
        tooltip: { trigger: "item", formatter: "{a} <br/>{b} : {c} ({d}%)" },
        legend: {
          orient: "vertical",
          left: 0,
          top: 50,
          data: [],
          textStyle: { color: "#333" }
        },
        series: [
          {
            name: "查单品",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [],
            label: {
              normal: {
                formatter: "{b}:{c}: ({d}%)",
                textStyle: {
                  color: "#333"
                }
              }
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 0, //鼠标移入饼状图显示的阴影大小
                shadowOffsetX: 0,
                shadowColor: "#333"
              },
              normal: {
                label: {
                  show: true,
                  formatter: "{b} : {c} ({d}%)"
                },
                labelLine: { show: true }
              }
            },
            minAngle: 5
          }
        ]
      },
      visitorTableData: [], // 访客数表格数据
      orderTableData: [], // 下单量表格数据
      rateTableData: [], // 转化率表格数据
      days: "1",
      progressNumber: 0,
      progressToggle: false,
      errorMsg: "",
      isShowUpGrade: false
    };
  },
  components: {
    elProgress,
    upGrade
  },
  computed: { ...mapState(["isLogin"]) },
  methods: {
    checkLogin(id) {
      let isFast = id;
      //检查是否已登录
      if (!this.isLogin) {
        this.$store.commit("LOGIN_MODAL_TOGGLE", {
          toggle: true,
          loginType: 2
        });
        return;
      } else {
        this.$refs["form"].validate(async valid => {
          if (valid) {
            this.search(isFast);
          }
        });
      }
    },
    async search(isFast) {
      this.isShowUpGrade = false;
      //查询
      this.progressStart();
      let params = {
        filterType: this.form.queryPort,
        sku: this.form.sku,
        module: this.module,
        isFast: isFast
      };
      const { data: res } = await searchDmpMultiDateData(params);
      this.progressEnd();
      switch (res.code) {
        case 200:
          this.description = res.data.description;
          // 判断如果没数据就不显示
          let dataList = Object.keys(res.data).map(key => res.data[key]);
          dataList.length = dataList.length - 1;
          if (dataList.every(item => item.visitor == null)) {
            this.$message({ type: "warning", message: "暂时没有数据" });
            this.allData = false;
            return;
          }
          this.allData = true;
          this.last7Result = res.data.last7Result;
          this.last15Result = res.data.last15Result;
          this.last30Result = res.data.last30Result;
          // // 判断数据不为空就优先显示
          let currentData =
            res.data.last7Result.visitor == null
              ? res.data.last15Result.visitor == null
                ? res.data.last30Result
                : res.data.last15Result
              : res.data.last7Result;
          this.days =
            res.data.last7Result.visitor == null
              ? res.data.last15Result.visitor == null
                ? "3"
                : "2"
              : "1";
          this.getData(currentData);
          break;
        case 2005:
          this.$message({ type: "warning", message: res.data.msg });
          break;
        case 8028:
          //当前会员等级没有权限使用此功能
          this.isShowUpGrade = true;
          this.errorMsg = searchRes.msg;
          break;
        default:
          this.$message.error(res.msg);
      }
    },
    //获取图表内容
    getData(val, isScroll = true) {
      // 初始化
      this.visitorTableData = [];
      this.orderTableData = [];
      this.rateTableData = [];
      this.visitorChartOption.legend.data = [];
      this.visitorChartOption.series[0].data = [];
      this.orderChartOption.legend.data = [];
      this.orderChartOption.series[0].data = [];
      // 判断该天数是否有数据，没有就停止
      if (val.visitor == null) {
        this.currentChooseNullData = true;
        return;
      }
      this.isArea = this.form.queryPort == "4" ? true : false; // 如果是地域就不显示饼图，否则反之
      //  赋值
      this.visitorTableData = val.visitor.result;
      this.orderTableData = val.order.result;
      this.rateTableData = val.rate.result;
      this.currentChooseNullData = false;
      this.visitorChartOption.legend.data = val.visitor.pieChart.nameList;
      this.visitorChartOption.series[0].data = val.visitor.pieChart.valueList;
      this.orderChartOption.legend.data = val.order.pieChart.nameList;
      this.orderChartOption.series[0].data = val.order.pieChart.valueList;
      // 不是地域才渲染饼图
      if (!this.isArea) {
        this.drawCharts();
      }
      //   if (isScroll) {
      //     //重新搜索才执行
      //     this.scrollToBottom();
      //   }
    },
    // 绘制饼图
    drawCharts() {
      this.$nextTick(() => {
        let visitorChart = this.$echart.init(
          document.getElementById("visitor-chart")
        );
        visitorChart.setOption(this.visitorChartOption);
        let orderChart = this.$echart.init(
          document.getElementById("order-chart")
        );
        orderChart.setOption(this.orderChartOption);
      });
    },
    changeDays() {
      let list =
        this.days == "1"
          ? this.last7Result
          : this.days == "2"
          ? this.last15Result
          : this.last30Result;
      this.getData(list, false);
    },
    clearValidate(propValue) {
      this.$refs.form.clearValidate(propValue);
    },
    progressStart() {
      //进度条开始跑
      this.progressToggle = true;
      this.progressNumber = 0;
      timer = setInterval(() => {
        this.progressNumber++;
        if (this.progressNumber >= 98) {
          this.progressNumber = 98;
        }
      }, 200);
    },
    progressEnd() {
      //结束进度条
      clearInterval(timer);
      this.progressToggle = false;
      timer = setInterval(() => {
        this.progressNumber++;
        if (this.progressNumber >= 100) {
          clearInterval(timer);
          this.progressNumber = 100;
          let closeProgressTimer = setTimeout(() => {
            clearTimeout(closeProgressTimer);
            this.progressNumber = 0;
          }, 1500);
        }
      }, 0);
    },
    cancelProgress() {
      //取消查询
      clearInterval(timer);
      this.progressToggle = false;
      this.progressNumber = 0;
    },
    reset() {
      //重置
      this.form = {
        queryPort: "0",
        sku: ""
      };
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  // height: 100%;
}
.modul {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 3px 24px 0px rgba(168, 168, 236, 0.22);
}
//即时查询
.instant-query {
  padding: 30px 10px 20px;
  .query-options {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .form {
      width: 530.8px;
      /deep/ .el-input {
        width: 440px;
      }
      /deep/ .el-input__inner {
        height: 30px;
      }
      /deep/ .el-form-item__label {
        color: #333;
        height: 30px;
        line-height: 30px;
      }
      /deep/ .el-form-item__content {
        height: 30px;
        line-height: 30px;
      }
      /deep/ .el-form-item {
        margin-bottom: 18px;
      }
      .el-radio-button +.el-radio-button {
        margin-left: 10px;
      }
      /deep/ .el-radio-button__inner {
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        width: 80px;
        height:30px;
        box-shadow: none;
      }
    }
    .btn-group {
      margin-top:10px;
      display: flex;
      /deep/ .el-button {
        width: 120px;
        padding: 0;
        line-height: 30px;
      }
      .btn-primary:hover {
        background-color: #3159e4;
      }
      .btn-none {
        color: #4d75ff;
        border: 1px solid #4d75ff;
        background-color: #fff;
      }
      .btn-none:hover {
        color: #fff;
        background-color: #4d75ff;
      }
    }
    .progress {
      margin-bottom: 10px;
      .tips {
        color: var(--DBlue);
        font-size: 14px;
        text-align: center;
        padding-bottom: 10px;
      }
    }
  }
  .query-results {
    width: 931px;
    box-sizing: border-box;
    padding: 10px 15px 10px 10px;
    .radio-group {
      margin: 30px 0 10px;
    }
    /deep/ .el-radio-button {
      margin-right: 10px;
    }
    /deep/ .el-radio-button__inner {
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      box-shadow: none;
    }
    .data-area {
      width: 100%;
      .chart {
        border: solid 1px #eee;
        background: #fff;
        height: 378px;
        position: relative;
        .category {
          position: absolute;
          top: 75px;
          left: 52px;
          color: #333;
          font-size: 12px;
          font-weight: 400;
        }
        .chart-title {
          color: #333;
          font-size: 16px;
          font-weight: bold;
          text-align: center;
          margin-top: 20px;
        }
        /deep/ .my-chart {
          width: 774px;
          height: 305px;
          margin: 15px 98px 0 45px;
        }
        .null-img {
          height: 305px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
    .order-chart-box {
      margin-top: 40px;
    }
    .table-category {
      text-align: end;
      font-size: 14px;
    }
    .table {
      width: 100%;
      height: 100px !important;
      margin-top: 10px;
      border: 1px solid #eee;
      display: flex;
      background-color: #fff;
      .null-data {
        line-height: 100px;
        text-align: center;
        width: 100%;
      }
      p {
        color: #333;
        font-size: 12px;
      }
      .flex-box {
        display: flex;
        width: 100%;
        .table-item {
          flex: 1;
        }
      }
      .first {
        line-height: 48px;
        text-align: center;
        border-bottom: 1px solid #eee;
      }
      .second {
        line-height: 48px;
        text-align: center;
      }
    }
    .order-table {
      margin-top: 0;
    }
    .trasform-rate {
      margin-top: 10px;
      width: 70px;
      height: 30px;
      line-height: 30px;
      background-color: #eee;
      color: #333;
      font-size: 12px;
      font-weight: 400px;
      text-align: center;
    }
  }
}
</style>