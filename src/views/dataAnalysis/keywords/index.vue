<!--关键词分析-->
<template>
  <div class="container">
    <!-- 查询选项 -->
    <div class="query-options">
      <el-form ref="form" :rules="rules" :model="form" label-width="90px">
        <el-form-item label="SKU:" prop="sku">
          <el-input placeholder="请输入sku链接或者sku" v-model="form.sku" @focus="clearValidate('sku')"></el-input>
        </el-form-item>
      </el-form>
      <div class="progress" v-if="progressToggle">
        <div class="tips">因查询的数据量过大，请耐心等待</div>
        <el-progress v-if="progressToggle" :progress="progressNumber"></el-progress>
      </div>
      <div class="btn-group">
        <div v-if="!progressToggle">
          <el-button
            type="primary"
            class="--btn-primary"
            @click="search(0)"
            onfocus="this.blur()"
          >查询</el-button>
          <el-button class="--btn-none" @click="form.sku = ''">重置</el-button>
        </div>
        <div v-else>
          <el-button class="--btn-none" @click="progressEnd" onfocus="this.blur()">取消</el-button>
        </div>
      </div>
    </div>
    <!-- 查询结果 -->
    <div class="query-results" v-if="showResults">
      <el-table :data="tableData">
        <el-table-column label="序号" align="center">
          <template slot-scope="scope">
            <div>{{++scope.$index}}</div>
          </template>
        </el-table-column>
        <el-table-column label="关键词" prop="keyword"></el-table-column>
        <el-table-column label="近30天访客数" prop="visitorCount" align="center"></el-table-column>
        <el-table-column label="近30天成交客户数" prop="orderCount" align="center"></el-table-column>
      </el-table>
    </div>
    <!-- 权限不足 -->
    <up-grade
      :errorMsg="errorMsg"
      type="竞品关键词"
      v-if="isShowUpGrade"
      @closeDialog="isShowUpGrade = false"
    ></up-grade>
  </div>
</template>
<script>
import { competingKeyword } from "../../../api/secondKill";
import { mapstate, mapState } from "vuex";
import { skuReg } from "@/utils/common";
import elProgress from "../../../components/progress";
import upGrade from "../../dialog/upGrade";
let timer = null;
export default {
  data() {
    let skuValidate = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("SKU不能为空"));
      } else if (!skuReg(this.form.sku)) {
        callback(new Error("SKU链接格式不正确"));
      } else {
        callback();
      }
    };
    return {
      form: {
        sku: ""
      },
      rules: {
        sku: [{ validator: skuValidate, trigger: "blur" }]
      },
      tableData: [],
      progressNumber: 0,
      progressToggle: false,
      showResults: false,
      isShowUpGrade: false, //是否显示权限不足的对话框
      errorMsg: "" //权限不足的提示语
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
    search(type) {
      if (!this.isLogin) {
        this.$store.commit("LOGIN_MODAL_TOGGLE", {
          toggle: true,
          loginType: 2
        });
        return;
      }
      this.$refs["form"].validate(async valid => {
        if (valid) {
          this.progressStart();
          const params = {
            sku: this.form.sku
          };
          const { data: res } = await competingKeyword({ params });
          this.progressEnd();
          switch (res.code) {
            case 200:
              this.tableData = res.data;
              break;
            case 8028:
              this.errorMsg = res.msg;
              this.isShowUpGrade = true;
              break;
            default:
              this.$message.error(res.msg);
          }
          this.showResults = true;
        }
      });
    },
    clearValidate(propValue) {
      //清除校验
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
      //查询结束
      clearInterval(timer);
      this.progressToggle = false;
      this.progressNumber = 0;
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  background-color: #fff;
  padding: 30px 14px 20px 16px;
  border-radius: 10px;
  box-shadow: 0px 3px 24px 0px rgba(168, 168, 236, 0.22);
}
.query-options {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /deep/ .el-form {
    width: 530.8px;
    /deep/ .el-input,
    .el-input__inner {
      width: 440px;
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
  }
  .progress {
    .tips {
      color: var(--DBlue);
      font-size: 14px;
      text-align: center;
      padding-bottom: 10px;
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
  padding-top: 60px;
  /deep/ .el-table {
    border: 1px solid #eee;
    border-bottom: 0;
    /deep/ .cell {
      font-size: 12px;
      color: #333;
    }
  }
}
</style>