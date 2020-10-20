<template>
  <div class="container">
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="isShowDialog"
      :center="true"
      @close="closeDialog"
      :width="showVerifyTips?'700px':'300px'"
      class="dialog"
    >
      <div v-if="showVerifyTips">
        <div class="dialog-title">验证店铺有效性（只支持京东店铺验证）</div>
        <ul class="ul-box">
          <li>
            <div class="title">商品标题码：</div>
            <div>{{goodsTitleCode}}</div>
          </li>
          <li class="goodsUrl-li">
            <div class="title goodsUrl">商品链接：</div>
            <el-input v-model="goodsUrl" placeholder="请输入商品链接"></el-input>
          </li>
          <li class="reward-li">
            <div class="title">奖励：</div>
            <div>通过店铺有效性验证，普通会员用户可获得2个月标准会员奖励；标准会员用户可获得2个月标准会员奖励，高级会员可获得2个月的高级会员奖励。</div>
          </li>
          <li>
            <div class="title">操作步骤：</div>
          </li>
          <li>1、将商品标题码加在该店铺名下的某一个商品标题名称前。</li>
          <li>
            <img class="first-img" src="../../assets/images/shopVerify.png" alt />
          </li>
          <li>2、复制所修改商品的链接，并粘贴到商品链接的输入框中。</li>
          <li>3、等待3~5分钟。由于改掉标题后，京东可能会产生延迟，为避免审核失败。</li>
          <li>4、点击审核，5秒内有审核结果。审核通过后，你可以将标题变更回来。</li>
          <li>5、通过审核后，奖励将会即刻生效。</li>
        </ul>
        <div class="btn-group">
          <el-button type="primary" class="--btn-primary" @click="submitAudit">提交审核</el-button>
        </div>
      </div>
      <div v-if="auditIing">
        <div class="auditing">正在审核中，5秒内有审核结果</div>
      </div>
      <div class="verfirySuccess-box" v-if="showSuccess">
        <div class="title">验证成功</div>
        <div class="btn-group">
          <el-button type="primary" class="--btn-primary" @click="closeDialog">我知道了</el-button>
        </div>
      </div>
      <div class="verifyFail-box" v-if="errMsg">
        <div class="title">验证失败</div>
        <div class="content">{{errMsg}}</div>
        <div class="btn-group">
          <el-button type="primary" class="--btn-primary" @click="closeDialog">我知道了</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { checkShopAndSku } from "../../api/user";
export default {
  data() {
    return {
      isShowDialog: true,
      goodsUrl: "",
      goodsTitleCode: "",
      showVerifyTips: true,
      auditIing: false,
      showSuccess: false,
      errMsg: ""
    };
  },
  props: {
    shopGoodsCode: {
      type: String
    }
  },
  created() {
    this.goodsTitleCode = this.shopGoodsCode;
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
    async submitAudit() {
      if (!this.goodsUrl) {
        this.$message.error("请输入商品链接");
        return;
      }
      this.showVerifyTips = false;
      this.auditIing = true;
      const params = { skuUrl: this.goodsUrl };
      const { data: res } = await checkShopAndSku({ params });
      this.auditIing = false;
      if (res.code === 200) {
        this.showSuccess = true;
        this.$emit("verifySuccess");
      } else {
        this.errMsg = res.msg;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.dialog {
  .dialog-title {
    color: #333;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
  }
  .ul-box {
    color: #333;
    font-size: 14px;
    margin-top: 20px;
    height: 500px;
    overflow-y: auto;
    li + li {
      margin-top: 15px;
    }
    li {
      display: flex;
      .title {
        min-width: 50px;
        font-weight: bold;
      }
      .first-img {
        width: 100%;
        height: 350px;
      }
      /deep/ .el-input__inner {
        width: 410px;
      }
    }
    .goodsUrl-li {
      align-items: center;
      .title {
        width: 83px;
      }
    }
    .reward-li {
      line-height: 20px;
    }
  }
  .btn-group {
    margin-top: 20px;
    text-align: center;
    /deep/ .el-button {
      width: 120px;
      height: 30px;
      padding: 0;
    }
  }
  .auditing {
    height: 50px;
    line-height: 50px;
    text-align: center;
  }
  .verfirySuccess-box {
    .title {
      color: green;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 30px;
    }
    .btn-group {
      text-align: center;
      /deep/ .el-button {
        width: 100px;
        height: 30px;
        padding: 0;
      }
    }
  }
  .verifyFail-box {
    .title {
      color: #f56c6c;
      font-size: 16px;
      font-weight: bold;
    }
    .content {
      color: #333;
      margin-top: 10px;
      line-height: 20px;
    }
    .btn-group {
      text-align: center;
      margin-top: 20px;
      /deep/ .el-button {
        width: 100px;
        height: 30px;
        padding: 0;
      }
    }
  }
}
</style>