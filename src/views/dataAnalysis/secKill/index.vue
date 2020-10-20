<!--秒杀分析-->
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
          <el-form-item label="查看时间：">
            <el-radio-group v-model="form.queryTime" size="small" @change="getCatData">
              <el-radio-button label="1">昨天</el-radio-button>
              <el-radio-button label="2">近7天</el-radio-button>
              <el-radio-button label="3">近15天</el-radio-button>
              <el-radio-button label="4">近30天</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="选择类目：" prop="selectedOptions">
            <el-cascader
              :options="catSelectOptions"
              placeholder="请输入类目名称或下拉选择类目"
              v-model="form.selectedOptions"
              filterable
              clearable
              @focus="clearValidate('selectedOptions')"
            ></el-cascader>
          </el-form-item>
        </el-form>
        <div class="btn-group">
          <el-button
            class="btn-primary"
            onfocus="this.blur()"
            type="primary"
            :loading="searchLoading"
            @click="checkLogin()"
          >查询</el-button>
          <el-button class="btn-none" @click="reset">重置</el-button>
        </div>
      </div>
      <div class="query-results" v-if="showResults">
        <div class="echart-box" ref="chart">
          <div class="title">京东秒杀三级类目商品量分布</div>
          <div v-if="chartOption.legend.data.length">
            <div class="tips">
              <div>三级类目：{{searchCat}}</div>
              <div>自营：{{selfCount}}个</div>
              <div>POP：{{popCount}}个</div>
            </div>
            <div class="my-chart" id="secondKillChart"></div>
          </div>
          <div v-else class="null-img">
            <img src="../../../assets/images/null.png" alt />
          </div>
        </div>
        <div class="table" id="table">
          <el-table :data="tableData">
            <el-table-column prop="num" label="序号" width="50" align="center"></el-table-column>
            <el-table-column prop="dateTime" label="时段" width="110" align="center">
              <template slot-scope="scope">
                <div>{{`${scope.row.dateTime.split(" ")[0]}`}}</div>
                <div>{{`${scope.row.dateTime.split(" ")[1]}`}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="thirdCategory" label="三级类目" align="center"></el-table-column>
            <el-table-column prop="sku" label="sku"></el-table-column>
            <el-table-column label="秒杀创意" width="120" align="center">
              <template slot-scope="scope">
                <img :src="scope.row.imageUrl" alt style="height:100px;width:100px" />
              </template>
            </el-table-column>
            <el-table-column label="秒杀标题" width="120" align="center">
              <template slot-scope="scope">
                <a
                  :href="scope.row.url"
                  class="kill-title --text-mouse-hover"
                  target="_blank"
                >{{scope.row.title}}</a>
              </template>
            </el-table-column>
            <el-table-column prop="secondTitle" label="商品副标题" width="150" align="center"></el-table-column>
            <el-table-column prop="price" label="促销价格" align="center"></el-table-column>
            <el-table-column prop="address" label="秒杀分析" align="center">
              <template slot-scope="scope">
                <el-button
                  class="btn-reviewDetails"
                  @click="handleClickDetails(scope.row)"
                  onfocus="this.blur()"
                  type="text"
                  size="small"
                >查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination" v-if="tableTotalCount > 10">
            <el-pagination
              background
              layout="prev, pager, next"
              prev-text="上一页"
              next-text="下一页"
              :total="tableTotalCount"
              :current-page="tableDataPage"
              @current-change="tablePageChange"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
    <!-- 升级对话框 -->
    <up-grade
      :errorMsg="errorMsg"
      type="秒杀分析"
      v-if="isShowUpGrade"
      @closeDialog="isShowUpGrade = false"
    ></up-grade>
    <!-- 详情分析对话框 -->
    <sec-kill-details
      v-if="isShowSecKillDetails"
      :pid="detailId"
      @closeDialog="isShowSecKillDetails = false"
    ></sec-kill-details>
  </div>
</template>
<script>
import Config from "../../../config";
import elProgress from "../../../components/progress";
import { skuReg } from "@/utils/common";
// import { checkLogin } from "../../../api/user";
import upGrade from "../../dialog/upGrade";
import secKillDetails from "../../dialog/secKIllDetails";
import {
  getItemCategory,
  getThirdCategoryPieChart,
  getMiaoshaList
} from "../../../api/secondKill.js";
import { mapState } from "vuex";

let timer = null;
export default {
  name: "",
  data() {
    let optionsValidate = (rule, value, callback) => {
      if (value.length == 0) {
        callback(new Error("类目不能为空"));
      } else {
        callback();
      }
    };
    return {
      Config,
      searchLoading: false,
      showResults: false,
      tableData: [],
      form: {
        queryTime: "1",
        selectedOptions: []
      },
      formRules: {
        selectedOptions: [{ validator: optionsValidate, trigger: ["blur"] }]
      },
      catSelectOptions: [],
      tableDataPage: 1,
      tableTotalCount: 0,
      chartOption: {
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
        // title: {
        //   text: "京东秒杀三级类目商品量分布",
        //   x: "center",
        //   color: "#333",
        //   fontSize: 18,
        //   fontWeight: "bolder"
        //   //主标题文本样式{"fontSize": 18,"fontWeight": "bolder","color": "#333"}
        // },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: 0,
          top: 50,
          data: [],
          textStyle: {
            color: "#333"
          }
        },
        series: [
          {
            name: "三级类目",
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
                shadowColor: "rgba(115,159,255,1)"
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
      selfCount: 0, //自营
      popCount: 0, //POP
      searchCat: "", //搜索的类目
      isShowSecKillDetails: false,
      detailId: 1,
      isShowUpGrade: false
    };
  },
  components: {
    elProgress,
    upGrade,
    secKillDetails
  },
  computed: {
    ...mapState(["isLogin"])
  },
  created() {
    this.getCatData();
  },
  methods: {
    //获取商品数据列表并渲染
    async getCatData() {
      let { data: res } = await getItemCategory({
        params: { dateType: this.form.queryTime }
      });
      if (res.code === 200) {
        this.catSelectOptions = res.data;
      }
    },

    async checkLogin() {
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
            // 点击查询，查询第一页数据，故传参数1
            this.search(1);
          }
        });
      }
    },
    async search(page) {
      this.tableDataPage = page ? page : this.tableDataPage;
      this.searchLoading = true;
      this.isShowUpGrade = false;
      //查询
      let params = {
        dateType: this.form.queryTime,
        firstCategory: this.form.selectedOptions[0],
        secondCategory: this.form.selectedOptions[1],
        thirdCategory: this.form.selectedOptions[2],
        page: this.tableDataPage
      };
      const { data: res } = await getMiaoshaList({ params });
      this.searchLoading = false;

      switch (res.code) {
        case 200:
          this.tableData = res.data.results;
          this.tableTotalCount = res.data.totalCount;
          this.initChartOptions();
          if (!this.tableData.length) {
            this.showResults = true;
            break; //第一个接口空了代表数据空就停止
          }
          this.getChartData();
          break;
        case 2005:
          this.$message({ type: "warning", message: res.data.msg });
          break;
        case 8028:
          //当前会员等级没有权限使用此功能
          this.isShowUpGrade = true;
          this.errorMsg = res.msg;
          break;
        default:
          this.$message.error(res.msg);
      }
    },
    initChartOptions() {
      this.chartOption.legend.data = [];
      this.chartOption.series[0].data = [];
    },
    async getChartData() {
      const params = {
        dateType: this.form.queryTime,
        firstCategory: this.form.selectedOptions[0],
        secondCategory: this.form.selectedOptions[1],
        thirdCategory: this.form.selectedOptions[2]
      };
      let { data: chartRes } = await getThirdCategoryPieChart({
        params: params
      });
      if (chartRes.code === 200) {
        this.chartOption.legend.data = chartRes.data.nameList;
        this.chartOption.series[0].data = chartRes.data.valueList;
        this.selfCount = chartRes.data.selfCount || 0;
        this.popCount = chartRes.data.popCount || 0;
        this.searchCat = chartRes.data.thirdCategory || "";
        this.drawCharts();
      }
    },
    drawCharts() {
      this.showResults = true;
      this.$nextTick(() => {
        let myChart = this.$echart.init(
          document.getElementById("secondKillChart")
        );
        let option = this.chartOption;
        myChart.setOption(option);
        myChart.on("click", this.clickChart);
        myChart.on("mouseout", e => {
          myChart.dispatchAction({
            type: "highlight",
            name: this.searchCat
          });
        });
        myChart.dispatchAction({
          type: "highlight",
          name: this.searchCat
        });
      });
    },
    clickChart(param) {
      this.form.selectedOptions[2] = param.data.name;
      this.search();
    },
    handleClickDetails(row) {
      this.detailId = row.id;
      this.isShowSecKillDetails = true;
    },
    tablePageChange(currentPage) {
      this.tableDataPage = currentPage;
      this.search();
      document.querySelector("#table").scrollIntoView();
    },
    clearValidate(propValue) {
      this.$refs.form.clearValidate(propValue);
    },
    reset() {
      //重置
      this.form = {
        queryTime: "1"
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
      /deep/ .el-radio-button {
        margin-right: 10px;
      }
      /deep/ .el-radio-button__inner {
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        width: 80px;
        height:30px;
        box-shadow: none;
      }
      /deep/ .el-cascader{
        line-height: 30px;
        .el-icon-arrow-down,.el-icon-arrow-down.is-reverse,.el-icon-circle-close{
          line-height: 30px;
        }
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
    }
  }
  .query-results {
    width: 931px;
    padding: 10px;
    .echart-box {
      width: 100%;
      height: 438px;
      border: 1px solid #eee;
      margin-top: 30px;
      position: relative;
      .title {
        color: #333;
        font-size: 16px;
        font-weight: bold;
        text-align: center;
        margin-top: 19px;
      }
      .tips {
        position: absolute;
        top: 48px;
        left: 55px;
        color: #333;
        font-size: 12px;
        div {
          line-height: 20px;
        }
      }
      .my-chart {
        width: 800px;
        height: 341px;
        margin: 27px 0 0 50px;
      }
      .null-img {
        width: 100%;
        height: 281px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .table {
      padding-top: 10px;
      /deep/ .el-table {
        border: 1px solid #eee;
        border-bottom: 0;
      }
      .kill-title {
        color: #333;
      }
      .btn-reviewDetails:hover {
        color: var(--JBlue);
      }
      .pagination {
        text-align: center;
        margin-top: 10px;
      }
    }
  }
}
</style>