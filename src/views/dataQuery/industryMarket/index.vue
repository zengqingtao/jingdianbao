<!--行业大盘查询-->
<template>
  <div class="industryMarket-container">
    <div class="query-options-and-resultsTable">
      <div class="query-options">
        <div class="category-box">
          <div class="category-level first-level-category">
            <span>一级类目：</span>
            <el-select
              v-model="firstLevelCategory"
              placeholder="请选择一级类目"
              :popper-append-to-body="false"
              :class="firstLevelCategoryList.length<=1?'category-empty':''"
              @change="getSecondCategoroy(firstLevelCategory)"
            >
              <el-option
                v-for="(item,index) in firstLevelCategoryList"
                :key="index"
                :label="item.name"
                :value="item.categoryId"
              ></el-option>
            </el-select>
          </div>
          <div class="category-level secondary-level-category">
            <span>二级类目：</span>
            <el-select
              v-model="secondaryLevelCategory"
              placeholder="请选择二级类目"
              :popper-append-to-body="false"
              :class="secondaryLevelCategoryList.length<=1?'category-empty':''"
              @change="getThirdCategoroy(secondaryLevelCategory)"
            >
              <el-option
                v-for="(item,index) in secondaryLevelCategoryList"
                :key="index"
                :label="item.name"
                :value="item.categoryId"
              ></el-option>
            </el-select>
          </div>
          <div class="category-level tertiary-level-category">
            <span>三级类目：</span>
            <el-select
              v-model="tertiaryLevelCategory"
              placeholder="请选择三级类目"
              :popper-append-to-body="false"
              :class="tertiaryLevelCategoryList.length<=1?'category-empty':''"
            >
              <el-option
                v-for="(item,index) in tertiaryLevelCategoryList"
                :key="index"
                :label="item.name"
                :value="item.categoryId"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="time-range">时间范围：近30天</div>
        <div class="btn-group">
          <el-button
            type="primary"
            class="--btn-primary"
            onfocus="this.blur()"
            @click="search"
            :loading="searchLoading"
          >查询</el-button>
        </div>
      </div>
      <div class="query-results-table" v-if="resultsVisible">
        <el-table :data="tableData">
          <el-table-column label="访客数" prop="visitorValue" align="center"></el-table-column>
          <el-table-column label="成交客户数" prop="buyValue" align="center"></el-table-column>
          <el-table-column label="关注人数" prop="attentionValue" align="center"></el-table-column>
          <el-table-column label="加购人数" prop="addValue" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="query-results-chart-box" v-if="resultsVisible">
      <el-radio-group v-model="timeRange">
        <el-radio-button label="month">月份</el-radio-button>
        <el-radio-button label="day">每天</el-radio-button>
      </el-radio-group>
      <div class="veLine">
        <ve-line
          :data="chartData"
          :settings="chartSettings"
          :legend="legend"
          :colors="colors"
          :data-empty="!chartData.rows?true:false"
        ></ve-line>
        <div class="veLine-title">{{chartTitle}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import "echarts/lib/component/title";
import {
  getFirstCategoroy,
  getSecondCategoroy,
  getThirdCategoroy,
  getBigBoardAnalyzeResult,
} from "../../../api/ranking";
import { checkLogin } from "../../../api/user";
export default {
  data() {
    this.legend = {
      bottom: "10px",
    };
    this.colors = [
      "#F64350",
      "#4463FF",
      "#10DD2D",
      "#F4AD16",
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
        visitorValue: "访客数",
        buyValue: "成交客户数",
        attentionValue: "关注人数",
        addValue: "加购人数",
      },
    };
    return {
      isLogin: false,
      resultsVisible: false,
      firstLevelCategoryList: [],
      firstLevelCategory: "",
      secondaryLevelCategoryList: [],
      secondaryLevelCategory: "",
      tertiaryLevelCategoryList: [],
      tertiaryLevelCategory: "",
      tableData: [],
      timeRange: "month",
      chartData: {
        columns: [
          "date",
          "visitorValue",
          "buyValue",
          "attentionValue",
          "addValue",
        ],
        rows: [],
      },
      chartTitle:'每个月的大盘数据',
      marketData: [],
      searchLoading:false
    };
  },
  watch: {
    timeRange() {
        if(this.timeRange==='month'){
          this.chartTitle = '每个月的大盘数据'
          this.chartData.rows = this.marketData[0]
        }else{
          this.chartData.rows = this.marketData[1]
          this.chartTitle = '近30天的大盘数据'
        }
    },
  },
  mounted() {
    this.checkLogin();
  },
  methods: {
    async checkLogin() {
      let { data: res } = await checkLogin();
      switch (res.code) {
        case 200:
          this.isLogin = true;
          this.getFirstCategoroy();
          break;
        case 2003:
          this.$store.commit("LOGIN_MODAL_TOGGLE", {
            toggle: true,
            loginType: 2,
          });
        default:
          this.$message.error(res.msg);
      }
    },
    async getFirstCategoroy() {
      let { data: res } = await getFirstCategoroy();
      if (res.code === 200) {
        if (res.data.length !== 0) {
          this.firstLevelCategoryList = res.data;
          this.firstLevelCategory = res.data[0].categoryId;
          this.getSecondCategoroy(res.data[0].categoryId);
        }
      } else {
        this.$message.error(res.msg);
      }
    },
    async getSecondCategoroy(firstLevelCategory) {
      let params = {
        categoryId: firstLevelCategory,
      };
      let { data: res } = await getSecondCategoroy({ params });
      if (res.code === 200) {
        let aLLSecondCategoroy = {
          name: "全部",
          categoryId: -1,
        };
        res.data.unshift(aLLSecondCategoroy);
        this.secondaryLevelCategoryList = res.data;
        this.secondaryLevelCategory = this.secondaryLevelCategoryList[0].categoryId;
        this.tertiaryLevelCategoryList = [{ name: "全部", categoryId: -1 }];
        this.tertiaryLevelCategory = this.tertiaryLevelCategoryList[0].categoryId;
      } else {
        this.$message.error(res.msg);
      }
    },
    async getThirdCategoroy(secondaryLevelCategory) {
      let params = {
        secondCategoryId: secondaryLevelCategory,
      };
      let { data: res } = await getThirdCategoroy({ params });
      if (res.code === 200) {
        let aLLThirdCategoroy = {
          name: "全部",
          categoryId: -1,
        };
        res.data.unshift(aLLThirdCategoroy);
        this.tertiaryLevelCategoryList = res.data;
        this.tertiaryLevelCategory = this.tertiaryLevelCategoryList[0].categoryId;
      } else {
        this.$message.error(res.msg);
      }
    },
    async search() {
      if (!this.isLogin) return;
      else {
        if (this.firstLevelCategory === "")
          return this.$message.error("请选择类目");
      }
      this.searchLoading = true
      let params = {
        firstId: this.firstLevelCategory,
        secondId: this.secondaryLevelCategory,
        thirdId: this.tertiaryLevelCategory,
      };
      let { data: res } = await getBigBoardAnalyzeResult({ params });
      this.searchLoading = false
      this.tableData = [];
      this.marketData = [];
      this.resultsVisible = true;
      if (res.code === 200) {
        this.tableData[0] = res.data.today;
        this.marketData[0] = res.data.everyMonthList;
        this.marketData[1] = res.data.everyDayList;
        this.chartData.rows =
          this.timeRange === "month"
            ? res.data.everyMonthList
            : res.data.everyDayList;
      } else {
        this.$message.error(res.msg);
      }
    },
  },
};
</script>
<style>
/* 折线图没有数据时用到 */
@import "v-charts/lib/style.css";
</style>
<style lang="scss" scoped>
.industryMarket-container {
  .query-options-and-resultsTable {
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0px 3px 24px 0px rgba(168, 168, 236, 0.22);
    .query-options {
      padding: 40px 49px 15px;
      .category-box {
        display: flex;
        color: #333;
        font-size: 14px;
        .category-level {
          display: flex;
          align-items: center;
          margin-left: 15px;
          span {
            min-width: 72px;
          }
          /deep/ .el-input__inner {
            height: 30px;
          }
          /deep/ .el-input__icon {
            line-height: 30px;
          }
          // 修改选项器默认样式
          /deep/ .el-select-dropdown {
            border: 0;
            border-radius: 10px;
            box-shadow: 1px 3px 24px 0px rgba(169, 169, 236, 0.22);
            .el-select-dropdown__list {
              width: 916px;
              display: flex;
              flex-wrap: wrap;
              padding: 5px 50px;
              .el-select-dropdown__item {
                width: 25%;
              }
            }
          }
          // 类目为空或者只有一个时修改回原来的样式
          .category-empty {
            /deep/ .el-select-dropdown__list {
              width: 100%;
              padding: 5px;
              .el-select-dropdown__item {
                width: 100%;
              }
            }
            /deep/ .el-select-dropdown {
              left: 0 !important;
              border-radius: 4px;
            }
            /deep/ .popper__arrow {
              left: 35px !important;
            }
          }
          /deep/ .el-scrollbar__bar.is-vertical {
            width: 4px;
            .el-scrollbar__thumb {
              background-color: #4d75ff;
            }
          }
        }
        .category-level:first-child {
          margin-left: 0;
        }
        // 一级类目选择器
        .first-level-category {
          /deep/ .el-select-dropdown {
            left: -94px !important;
          }
          /deep/ .popper__arrow {
            left: 172px !important;
          }
        }
        // 二级类目选择器
        .secondary-level-category {
          /deep/ .el-select-dropdown {
            left: -388px !important;
          }
          /deep/ .popper__arrow {
            left: 480px !important;
          }
        }
        // 三级类目选择器
        .tertiary-level-category {
          /deep/ .el-select-dropdown {
            left: -682px !important;
          }
          /deep/ .popper__arrow {
            left: 769px !important;
          }
        }
      }
      .time-range {
        font-size: 14px;
        margin-top: 20px;
      }
      .btn-group {
        display: flex;
        justify-content: center;
        margin-top: 12px;
        /deep/ .el-button {
          width: 120px;
          height: 30px;
          padding: 0;
        }
      }
      // 类目选择器
    }
    .query-results-table {
      padding: 0 15px 15px;
      /deep/ .el-table {
        border: 1px solid #ebeef5;
        border-bottom: 0;
        color: #333;
        font-size: 12px;
      }
    }
  }
  .query-results-chart-box {
    padding: 19px 17px 10px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0px 3px 24px 0px rgba(168, 168, 236, 0.22);
    margin-top: 10px;
    /deep/ .el-radio-button + .el-radio-button {
      margin-left: 10px;
    }
    /deep/ .el-radio-button__inner {
      width: 80px;
      height: 30px;
      line-height: 30px;
      padding: 0;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      box-shadow: none;
    }
    .veLine {
      padding: 10px 60px 0 80px;
      position: relative;
      .veLine-title {
        position: absolute;
        top: 25px;
        left: 50%;
        font-size: 14px;
        color: #333;
        margin-left: -56px;
      }
    }
  }
}
</style>