<template>
  <div class="container">
    <div class="module">
      <div class="radio-group">
        <el-radio-group v-model="queryType" size="small">
          <el-radio-button label="1">京币</el-radio-button>
          <el-radio-button label="2">消费明细</el-radio-button>
          <el-radio-button label="3">京币规则</el-radio-button>
        </el-radio-group>
      </div>
      <jing-currency v-if="queryType=='1'"></jing-currency>
      <consumption-details v-if="queryType=='2'"></consumption-details>
      <jing-currency-rules v-if="queryType=='3'"></jing-currency-rules>
    </div>
  </div>
</template>
<script>
import jingCurrency from "./jingCurrencyList/jingCurreny";
import consumptionDetails from "./consumptionDetails";
import jingCurrencyRules from "./jingCurrencyRules";
export default {
  data() {
    return {
      queryType: "1"
    };
  },
  components: {
    jingCurrency,
    consumptionDetails,
    jingCurrencyRules
  }
};
</script>
<style lang="scss" scoped>
.container {
  height: 100%;
}
.module {
  height: 100%;
  background-color: #fff;
  box-shadow: 0px 3px 24px 0px rgba(168, 168, 236, 0.22);
  border-radius: 10px;
  padding: 20px;
  .radio-group {
    /deep/ .el-radio-button {
      margin-right: 6px;
    }
    /deep/ .el-radio-button__inner {
      width: 76px;
      height: 30px;
      border-radius: 0;
      color: #999999 !important;
      border: 1px solid #999 !important;
      background-color: #fff;
      box-shadow: none;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    /deep/ .el-radio-button.is-active .el-radio-button__inner {
      border-color: var(--DBlue) !important;
      color: var(--DBlue) !important;
    }
    /deep/ .el-radio-button.is-active .el-radio-button__inner:hover {
      background-color: var(--DBlue) !important;
      color: #fff !important;
    }
    /deep/ .el-radio-button__inner:hover {
      border-color: var(--DBlue) !important;
      color: var(--DBlue) !important;
      background-color: #fff !important;
    }
  }

  .consumption-box {
    .consumption-options {
      margin-top: 26px;
      /deep/ .el-select {
        margin-right: 26px;
      }
      /deep/ .el-select .el-input__inner {
        width: 120px;
        height: 30px;
      }
      /deep/ .el-select .el-input .el-select__caret {
        line-height: 30px;
      }
      /deep/ .el-range-editor.el-input__inner {
        height: 30px;
        line-height: 30px;
      }
      /deep/ .el-date-editor .el-range__icon {
        line-height: 22px;
      }
      /deep/ .el-date-editor .el-range-separator {
        line-height: 22px;
      }
      /deep/ .el-button {
        margin-left: 10px;
        width: 80px;
        height: 30px;
        padding: 0;
      }
    }
    .consumption-details {
      margin-top: 20px;
      .el-table {
        border: 1px solid #ebeef5;
        border-bottom: 0;
      }
    }
  }
}
</style>