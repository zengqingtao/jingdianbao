<!--查留评率-查看删除数-->
<!--删评监控已停用，故这个查看删除数也暂时没用到-->
<template>
  <div class="container">
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="isShowReview"
      :center="true"
      @close="closeDialog"
      width="420px"
      height="408px"
      class="reviewDialog"
    >
      <div class="tips-content" v-if="type===-1">所选时间,未有监控数据</div>
      <div class="tips-content" v-if="type===-2">查看删除数，需要先将SKU添加至删评监控，然后从添加监控的次日起再来查看哦~</div>
      <div slot="footer" class="dialog-footer">
        <div class="btn-box">
          <el-button class="--btn-none" size="small" @click="closeDialog" v-if="type!==-1">取消</el-button>
          <el-button
            class="--btn-primary"
            type="primary"
            onfocus="this.blur()"
            @click="handleAdd"
            size="small"
            v-if="type===-1"
          >我知道了</el-button>
          <el-button
            class="--btn-primary"
            type="primary"
            onfocus="this.blur()"
            @click="handleAdd"
            size="small"
            v-else
            v-baidu-count="{event:'内部跳转转化',value:'每日监控内部跳转',label:'查留评率-添加删评监控'}"
          >去添加</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isShowReview: true
    };
  },
  props: {
    type: Number
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
    handleAdd() {
      if (this.type === -1) {
        this.closeDialog();
        return;
      }
      this.$router.push("/dataMonitoring/delCommentMonitoring");
    }
  }
};
</script>
<style lang="scss" scoped>
// 权限不够弹框
.reviewDialog {
  .tips-content {
    line-height: 20px;
    color: var(--JBlue);
  }
  /deep/ .el-icon-close {
    width: 30px;
    height: 30px;
    line-height: 30px;
    color: #fff !important;
    border: 1px solid #fff;
    border-radius: 50%;
  }

  /deep/ .el-dialog__headerbtn {
    right: -40px;
    top: 0px;
  }
  .btn-box {
    /deep/ .el-button {
      width: 68px;
      height: 32px;
      padding: 0;
      text-align: center;
    }
  }
}
</style>