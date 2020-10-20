<!--升级会员对话框-->
<template>
  <div class="container">
      <el-dialog
      :close-on-click-modal="false"
      :visible.sync="isShowUpGrade"
      :modal-append-to-body="false"
      :center="true"
      @close="closeDialog"
      width="420px"
      height="408px"
    >
      <div class="error-msg" v-if="vipType=='1'">
        你当前是普通会员，你的关键词监控数量已满。普通会员只可同时监控{{num}}个关键词。升级标准/高级会员，可提高数量。
      </div>
      <div class="error-msg" v-if="vipType=='2'">
         你当前是标准会员，你的关键词监控数量已满。标准会员只可同时监控{{num}}个关键词。升级高级会员，可提高数量。
      </div>
      <div class="error-msg" v-if="vipType=='3'">
         你当前是高级会员，你的关键词监控已满，无法再添加新的关键词。
      </div>
      <div slot="footer" class="dialog-footer">
        <div v-if="vipType!='3'">
          <el-button class="--btn-primary" type="primary" size="small" @click="toUpGrade">升级会员</el-button>
        </div>
        <div v-else>
          <el-button
            class="--btn-primary"
            type="primary"
            size="small"
            @click="closeDialog"
          >我知道了</el-button>
        </div>
      </div>
    </el-dialog>
    <buy-vip v-if="showBuyVip" @closeDialog="closeBuyVip" :clickType="vipType==1?2:3" :vipLevel="vipType"></buy-vip>
  </div>
</template>
<script>
// import { checkLogin } from "../../api/user";
import buyVip from "./buyVip"
import { mapState } from 'vuex';
export default {
  data() {
    return {
      isShowUpGrade: true,
      // vipType: "1",
      showBuyVip:false,
    };
  },
  props: {
    num: Number
  },
  components:{
    buyVip
  },
  computed:{
    ...mapState(["vipType"])
  },
  // created() {
  //   this.checkLogin();
  // },
  methods: {
    // async checkLogin() {
    //   const { data: res } = await checkLogin();
    //   if (res.code == 200) {
    //     this.vipType = res.data.vipType;
    //   }
    // },
    closeDialog(){
      this.$emit("closeDialog")
    },
    closeBuyVip(){
      this.closeDialog()
      this.showBuyVip = false
    },
    toUpGrade(){
      this.showBuyVip = true
    }
  }
};
</script>
<style lang="scss" scoped>
// 权限不够弹框
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
</style>