<!--个人资料-->
<template>
  <div class="container">
    <div class="module">
      <ul class="ul-box">
        <li class>
          <div class="left">
            <div class="title">登录账号</div>
            <div class="content">{{userName}}</div>
          </div>
          <div class="right">
            <div @click="resetPwd">修改密码</div>
          </div>
        </li>
        <li class>
          <div class="left">
            <div class="title">绑定手机</div>
            <div class="content">{{bindingPhone}}</div>
          </div>
        </li>
        <li>
          <div class="left">
            <div class="title">头像</div>
            <div class="content">
              <img class="avatar-img" :src="headImg?headImg:defaultAvatar" alt />
            </div>
          </div>
          <div class="right">
            <el-upload
              action="null"
              accept=".jpg, .jpeg, .png, .gif, .bmp"
              :auto-upload="false"
              :show-file-list="false"
              :file-list="fileList"
              :on-change="handleChange"
            >
              <el-button class="uploadAvatar-btn" type="text">上传头像</el-button>
            </el-upload>
          </div>
        </li>
        <li class>
          <div class="left">
            <div class="title">店铺</div>
            <!-- 店铺已添加 -->
            <div class="content" v-if="shopName">
              {{shopName}}
              <span>{{shopGoodsCode?'（未验证，通过验证可获得会员奖励）':'（已验证）'}}</span>
            </div>
            <!-- 店铺未添加 -->
            <div class="content" v-else>添加店铺，通过验证可获得会员奖励</div>
          </div>
          <div class="right" v-if="shopName">
            <div class="btn" @click="showShopEdit = true">编辑</div>
            <div class="btn" v-if="shopGoodsCode" @click="showShopVerify= true">验证</div>
          </div>
          <div class="right" v-else>
            <div class="btn" @click="showShopEdit = true">绑定店铺</div>
          </div>
        </li>
        <li class>
          <div class="left">
            <div class="title">会员等级</div>
            <div
              class="content"
            >{{ memberInfo.vipLevel }} ({{ memberInfo.endDate }}{{memberInfo.vipLevelCode==1?'':'到期'}})</div>
          </div>
          <div class="right">
            <div
              class="btn"
              @click="buyVip(memberInfo.vipLevelCode==2?2:3)"
              v-if="memberInfo.vipLevelCode!=1"
            >续费</div>
            <div
              class="btn"
              @click="buyVip(memberInfo.vipLevelCode==1?2:3)"
              v-if="memberInfo.vipLevelCode!=3"
            >升级</div>
          </div>
        </li>
        <li class>
          <div class="left">
            <div class="title">注册推荐码</div>
            <div class="content">{{ memberInfo.myInviteCode }}</div>
          </div>
          <div class="right">
            <div class="btn" @click="showShare = true">分享</div>
          </div>
        </li>
        <li class>
          <div class="left">
            <div class="title">账户余额</div>
            <div class="content">￥{{accountBalance}}</div>
          </div>
          <div class="right">
            <div class="btn" @click="$router.push('/personal/accountBalance')">充值</div>
          </div>
        </li>
      </ul>
    </div>
    <!-- 验证 -->
    <shop-verify
      v-if="showShopVerify"
      :shopGoodsCode="shopGoodsCode"
      @verifySuccess="verifySuccess"
      @closeDialog="showShopVerify = false"
    ></shop-verify>
    <!-- 编辑 -->
    <shop-edit v-if="showShopEdit" @editSuccess="editSuccess" @closeDialog="showShopEdit = false"></shop-edit>
    <!-- 购买会员 -->
    <!-- @paySuccess="paySuccess" -->
    <buy-vip
      v-if="showBuyVip"
      :clickType="clickType"
      :vipLevel="memberInfo.vipLevelCode"
      @closeDialog="showBuyVip = false"
    ></buy-vip>
    <!-- 分享 -->
    <share-code v-if="showShare" :code="memberInfo.myInviteCode" @closeDialog="showShare = false"></share-code>
  </div>
</template>
<script>
import {
  checkLogin,
  getJdbUserVip,
  getSkuCheckCode,
  uploadHeadImg
} from "../../../api/user";
import { mapState, mapMutations } from "vuex";
import { balance, getDepositBalance } from "../../../api/balance";
import shopVerify from "../../dialog/shopVerify";
import shopEdit from "../../dialog/shopEdit";
import buyVip from "../../dialog/buyVip";
import shareCode from "../../dialog/shareCode";
import defaultAvatar from "../../../assets/images/defaultAvatar.png";
export default {
  data() {
    return {
      memberInfo: {},
      accountBalance: 0,
      headImg: "",
      accountBalanceInfo: {},
      shopGoodsCode: "",
      showShopVerify: false,
      showShopEdit: false,
      showBuyVip: false,
      clickType: 1,
      showShare: false,
      fileList: [],
      defaultAvatar: defaultAvatar,
      bindingPhone:''
    };
  },
  computed: {
    ...mapState([
      //   "resetPasswordModalToggle",
      //   "bindShopModalToggle",
      "userName",
      "shopName",
      "memberInfo"
    ])
  },
  components: {
    shopVerify,
    shopEdit,
    buyVip,
    shareCode
  },
  created() {
    this.checkUserLogin();
    this.getJdbUserVip();
    this.checkUserBalance();
    this.getSkuCheckCode();
  },
  methods: {
    ...mapMutations(["BIND_SHOP_NAME"]),
    async checkUserLogin() {
      let { data: res } = await checkLogin();
      if (res.code === 200) {
        this.isLogin = true;
        this.jbBalance = res.data.jb;
        this.headImg = res.data.headImage;
        this.bindingPhone = res.data.phone
        this.BIND_SHOP_NAME(res.data.shopName);
      }
    },
    async getJdbUserVip() {
      const { data: res } = await getJdbUserVip();
      if (res.code === 200) {
        this.$store.commit("CHANGE_MEMBER_INFO", res.data);
        this.memberInfo = res.data;
      }
    },
    // 账户余额
    async checkUserBalance() {
      let { data: res } = await balance();
      if (res.code === 200) {
        this.accountBalance = res.data.balance;
        this.accountBalanceInfo = res.data;
      }
    },
    // 修改密码
    resetPwd() {
      let url = location.href;
      url = url.split("#")[0] + "#";
      window.open(url + "/resetPwd");
    },
    async getSkuCheckCode() {
      const { data: res } = await getSkuCheckCode();
      if (res.code === 200) {
        this.shopGoodsCode = res.data;
      }
    },
    handleChange(file) {
      let size = file.size / 1024 / 1024;
      if (size > 2) {
        return this.$message.error("文件大小不能大于2MB");
      }
      let params = new FormData();
      params.append("file", file ? file.raw : "");
      uploadHeadImg(params).then(res => {
        if (res.data.code == 200) {
          this.$message.success("上传成功");
          this.checkUserLogin();
        }
      });
    },
    // 验证成功
    verifySuccess() {
      location.reload();
    },
    // 编辑成功
    editSuccess() {
      location.reload();
    },
    // 续费或者升级type ：1续费 ，2升级
    buyVip(type) {
      this.clickType = type;
      this.showBuyVip = true;
    }
    // 支付成功
    // paySuccess() {
    //   location.reload();
    // }
  }
};
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
}
.module {
  min-height: 100%;
  background-color: #fff;
  box-shadow: 0px 3px 24px 0px rgba(168, 168, 236, 0.22);
  border-radius: 10px;
  padding: 30px 18px 20px;
  .ul-box {
    li {
      height: 70px;
      line-height: 70px;
      display: flex;
      justify-content: space-between;
      padding: 0 30px 0 24px;
      border-bottom: 1px solid #f4f4f4;
      .left {
        display: flex;
        font-size: 14px;
        .title {
          width: 96px;
          color: #666;
          margin-right: 20px;
        }
        .content {
          color: #000;
          font-weight: bold;
          display: flex;
          align-items: center;
          .avatar-img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
          }
        }
      }
      .right {
        font-size: 14px;
        color: var(--DBlue);
        display: flex;
        div {
          cursor: pointer;
        }
        .btn + .btn {
          margin-left: 10px;
        }
        .uploadAvatar-btn {
          color: var(--DBlue);
        }
      }
    }
  }
}
</style>