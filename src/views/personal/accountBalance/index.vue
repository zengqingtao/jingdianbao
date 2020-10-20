<template>
  <div class="container">
    <div class="module">
      <div class="radio-group">
        <el-radio-group v-model="queryType" size="small">
          <el-radio-button label="1">余额充值</el-radio-button>
          <el-radio-button label="2">消费明细</el-radio-button>
        </el-radio-group>
        <div class="charge-box" v-if="queryType=='1'">
          <div class="money">
            <div class="title font-bold">金额</div>
            <div>
              账户余额：￥
              <span class="font-bold">{{accountBalanceInfo.balance}}</span>
            </div>
          </div>
          <div class="charge">
            <div class="title">充值</div>
            <div class="pay-mode">
              <div class="pay-mode-title">支付方式：</div>
              <div class="pay-mode-list">
                <div class="pay-mode-item zfb-box">
                  <img src="../../../assets/images/personal/zfb.png" alt />
                  <div>支付宝支付</div>
                </div>
              </div>
            </div>
            <div class="charge-money">
              <div class="charge-money-title">充值金额：</div>
              <div class="charge-money-list">
                <div
                  class="charge-money-item"
                  @click="changeMoney('0',0.01)"
                  :class="activeChargeMoney=='0'?'is-active':''"
                  v-if="!isProd"
                >
                  <div>
                    充
                    <span>0.01</span>送
                    <span>10000</span>
                  </div>
                </div>
                <div
                  class="charge-money-item"
                  @click="changeMoney('1',1000)"
                  :class="activeChargeMoney=='1'?'is-active':''"
                >
                  <div>
                    充
                    <span>1000</span>
                  </div>
                </div>
                <div
                  class="charge-money-item"
                  @click="changeMoney('2',3000)"
                  :class="activeChargeMoney=='2'?'is-active':''"
                >
                  <div>
                    充
                    <span>3000</span>送
                    <span>400</span>
                  </div>
                </div>
                <div
                  class="charge-money-item"
                  @click="changeMoney('3',5000)"
                  :class="activeChargeMoney=='3'?'is-active':''"
                >
                  <div>
                    充
                    <span>5000</span>送
                    <span>800</span>
                  </div>
                </div>
                <div
                  class="charge-money-item"
                  @click="changeMoney('4',10000)"
                  :class="activeChargeMoney=='4'?'is-active':''"
                >
                  <div>
                    充
                    <span>10000</span>送
                    <span>2000</span>
                  </div>
                </div>
                <div
                  class="charge-money-item big-item"
                  @click="changeMoney('5',20000)"
                  :class="activeChargeMoney=='5'?'is-active':''"
                >
                  <div>
                    充
                    <span class="price">20000</span>送
                    <span class="price">4000</span>
                  </div>
                  <div class="tips">拥有人气产品9折优惠1年</div>
                </div>
                <div
                  class="charge-money-item big-item"
                  @click="changeMoney('6',30000)"
                  :class="activeChargeMoney=='6'?'is-active':''"
                >
                  <div>
                    充
                    <span class="price">30000</span>送
                    <span class="price">6000</span>
                  </div>
                  <div class="tips">拥有人气产品8折优惠1年</div>
                </div>
              </div>
            </div>
            <div class="reminder">更多平台优惠政策，请添加运营经理微信咨询，页面右侧扫码添加。</div>
            <div class="btn-group">
              <el-button
                type="primary"
                class="--btn-primary"
                onfocus="this.blur()"
                @click="charge()"
              >充值</el-button>
            </div>
          </div>
        </div>
        <div v-if="queryType=='2'">
          <div class="query-options">
            <div class="options-box">
              <div>所属产品：</div>
              <el-select v-model="product">
                <el-option
                  v-for="(item,index) in productOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <div class="options-box">
              <div>收支类型：</div>
              <el-select v-model="revenue">
                <el-option
                  v-for="(item,index) in revenueOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <div class="date-box">
              <div>时间：</div>
              <el-date-picker
                v-model="searchDate"
                type="daterange"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
              <el-button
                type="primary"
                class="--btn-primary"
                onfocus="this.blur()"
                @click="getConsumptionDetails(true)"
              >查询</el-button>
            </div>
          </div>
          <div class="query-results">
            <el-table :data="tableData" style="width: 100%">
              <el-table-column prop="time" label="时间" width="160px"></el-table-column>
              <el-table-column prop="project" label="所属产品"></el-table-column>
              <el-table-column prop="orderType" label="收支类型"></el-table-column>
              <el-table-column prop="orderDesc" label="描述" width="200px"></el-table-column>
              <el-table-column prop="amount" label="金额"></el-table-column>
              <el-table-column prop="balance" label="余额"></el-table-column>
            </el-table>
            <div class="pagination-box">
              <el-pagination
                v-if="pagination.total>10"
                prev-text="上一页"
                next-text="下一页"
                background
                layout="prev, pager, next"
                @current-change="changePage"
                :total="pagination.total"
              ></el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { recharge, searchOrder, balance } from "../../../api/balance";
import { aliPay } from "../../../utils/pay";
export default {
  data() {
    return {
      queryType: "1",
      activeChargeMoney: "5",
      chargeMoney: "",
      accountBalanceInfo: {},
      productOptions: [
        {
          value: "-1",
          label: "全部"
        },
        {
          value: "0",
          label: "京店宝账户"
        },
        {
          value: "1",
          label: "人气宝"
        },
        {
          value: "2",
          label: "京客集市"
        },
        {
          value: "5",
          label: "试客宝"
        },
        {
          value: "6",
          label: "砍价宝"
        },
        {
          value: "7",
          label: "广告宝"
        }
      ],
      product: "-1", //所属产品
      revenueOptions: [
        {
          value: "-1",
          label: "全部"
        },
        {
          value: "0",
          label: "充值"
        },
        {
          value: "1",
          label: "消费"
        },
        {
          value: "2",
          label: "消费退款"
        },
        {
          value: "3",
          label: "转账"
        },
        {
          value: "4",
          label: "赠送"
        },
        {
          value: "5",
          label: "提现"
        },
        {
          value: "6",
          label: "取消提现"
        }
      ],
      revenue: "-1", //收支类型
      searchDate: "",
      tableData: [],
      pagination: {
        page: 1,
        total: 0
      }
    };
  },
  computed: {
    isProd() {
      return process.env.HOST === "prod";
    },
    searchStartTime() {
      return this.searchDate ? this.searchDate[0] : "";
    },
    searchEndTime() {
      return this.searchDate ? this.searchDate[1] : "";
    }
  },
  created() {
    this.getAccountBalance();
    this.getConsumptionDetails();
  },
  methods: {
    // 账户余额
    async getAccountBalance() {
      let { data: res } = await balance();
      if (res.code === 200) {
        this.accountBalanceInfo = res.data;
      }
    },
    changeMoney(active, money) {
      this.activeChargeMoney = active;
      this.chargeMoney = money;
    },
    async charge() {
      const params = {
        userId: localStorage.getItem("uid") || "",
        amount: this.chargeMoney,
        returnUrl: window.location.href,
        accountType: 1
      };
      let { data: res } = await recharge(params);
      if (res.status === 1) {
        aliPay(res.alipayUrl, false);
      } else if (res.status === 2) {
        this.$message({ type: "warning", message: "用户不存在" });
      } else if (res.code === 2003) {
        this.$store.commit("LOGIN_MODAL_TOGGLE", {
          toggle: true,
          loginType: 2
        });
      } else {
        this.$message({ type: "warning", message: "网络异常,请稍后重试" });
      }
    },
    async getConsumptionDetails(isSearch) {
      if (isSearch) {
        this.pagination.page = 1;
      }
      let params = {
        accountType: 1,
        startTime: this.searchStartTime,
        endTime: this.searchEndTime,
        orderFrom: this.product,
        orderType: this.revenue,
        page: this.pagination.page
      };
      let { data: res } = await searchOrder(params);
      if (res.code == 200) {
        this.tableData = res.data.results;
        this.pagination.total = res.data.totalCount;
      } else {
        this.$message.error(res.msg);
      }
    },
    changePage(currentPage) {
      this.pagination.page = currentPage;
      this.getConsumptionDetails();
    }
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
  .charge-box {
    .money {
      margin-top: 38px;
      line-height: 30px;
      color: #333;
      font-size: 14px;
      .font-bold {
        font-weight: bold;
      }
    }
    .charge {
      margin-top: 30px;
      font-size: 14px;
      color: #333;
      .title {
        font-weight: bold;
        margin-bottom: 10px;
      }
      .pay-mode {
        display: flex;
        .pay-mode-title {
          height: 44px;
          line-height: 44px;
        }
        .pay-mode-list {
          display: flex;
          .pay-mode-item {
            cursor: pointer;
          }
          .zfb-box {
            width: 130px;
            height: 44px;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid var(--DBlue);
            color: var(--DBlue);
            border-radius: 2px;

            img {
              width: 24px;
              height: 24px;
              margin-right: 8px;
            }
          }
        }
      }
      .charge-money {
        display: flex;
        margin-top: 10px;
        .charge-money-title {
          height: 44px;
          line-height: 44px;
        }
        .charge-money-list {
          width: 720px;
          display: flex;
          flex-wrap: wrap;
          .charge-money-item + .charge-money-item {
            margin-right: 14px;
          }
          .charge-money-item:first-child {
            margin-right: 14px;
          }
          .charge-money-item {
            width: 130px;
            height: 44px;
            border: 1px solid #eee;
            margin-bottom: 10px;
            position: relative;
            color: #333;
            text-align: center;
            line-height: 44px;
            cursor: pointer;
            // background: url("../../../assets/images/personal/normal.png")
            //   no-repeat;
            background-position: 101px 17px;
            background-size: 29px 28px;
            &.is-active {
              // background: url("../../../assets/images/personal/active.png")
              //   no-repeat;
              background-size: 29px 28px;
              background-position: 101px 17px;
              background-color: var(--DBlue);
              color: #fff;
              span {
                color: #ff0;
                font-size: 16px;
                font-weight: bold;
              }
            }
          }
          .big-item {
            width: 273px;
            height: 72px;
            background-position: 244px 44px;
            text-align: left;
            line-height: 20px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding-left: 15px;
            &.is-active {
              background-position: 244px 44px !important;
            }
          }
        }
      }
      .reminder{
        margin:15px 0 15px 71px;
        font-size:12px;
        font-weight: bold;
        color:#f30213;
      }
      .btn-group {
        padding-left: 71px;
        /deep/ .el-button {
          width: 120px;
          height: 30px;
          padding: 0;
        }
      }
    }
  }
  .query-options {
    display: flex;
    height: 30px;
    line-height: 30px;
    margin-top: 26px;
    color: #333;
    font-size: 14px;
    .options-box {
      display: flex;
      margin-right: 15px;
      /deep/ .el-select .el-input__inner {
        width: 120px;
        height: 30px;
      }
      /deep/ .el-select .el-input .el-select__caret {
        line-height: 30px;
      }
    }
    .date-box {
      display: flex;
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
  }
  .query-results {
    margin-top: 20px;
    /deep/ .el-table {
      border: 1px solid #ebeef5;
      border-bottom: 0;
    }
    .pagination-box {
      margin-top: 10px;
      text-align: center;
    }
  }
}
</style>