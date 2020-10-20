<!--关键词查询-->
<template>
  <div>
    <!-- 查询项 -->
    <div class="query-options">
      <el-form :model="form" ref="form" :rules="rules" label-width="90px" @submit.native.prevent>
        <el-form-item label="时间范围：">
          <el-radio-group v-model="form.dateRange" size="small">
            <el-radio-button label="3">昨日</el-radio-button>
            <el-radio-button label="0">近7天</el-radio-button>
            <el-radio-button label="1">近30天</el-radio-button>
            <el-radio-button label="2">近6个月</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="渠道：">
          <el-radio-group v-model="form.channel" size="small">
            <el-radio-button label="99">全渠道</el-radio-button>
            <el-radio-button label="2">APP</el-radio-button>
            <el-radio-button label="20">PC</el-radio-button>
            <el-radio-button label="3">微信</el-radio-button>
            <el-radio-button label="4">手Q</el-radio-button>
            <el-radio-button label="1">M端</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="关键词：" prop="keyword">
          <el-input v-model="form.keyword" placeholder="请输入关键词" @focus="clearValidate"></el-input>
        </el-form-item>
      </el-form>
      <div class="progress" v-if="progressToggle">
        <el-progress :progress="progressNumber" class="ranking-progress"></el-progress>
      </div>
      <div class="btn-group">
        <el-button
          type="primary"
          class="--btn-primary"
          onfocus="this.blur()"
          v-if="!progressToggle"
          @click="search"
        >查询</el-button>
        <el-button class="--btn-none" v-if="!progressToggle" @click="reset">重置</el-button>
        <el-button class="--btn-none" v-if="progressToggle" @click="progressEnd">取消</el-button>
      </div>
    </div>
    <!--查询结果-->
    <div class="query-results" v-if="tableData.length">
      <div class="tips">
        <span class="the-best-product">最优品类：{{bestProduct}}</span>
        <span>次优品类：{{excellentProduct}}</span>
      </div>
      <el-table :data="tableData">
        <el-table-column prop="currentKeyword" label="关键词"></el-table-column>
        <el-table-column prop="searchIndex" label="搜索指数"></el-table-column>
        <el-table-column prop="searchClickIndex" label="搜索点击指数" width="95px"></el-table-column>
        <el-table-column prop="ordAmtIndex" label="成交金额指数" width="95px"></el-table-column>
        <el-table-column prop="ordNumIndex" label="成交单量指数" width="95px"></el-table-column>
        <el-table-column label="成交转化率">
          <teamplate slot-scope="scope">
            <div>{{(scope.row.convertRate*100).toFixed(2)+'%'}}</div>
          </teamplate>
        </el-table-column>
        <el-table-column label="点击率">
          <teamplate slot-scope="scope">
            <div>{{(scope.row.clickRate*100).toFixed(2)+'%'}}</div>
          </teamplate>
        </el-table-column>
        <el-table-column prop="commodityNumber" label="全网商品数"></el-table-column>
        <el-table-column prop="competition" label="潜力值"></el-table-column>
      </el-table>
    </div>
    <!-- 弹框 -->
    <up-grade
      :errorMsg="errorMsg"
      type="关键词分析"
      v-if="isShowUpGrade"
      @closeDialog="isShowUpGrade = false"
    ></up-grade>
  </div>
</template>
<script>
import elProgress from "../../../components/progress";
import { keyWordAnaly } from "../../../api/dmp";
import upGrade from "../../dialog/upGrade";
let timer = null;
export default {
  data() {
    const keywordValidator = (rule, value, callback) => {
      if (!value) {
        callback(new Error("关键词不能为空"));
      } else {
        callback();
      }
    };
    return {
      form: {
        dateRange: "3",
        channel: "99", //全部渠道': 99, 'APP': 2, 'PC': 20, '微信': 3, '手Q': 4, 'M端': 1
        keyword: ""
      },
      rules: {
        keyword: [{ validator: keywordValidator, trigger: ["blur"] }]
      },
      tableData: [],
      isShowUpGrade: false, //是否显示升级对话框
      errorMsg: "", //升级对话框的提示
      progressToggle: false,
      progressNumber: 0,
      bestProduct: "", //最优品
      excellentProduct: "" //优品
    };
  },
  components: {
    elProgress,
    upGrade
  },
  methods: {
    async search() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          this.progressToggle = true;
          this.progressStart();
          let params = {
            channel: this.form.channel,
            dayOption: this.form.dateRange,
            keyword: this.form.keyword
          };
          const { data: res } = await keyWordAnaly(params);
          this.progressToggle = false;
          this.progressEnd();
          switch (res.code) {
            case 200:
              this.tableData = [];
              this.tableData.push(res.data);
              this.bestProduct = res.data.optimalIndName;
              this.excellentProduct = res.data.suboptimalIndName;
              break;
            case 8028:
              this.errorMsg = res.msg;
              this.isShowUpGrade = true;
              break;
            default:
              this.$message.error(res.msg);
          }
        }
      });
    },
    clearValidate() {
      this.$refs.form.clearValidate("keyword");
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
      //查询结束
      clearInterval(timer);
      this.progressToggle = false;
      this.progressNumber = 0;
    },
    reset() {
      this.form.keyword = "";
    }
  }
};
</script>
<style lang="scss" scoped>
.query-options {
  padding: 30px 16px 20px;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0px 3px 24px 0px rgba(168, 168, 236, 0.22);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /deep/ .el-form {
    width: 620.8px;
    /deep/ .el-input {
      width: 440px;
    }
    /deep/ .el-form-item {
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }
    /deep/ .el-form-item__label {
      color: #333;
      height: 30px;
      line-height: 30px;
    }
    /deep/ .el-form-item__content {
      height: 30px;
      line-height: 30px;
      margin-left: 0 !important;
      flex: 1;
    }
    .el-radio-button + .el-radio-button {
      margin-left: 10px;
    }
    /deep/ .el-radio-button__inner {
      width:80px;
      height: 30px;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      box-shadow: none;
    }

    /deep/ .el-input__inner {
      height: 30px;
    }
  }
  .btn-group {
    margin-top: 10px;
    /deep/ .el-button {
      width: 120px;
      height: 30px;
      padding: 0;
    }
  }
}
.query-results {
  margin-top: 10px;
  padding: 12px 14px 12px 16px;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0px 3px 24px 0px rgba(168, 168, 236, 0.22);
  // 表格数据上方的最优品类
  .tips {
    font-size: 12px;
    color: #333;
    .the-best-product {
      padding-right: 5px;
    }
  }
  /deep/ .el-table {
    border: 1px solid #ebeef5;
    border-bottom: 0;
    margin-top: 10px;
    /deep/ .cell {
      font-size: 12px;
      color: #333;
      text-align: center;
    }
    .addMonitor {
      /deep/ .el-button:hover {
        color: var(--JBlue);
      }
    }
  }
}
</style>