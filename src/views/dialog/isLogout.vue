<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="showDialog"
      :modal-append-to-body="false"
      :center="true"
      @close="closeDialog"
      width="420px"
      height="408px"
      class="logoutDialog"
    >
      <div class="error-msg">此操作将退出登录, 是否继续退出?</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog" class="--btn-none" size="small">取消</el-button>
        <el-button
          @click="logout"
          class="--btn-primary"
          onfocus="this.blur()"
          type="primary"
          size="small"
        >退出</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { logout } from "../../api/user";
export default {
  data() {
    return {
      showDialog: true,
      route: -1 //1个人中心，2会员中心
    };
  },
  created() {
    let hash = window.location.hash;
    let path = hash.split("/");
    if (path.includes("personal")) {
      this.route = 1;
    } else if (
      path.includes("memberExchange") ||
      path.includes("invitationDetails")
    ) {
      this.route = 2;
    }else{
      this.route=-1
    }
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
    logout() {
      logout().then(res => {
        if (res.code == 200) {
          this.$store.commit("CHANGE_USERNAME", "");
          this.$store.commit("CHANGE_PASSWORD", "");
          this.$store.commit("USER_LOGIN_CHANGE", false);
          // 如果当前页面是个人中心返回首页，是会员兑换、邀请明细就返回会员介绍，否则刷新当前页面
          if(this.route==1){
            let url = location.href;
            url = url.split("#")[0] + "#/";
            location.href = url;
            location.reload();
          }else if(this.route==2){
            let url = location.href;
            url = url.split("#")[0] + "#/member";
            location.href = url;
            location.reload();
          }else{
            location.reload()
          }
        } else {
          this.$message.error("退出失败");
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
// 权限不够弹框
.logoutDialog {
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