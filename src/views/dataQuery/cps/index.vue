<!--cps查询-->
<template>
  <div class="cps-container">
    <div class="query-options">
      <el-form
        class="form"
        ref="form"
        :rules="formRules"
        :model="form"
        label-width="90px"
        @submit.native.prevent
      >
        <el-form-item label="SKU：" prop="sku">
          <el-input
            v-model="form.sku"
            size="small"
            placeholder="请输入要查询的SKU链接或者SKU"
            @focus="clearValidate('sku')"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="progress" v-if="progressToggle">
        <el-progress :progress="progressNumber" class="ranking-progress"></el-progress>
      </div>
      <div class="btn-group">
        <el-button
          class="--btn-primary"
          onfocus="this.blur()"
          type="primary"
          v-if="!progressToggle"
          @click="checkLogin()"
        >查询</el-button>
        <el-button class="--btn-none" type v-if="progressToggle" @click="cancelProgress">取消</el-button>
        <el-button class="--btn-none" type v-if="!progressToggle" @click="reset">重置</el-button>
      </div>
    </div>
    <div class="query-results" v-if="resultsVisible">
      <el-radio-group v-model="resultsType" size="small">
        <el-radio-button label="sku">sku</el-radio-button>
        <el-radio-button label="spu">spu</el-radio-button>
      </el-radio-group>
      <el-table :data="commissionData" class="commission-table" key="0">
        <el-table-column label="sku" prop="skuId" width="105px">
          <template slot-scope="scope">
            <a
              target="_blank"
              :href="'https://item.jd.com/'+scope.row.skuId+'.html'"
              class="commission-sku"
            >{{scope.row.skuId}}</a>
          </template>
        </el-table-column>
        <el-table-column label="京东价" prop="unitPrice"></el-table-column>
        <el-table-column label="券面额" prop="bestCouponAmount" width="80px"></el-table-column>
        <el-table-column label="券消费限额" prop="couponLimitAmount"></el-table-column>
        <el-table-column label="券后价" prop="afterCouponPrice"></el-table-column>
        <el-table-column label="佣金比例" prop="commisionRatio" width="70px">
          <template slot-scope="scope">{{scope.row.commisionRatio+'%'}}</template>
        </el-table-column>
        <el-table-column label="佣金金额" prop="commisionAmount" ></el-table-column>
        <el-table-column label="spu近30天引单量" prop="inOrderCount30Days" width="135px"></el-table-column>
        <el-table-column label="spu近30天支出佣金" prop="inOrderComm30Days" width="145px"></el-table-column>
      </el-table>
      <el-table :data="couponData" empty-text="没有优惠券" class="coupon-table"  key="1">
        <el-table-column label="券种类" prop="couponType"></el-table-column>
        <el-table-column label="优惠券链接" prop="couponLink">
          <template slot-scope="scope">
            <a :href="scope.row.couponLink" target="_blank" :title="scope.row.couponLink">{{scope.row.couponLink}}</a>
          </template>
        </el-table-column>
        <el-table-column label="券消费限额" prop="couponLimitAmount" align="center"></el-table-column>
        <el-table-column label="券面额" prop="couponAmount" align="center" width="80px"></el-table-column>
        <el-table-column label="券总数" prop="couponTotal" align="center"></el-table-column>
        <el-table-column label="券剩余量" prop="couponSurplusNum" align="center"></el-table-column>
        <el-table-column label="券领取量" prop="couponReceiveNum" align="center"></el-table-column>
        <el-table-column label="领取时间" prop="startTimeAndEndTime" align="center" >
          <template slot-scope="scope">
            <p>{{scope.row.startTimeAndEndTime.split("~")[0].split(" ")[0]}}</p>
            <p>{{scope.row.startTimeAndEndTime.split("~")[0].split(" ")[1]}}</p>
            <p>~</p>
            <p>{{scope.row.startTimeAndEndTime.split("~")[1].split(" ")[0]}}</p>
            <p>{{scope.row.startTimeAndEndTime.split("~")[1].split(" ")[1]}}</p>
          </template>
        </el-table-column>
        <el-table-column label="生效时间" prop="useTimeAndEndTime" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.useTimeAndEndTime.split("~")[0].split(" ")[0]}}</p>
            <p>{{scope.row.useTimeAndEndTime.split("~")[0].split(" ")[1]}}</p>
            <p>~</p>
            <p>{{scope.row.useTimeAndEndTime.split("~")[1].split(" ")[0]}}</p>
            <p>{{scope.row.useTimeAndEndTime.split("~")[1].split(" ")[1]}}</p>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import elProgress from "../../../components/progress";
import { mapState } from "vuex";
import { skuReg } from "@/utils/common";
import "../../../mixin/progress";
import progress from "../../../mixin/progress";
import { cpsSearchBySkuOrSpu } from "../../../api/ranking";
export default {
  mixins: [progress],
  data() {
    let skuValidate = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("SKU不能为空"));
      } else if (!skuReg(this.form.sku)) {
        callback(new Error("SKU链接格式不正确"));
      } else {
        callback();
      }
    };
    return {
      form: {
        sku: "",
      },
      formRules: {
        sku: [{ validator: skuValidate, trigger: ["blur"] }],
      },
      resultsType: "sku",
      results:{},
      commissionData: [],
      couponData: [],
      resultsVisible: false,
    };
  },
  computed: {
    ...mapState(["isLogin"]),
  },
  components: {
    elProgress,
  },
  watch:{
    resultsType(){
      if(this.resultsType==='sku'){
          this.commissionData = this.results.sku.commissionList;
          this.couponData = this.results.sku.couponList;
        }else{
          this.commissionData = this.results.spu.commissionList;
          this.couponData = this.results.spu.couponList;
        }
    },
  },
  methods: {
    checkLogin() {
      //检查是否已登录
      if (this.isLogin) {
        this.$refs["form"].validate(async (valid) => {
          valid ? this.search() : "";
        });
      } else {
        this.$store.commit("LOGIN_MODAL_TOGGLE", {
          toggle: true,
          loginType: 2,
        });
      }
    },
    async search() {
      this.progressStart();
      let params = {
        skuOrSkuUrl: this.form.sku,
        type:"2" //统计维度 1：sku 2:spu(现在固定为spu)
      };
      let { data: res } = await cpsSearchBySkuOrSpu({ params });
      this.cancelProgress();
      this.resultsVisible = true;
      if (res.code === 200) {
        this.results = res.data
        if(this.resultsType==='sku'){
          this.commissionData = res.data.sku.commissionList;
          this.couponData = res.data.sku.couponList;
        }else{
          this.commissionData = res.data.spu.commissionList;
          this.couponData = res.data.spu.couponList;
        }
      } else {
        this.$message.error(res.msg);
      }
    },
    clearValidate(propValue) {
      this.$refs.form.clearValidate(propValue);
    },
    reset(){
      this.form = {
        sku: "",
      }
    }
  },
};
</script>
<style lang="scss" scoped>
.cps-container {
  .query-options {
    border-radius: 10px;
    padding: 30px 16px 20px;
    background-color: #fff;
    box-shadow: 0px 3px 24px 0px rgba(168, 168, 236, 0.22);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .form {
      width: 530.8px;
      /deep/ .el-input {
        width: 440px;
      }
      /deep/ .el-input__inner {
        height: 30px;
      }
      /deep/ .el-form-item__label {
        color: #333;
        height: 30px;
        line-height: 30px;
      }
      /deep/ .el-form-item__content {
        height: 30px;
        line-height: 30px;
      }
      /deep/ .el-form-item {
        margin-bottom: 18px;
      }
    }
    .btn-group {
      display: flex;
      margin-top: 10px;
      /deep/ .el-button {
        width: 120px;
        height: 30px;
        padding: 0;
      }
    }
    .progress {
      margin-bottom: 10px;
    }
  }
  .query-results {
    margin-top: 10px;
    padding: 15px;
    background-color: #fff;
    box-shadow: 0px 3px 24px 0px rgba(168, 168, 236, 0.22);
    border-radius: 10px;
    /deep/ .el-radio-button + .el-radio-button {
      margin-left: 10px;
    }
    /deep/ .el-radio-button__inner {
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      width: 80px;
      height: 30px;
      box-shadow: none;
    }
    /deep/ .el-table {
      border: 1px solid #ebeef5;
      border-bottom: 0;
      margin-top: 20px;
    }
    .commission-table {
      /deep/ .cell {
        font-size: 12px;
        padding:0 5px;
        text-align: center;
      }
      /deep/ th .cell{
        font-size:14px;
      }
      .commission-sku {
        color: #333;
        &:hover {
          color: #4d75ff;
        }
        &:active {
          color: #333;
        }
      }
    }
    .coupon-table {
      /deep/ .cell {
        padding: 0 5px;
      }
      /deep/ .el-table__row td:nth-child(2) .cell {
        a {
          height: 50px;
          display: -webkit-box;
          /* ! autoprefixer: off */
          -webkit-box-orient: vertical;
          /* autoprefixer: on */
          -webkit-line-clamp: 2;
          overflow: hidden;
          color: #333;
          &:hover {
            color: #4d75ff;
          }
          &:active {
            color: #333;
          }
        }
      }
    }
  }
}
</style>
