<!--升级对话框-->
<template>
  <div class="container">
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="isShowUpGrade"
      :center="true"
      @close="closeDialog"
      width="420px"
      height="408px"
      class="upGradeDialog"
    >
      <div class="error-msg">{{errorMsg}}</div>
      <div slot="footer" class="dialog-footer">
        <div v-if="vipType!='3'">
          <el-button class="--btn-none" @click="closeDialog" size="small">取 消</el-button>
          <el-button
            v-if="type"
            class="--btn-primary"
            type="primary"
            size="small"
            @click="toUpGrade"
            v-baidu-count="{event:'内部跳转转化',value:'删评监控内部跳转',label:`${type}-去升级`}"
          >去升级</el-button>
          <el-button v-else class="--btn-primary" type="primary" size="small" @click="toUpGrade">去升级</el-button>
        </div>
        <div v-else>
          <el-button class="--btn-primary" type="primary" size="small" @click="closeDialog">我知道了</el-button>
        </div>
      </div>
    </el-dialog>
    <buy-vip
      v-if="showBuyVip"
      @closeDialog="closeBuyVip"
      :clickType="vipType==1?2:3"
      :vipLevel="vipType"
    ></buy-vip>
  </div>
</template>
<script>
import buyVip from "./buyVip";
import { mapState } from "vuex";
export default {
  data() {
    return {
      isShowUpGrade: true,
      // vipType: "1",
      showBuyVip: false,
    };
  },
  props: {
    errorMsg: String,
    type: String,
  },
  components: {
    buyVip,
  },
  computed: { ...mapState(["isLogin", "vipType"]) },
  methods: {
    // async checkLogin() {
    //   const { data: res } = await checkLogin();
    //   if (res.code == 200) {
    //     this.vipType = res.data.vipType;
    //   }
    // },
    closeDialog() {
      this.$emit("closeDialog");
    },
    closeBuyVip() {
      this.closeDialog();
      this.showBuyVip = false;
    },
    toUpGrade() {
      this.showBuyVip = true;
    },
  },
};
</script>
<style lang="scss" scoped>
// 权限不够弹框
.upGradeDialog {
  .error-msg {
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