<template>
  <div class="conatiner">
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="isShowDialog"
      :center="true"
      @close="closeDialog"
      width="601px"
      class="dialog"
    >
      <div class="content">
        <div>京店宝官网：{{jdbUrl}}</div>
        <div>推荐码:{{recommendCode}}</div>
      </div>
      <div class="btn-group">
        <el-button type="primary" class="--btn-primary" @click="handleCopy">复制</el-button>
      </div>
      <div class="tips">（为了防止灌水邀请注册，需验证店铺有效性。一个店铺只可被验证一次）</div>
    </el-dialog>
  </div>
</template>
<script>
import Config from "../../config";
import { getJdbUserVip } from "../../api/user";
export default {
  data() {
    return {
      isShowDialog: true,
      jdbUrl: Config.jdbUrl,
      recommendCode: ""
    };
  },
  created() {
    this.getJdbUserVip()
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
    async getJdbUserVip() {
      const { data: res } = await getJdbUserVip();
      if (res.code === 200) {
         this.recommendCode = res.data.myInviteCode
      }
    },
    handleCopy() {
      let content =
        "京店宝官网：" + this.jdbUrl + " " + "推荐码：" + this.recommendCode;
      let oInput = document.createElement("input");
      oInput.value = content;
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象
      document.execCommand("Copy"); // 执行浏览器复制命令
      oInput.className = "oInput";
      oInput.style.display = "none";
      this.$message.success("复制成功");
      this.closeDialog();
    }
  }
};
</script>
<style lang="scss" scoped>
.dialog {
  .content {
    color: #333;
    font-size: 16px;
    font-weight: bold;
    line-height: 25px;
    text-align: center;
    padding: 36px 0 27px 0;
  }
  .btn-group {
    text-align: center;
    /deep/ .el-button {
      width: 120px;
      height: 30px;
      padding: 0;
    }
  }
  .tips {
    text-align: center;
    margin-top: 10px;
    color: #f00;
  }
}
</style>