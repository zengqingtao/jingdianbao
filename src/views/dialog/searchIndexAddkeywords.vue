<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="isShowDialog"
      :modal-append-to-body="false"
      :center="true"
      :width="step==1?'601px':'430px'"
      @close="closeDialog"
      class="dialog"
    >
      <p class="title">添加关键词</p>
      <div class="step1-box" v-if="step==1">
        <el-form
          class="form"
          ref="form"
          :rules="formRules"
          :model="form"
          label-width="90px"
          @submit.native.prevent
        >
          <el-form-item label="输入方式：">
            <el-radio-group v-model="form.inputModel" size="small" @change="changeInputModel">
              <el-radio-button label="1">手动录入</el-radio-button>
              <el-radio-button label="2">批量导入</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="关键词：" prop="keyword" v-if="form.inputModel=='1'">
            <div class="keyword-inp">
              <el-input
                v-model="form.keyword"
                size="small"
                placeholder="请输入关键词，按下回车键确认"
                @keyup.enter.native="addkeyword"
                @focus="clearValidate('keyword')"
              ></el-input>
            </div>
          </el-form-item>
          <el-form-item prop="sku" label="sku：" v-if="form.inputModel=='2'">
            <el-input placeholder="请输入sku或者sku链接" v-model="form.sku" size="small" @focus="clearValidate('sku')"></el-input>
          </el-form-item>
        </el-form>
        <div class="keyword-box" v-if="form.inputModel=='1'">
          <div class="keyword-item" v-for="(item,index) in form.keywordsList" :key="index">
            <span>{{item}}</span>
            <i class="iconfont icon-guanbi" @click="delKeyword(index)"></i>
          </div>
        </div>
        <div
          class="keyword-tip"
          v-if="form.inputModel=='1'"
        >(上限：{{keywordInfo.power}}个，已用{{keywordInfo.exitCount}}个，可新增{{keywordInfo.addCount}}个)</div>
        <div class="submit-btn">
          <el-button
            type="primary"
            class="--btn-primary"
            onfocus="this.blur()"
            @click="submit"
            v-if="form.inputModel=='1'"
            :loading="btnLoading"
          >提交</el-button>
          <el-button
            type="primary"
            class="--btn-primary"
            onfocus="this.blur()"
            @click="next"
            v-if="form.inputModel=='2'"
            :loading="btnLoading"
          >下一步</el-button>
        </div>
      </div>
      <div class="step2-box" v-if="step==2">
        <el-table :data="list" class="table" height="403px">
          <el-table-column label="序号" align="center">
            <template slot-scope="scope">
              <div :class="scope.row.checked?'checked':''">{{scope.$index+1}}</div>
            </template>
          </el-table-column>
          <el-table-column label="关键词" prop="keyword" align="center">
            <template slot-scope="scope">
              <div :class="scope.row.checked?'checked':''">{{scope.row.keyword}}</div>
            </template>
          </el-table-column>
          <el-table-column label="选择" align="center">
            <template slot-scope="scope">
              <el-checkbox
                :key="scope.$index"
                v-model="scope.row.checked"
                @change="selectKeyword(scope.$index,scope.row.checked)"
              ></el-checkbox>
            </template>
          </el-table-column>
        </el-table>
        <div class="checkAll">
          <!-- <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox> -->
          <div class="checked-count">可选 {{checkedCount}}/{{optional}}</div>
        </div>
        <div class="pleaseSelectKeyword" v-if="!checkedCount&&pleaseSelectedKeyword">请选择关键词</div>
        <div class="submit-btn step2-btn-group">
          <el-button class="--btn-none" @click="step=1">上一步</el-button>
          <el-button
            type="primary"
            class="--btn-primary"
            onfocus="this.blur()"
            @click="step2Submit"
            :loading="btnLoading"
          >提交</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  addKeyword,
  getKeywordsBySku,
  getKeywordsInfo
} from "../../api/information";
import { skuReg } from "@/utils/common";
import { mapState } from "vuex";
export default {
  data() {
    let keywordValidate = (rule, value, callback) => {
      if (this.form.keywordsList.length == 0&&this.keywordInfo.addCount!==0) {
        if (value != "") {
          callback(new Error("请按下回车键确认关键词"));
        } else {
          callback(new Error("关键词不能为空"));
        }
      } else if (
        this.form.keywordsList.length == this.keywordInfo.addCount &&
        value != ""
      ) {
        callback(new Error("关键词新增数量超出可新增的上限"));
      }
      callback();
    };
    let skuValidate = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("sku不能为空"));
      } else if (!skuReg(this.form.sku)) {
        callback(new Error("sku链接格式不正确"));
      } else {
        callback();
      }
    };
    return {
      isShowDialog: true,
      form: {
        inputModel: "1",
        keywordsList: [],
        keyword: "",
        sku: ""
      },
      formRules: {
        keyword: [{ validator: keywordValidate, trigger: ["blur"] }],
        sku: [{ validator: skuValidate, trigger: ["blur"] }]
      },
      step: 1,
      list: [],
      selectedKeywords: [],
      checkAll: false,
      checkedCount: 0,
      btnLoading: false,
      pleaseSelectedKeyword: false,
      optional: 0,
      keywordInfo: {},
      test: "测试"
    };
  },
  props: {
    num: {
      type: Number
    }
  },
    computed: mapState(["searchIndexListKeyword"]),
  mounted() {
    this.optional = this.num;
    this.getKeywordsInfo();
     if (this.searchIndexListKeyword) {
       this.form.keyword = this.searchIndexListKeyword
    }
  },
  methods: {
    async getKeywordsInfo() {
      let { data: res } = await getKeywordsInfo();
      if (res.code == 200) {
        this.keywordInfo = res.data;
      }
    },
    async request(keywords) {
      this.btnLoading = true;
      let params = {
        keyword: this.step == 1 ? this.dealKeyword() : keywords
      };
      const { data: res } = await addKeyword({ params });
      this.btnLoading = false;
      if (res.code == 200) {
        this.closeDialog();
        this.$emit("success");
      } else {
        this.$message.error(res.msg);
      }
    },
    submit(keywords) {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.request();
        }
      });
    },
    next() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          this.btnLoading = true;
          let params = {
            sku: skuReg(this.form.sku)
          };
          const { data: res } = await getKeywordsBySku({ params });
          this.btnLoading = false;
          if (res.code == 200) {
            this.step = 2;
            let list = res.data.result;
            this.list = [];
            list.forEach(element => {
              let obj = {};
              obj.keyword = element;
              obj.checked = false;
              this.list.push(obj);
            });
          }
        }
      });
    },
    step2Submit() {
      if (!this.selectedKeywords.length) {
        this.pleaseSelectedKeyword = true;
      } else {
        if (this.selectedKeywords.length > this.optional) {
          this.selectedKeywords.splice(this.optional);
        }
        let checkedKeywords = this.selectedKeywords.join(",");
        this.request(checkedKeywords);
      }
    },
    selectKeyword(index, checked) {
      //选择关键词
      if (this.selectedKeywords.length == this.optional && checked) {
        this.list[index].checked = false;
        return;
      }
      this.list[index].checked = checked;
      this.checkedCount = 0;
      this.selectedKeywords = [];
      this.list.forEach(element => {
        if (element.checked) {
          if (this.checkedCount < this.optional) {
            this.checkedCount++;
          }
          this.selectedKeywords.push(element.keyword);
        }
      });
      // if (this.selectedKeywords.length == this.list.length) {
      //   this.checkAll = true;
      // } else {
      //   this.checkAll = false;
      // }
    },
    // handleCheckAllChange() {
    //   // 全选
    //   this.list.forEach(element => {
    //     element.checked = this.checkAll;
    //   });
    //   if (this.checkAll) {
    //     if (this.list.length > this.optional) {
    //       this.checkedCount = this.optional;
    //     } else {
    //       this.checkedCount = this.list.length;
    //     }
    //     this.selectedKeywords = this.list.map(item => {
    //       return item.keyword;
    //     });
    //   } else {
    //     this.checkedCount = 0;
    //     this.selectedKeywords = [];
    //   }
    // },
    changeInputModel() {
      this.form = {
        inputModel: this.form.inputModel,
        keywordsList: [],
        keyword: "",
        sku: ""
      };
      this.$refs.form.resetFields();
    },
    dealKeyword() {
      //处理关键词
      let keywordsStr = this.form.keywordsList.join(",");
      return keywordsStr;
    },
    delKeyword(index) {
      //删除关键词
      this.form.keywordsList.splice(index, 1);
    },
    addkeyword() {
      //增加关键词
      if (this.form.keyword == "") return;
      if (this.form.keywordsList.length < this.keywordInfo.addCount) {
        this.form.keywordsList.push(this.form.keyword);
        this.form.keyword = "";
        this.$refs.form.clearValidate();
      } else {
        this.$refs.form.validateField("keyword");
      }
    },
    clearValidate(propValue) {
      this.$refs.form.clearValidate(propValue);
    },
    closeDialog() {
      this.$emit("closeDialog");
    }
  }
};
</script>
<style lang="scss" scoped>
.dialog {
  /deep/ .el-dialog--center .el-dialog__body {
    padding: 30px 15px 26px !important;
  }
  .title {
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
  }
  .step1-box {
    padding: 0 33px 0 15px;
  }
  .form {
    /deep/ .el-form-item {
      margin-bottom: 16px;
    }
    /deep/ .el-form-item__content,
    /deep/ .el-form-item__label {
      line-height: 30px;
    }
    /deep/ .el-radio-button {
      margin-right: 10px;
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
      border-color:var(--DBlue) !important
    }
  }
  .keyword-box {
    width: 438px;
    margin-left: 90px;
    padding: 5px 0;
    display: flex;
    flex-wrap: wrap;
    .keyword-item {
      height: 25px;
      line-height: 25px;
      font-size: 12px;
      background-color: #dcdfe6;
      padding: 0 10px;
      border-radius: 12.5px;
      margin: 0 5px 5px 0;
      .icon-guanbi {
        font-size: 13px;
        cursor: pointer;
      }
    }
  }
  .keyword-tip {
    margin-left: 90px;
    line-height: 20px;
    color: #999;
    font-size: 12px;
  }
  .submit-btn {
    margin-top: 30px;
    text-align: center;
    /deep/ .el-button {
      width: 120px;
      height: 30px;
      padding: 0;
    }
  }
  .step2-box {
    .table {
      border: 1px solid #eee;
      border-bottom: 0;
    }
    /deep/ .el-table th,
    /deep/ .el-table td {
      border: 0;
    }
    /deep/ .el-table td,
    /deep/ .el-table th {
      padding: 6px 0;
    }
    .checked {
      color: var(--DBlue);
    }
    /deep/ .el-checkbox__input.is-focus .el-checkbox__inner {
      border-color: #dcdfe6 !important;
    }
    .checkAll {
      margin-top: 10px;
      display: flex;
      align-items: center;
      /deep/ .el-checkbox {
        margin-right: 10px;
        color: #333;
      }
      .checked-count {
        color: #999;
        font-size: 12px;
      }
    }
    .pleaseSelectKeyword {
      color: #f56c6c;
      text-align: center;
    }
    .step2-btn-group {
      margin-top: 25px;
    }
  }
}
</style>