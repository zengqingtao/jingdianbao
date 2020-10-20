<template>
  <div class="container">
    <div class="module">
      <div class="member-exChange">
        <div class="head">
          <div class="exChange-title-box">
            <span class="title">会员兑换</span>
            <span
              class="subtitle"
            >累计有效邀请人数：{{memberDetail.totalCount}}人（已兑换{{memberDetail.exchangeCount}}人）</span>
          </div>
          <div class="recommend-code">个人推荐码：{{memberInfo.myInviteCode}}</div>
        </div>
        <div class="table-box">
          <el-table :data="exChangeList">
            <el-table-column prop="name" align="center" label="奖励会员" width="190px"></el-table-column>
            <el-table-column prop="condition" align="center" label="会员兑换条件"></el-table-column>
            <el-table-column prop="days" label="有效期" width="190px">
              <template slot-scope="scope">
                <div class="effective-time-box">
                  <div class="effective-time">{{scope.row.days}}</div>
                  <div v-if="scope.$index!=0">
                    <el-button
                      v-if="scope.row.isExchange==1"
                      type="primary"
                      class="--btn-primary"
                      onfocus="this.blur()"
                      @click="exchangeJdbVip(scope.$index)"
                    >兑换</el-button>
                    <div class="tips" v-else>{{scope.row.isExchange==2?'已兑换':'未满足条件'}}</div>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="invination-register">
        <div class="title">邀请注册流程</div>
        <ul class="ul-box">
          <li class="li1">
            <p>
              <span>1、将个人专属推荐码分享给好友；京店宝官网：{{jdbUrl}}</span>
              <span class="recommend-code">
                <span>推荐码：</span>
                <span class="code">{{memberInfo.myInviteCode}}</span>
              </span>
            </p>
            <el-button
              type="primary"
              class="copy-btn --btn-primary"
              onfocus="this.blur()"
              @click="copyFn"
            >复制分享</el-button>
          </li>
          <li class="li2">2、好友在京店宝官网注册新账号，并且在注册页面输入上述推荐码；</li>
          <li class="li3-img">
            <img src="../../../assets/images/member/memberExchange/recommendCode.jpg" alt />
          </li>
          <li>3、注册成功后，好友进入个人中心，点击【验证】按钮，对店铺有效性进行验证</li>
          <li class="li5-img">
            <img src="../../../assets/images/member/memberExchange/verify1.jpg" alt />
          </li>
          <li>4、首先，被邀请人在验证店铺有效性的页面，输入商品链接；</li>
          <li class="li7-img">
            <img src="../../../assets/images/member/memberExchange/verify2.jpg" alt />
          </li>
          <li class="text-li">5、然后，被邀请人按要求，修改该店铺下某个商品的标题，最后提交申请验证</li>
          <li class="text-li">6、通过验证后，邀请的有效用户数会+1；（注意，一个店铺只可参与一次有效验证）</li>
          <li
            class="text-li"
          >7、被邀请人通过店铺验证，也可获得奖励。普通会员用户可获得2个月的标准会员奖励,标准会员用户可获得2个月标准会员奖励，高级会员用户可获得2个月的高级会员奖励。</li>
          <li class="text-li">8、系统对商品标题验证通过后，可马上将标题恢复。</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { getUserVipExchangeInfo, exchangeJdbVip } from "../../../api/user";
import { mapState } from "vuex";
import { copyUrl2 } from "../../../utils/common";
import { getJdbUserVip } from "../../../api/user";
export default {
  data() {
    return {
      memberDetail: {},
      exChangeList: [
        {
          name: "普通会员",
          condition: "新注册用户直接赠送",
          days: "永久"
        },
        {
          name: "一个月标准会员",
          condition:
            "邀请：累计邀请1人注册，被邀请人绑定店铺，并通过店铺有效性验证",
          days: "一个月"
        },
        {
          name: "半年标准会员",
          condition:
            "邀请：累计邀请5人注册，被邀请人绑定店铺，并通过店铺有效性验证",
          days: "6个月"
        },
        {
          name: "半年高级会员",
          condition:
            "邀请：累计邀请10人注册，被邀请人绑定店铺，并通过店铺有效性验证",
          days: "6个月"
        }
      ],
      jdbUrl: "http://www.jingdianbao.cn"
    };
  },
  computed: {
    ...mapState(["memberInfo"])
  },
  created() {
    document.scrollingElement.scrollTop = 0; //让页面滚动到最顶部
    this.getUserVipExchangeInfo();
    this.getJdbUserVip();
  },
  methods: {
    async getUserVipExchangeInfo() {
      const { data: res } = await getUserVipExchangeInfo();
      if (res.code === 200) {
        this.memberDetail = res.data;
        this.exChangeList.forEach((item, index) => {
          // exchangeType 1:一个月标准 2：半年标准 3：半年高级
          // isExchange 0:未满足条件 1：可兑换 2：已兑换
          switch (index) {
            case 1:
              item.exchangeType = index;
              item.isExchange = this.memberDetail.level2Day7;
              break;
            case 2:
              item.exchangeType = index;
              item.isExchange = this.memberDetail.level2Day30;
              break;
            case 3:
              item.exchangeType = index;
              item.isExchange = this.memberDetail.level3Day30;
              break;
          }
          this.$set(this.exChangeList, index, item);
        });
      }
    },
    async getJdbUserVip() {
      const { data: res } = await getJdbUserVip();
      if (res.code === 200) {
        this.$store.commit("CHANGE_MEMBER_INFO", res.data);
      }
    },
    // 兑换会员
    async exchangeJdbVip(exchangeType) {
      const params = { type: exchangeType };
      const { data: res } = await exchangeJdbVip({ params });
      if (res.code === 200) {
        this.$message.success(`兑换成功`);
        location.reload();
      } else {
        this.$message.error(res.msg);
      }
    },
    // 复制
    copyFn() {
      let content =
        "京店宝官网：" +
        this.jdbUrl +
        " 推荐码：" +
        this.memberInfo.myInviteCode;
      copyUrl2(content);
      this.$message.success("复制成功");
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  background-color: #fff;
  display: flex;
  justify-content: center;
  padding: 22px 0 30px 0;
}
.member-exChange {
  width: 1200px;
  height: 292px;
  margin: 20px 0 20px 0;
  color: #333333ff;
  font-size: 14px;
  .head {
    height: 47px;
    background-color: #f4f4f4ff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    border: 1px solid #eef;
    border-bottom: 0;
    .exChange-title-box {
      .title {
        color: #333333ff;
        font-size: 16px;
        font-weight: bold;
      }
      .subtitle {
        color: #999999ff;
        font-size: 12px;
        vertical-align: bottom; /*底对齐*/
      }
    }
    .recommend-code {
      width: 160px;
      height: 30px;
      line-height: 30px;
      background-color: #d5e8ffff;
      border-radius: 2px;
      color: #333;
      font-size: 12px;
      text-align: center;
    }
  }
  .table-box {
    height: 245px;
    /deep/ .el-table {
      border-left: 1px solid #eef;
      border-right: 1px solid #eef;
    }
    /deep/ .el-table td,
    .el-table th {
      padding: 10px 0;
    }
    /deep/ .el-table thead {
      font-weight: bold !important;
    }
    .effective-time-box {
      display: flex;
      align-items: center;
      .effective-time {
        width: 50px;
      }
      /deep/ .el-button {
        width: 65px;
        height: 30px;
        padding: 0;
        margin-left: 10px;
      }
      .tips {
        color: #999;
        padding-left: 15px;
      }
    }
  }
}
.invination-register {
  width: 1200px;
  border: 1px solid #eeeeeeff;
  .title {
    background-color: #f4f4f4ff;
    height: 47px;
    line-height: 47px;
    color: #333;
    font-size: 16px;
    font-weight: bold;
    padding-left: 20px;
  }
  .ul-box {
    padding: 0 0 30px 53px;
    color: #333;
    font-size: 14px;
    .li1 {
      padding: 10px 0 20px 0;
      display: flex;
      align-items: center;
      .recommend-code {
        padding: 0 10px;
        .code {
          font-weight: bold;
        }
      }
      .copy-btn.el-button {
        width: 93px;
        height: 34px;
        padding: 0;
      }
    }
    .li3-img,
    .li5-img,
    .li7-img {
      padding: 10px 0 30px 0;
      img {
        width: 994px;
      }
    }
    .text-li + .text-li {
      padding-top: 30px;
    }
  }
}
</style>