<!--搜索分析-->
<template>
  <div class="container">
    <!-- 即时查询 -->
    <div class="modul instant-query">
      <div class="check-body">
        <el-form
          class="form"
          ref="form"
          :rules="formRules"
          :model="form"
          label-width="90px"
          @submit.native.prevent
        >
          <el-form-item label="关键词：" prop="keyword">
            <el-input
              v-model="form.keyword"
              size="small"
              placeholder="请输入关键词"
              @focus="clearValidate('keyword')"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="progress" v-if="progressToggle">
          <el-progress :progress="progressNumber" class="ranking-progress"></el-progress>
        </div>
        <div class="btn-group">
          <el-button
            class="btn-primary"
            onfocus="this.blur()"
            type="primary"
            v-if="!progressToggle"
            @click="checkLogin"
          >查询</el-button>
          <el-button class="btn-none" type v-if="progressToggle" @click="cancel">取消</el-button>
          <el-button class="btn-none" type v-if="!progressToggle" @click="reset">重置</el-button>
        </div>
      </div>
      <div class="check-result" v-if="showResults">
        <div class="table-tips">查询结果为行业七天数据：</div>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="page" label="APP页面"></el-table-column>
          <el-table-column prop="avgTotalFlow">
            <template slot="header">
              <span>平均访客</span>
              <el-tooltip popper-class="tooltip" content="当页最近7天平均每个坑位的总访客数量" placement="top">
                <i class="iconfont icon-wenhao"></i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="avgOrders">
            <template slot="header">
              <span>平均下单</span>
              <el-tooltip popper-class="tooltip" content="当页最近7天平均每个坑位的总下单量" placement="top">
                <i class="iconfont icon-wenhao"></i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="avgPercentConversion">
            <template slot="header">
              <span>平均转化</span>
              <el-tooltip popper-class="tooltip" content="当页最近7天平均每个坑位的转化率" placement="top">
                <i class="iconfont icon-wenhao"></i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="avgSearchProportion">
            <template slot="header">
              <span>平均搜索占比</span>
              <el-tooltip popper-class="tooltip" content="当页最近7天平均每个坑位的搜索访客数量占比" placement="top">
                <i class="iconfont icon-wenhao"></i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 弹框 -->
    <up-grade
      :errorMsg="errorMsg"
      type="搜索分析"
      v-if="isShowUpGrade"
      @closeDialog="isShowUpGrade = false"
    ></up-grade>
  </div>
</template>
<script>
import Config from "../../../config";
import elProgress from "../../../components/progress";
import { skuReg } from "@/utils/common";
import { searchAnaly } from "../../../api/dmp";
// import { checkLogin } from "../../../api/user";
import { mapState } from "vuex";
import upGrade from "../../dialog/upGrade";
let timer = null;
export default {
  name: "salesVolume",
  data() {
    let keywordValidate = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("关键词不能为空"));
      }
      callback();
    };
    return {
      Config,
      showResults: false,
      form: {
        keyword: ""
      },
      formRules: {
        keyword: [{ validator: keywordValidate, trigger: ["blur"] }]
      },
      tableData: [],
      currentPage: 1,
      progressNumber: 0,
      progressToggle: false,
      errorMsg: "",
      isShowUpGrade: false,
      isCancel: false
    };
  },
  components: {
    elProgress,
    upGrade
  },
  computed: {
    ...mapState(["isLogin"])
  },
  methods: {
    checkLogin() {
      //检查是否已登录
      if (!this.isLogin) {
        this.$store.commit("LOGIN_MODAL_TOGGLE", {
          toggle: true,
          loginType: 2
        });
        return;
      } else {
        this.search();
      }
    },
    search() {
      this.isShowUpGrade = false;
      this.$refs["form"].validate(async valid => {
        if (valid) {
          this.currentPage = 1;
          this.progressStart();
          let params = {
            keyword: this.form.keyword
          };
          let res = await searchAnaly(params);
          this.showResults = true;
          this.progressEnd();
          switch (res.data.code) {
            case 200:
              this.tableData = res.data.data;
              this.tableToggle = true;
              break;
            case 8028:
              this.isShowUpGrade = true;
              this.errorMsg = res.data.msg;
              break;
            default:
              this.$message.error(res.data.msg);
          }
        }
      });
    },
    changePage(currentPage) {
      //切换页码
      this.currentPage = currentPage;
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
    // 取消
    cancel() {
      this.progressEnd();
      this.isCancel = true;
    },
    reset() {
      //重置
      this.form = {
        keyword: ""
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
  .check-body {
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
  .check-result {
    padding-top: 50px;
    .table-tips {
      padding: 10px 0;
      color: #333;
      font-size: 14px;
    }
    /deep/ .el-table {
      border: 1px solid #ebeef5;
      border-bottom: 0;
    }
  }
}
</style>