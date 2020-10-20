<!--查权重-->
<template>
  <div class="container">
    <!-- 即时查询 -->
    <div class="modul instant-query">
      <div class="check-body">
        <el-form class="form" ref="form" :rules="formRules" :model="form" label-width="90px">
          <el-form-item label="关键词：" prop="keyword">
            <el-input
              v-model="form.keyword"
              size="small"
              placeholder="请输入关键词"
              @focus="clearValidate('keyword')"
            ></el-input>
          </el-form-item>
          <el-form-item label="SKU：" prop="sku">
            <el-input
              v-model="form.sku"
              size="small"
              placeholder="请输入SKU链接或者SKU"
              @focus="clearValidate('sku')"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="progress" v-if="progressToggle">
          <el-progress :progress="progressNumber" class="ranking-progress"></el-progress>
        </div>
        <div class="btn-group">
          <el-button
            class="btn-primary"
            onfocus="this.blur()"
            type="primary"
            v-if="!progressToggle"
            @click="checkLogin"
          >查询</el-button>
          <el-button class="btn-none" type v-if="progressToggle" @click="progressEnd">取消</el-button>
          <el-button class="btn-none" type v-if="!progressToggle" @click="reset">重置</el-button>
        </div>
      </div>
      <div class="query-results" id="query-results" v-if="showResults">
        <el-table
          :data="tableData.slice((currentPage - 1) * 10,currentPage * 10)"
          style="width: 100%"
        >
          <el-table-column label="序号" width="60px">
            <template slot-scope="scope">
              {{scope.row.index}}
              <!-- <div class="is-relation-sku" v-if="scope.row.isMainSku === 0">关联SKU</div> -->
            </template>
          </el-table-column>
          <el-table-column prop="date" label="商品链接" width="183px" align="center">
            <template slot-scope="scope">
              <div class="goods-url">
                <div class="price-img-box">
                  <img class="shop-img" v-if="scope.row.imgUrl" :src="scope.row.imgUrl" alt />
                  <p class="price">￥{{scope.row.price}}</p>
                </div>
                <a
                  :href="scope.row.goodsUrl"
                  target="_blank"
                  class="--text-mouse-hover"
                >{{scope.row.goodsName}}</a>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="sellerType" width="100px" align="center">
            <template slot="header">
              <span>店铺类型</span>
              <el-tooltip
                popper-class="tooltip"
                content="该商品所属店铺类型，POP为第三方卖家店铺，自营为京东自定店铺或京东超市"
                placement="top"
              >
                <i class="iconfont icon-wenhao"></i>
              </el-tooltip>
            </template>
            <template slot-scope="scope">{{scope.row.sellerType}}</template>
          </el-table-column>
          <!-- <el-table-column prop="keyword" label="关键词"></el-table-column> -->
          <el-table-column prop="rank" label="位置" align="center"></el-table-column>
          <el-table-column prop="date" align="center">
            <template slot="header">
              <span>排名</span>
              <el-tooltip popper-class="tooltip" content="排名结果为过滤广告及活动页结果" placement="top">
                <i class="iconfont icon-wenhao"></i>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              <p>总排名第{{scope.row.totalRank}}名</p>
            </template>
          </el-table-column>
          <el-table-column prop="date" align="center">
            <template slot="header">
              <span>权重分</span>
              <el-tooltip
                popper-class="tooltip"
                content="京东平台对于商品销量、评价等综合情况给出的估值分数，根据千人千面原则，部分地区查询结果会略有差异"
                placement="top"
              >
                <i class="iconfont icon-wenhao"></i>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              <p>{{scope.row.weightiness === -1? '快车广告' : scope.row.weightiness}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="date" width="120px" align="center">
            <template slot="header">
              <span>标题权重分</span>
              <el-tooltip
                popper-class="tooltip"
                content="京东平台对于商品文本相关性给出的分数，对于商品搜索的分值召回有影响"
                placement="top"
              >
                <i class="iconfont icon-wenhao"></i>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              <p>{{scope.row.titleWeightiness === -1? '快车广告' : scope.row.titleWeightiness}}</p>
            </template>
          </el-table-column>
          <el-table-column label="推荐策略" align="center">
            <template>
              <div class="recommend-btn-box">
                <el-tooltip popper-class="tooltip" placement="top" :enterable="false">
                  <div slot="content">通过人气宝的【人气排名提升】功能，可真实有效地提高商品的综合排名</div>
                  <a
                    class="up-btn"
                    target="_blank"
                    :href="Config.rqbUrl + 'newReleaseIndex/jd/popular-rank'"
                    onfocus="this.blur()"
                    v-baidu-count="{event:'外部跳转转化',value:'推荐策略',label:'查权重-提升排名'}"
                  >提升排名</a>
                </el-tooltip>
                <el-tooltip popper-class="tooltip" placement="top" :enterable="false">
                  <div slot="content">
                    通过人气宝的【店铺粉丝】功能，
                    <br />可真实有效地提高商品的权重分数
                  </div>
                  <a
                    class="up-btn add-fans-btn"
                    target="_blank"
                    :href="Config.rqbUrl + 'newReleaseIndex/jd/shop-attention'"
                    onfocus="this.blur()"
                    v-baidu-count="{event:'外部跳转转化',value:'推荐策略',label:'查权重-增加粉丝'}"
                  >增加粉丝</a>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            v-if="tableData.length>10"
            prev-text="上一页"
            next-text="下一页"
            background
            layout="prev, pager, next"
            :current-page="currentPage"
            @current-change="changePage"
            :total="tableData.length"
          ></el-pagination>
        </div>
        <!-- <div class="null-img" v-if="tableData.length==0">
          <img src="../../../assets/images/null.png" alt />
        </div>-->
      </div>
    </div>
    <!-- 弹框 -->
    <up-grade :errorMsg="errorMsg" v-if="isShowUpGrade" @closeDialog="isShowUpGrade = false"></up-grade>
  </div>
</template>
<script>
import Config from "../../../config";
import elProgress from "../../../components/progress";
import { skuReg } from "@/utils/common";
import { searchWeights } from "../../../api/dmp";
import upGrade from "../../dialog/upGrade";
import { mapState } from "vuex";
let timer = null;
export default {
  name: "salesVolume",
  data() {
    let keywordValidate = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("关键词不能为空"));
      }
      callback();
    };
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
      Config,
      showResults: false,
      form: {
        keyword: "",
        // keywordsList: [],
        sku: ""
      },
      formRules: {
        keyword: [{ validator: keywordValidate, trigger: ["blur"] }],
        sku: [{ validator: skuValidate, trigger: ["blur"] }]
      },
      tableData: [],
      currentPage: 1,
      progressNumber: 0,
      progressToggle: false,
      errorMsg: "",
      isShowUpGrade: false
    };
  },
  components: {
    elProgress,
    upGrade
  },
  computed: { ...mapState(["isLogin"]) },
  methods: {
    checkLogin() {
      //检查是否已登录
      if (!this.isLogin) {
        this.$store.commit("LOGIN_MODAL_TOGGLE", {
          toggle: true,
          loginType: 2
        });
        return;
      } else {
        this.search();
      }
    },
    search() {
      this.isShowUpGrade = false;
      this.$refs["form"].validate(async valid => {
        if (valid) {
          this.currentPage = 1;
          this.progressStart();
          let params = {
            skuId: skuReg(this.form.sku),
            keyword: this.form.keyword
          };
          let res = await searchWeights(params);
          this.progressEnd();
          switch (res.data.code) {
            case 200:
              this.showResults = true;
              this.tableData = res.data.data;
              this.tableToggle = true;
              break;
            case 8028:
              this.isShowUpGrade = true;
              this.errorMsg = res.data.msg;
              break;
            default:
              this.$message.error(res.data.msg);
          }
        }
      });
    },
    changePage(currentPage) {
      //切换页码
      this.currentPage = currentPage;
      document.querySelector("#query-results").scrollIntoView(true);
    },
    clearValidate(propValue) {
      this.$refs.form.clearValidate(propValue);
    },
    progressStart() {
      //进度条开始跑
      this.progressToggle = true;
      this.progressNumber = 0;
      timer = setInterval(() => {
        this.progressNumber++;
        if (this.progressNumber >= 98) {
          this.progressNumber = 98;
        }
      }, 200);
    },
    progressEnd() {
      //结束进度条
      clearInterval(timer);
      this.progressToggle = false;
      timer = setInterval(() => {
        this.progressNumber++;
        if (this.progressNumber >= 100) {
          clearInterval(timer);
          this.progressNumber = 100;
          let closeProgressTimer = setTimeout(() => {
            clearTimeout(closeProgressTimer);
            this.progressNumber = 0;
          }, 1500);
        }
      }, 0);
    },
    reset() {
      //重置
      this.form = {
        keyword: "",
        // keywordsList: [],
        sku: ""
      };
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  // height: 100%;
}
.modul {
  background-color: #fff;
  border-radius: 10px;
    box-shadow:0px 3px 24px 0px rgba(168,168,236,0.22);
}
//即时查询
.instant-query {
  padding: 30px 10px 20px;
  .check-body {
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
        height:30px;
        line-height: 30px;
      }
      /deep/ .el-form-item__content{
        height:30px;
        line-height: 30px;
      }
      /deep/ .el-form-item {
        margin-bottom: 18px;
      }
    }
    .btn-group {
      margin-top:10px;
      display: flex;
      /deep/ .el-button {
        width: 120px;
        padding: 0;
        line-height: 30px;
      }
      .btn-primary:hover {
        background-color: #3159e4;
      }
      .btn-none {
        color: #4d75ff;
        border: 1px solid #4d75ff;
        background-color: #fff;
      }
      .btn-none:hover {
        color: #fff;
        background-color: #4d75ff;
      }
    }
    .progress {
      margin-bottom: 10px;
    }
  }
  .query-results {
    padding-top: 50px;
    /deep/ .el-table {
      border: 1px solid #ebeef5;
      border-bottom: 0;
      .is-relation-sku {
        width: 65px;
        color: #999;
        font-size: 12px;
        width: 56px;
        height: 20px;
        background: rgba(229, 241, 255, 1);
        border-radius: 2px;
        line-height: 20px;
      }
      .goods-url {
        display: flex;
        align-items: center;
        .price-img-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          .price {
            color: #999;
            font-size: 12px;
          }
        }
        a {
          display: -webkit-box;
          /* ! autoprefixer: off */
          -webkit-box-orient: vertical;
          /* autoprefixer: on */
          -webkit-line-clamp: 2;
          overflow: hidden;
          margin-left: 5px;
          flex: 1;
          color: #333;
          text-align: start;
        }
        .shop-img {
          width: 50px;
          height: 50px;
        }
      }
      .recommend-btn-box{
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .add-fans-btn {
        margin-top: 5px;
      }
      .up-btn {
        width: 65px;
        height: 23px;
        line-height: 23px;
        text-align: center;
        font-size: 14px;
        background-color: #f30213;
        border-radius: 2px;
        color: #fff;
        display: block;
        user-select: none;
        cursor: pointer;
        outline: none;
      }
    }
    .pagination {
      text-align: center;
      margin-top: 10px;
    }
    .null-img {
      height: 200px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>