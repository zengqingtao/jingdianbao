<template>
  <div class="container">
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="isShowDialog"
      :center="true"
      @close="closeDialog"
      width="570px"
      class="dialog"
    >
      <div class="buyOptions-box">
        <div class="title">{{userName}}</div>
        <div class="radio-group">
          <div class="radio-item" :class="activeRadio==1?'is-active':''" @click="activeRadio=1">标准会员</div>
          <div class="radio-item" :class="activeRadio==2?'is-active':''" @click="activeRadio=2">高级会员</div>
        </div>
        <div class="price-box">
          <div
            class="price-item"
            v-for="(item,index) in fliterPriceList"
            :key="index"
            :class="active==index?activePriceStyle[activeRadio]:''"
            @click="changeMoney(index)"
          >
            <p class="item-num">{{ item.money }}</p>
            <p class="item-unit">{{ item.unit }}</p>
          </div>
        </div>
        <div class="desc-box" v-if="discountDetail.discount && activeRadio == '2'">
          <p>升级高级会员可用标准会员抵扣金额，你有{{discountDetail.month}}个月的标准会员可用于抵扣，可抵扣金额为：¥{{discountDetail.discount}}</p>
          <p>购买{{ active == 0 ? '半': '一'}}年高级会员，实际支付金额：¥{{discountDetail.payMoney}}</p>
        </div>
        <div class="desc-box" v-if="level === 3 && activeRadio == '1'">
          <p>你的高级用户还有效，暂时无法购买标准会员</p>
        </div>
        <div class="payType-box">
          <div>支付方式：</div>
          <el-radio v-model="payType" label="1" :disabled="balanceNotEnough">
            账户余额
            <span class="tips" v-if="balanceNotEnough">(余额不足)</span>
          </el-radio>
          <el-radio v-model="payType" label="2">支付宝支付</el-radio>
        </div>
        <div class="btn-group">
          <el-button
            type="primary"
            :loading="payBtnLoading"
            :disabled="level==3&&activeRadio==1"
            @click="chargeForBuyVip"
            :class="activeRadio==2?'advanced-btn':''"
          >付款购买</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { aliPay } from "../../utils/pay";
import { getChargeMoney, chargeForBuyVip } from "../../api/user";
import { getBalanceMoney, balancePayJdbVip } from "../../api/balance";
export default {
  data() {
    return {
      isShowDialog: true,
      activeRadio: 1,
      active: 0,
      payType: "1",
      activePriceStyle: {
        1: "is-active-standard",
        2: "is-active-advanced"
      },
      priceList: [
        {
          money: "88",
          unit: "元/月",
          type: 1
        },
        {
          money: "660",
          unit: "元/年",
          type: 2
        },
        {
          money: "880",
          unit: "元/半年",
          type: 3
        },
        {
          money: "1280",
          unit: "元/年",
          type: 4
        }
      ],
      type: 1, //2选中标准会员，3选中高级会员
      level: 1, //1普通会员，2标准会员，3高级会员
      accountBalance: "", //账户余额
      discountDetail: {},
      balanceNotEnough: false,
      payBtnLoading: false
    };
  },
  props: {
    clickType: {
      type: Number,
      default: 2
    },
    vipLevel: {
      type: Number
    }
  },
  computed: {
    ...mapState(["buyMemberModalStatus", "userName", "memberInfo"]),
    fliterPriceList() {
      if (this.activeRadio == 1) {
        return this.priceList.filter(item => item.type < 3);
      } else {
        return this.priceList.filter(item => item.type > 2);
      }
    },
    priceType() {
      return this.fliterPriceList[this.active].type;
    }
  },
  watch: {
    activeRadio() {
      this.getChargeMoney();
      this.active = 0;
    }
  },
  created() {
    this.type = this.clickType;
    this.level = this.vipLevel;
    switch (this.type) {
      case 2:
        this.activeRadio = 1;
        break;
      case 3:
        this.activeRadio = 2;
    }
    // switch (this.level) {
    //   case 1:
    //     this.activeRadio = 1;
    //     break;
    //   case 2:
    //     if (this.type == 1) {
    //       this.activeRadio = 1;
    //     } else {
    //       this.activeRadio = 2;
    //     }
    //     break;
    //   default:
    //     this.activeRadio = 2;
    // }
    this.getChargeMoney();
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
    changeStatus(status) {
      this.active = 0;
      this.$store.commit("CHANGE_BUY_MEMBER_STATUS", status);
    },
    async getAccountBalance() {
      let { data: res } = await getBalanceMoney();
      if (res.code === 200) {
        this.accountBalance = res.data;
      }
    },
    changeMoney(index) {
      this.active = index;
      this.getChargeMoney();
    },
    async getChargeMoney() {
      await this.getAccountBalance();
      const params = { type: this.priceType };
      const { data } = await getChargeMoney({ params });
      if (data.code === 200) {
        this.discountDetail = data.data;
        if (this.accountBalance < this.discountDetail.payMoney) {
          this.balanceNotEnough = true;
          this.payType = "2";
        } else {
          this.balanceNotEnough = false;
          this.payType = "1";
        }
      } else {
        this.balanceNotEnough = false;
        this.paymentRadio = "1";
      }
    },
    // 付款购买
    async chargeForBuyVip() {
      this.payBtnLoading = true;
      let params1 = { type: this.priceType };
      if (this.payType == "1") {
        //账户余额支付
        const { data: res } = await balancePayJdbVip({ params:params1 });
        if (res.code == 200) {
          this.$message.success("支付成功");
          this.closeDialog();
          location.reload();
        } else {
          this.payBtnLoading = false;
          this.$message.error("支付失败");
        }
      } else if (this.payType == "2") {
        let params2 = {
          type: this.priceType,
          version: 0, //0：新版本
          url:location.href
        };
        const { data: res } = await chargeForBuyVip({ params:params2 });
        if (res.code === 200) {
          aliPay(res.data.alipayUrl);
        } else {
          this.payBtnLoading = false;
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/ .el-dialog--center .el-dialog__body {
  padding: 0 !important;
}
.buyOptions-box {
  .title {
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: #fff;
    font-size: 16px;
    background-color: #222431;
  }
  .radio-group {
    height: 40px;
    line-height: 40px;
    background-color: #f4f4f4;
    color: #666666;
    font-size: 14px;
    display: flex;
    .radio-item {
      width: 50%;
      text-align: center;
      cursor: pointer;
    }
    .is-active {
      color: #333;
      font-weight: bold;
      background-color: #dde3fb;
      transition: all 0.2s;
    }
  }
  .price-box {
    padding: 31px 38px 10px;
    display: flex;
    justify-content: space-between;
    .price-item {
      width: 240px;
      height: 110px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: url("../../assets/images/normal.png") no-repeat;
      &.is-active-standard {
        background: url("../../assets/images/standard-bg.png") no-repeat !important;
        .item-num {
          color: #2b396d;
          font-weight: bold;
        }
        .item-unit {
          color: #2b396d;
        }
      }
      &.is-active-advanced {
        background: url("../../assets/images/advanced-bg.png") no-repeat !important;
        .item-num {
          color: #ebdd0c;
          font-weight: bold;
        }
        .item-unit {
          color: #ebdd0c;
        }
      }
      .item-num {
        color: #999;
        font-size: 40px;
      }
      .item-unit {
        color: #999;
      }
    }
  }
  .desc-box {
    width: 444px;
    line-height: 20px;
    margin-left: 38px;
    color: #333;
  }
  .payType-box {
    display: flex;
    padding: 20px 0 20px 38px;
    color: #333;
    /deep/ .el-radio__input.is-checked + .el-radio__label {
      color: #1e2189;
    }
    /deep/ .el-radio__input.is-checked .el-radio__inner {
      background-color: #1e2189;
      border-color: #1e2189;
    }
    .tips {
      color: #f00;
    }
  }
  .btn-group {
    text-align: center;
    padding-bottom: 25px;
    /deep/ .el-button {
      width: 120px;
      height: 30px;
      line-height: 30px;
      padding: 0;
      background-color: #8196ff;
      border-color: #8196ff;
    }
    /deep/ .el-button:hover {
      border-color: #8196ff !important;
    }
    .advanced-btn.el-button {
      color: #ebdd0c !important;
      background-color: #2f3249;
      border-color: #2f3249;
    }
    .advanced-btn.el-button:hover {
      border-color: #2f3249 !important;
    }
  }
}
</style>
