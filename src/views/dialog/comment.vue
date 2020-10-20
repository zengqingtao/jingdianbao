<template>
  <div >
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="showDialog"
      :center="true"
      :modal-append-to-body="false"
      @close="closeDialog"
      width="442px"
      class="dialog"
    >
      <div class>
        <div class="title">不满意模块:</div>
        <div class="radio-group">
          <el-radio-group v-model="product" size="small">
            <el-radio-button
              :label="item.id"
              v-for="(item,index) in productList"
              :key="index"
            >{{item.name}}</el-radio-button>
          </el-radio-group>
        </div>
        <el-input
          class="textarea"
          type="textarea"
          :autosize="{ minRows: 8, maxRows: 20}"
          maxlength="150"
          v-model="commentContent"
          placeholder="请输入不满意或者您需要的功能告知我们，我们尽快采纳。"
          @focus="onfocus"
        ></el-input>
        <div class="tips">{{errorTips}}</div>
        <div class="btn-group">
          <el-button type="primary" onfocus="this.blur()" class="--btn-primary" :loading="submitLoading" @click="submit" >提交</el-button>
          <el-button class="--btn-none" @click="closeDialog">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getJdbProductModule, addFeedback } from "../../api/feedback";
export default {
  data() {
    return {
      showDialog: true,
      productList: [],
      product: "1",
      commentContent: "",
      errorTips: "",
      submitLoading:false
    };
  },
  created() {
    this.getParentModule();
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
    async getParentModule() {
      const params = { parentId: 0,version:0 };
      let { data: res } = await getJdbProductModule({ params });
      if (res.code === 200 && res.data.length > 0) {
        this.productList = res.data;
        this.product = res.data[0].id;
      } else {
        this.productList = [];
      }
    },
    onfocus() {
      this.errorTips = "";
    },
    submit() {
      if (!this.commentContent) {
        this.errorTips = "请输入您不满意或者需要的功能";
        return;
      }
      this.submitLoading = true
      let moduleIds = [this.product]
      addFeedback({
        moduleIds,
        content: this.commentContent
      }).then(res => {
          this.submitLoading = false
        if (res.data.code === 200) {
          this.$message({ type: "success", message: "提交成功！" });
          this.closeDialog()
          this.$emit("success")
        } else {
          this.$message({ type: "error", message: "提交失败！" });
        }
      });
    },
  }
};
</script>
<style lang="scss" scoped>
.dialog {
  .title {
    color: #333;
    font-size: 14px;
    padding: 15px 0;
  }
  .radio-group {
    /deep/ .el-radio-button {
      margin: 0 10px 10px 0;
    }
    /deep/ .el-radio-button:nth-child(4n) {
      margin-right: 0 !important;
    }
    /deep/ .el-radio-button__inner {
      width: 88px;
      height: 34px;
      border-radius: 2px;
      color: #666 !important;
      border: 1px solid #eee !important;
      background-color: #eee;
      box-shadow: none;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    /deep/ .el-radio-button.is-active .el-radio-button__inner {
      background-color: var(--DBlue);
      border-color: var(--DBlue) !important;
      color: #fff !important;
    }
    /deep/ .el-radio-button.is-active .el-radio-button__inner:hover {
      background-color: var(--JBlue) !important;
      border-color: var(--JBlue) !important;
      color: #fff !important;
    }
    /deep/ .el-radio-button__inner:hover {
      border-color: var(--DBlue) !important;
      color: #fff !important;
      background-color: var(--DBlue) !important;
    }
  }
  .textarea {
    padding-top: 10px;
  }
  .btn-group {
    margin-top: 50px;
    text-align: center;
    /deep/ .el-button {
      width: 120px;
      height: 30px;
      padding: 0;
    }
  }
  .tips {
    height: 20px;
    text-align: center;
    margin-top: 20px;
    color: #d80000;
  }
}
</style>