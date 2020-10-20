<!--添加类目排名-->
<template>
  <div class="container">
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="isShowDialog"
      :center="true"
      @close="closeDialog"
      width="601px"
      class="dialog"
    >
      <div class="dialog-body">
        <p class="title">{{title}}</p>
        <el-form class="form" :model="form" label-width="90px">
          <el-form-item label="查询模式：">
            <el-radio-group v-model="form.sortMode" size="small">
              <el-radio-button label="1">综合排序</el-radio-button>
              <el-radio-button label="5">价格升序</el-radio-button>
              <el-radio-button label="2">销量排序</el-radio-button>
              <el-radio-button label="3">评价排序</el-radio-button>
              <el-radio-button label="4">新品排序</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div class="footer-btn-box">
          <el-button
            v-if="!progressToggle"
            class="btn-submit --btn-primary"
            onfocus="this.blur()"
            type="primary"
            size="small"
            @click="checkLogin"
          >提交</el-button>
        </div>
        <div class="progress-box" v-if="progressToggle">
          <el-progress :progress="progressNumber" class="progress"></el-progress>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import elProgress from "../../components/progress";
import { skuReg } from "@/utils/common";
import { addCatMonitor } from "../../api/monitor";
import {mapState} from "vuex"
let timer = null;
export default {
  data() {
    return {
      isShowDialog: true,
      form: {
        sortMode: "1",
      },
      progressNumber: 0,
      progressToggle: false,
      upGradeTips:""
    };
  },
  props: {
    title: {
      type: String,
      default: "添加类目监控"
    },
    skuId: {
      type: String
    },
  },
  computed:{
    ...mapState(["isLogin"])
  },
  components: {
    elProgress
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
    checkLogin() {
      this.submitLoading = true;
      //检查是否已登录
      if (!this.isLogin) {
        this.$store.commit("LOGIN_MODAL_TOGGLE", {
          toggle: true,
          loginType: 2
        });
        return;
      } else {
        this.submit();
      }
    },
    async submit() {
          this.progressStart();
          let params = {
            skuId:this.skuId,
            sortType: this.form.sortMode,
            rankType: 1
          };
          const { data: res } = await addCatMonitor(params);
          this.progressEnd();
          switch (res.code) {
            case 200:
              this.$emit("successGetData");
              this.closeDialog();
              break;
            case 8028:
              this.closeDialog();
              this.upGradeTips = res.msg;
              this.$emit("upGrade",this.upGradeTips)
              break;
            default:
              this.$message.error(res.msg);
          }
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
      timer = setInterval(() => {
        this.progressNumber++;
        if (this.progressNumber >= 100) {
          clearInterval(timer);
          this.progressNumber = 100;
          let closeProgressTimer = setTimeout(() => {
            clearTimeout(closeProgressTimer);
            this.progressNumber = 0;
          }, 1500);
        }
      }, 0);
    },
  }
};
</script>
<style lang="scss" scoped>
// 权限不够弹框
.dialog {
  box-sizing: border-box;
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
  /deep/ .el-dialog--center .el-dialog__body {
    padding: 21px 48px 24px 32px !important;
  }
  /deep/ .el-dialog__footer {
    padding-bottom: 24px !important;
  }
  .dialog-body {
    .title {
      color: #333;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
    }
    .form {
      margin-top: 30px;
      /deep/ .el-form-item,
      /deep/ .el-form-item__content,
      /deep/ .el-form-item__label {
        height: 30px;
        line-height: 30px !important;
      }
      /deep/ .el-radio-button__inner {
        border-radius: 4px;
        border: 1px solid #dcdfe6 !important;
        color: #999 !important;
        width: 80px;
        height: 30px;
        box-shadow: none;
        padding: 9px 10px;
      }
      /deep/ .el-radio-group {
        display: flex;
        justify-content: space-between;
      }
      /deep/ .el-radio-button__inner:hover {
        color: var(--DBlue) !important;
        border-color: var(--DBlue) !important;
        background-color: #fff !important;
      }
      /deep/ .el-radio-button.is-active .el-radio-button__inner:hover {
        background-color: var(--JBlue) !important;
      }
      /deep/ .el-radio-button.is-active .el-radio-button__inner {
        border-color:var(--DBlue) !important;
        color: #fff !important;
      }
    }
    .footer-btn-box {
      margin-top: 30px;
      text-align: center;
      .btn-submit {
        width: 120px;
        height: 30px;
      }
    }
    .progress-box {
      width: 100%;
      margin-top: 10px;
      display: flex;
      justify-content: center;
    }
  }
}
</style>