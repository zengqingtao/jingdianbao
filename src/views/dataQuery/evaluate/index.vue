<!--查留评率-->
<template>
  <div class="container">
    <!-- 即时查询 -->
    <div class="modul instant-query">
      <div class="query-options">
        <el-form class="form" ref="form" :rules="formRules" :model="form" label-width="90px">
          <el-form-item label="统计维度：">
            <el-radio-group v-model="form.dimension" size="small">
              <el-radio-button label="1">sku评价</el-radio-button>
              <el-radio-button label="0">spu评价</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="评价时间：" prop="dateList">
            <el-date-picker
              v-model="form.dateList"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              value-format="yyyy-MM-dd"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
            ></el-date-picker>
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
          <el-progress :progress="progressNumber" class="ranking-progress"></el-progress>
        </div>
        <div class="btn-group">
          <el-button
            class="--btn-primary"
            onfocus="this.blur()"
            type="primary"
            v-if="!progressToggle"
            @click="checkLogin"
          >查询</el-button>
          <el-button class="--btn-none" type v-if="progressToggle" @click="cancelProgress">取消</el-button>
          <el-button class="--btn-none" type v-if="!progressToggle" @click="reset">重置</el-button>
        </div>
      </div>
      <div class="query-results" id="query-results" v-if="resultsVisible">
        <div>
          <div class="tabs-box">
            <p class="tabs-item">总数量：{{summaryData.totalCount}}</p>
            <p class="tabs-item">留评数：{{summaryData.leaveReview}}</p>
            <p class="tabs-item">忽略数：{{summaryData.ignoreCount}}</p>
            <p class="tabs-item">留评率：{{summaryData.leaveReviewRate}}%</p>
          </div>
          <el-table class="table" :data="tableData">
            <el-table-column prop="id" label="序号" width="70"></el-table-column>
            <el-table-column prop="skuId" label="评价星数" width="130px">
              <template slot-scope="scope">
                <el-rate :value="Number(scope.row.score)" disabled></el-rate>
              </template>
            </el-table-column>
            <el-table-column prop="content" label="评语" width="200px"></el-table-column>
            <el-table-column prop="creationTime" label="评价时间" width="150px"></el-table-column>
            <el-table-column prop="userLevelName" label="会员级别"></el-table-column>
            <el-table-column prop="nickname" label="用户昵称"></el-table-column>
            <el-table-column prop="userClientShow" label="端口分析" width="170px"></el-table-column>
          </el-table>
          <div class="pagination" v-show="assessDataList.length > tablePageSize">
            <el-pagination
              background
              layout="prev, pager, next"
              :page-size="tablePageSize"
              :total="assessDataList.length"
              prev-text="上一页"
              next-text="下一页"
              @current-change="tablePageChange"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
    <!-- 对话框-去升级 -->
    <up-grade
      v-if="isShowUpGrade"
      :errorMsg="errorMsg"
      type="查留评率"
      @closeDialog="isShowUpGrade = false"
    ></up-grade>
  </div>
</template>
<script>
import Config from "../../../config";
import elProgress from "../../../components/progress";
import { skuReg } from "@/utils/common";
import upGrade from "../../dialog/upGrade";
import {
  assessAnalysis,
  getIgnoreCommentCount,
  searchDeleteCount,
} from "@/api/ranking";
import { mapState } from "vuex";

let timer = null;
export default {
  name: "evaluate",
  data() {
    let dateListValidate = (rule, value, callback) => {
      if (value.length != 2) {
        callback(new Error("请选择正确的时间"));
      } else {
        callback();
      }
    };
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
        dimension:'1',
        dateList: [],
        sku: "",
      },
      formRules: {
        dateList: [{ validator: dateListValidate, trigger: ["blur"] }],
        sku: [{ validator: skuValidate, trigger: ["blur"] }],
      },
      pickerOptions: {
        disabledDate(time) {
          return (
            time.getTime() > Date.now() - 8.64e7 ||
            time.getTime() < Date.now() - 16 * 24 * 60 * 60 * 1000
          );
        },
      },
      resultsVisible:false,
      assessDataList: [],
      summaryData: {
        totalCount: 0,
        ignoreCount: 0,
        leaveReview: 0,
        leaveReviewRate: 0,
      },
      tablePageSize: 10,
      tablePageLimit: 1,
      progressNumber: 0,
      progressToggle: false,
      errorMsg: "",
      isShowUpGrade: false,
      reviewTips: "",
      isShowReview: false,
    };
  },
  components: {
    elProgress,
    upGrade,
  },
  computed: {
    ...mapState(["isLogin"]),
    tableData() {
      if (!this.assessDataList.length) return [];
      let page = this.tablePageLimit;
      let limit = this.tablePageSize;
      return this.assessDataList.filter((item, index) => {
        return index >= limit * (page - 1) && index < limit * page;
      });
    },
  },
  created() {
    if (this.$route.query.skuId) {
      this.form.sku = this.$route.query.skuId;
    }
  },
  methods: {
    checkLogin() {
      //检查是否已登录
      if (!this.isLogin) {
        this.$store.commit("LOGIN_MODAL_TOGGLE", {
          toggle: true,
          loginType: 2,
        });
        return;
      } else {
        this.$refs["form"].validate(async (valid) => {
          if (valid) {
            this.search();
          }
        });
      }
    },
    async search() {
      this.tablePageLimit = 1;
      this.isShowUpGrade = false;
      //查询
      this.progressStart();
      let params = {
        skuId: this.form.sku,
        startDate: this.form.dateList[0],
        endDate: this.form.dateList[1],
        skuComment:this.form.dimension
      };
      const { data: res } = await assessAnalysis({ params });
      switch (res.code) {
        case 200:
          this.assessDataList = res.data.comentDatas;
          this.summaryData.leaveReview = Object.keys(res.data.map)
            .map((key) => res.data.map[key])
            .reduce((a, b) => a + b);
          this.getIgnoreCommentCount(params);
          break;
        case 2005:
          this.progressEnd();
          this.$message({ type: "warning", message: res.data.msg });
          break;
        case 8028:
          this.progressEnd();
          //当前会员等级没有权限使用此功能
          this.isShowUpGrade = true;
          this.errorMsg = res.msg;
          break;
        default:
          this.progressEnd();
          this.$message.error(res.msg);
      }
    },
    async getIgnoreCommentCount(params) {
      let { data: res } = await getIgnoreCommentCount({ params });
      this.resultsVisible = true
      this.progressEnd();
      if (res.code === 200) {
        this.summaryData.ignoreCount = res.data;
        this.summaryData.totalCount = this.summaryData.leaveReview + this.summaryData.ignoreCount;
        let evaluateRate = this.summaryData.leaveReview / this.summaryData.totalCount
        this.summaryData.leaveReviewRate = evaluateRate ? (evaluateRate*100).toFixed(0) : 0;
      } else {
        this.errorMsg = res.msg;
      }
    },
    tablePageChange(page) {
      this.tablePageLimit = page;
      document.querySelector("#query-results").scrollIntoView(true);
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
        dateList: [],
        sku: "",
        dimension:"1"
      };
    },
  },
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
      /deep/ .el-range-editor.el-input__inner {
        width: 440px;
      }
      /deep/ .el-input__icon,
      /deep/ .el-range-separator {
        height: 30px;
        line-height: 30px;
      }
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
      /deep/ .el-radio-button + .el-radio-button {
        margin-left: 10px;
      }
      /deep/ .el-radio-button__inner {
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        width: 80px;
        height: 30px;
        box-shadow: none;
      }
    }
    .btn-group {
      margin-top: 10px;
      display: flex;
      /deep/ .el-button {
        width: 120px;
        padding: 0;
        line-height: 30px;
      }
      .btn-primary:hover {
        background-color: var(--JBlue);
      }
      .btn-none {
        color: var(--DBlue);
        border: 1px solid var(--DBlue);
        background-color: #fff;
      }
      .btn-none:hover {
        color: #fff;
        background-color: var(--DBlue);
      }
    }
    .progress {
      margin-bottom: 10px;
    }
  }
  .query-results {
    width: 931px;
    box-sizing: border-box;
    padding-top: 40px;
    .el-table {
      border: 1px solid #ebeef5;
      border-bottom: 0;
      /deep/ .el-rate__icon {
        margin-right: 0px;
      }
    }
    .tabs-box {
      display: flex;
      padding-bottom: 10px;
      .tabs-item {
        width: 100px;
        height: 30px;
        line-height: 30px;
        color: #333;
        font-size: 12px;
        border: 1px solid #999;
        border-radius: 2px;
        text-align: center;
        a {
          cursor: pointer;
          color: var(--DBlue);
        }
        a:hover {
          color: var(--JBlue) !important;
        }
      }
      .tabs-item + .tabs-item {
        margin-left: 6px;
      }
    }
    .pagination {
      margin: 40px 0 23px 0;
      text-align: center;
    }
  }
}
</style>