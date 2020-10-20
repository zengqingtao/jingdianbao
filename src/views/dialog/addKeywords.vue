<!--添加关键词-->
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
        <el-form
          class="form"
          ref="form"
          :rules="formRules"
          :model="form"
          label-width="90px"
          @submit.native.prevent
        >
          <el-form-item label="关键词：" prop="keyword">
            <el-input
              v-model="form.keyword"
              size="small"
              :placeholder="form.keywordsList.length>2?'':'请输入关键词，可同时输入3个，按下回车键可分隔开'"
              @keyup.enter.native="addkeyword"
              :disabled="form.keywordsList.length>2"
              @focus="clearValidate('keyword')"
            >
              <template slot="prepend">
                <span v-for="(item,index) in form.keywordsList" :key="index">
                  {{item}}
                  <i
                    class="iconfont icon-guanbi"
                    style="cursor:pointer;"
                    @click="delKeyword(index)"
                  ></i>
                </span>
              </template>
            </el-input>
          </el-form-item>
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
import { addItemMonitor } from "../../api/monitor";
import { mapState } from "vuex";
let timer = null;
export default {
  data() {
    let keywordValidate = (rule, value, callback) => {
      if (value == "" && this.form.keywordsList.length == 0) {
        callback(new Error("关键词不能为空"));
      }
      callback();
    };
    return {
      isShowDialog: true,
      form: {
        sortMode: "1",
        keywordsList: [],
        keyword: ""
      },
      formRules: {
        keyword: [{ validator: keywordValidate, trigger: ["blur"] }]
      },
      progressNumber: 0,
      progressToggle: false,
      upGradeTips: ""
    };
  },
  props: {
    title: {
      type: String,
      default: "添加关键词"
    },
    skuId: {
      type: String
    },
    groupId: {
      type: Number
    }
  },
  components: {
    elProgress
  },
  computed: { ...mapState(["isLogin"]) },
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
    submit() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          this.progressStart();
          let params = {
            searchWord: this.dealKeyword(),
            skuId: this.skuId,
            sortType: this.form.sortMode,
            rankType: 1,
            groupId: this.groupId
          };
          const { data: res } = await addItemMonitor(params);
          this.progressEnd();
          switch (res.code) {
            case 200:
              this.$emit("successGetData");
              this.closeDialog();
              break;
            case 8028:
              this.closeDialog();
              this.upGradeTips = res.msg;
              this.$emit("upGrade", this.upGradeTips);
              break;
            default:
              this.$message.error(res.msg);
          }
        }
      });
    },
    clearValidate(propValue) {
      this.$refs.form.clearValidate(propValue);
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
    dealKeyword() {
      //处理关键词
      let keyword = this.form.keyword;
      let list = this.form.keywordsList;
      let keywordsStr = "";
      if (list.length === 0) {
        keywordsStr = keyword;
      } else {
        keywordsStr = list.join(",");
        if (list.indexOf(keyword) === -1 && keyword) {
          keywordsStr += "," + keyword;
        }
      }
      return keywordsStr;
    },
    delKeyword(index) {
      //删除关键词
      this.form.keywordsList.splice(index, 1);
    },
    addkeyword() {
      //增加关键词
      //最多可添加三个关键词
      if (this.form.keywordsList.length > 2) return;
      let isExist = this.form.keywordsList.indexOf(this.form.keyword);
      if (isExist === -1) {
        this.form.keywordsList.push(this.form.keyword);
        this.form.keyword = "";
      } else {
        this.$message.error("关键词已存在");
      }
    }
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
        color: #fff !important;
        border-color: var(--DBlue) !important;
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