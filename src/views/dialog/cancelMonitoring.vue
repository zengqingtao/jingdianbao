<!--取消/删除监控-->
<template>
  <div class="container">
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="isShowDialog"
      :center="true"
      @close="closeDialog"
      width="420px"
      height="408px"
      class="dialog"
    >
      <div class="error-msg">{{dialogTips}}</div>
      <div slot="footer" class="dialog-footer">
        <div>
          <el-button class="--btn-none" @click="closeDialog" size="small">取 消</el-button>
          <el-button class="--btn-primary" type="primary" size="small" @click="confirm">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isShowDialog: true
    };
  },
  props:{
      dialogTips:String
  },
  methods:{
      closeDialog(){
          this.$emit("closeDialog")
      },
      confirm(){
          this.$emit("cancelMonitoring")
      }
  }
};
</script>
<style lang="scss" scoped>

.dialog {
  .error-msg {
      text-align: center;
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
}
</style>