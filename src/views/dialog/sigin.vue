<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="showDialog"
      :center="true"
      :modal-append-to-body="false"
      @close="closeDialog"
      width="500px"
      class="dialog"
    >
      <div class="radio-group">
        <el-radio-group v-model="activeRadio" size="small">
          <el-radio-button label="1">签到</el-radio-button>
          <el-radio-button label="2">幸运100%</el-radio-button>
          <el-radio-button label="3">早到榜</el-radio-button>
        </el-radio-group>
      </div>
      <sigin-item v-if="activeRadio=='1'" @onSigin="activeRadio = '2'" @canSignIn="getCanSignIn"></sigin-item>
      <lucky-item v-if="activeRadio=='2'" :canSignIn="canSignIn"></lucky-item>
      <early-item v-if="activeRadio=='3'"></early-item>
    </el-dialog>
  </div>
</template>
<script>
import siginItem from "../personal/jingCurrency/jingCurrencyList/siginItem";
import luckyItem from "../personal/jingCurrency/jingCurrencyList/luckyItem";
import earlyItem from "../personal/jingCurrency/jingCurrencyList/earlyItem";
export default {
  data() {
    return {
      showDialog: true,
      activeRadio: "1",
      canSignIn:false,
    };
  },
  components: {
    siginItem,
    luckyItem,
    earlyItem
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
    getCanSignIn(value){
      this.canSignIn = value
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/ .el-dialog--center .el-dialog__body {
  padding: 30px 51px 26px !important;
}
.dialog {
  .radio-group {
    margin-top: 30px;
    /deep/ .el-radio-button{
      margin-right:0;
    }
    /deep/ .el-radio-button + .el-radio-button {
      margin-left: 10px;
    }
    /deep/ .el-radio-button__inner {
      width: 126px;
      height: 40px;
      font-size: 16px;
      border-radius: 2px;
      color: var(--DBlue) !important;
      border: 1px solid var(--DBlue) !important;
      background-color: #fff;
      box-shadow: none;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    /deep/ .el-radio-button.is-active .el-radio-button__inner {
      background-color: var(--DBlue);
      border-color: var(--DBlue) !important;
      color: #fff !important;
    }
    /deep/ .el-radio-button.is-active .el-radio-button__inner:hover {
      background-color: var(--JBlue) !important;
      border-color: var(--JBlue) !important;
      color: #fff !important;
    }
    /deep/ .el-radio-button__inner:hover {
      border-color: var(--DBlue) !important;
      color: #fff !important;
      background-color: var(--DBlue) !important;
    }
  }
  .sigin {
  }
}
</style>