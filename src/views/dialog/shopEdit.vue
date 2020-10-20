<template>
  <div class="container">
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="isShowDialog"
      :center="true"
      @close="closeDialog"
      width="511px"
      class="dialog"
    >
      <div class="title">{{shopName?'编辑店铺':'绑定店铺(暂不支持拼多多店铺链接)'}}</div>
      <div class="original-shopName" v-if="shopName">原店铺名称：{{shopName}}</div>
      <el-form ref="form" :rules="formRules" :model="form" @submit.native.prevent>
        <el-form-item  prop="shopMainPage">
          <el-input
            v-model="form.shopMainPage"
            :placeholder="shopName?'请输入新的店铺主页链接':'请输入店铺主页链接'"
            @focus="clearValidate('shopMainPage')"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="btn-group">
        <el-button type="primary" onfocus="this.blur()" class="--btn-primary" @click="submitAdd">{{shopName?'确定':'添加'}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { bindShop,updateBindShop } from "../../api/user";
import { mapState } from "vuex";
import { shopUrlReg } from "../../utils/common"
export default {
  data() {
    let shopMainPageValidate = (rule, value, callback) => {
      if (!value) {
        callback(new Error("店铺主页链接不能为空"));
      } 
      else if(!shopUrlReg(value)){
        callback(new Error("店铺主页链接格式不正确"));
      }
      else{
        callback()
      }
    };
    return {
      isShowDialog: true,
      form: {
        shopMainPage: ""
      },
      formRules: {
        shopMainPage: [{ validator: shopMainPageValidate, trigger: "blur" }]
      }
    };
  },
  computed: {
    ...mapState(["shopName"])
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
    submitAdd() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          let params = {
            shopName:"",
            shopIndex: this.form.shopMainPage
          };
          let { data: res } = this.shopName?await updateBindShop(params):await bindShop(params);
          if (res.code === 200) {
            this.$message({ type: "success", message: "绑定店铺成功！" });
            this.closeDialog();
            this.$emit("editSuccess");
          } else {
            this.$message({ type: "error", message: res.msg });
          }
        }
      });
    },
    clearValidate(propValue) {
      this.$refs.form.clearValidate(propValue);
    }
  }
};
</script>
<style lang="scss" scoped>
.dialog {
  .title {
    color: #333;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
  }
  .original-shopName {
    padding: 30px 0 0 8px;
    color: #666666ff;
    font-size: 14px;
  }
  /deep/ .el-form {
    padding: 9px 18px 0 8px;
  }
  .btn-group {
    text-align: center;
    margin-top: 30px;
    /deep/ .el-button {
      width: 120px;
      height: 30px;
      padding: 0;
    }
  }
}
</style>