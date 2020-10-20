<!--京东国际-查排名-->
<template>
  <div class="container">
    <!-- 即时查询 -->
    <div class="modul instant-query">
      <div class="query-options">
        <el-form class="form" ref="form" :rules="formRules" :model="form" label-width="90px">
          <el-form-item label="查看端口：">
            <el-radio-group v-model="form.queryPort" size="small">
              <el-radio-button
                label="1"
                v-baidu-count="{
                  event: '点击',
                  value: '京东国际-PC端',
                  label: '京东国际-PC端'}"
              >PC端</el-radio-button>
              <el-radio-button
                label="2"
                v-baidu-count="{
                  event: '点击',
                  value: '京东国际-APP端',
                  label: '京东国际-APP端'}"
              >APP端</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="查询模式：">
            <el-radio-group v-model="form.queryModel" size="small">
              <el-radio-button label="1">指定商品</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <!--关键词 -->
          <el-form-item label="关键词：" prop="keyword">
            <el-input
              v-model="form.keyword"
              size="small"
              placeholder="请输入关键词"
              @focus="clearValidate('keyword')"
            ></el-input>
          </el-form-item>
          <!-- SKU -->
          <el-form-item label="SKU：" prop="sku">
            <el-input
              v-model="form.sku"
              size="small"
              placeholder="请输入sku链接或者sku"
              @focus="clearValidate('sku')"
            ></el-input>
          </el-form-item>
          <el-form-item label="排序方式：">
            <el-radio-group v-model="form.sortMode" size="small">
              <el-radio-button label="1">综合</el-radio-button>
              <el-radio-button label="5">价格</el-radio-button>
              <el-radio-button label="2">销量</el-radio-button>
              <el-radio-button label="3">评价</el-radio-button>
              <el-radio-button label="4">新品</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="查询范围：" v-if="form.queryPort=='1'">
            <div class="slider">
              <div class="slider-box">
                <el-slider v-model="form.pageEnd" :max="100" :min="1" tooltip-class="tooltip"></el-slider>
              </div>
              <div class="slider-tips">
                {{form.pageEnd}}页/前{{form.pageEnd*48}}名
                <el-tooltip popper-class="tooltip" content="查询范围越小，查询速度越快" placement="right">
                  <i
                    class="iconfont icon-wenhao"
                    style="color:#909399;margin-left:5px;line-height:40px"
                  ></i>
                </el-tooltip>
              </div>
            </div>
          </el-form-item>
        </el-form>
        <div class="progress" v-if="progressToggle">
          <el-progress :progress="progressNumber"></el-progress>
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
      <div class="query-results" v-if="showResults">
        <div class="title">京东在更新排名时会造成排名有误差，如排名不稳定，请在2小时后再查询。</div>
        <el-table :data="tableData" style="width: 100%;">
          <el-table-column label="序号" align="center">
            <template slot-scope="scope">
              {{ ++scope.$index }}
              <div class="num-box">
                <div class="is-relation-sku" v-if="scope.row.association === 1">关联SKU</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="商品标题" width="170" align="center">
            <template slot-scope="scope">
              <div class="goods-url-box">
                <img v-if="scope.row.img" :src="scope.row.img" alt class="table-item-img" />
                <a
                  :href="scope.row.url"
                  target="_blank"
                  v-baidu-count="{
                  event: '点击',
                  value: '京东国际-商品',
                  label: '京东国际-商品'
                }"
                >{{scope.row.skuName}}</a>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="searchWord"
            :label="
            tableData[0] && tableData[0].searchWord ? '关键词' : '三级类目'
          "
            align="center"
          >
            <template slot-scope="scope">
              <div>
                {{
                scope.row.searchWord ? scope.row.searchWord : scope.row.thirdCat
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="skuId" label="sku" align="center"></el-table-column>
          <el-table-column prop="ranking" align="center">
            <template slot="header">
              <span>位置和排名</span>
              <el-tooltip
                popper-class="tooltip"
                content="排名为无痕查询后的结果，排名结果为过滤掉广告和活动页后的排名"
                placement="top"
              >
                <i class="iconfont icon-wenhao"></i>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              <div
                v-if="scope.row.locationPage===0&&scope.row.locationRow===0&&scope.row.rank===0"
              >不在查询范围内</div>
              <div v-else>
                <div>第{{ scope.row.locationPage }}页-{{ scope.row.locationRow }}位</div>
                <div>{{ scope.row.rank }}名</div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import Config from "../../../config";
import elProgress from "../../../components/progress";
import { skuReg } from "@/utils/common";
import { hkRankPcProduct, hkRankH5Product } from "../../../api/ranking";
import { mapState } from "vuex";

let timer = null;
export default {
  name: "ranking",
  data() {
    let keywordValidate = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("关键词不能为空"));
      }
      callback();
    };
    let skuValidate = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("sku不能为空"));
      } else if (!skuReg(value)) {
        callback(new Error("sku链接格式不正确"));
      } else {
        callback();
      }
    };
    return {
      Config,
      showResults: false,
      form: {
        queryPort: "1",
        queryModel: "1",
        keyword: "",
        sku: "",
        sortMode: "1",
        pageEnd: 50
      },
      formRules: {
        keyword: [{ validator: keywordValidate, trigger: ["blur"] }],
        sku: [{ validator: skuValidate, trigger: ["blur"] }]
      },
      tableData: [],
      progressNumber: 0,
      progressToggle: false,
      request: null //查询的请求接口
    };
  },
  components: {
    elProgress
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
    async search() {
      //查询
      this.$refs["form"].validate(async valid => {
        if (valid) {
          this.progressStart();
          let params1 = {
            keyword: this.form.keyword,
            sku: skuReg(this.form.sku),
            sortType: this.form.sortMode,
            pageEnd: this.form.pageEnd
          };
          let params2 = {
            keyword: this.form.keyword,
            sku: skuReg(this.form.sku),
            sortType: this.form.sortMode
          };
          const { data: res } =
            this.form.queryPort === "1"
              ? await hkRankPcProduct({ params: params1 })
              : await hkRankH5Product({ params: params2 });
          this.progressEnd();
          if (res.code == 200) {
            this.showResults = true;
            this.tableData = res.data;
          } else {
            this.tableData = [];
            this.$message.error(res.msg);
          }
        }
      });
    },
    clearValidate(propValue) {//清除校验
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
      //查询结束
      clearInterval(timer);
      this.progressToggle = false;
      this.progressNumber = 0;
    },
    reset() {
      //重置
      this.form.keyword = "";
      this.form.sku = "";
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  .modul {
    background-color: #fff;
  }
  .instant-query {
    padding: 30px 10px 20px;
    box-shadow:0px 3px 24px 0px rgba(168,168,236,0.22);
    border-radius: 10px;
    .query-options {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      .form {
        width: 530.8px;
      }
      /deep/ .el-form-item {
        margin-bottom: 18px;
      }
      /deep/ .el-form-item__label {
        color: #333;
        height:30px;
        line-height: 30px;
      }
      /deep/ .el-form-item__content {
        height:30px;
        line-height: 30px;
      }
      .el-radio-button+.el-radio-button {
        margin-left: 10px;
      }
      /deep/ .el-radio-button__inner {
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        width: 80px;
        height:30px;
        box-shadow: none;
      }
      /deep/ .el-input {
        width: 440px !important;
      }
      /deep/ .el-input__inner {
        height: 30px;
      }
      .el-button {
        width: 120px;
        padding: 0;
        line-height: 30px;
      }
      .slider {
        display: flex;
        .slider-box {
          width: 263px;
        }
        .slider-tips {
          display: flex;
          align-items: center;
          font-size: 12px;
          color: #999;
          margin-left: 20px;
        }
      }
      .btn-group {
        display: flex;
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
      margin-top: 25px;
      .el-table {
        border: 1px solid #ebeef5;
        border-bottom: 0;
        .num-box {
          display: flex;
          justify-content: center;
          .is-relation-sku {
            color: #999;
            font-size: 14px;
            width: 65px;
            height: 20px;
            background: rgba(229, 241, 255, 1);
            border-radius: 2px;
            line-height: 20px;
          }
        }
      }
      .title {
        font-size: 14px;
        color: #666;
        padding-bottom: 10px;
      }

      .recommend-btn-box {
        display: flex;
        justify-content: center;
      }
      .recommend-btn {
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
        border-color: #f30213;
        width: 65px;
      }
      .goods-url-box {
        display: flex;
        align-items: center;
        text-align: center;
        a {
          color: #333;
          display: -webkit-box;
          /* ! autoprefixer: off */
          -webkit-box-orient: vertical;
          /* autoprefixer: on */
          -webkit-line-clamp: 2;
          overflow: hidden;
          flex: 1;
        }
        .table-item-img {
          width: 40px;
          height: 40px;
          margin-right: 5px;
        }
      }
      .opreate-box {
        display: flex;
        flex-direction: column;
        text-align: left;
        font-size: 14px;
        color: var(--themeColor);
        span {
          cursor: pointer;
        }
      }
    }
  }
}
</style>

<style >
.el-slider__button-wrapper::after {
  background-color: #f00 !important;
}
</style>