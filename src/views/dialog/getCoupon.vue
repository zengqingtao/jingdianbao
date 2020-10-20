<template>
  <div class="container">
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="isShowDialog"
      :center="true"
      @close="closeDialog"
      width="601px"
    >
      <div class="title">领优惠券</div>
      <div class="content-box">
        <p>尊敬的京店宝用户：</p>
        <p class="content">你们好！添加运营经理微信号，可向运营经理取得阿明工具的优惠券，详情请咨询运营经理。</p>
      </div>
      <div class="btn-box">
          <el-button type="primary" class="--btn-primary" @click="closeDialog">我知道了</el-button>
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
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  color: #333;
  .title {
    font-size: 18px;
    font-weight: bold;
    text-align: center;
  }
  .content-box{
      color:#333;
      padding-top:10px;
      line-height: 22px;
      .content{
          text-indent:2em;
          
      }
  }
  .btn-box{
      padding-top:20px;
      text-align: center;
      /deep/ .el-button{
          width:120px;
          height:30px;
          padding:0;
      }
  }
}
</style>