<template>
  <div class="container">
    <div class="module">
      <div class="userInfo-box">
        <div class="userInfo">
          <!-- 未登录 -->
          <div v-if="!isLogin" class="not-login">
            <div>登录可查看个人会员等级</div>
            <el-button
              type="primary"
              class="--btn-primary"
              onfocus="this.blur()"
              @click="showLogin = true"
            >登录</el-button>
          </div>
          <!-- 已登录 -->
          <div class="is-login" v-if="isLogin">
            <img :src="userInfo.headImage?userInfo.headImage:defaultAvatar" alt />
            <div class="account">{{userInfo.username}}</div>
            <!-- 普通会员 -->
            <div class="level1-box" v-if="userInfo.vipType==1">
              <div class="tips">开通标准/高级会员，享受专属特权</div>
              <el-button type="primary" class="--btn-primary" @click="buyVip(2)">开通</el-button>
            </div>
            <!-- 标准会员/高级会员 -->
            <div class="level2-box" v-if="userInfo.vipType!=1">
              <div class="standard-box">
                <img src="../../../assets/images/member/privilege/standard.png" alt />
                <div class="standard">标准会员</div>
                <div>{{level2Info?(level2Info + ' 到期'):'未开通'}}</div>
              </div>
              <div class="advanced-box">
                <img src="../../../assets/images/member/privilege/advanced.png" alt />
                <div class="advanced">高级会员</div>
                <div>{{currentLevelInfo.vipLevelCode==3?(currentLevelInfo.endDate + ' 到期'):'未开通'}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="list-box">
        <div class="list">
          <div class="column column1">
            <div class="function-rank">功能排名</div>
            <div class="content" v-for="(item,index) in tableData" :key="index">{{item.title}}</div>
          </div>
          <div class="column column2" :class="userInfo.vipType==1?'heightLight':''">
            <div class="member">普通会员</div>
            <el-button>永久拥有</el-button>
            <div class="content" v-for="(item,index) in tableData" :key="index">{{item.ordinary}}</div>
          </div>
          <div class="column column3" :class="userInfo.vipType==2?'heightLight':''">
            <div class="member">标准会员</div>
            <el-button
              type="primary"
              :disabled="userInfo.vipType==3"
              @click="buyVip(2)"
            >{{level2Info?'续费':'开通标准会员'}}</el-button>
            <div class="content" v-for="(item,index) in tableData" :key="index">{{item.standard}}</div>
          </div>
          <div class="column column4" :class="userInfo.vipType==3?'heightLight':''">
            <div class="member">高级会员</div>
            <el-button
              type="primary"
              class="--btn-primary"
              @click="buyVip(3)"
            >{{userInfo.vipType!=3?'开通高级会员':'续费'}}</el-button>
            <div class="content" v-for="(item,index) in tableData" :key="index">{{item.senior}}</div>
          </div>
        </div>
        <div class="remarks-box">
          <p>备注：</p>
          <p>1、排名监控：每添加1个SKU计算1个数量（每个SKU可监控5个词语）；竞品监控：每添加1个SKU计算1个数量。</p>
          <p>2、“限制次数”的功能，超出数量后，可用京币使用该功能（查销量/查权重/关键词分析/排名监控/竞品监控/直播监控/流量监控除外）；“不限次数”的功能，无需京币即可无限使用；“无权限”的功能，用京币也无法使用。</p>
          <p>3、同个模块，一天内查询同个SKU，无论查询多少次都只计算1次。例如：今天查行业，通过不同条件查询同个SKU，今天无论查多少次，都只计算为1次。</p>
        </div>
      </div>
    </div>
    <buy-vip
      v-if="showBuyVip"
      :clickType="clickType"
      :vipLevel="userInfo.vipType"
      @closeDialog="showBuyVip = false"
    ></buy-vip>
    <login-dialog v-if="showLogin" @closeDialog="showLogin = false"></login-dialog>
  </div>
</template>
<script>
import { checkLogin, getJdbUserVip, getUserLevel2 } from "../../../api/user";
import avatar from "../../../assets/images/defaultAvatar.png";
import buyVip from "../../dialog/buyVip";
import loginDialog from "../../login/loginDialog";
export default {
  data() {
    return {
      isLogin: false,
      defaultAvatar: avatar,
      userInfo: {},
      level2Info: "",
      currentLevelInfo: {},
      showBuyVip: false,
      showLogin: false,
      clickType: 1,
      tableData: [
        {
          title: "查排名",
          ordinary: "不限次数",
          standard: "不限次数",
          senior: "不限次数"
        },
        // {
        //   title: "京东国际",
        //   ordinary: "不限次数",
        //   standard: "不限次数",
        //   senior: "不限次数"
        // },
        {
          title: "查快车",
          ordinary: "不限次数",
          standard: "不限次数",
          senior: "不限次数"
        },
        {
          title: "查评价",
          ordinary: "不限次数",
          standard: "不限次数",
          senior: "不限次数"
        },
         {
          title: "cps查询",
          ordinary: "不限次数",
          standard: "不限次数",
          senior: "不限次数"
        },
        {
          title: "行业大盘查询",
          ordinary: "不限次数",
          standard: "不限次数",
          senior: "不限次数"
        },
        {
          title: "关键词查询",
          ordinary: "每日50个",
          standard: "不限次数",
          senior: "不限次数"
        },
        {
          title: "查销量",
          ordinary: "无权限",
          standard: "每日10次",
          senior: "不限次数"
        },
        {
          title: "查权重",
          ordinary: "无权限",
          standard: "每日10次",
          senior: "不限次数"
        },
        {
          title: "查行业",
          ordinary: "每日1次",
          standard: "每日10次",
          senior: "不限次数"
        },
        {
          title: "查店铺",
          ordinary: "每日1次",
          standard: "每日10次",
          senior: "不限次数"
        },
        {
          title: "查单品",
          ordinary: "每日1次",
          standard: "每日10次",
          senior: "不限次数"
        },
        {
          title: "查流量",
          ordinary: "每日1次",
          standard: "不限次数",
          senior: "不限次数"
        },
        {
          title: "搜索分析",
          ordinary: "每日1次",
          standard: "不限次数",
          senior: "不限次数"
        },
        {
          title: "秒杀分析",
          ordinary: "无权限",
          standard: "不限次数",
          senior: "不限次数"
        },
        {
          title: "关键词分析",
          ordinary: "无权限",
          standard: "无权限",
          senior: "每日100次"
        },

        {
          title: "排名监控",
          ordinary: "1个",
          standard: "10个",
          senior: "50个"
        },
        {
          title: "竞品监控",
          ordinary: "10个",
          standard: "20个",
          senior: "60个"
        },
        // 停用
        // {
        //   title: "删评监控",
        //   ordinary: "1个",
        //   standard: "10个",
        //   senior: "50个"
        // },
        {
          title: "直播监控",
          ordinary: "无权限",
          standard: "无权限",
          senior: "1个"
        },
        {
          title: "流量监控",
          ordinary: "1个",
          standard: "10个",
          senior: "50个"
        },
        {
          title: "增值服务",
          ordinary: "-",
          standard: "-",
          senior: "人气宝消费9折"
        }
      ]
    };
  },
  components: {
    buyVip,
    loginDialog
  },
  created() {
    document.documentElement.scrollTop = 0;
    this.checkLogin();
    this.getLevel2Info();
    this.getCurrentLevelInfo();
  },
  methods: {
    async checkLogin() {
      const { data: res } = await checkLogin();
      if (res.code == 200) {
        this.isLogin = true;
        this.userInfo = res.data;
      }
    },
    async getLevel2Info() {
      const { data: res } = await getUserLevel2();
      if (res.code == 200) {
        this.level2Info = res.data;
      }
    },
    async getCurrentLevelInfo() {
      const { data: res } = await getJdbUserVip();
      if (res.code == 200) {
        this.currentLevelInfo = res.data;
      }
    },
    buyVip(type) {
      if (this.isLogin) {
        this.clickType = type;
        this.showBuyVip = true;
      } else {
        this.showLogin = true;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  min-height: calc(100vh - 90px);
  display: flex;
  justify-content: center;
  background-color: #fff;
}
.userInfo-box {
  width: 1200px;
  height: 190px;
  background: url("../../../assets/images/member/privilege/top-bg.png")
    no-repeat;
  background-color: #fff;
  box-shadow: 0px 3px 11px 0px rgba(232, 233, 246, 0.65);
  display: flex;
  justify-content: center;
  align-items: center;
  .userInfo {
    .not-login {
      text-align: center;
      color: #333;
      /deep/ .el-button {
        width: 120px;
        height: 30px;
        padding: 0;
        margin-top: 20px;
      }
    }
    .is-login {
      text-align: center;
      img {
        width: 70px;
        height: 70px;
        border-radius: 50%;
      }
      .account {
        font-size: 16px;
        color: #333;
        font-weight: bold;
        padding-top: 10px;
      }
      .level1-box {
        .tips {
          color: #333;
          font-size: 14px;
          padding-top: 5px;
        }
        /deep/ .el-button {
          width: 120px;
          height: 30px;
          padding: 0;
          margin-top: 5px;
        }
      }
      .level2-box {
        color: #333;
        font-size: 14px;
        .standard-box {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px 0;
          img {
            width: 15px;
            height: 10px;
          }
          .standard {
            padding: 0 10px 0 5px;
          }
        }
        .advanced-box {
          display: flex;
          align-items: center;
          justify-content: center;
          img {
            width: 18px;
            height: 13px;
          }
          .advanced {
            padding: 0 10px 0 5px;
          }
        }
      }
    }
  }
}
.list-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 34px 0 45px 0;
  .list {
    width: 880px;
    height: 915px;
    background: url("../../../assets/images/member/privilege/list-bg.png")
      no-repeat;
    background-size: 100% 100%;
    display: flex;
    .column {
      width: 25%;
      height: 100%;
      text-align: center;
      .content {
        color: #333;
        font-size: 14px;
        line-height: 40px;
      }
      .member {
        color: #333;
        font-size: 18px;
        font-weight: bold;
        padding: 29px 0 10px 0;
      }
      /deep/ .el-button {
        width: 130px;
        height: 34px;
        padding: 0;
        margin-bottom: 17px;
        font-size: 16px;
      }
    }
    .column1 {
      text-align: center;
      .function-rank {
        color: #333;
        font-size: 20px;
        padding: 67px 0 20px 0;
      }
    }
    .column2 {
      /deep/ .el-button {
        color: #838ab2ff;
        background-color: #cfd6f5;
        border-color: #cfd6f5;
        cursor: auto;
      }
    }
    .column3 {
      /deep/ .el-button:hover {
        background-color: var(--JBlue);
        border-color: var(--JBlue);
      }
      /deep/ .el-button--primary.is-disabled:hover {
        color: #fff !important;
        background-color: #8f90c4 !important;
        border-color: #8f90c4 !important;
      }
    }
    .heightLight {
      background-color: #e5e9ff;
    }
  }
  .remarks-box {
    width: 880px;
    padding-top: 20px;
    p {
      line-height: 20px;
      color: #333;
      font-size: 14px;
    }
  }
}
</style>