<!--添加流量监控-->
<template>
  <div class="addFlowMonitor-container">
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :center="true"
      width="500px"
      @close="closeDialog"
    >
      <div class="dialog-body">
        <div class="title">添加商品</div>
        <div class="sku-input-box">
          <span>SKU:</span>
          <el-input placeholder="请输入商品sku链接或sku" v-model="sku"></el-input>
        </div>
        <div class="errTips">{{errMsg}}</div>
        <el-button
          type="primary"
          class="--btn-primary"
          onfocus="this.blur()"
          @click="submit"
          :loading="loading"
        >提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { skuReg } from "../../utils/common";
import { addFlowMonitor } from "../../api/monitor";
export default {
  data() {
    return {
      dialogVisible: true,
      sku: "",
      errMsg: "",
      loading: false,
    };
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
    validateSku() {
      if (this.sku === "") {
        this.errMsg = "sku不能为空";
      } else if (!skuReg(this.sku)) {
        this.errMsg = "sku输入有误";
      } else {
        this.errMsg = "";
      }
    },
    async submit() {
      await this.validateSku();
      if (this.errMsg) return;
      this.loading = true;
      let params = {
        sku: this.sku,
      };
      let { data: res } = await addFlowMonitor(params);
      this.loading = false;
      switch (res.code) {
        case 200:
          this.$emit("addFlowMonitorSuccess");
          break;
        case 2003:
          this.closeDialog();
          this.$store.commit("LOGIN_MODAL_TOGGLE", {
            toggle: true,
            loginType: 2,
          });
          break;
        case 8028:
          this.closeDialog();
          this.$emit("upGrade", res.msg);
          break;
        default:
          this.$message.error(res.msg);
      }
    },
  },
};
</script>
<style lang="scss">
.addFlowMonitor-container {
  .dialog-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    .title {
      color: #333;
      font-size: 16px;
      font-weight: bold;
    }
    /deep/ .el-button {
      width: 120px;
      height: 30px;
      padding: 0;
    }
    .sku-input-box {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 20px 0 10px;
      /deep/ .el-input {
        margin-left: 5px;
      }
      /deep/ .el-input,
      /deep/ .el-input__inner {
        width: 300px;
        height: 30px;
      }
    }
    .errTips {
      height: 20px;
      color: crimson;
    }
  }
}
</style>