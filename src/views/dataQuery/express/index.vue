<!--快车排名-->
<template>
  <div class="container">
    <!-- 即时查询 -->
    <div class="modul instant-query">
      <div class="query-options">
        <el-form class="form" ref="form" :rules="formRules" :model="form" label-width="130px">
          <el-form-item label="查看端口：">
            <el-radio-group v-model="form.queryPort" size="small">
              <el-radio-button label="1">PC端</el-radio-button>
              <el-radio-button label="2">手机端</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="关键词：" prop="keyword">
            <el-input
              v-model="form.keyword"
              size="small"
              placeholder="请输入关键词"
              @focus="clearValidate('keyword')"
            ></el-input>
          </el-form-item>
          <el-form-item label="选择地域：" prop="selectedOptions">
            <el-cascader
              clearable
              placeholder="请选择地域"
              :options="addressOptions"
              v-model="form.selectedOptions"
              @change="handleAddressChange"
              @focus="clearValidate('selectedOptions')"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="请选择推广位置：">
            <el-radio-group
              v-model="form.promotionPosition"
              size="small"
              v-if="form.queryPort=='1'"
            >
              <el-radio-button label="1">
                左侧商品精选
                <el-tooltip
                  content="京东PC搜索结果页中，左侧列表，商品精选位置"
                  placement="bottom"
                  popper-class="tooltip"
                >
                  <i class="iconfont icon-wenhao"></i>
                </el-tooltip>
              </el-radio-button>
              <el-radio-button label="2">
                底部商品精选
                <el-tooltip
                  content="京东PC搜索结果页中，底部列表，商品精选位置"
                  placement="bottom"
                  popper-class="tooltip"
                >
                  <i class="iconfont icon-wenhao"></i>
                </el-tooltip>
              </el-radio-button>
              <el-radio-button label="3">
                信息流原生
                <el-tooltip
                  content="京东PC搜索结果页中，穿插在自然结果中且打有“广告”标识的原生广告"
                  placement="bottom"
                  popper-class="tooltip"
                >
                  <i class="iconfont icon-wenhao"></i>
                </el-tooltip>
              </el-radio-button>
              <el-radio-button label="4">
                商家精选
                <el-tooltip
                  content="京东PC搜索结果页中，左侧列表底部，商家精选位置"
                  placement="bottom"
                  popper-class="tooltip"
                >
                  <i class="iconfont icon-wenhao"></i>
                </el-tooltip>
              </el-radio-button>
            </el-radio-group>
            <el-radio-group
              v-model="form.promotionPosition"
              size="small"
              v-if="form.queryPort=='2'"
            >
              <el-radio-button label="1">APP搜索页</el-radio-button>
              <el-radio-button label="2">微信搜索页</el-radio-button>
              <el-radio-button label="3">手Q搜索页</el-radio-button>
              <el-radio-button label="4">京东M端搜索页</el-radio-button>
            </el-radio-group>
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
          <el-button class="btn-none" type v-if="progressToggle" @click="cancelProgress">取消</el-button>
          <el-button class="btn-none" type v-if="!progressToggle" @click="reset">重置</el-button>
        </div>
      </div>
      <div class="query-results" id="query-results" v-if="showResults">
        <ul class="ul-box">
          <li class="ul-li" v-for="(item,index) in list" :key="index">
            <div class="left">{{item.rank}}</div>
            <div class="right">
              <a :href="item.goodsUrl" target="_blank">
                <img class="goods-img" :src="item.img" alt />
              </a>
              <p class="price">特价：{{item.price}}</p>
              <a
                :href="item.goodsUrl"
                target="_blank"
                class="skuName --text-mouse-hover"
              >{{item.skuName}}</a>
              <div class="evaluateNum">
                已有
                <span>{{item.commentsNum}}</span>
                人评价
              </div>
            </div>
          </li>
        </ul>
        <div class="pagination">
          <el-pagination
            v-if="tableData.length>8"
            prev-text="上一页"
            next-text="下一页"
            background
            layout="prev, pager, next"
            :current-page="currentPage"
            :page-size="pageSize"
            @current-change="tablePageChange"
            :total="tableData.length"
          ></el-pagination>
        </div>
        <div class="null-img" v-if="showResults&&list.length==0">
          <img src="../../../assets/images/null.png" alt />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Config from "../../../config";
import elProgress from "../../../components/progress";
import addressOptions from "../../../utils/addressList";
import { searchKuaiche } from "../../../api/ranking";
import { mapState } from "vuex";
// import { checkLogin } from "../../../api/user";
let timer = null;
export default {
  name: "salesVolume",
  data() {
    let keyworyValidate = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("关键词不能为空"));
      } else {
        callback();
      }
    };
    let selectedOptionsValidate = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("地域不能为空"));
      } else {
        callback();
      }
    };
    return {
      Config,
      showResults: false,
      form: {
        queryPort: "1",
        keyword: "",
        selectedOptions: "",
        promotionPosition: "1"
      },
      addressOptions,
      formRules: {
        keyword: [{ validator: keyworyValidate, trigger: ["blur"] }],
        selectedOptions: [
          { validator: selectedOptionsValidate, trigger: ["blur"] }
        ]
      },
      tableData: [],
      list: [],
      currentPage: 1,
      pageSize: 8,
      progressNumber: 0,
      progressToggle: false
    };
  },
  components: {
    elProgress
  },
  computed: {
    ...mapState(["isLogin"])
  },
  created() {},
  methods: {
    handleAddressChange(val) {
      if (val.indexOf("江苏") > -1 && !this.addressOptions[0].cities.length) {
        this.addressOptions[0].cities = [
          {
            label: "南京"
          }
        ];
      } else if (
        val.indexOf("浙江") > -1 &&
        !this.addressOptions[1].cities.length
      ) {
        this.addressOptions[1].cities = [
          {
            label: "杭州"
          }
        ];
      }
    },
    async search() {
      //查询
      this.progressStart();
      let params = {
        equipment: this.form.queryPort,
        area: 2,
        areaValue: this.getSelectedOptionsId(this.form.selectedOptions),
        keyValue: this.form.keyword,
        position: this.form.promotionPosition
      };
      const { data: res } = await searchKuaiche({ params });
      this.progressEnd();
      if (res.code == 200) {
        this.showResults = true;
        this.tableData = res.data;
        this.list = this.tableData.slice(0, 8); //初始取前8条
      }
    },
    // 切换页码
    tablePageChange(page) {
      this.currentPage = page;
      this.list = this.tableData.slice((page - 1) * 8, page * 8);
      document.querySelector("#query-results").scrollIntoView(true);
    },
    checkLogin() {
      //检查是否已登录
      if (!this.isLogin) {
        this.$store.commit("LOGIN_MODAL_TOGGLE", {
          toggle: true,
          loginType: 2
        });
        return;
      } else {
        this.$refs["form"].validate(async valid => {
          if (valid) {
            this.search();
          }
        });
      }
    },
    getSelectedOptionsId() {
      if (!this.form.selectedOptions.length) return "";
      let len = this.form.selectedOptions.length;
      const returnData = {
        1: this.form.selectedOptions[0],
        2: this.form.selectedOptions[1]
      };
      return returnData[len];
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
    cancelProgress() {
      //取消查询
      clearInterval(timer);
      this.progressToggle = false;
      this.progressNumber = 0;
    },
    reset() {
      //重置
      this.form.keyword = "";
      this.form.selectedOptions = "";
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
  box-shadow: 0px 3px 24px 0px rgba(168, 168, 236, 0.22);
}
//即时查询
/deep/ .el-tooltip__popper.is-light {
  border: 1px solid #f00 !important;
}
.instant-query {
  padding: 30px 10px 20px;
  .query-options {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .form {
      width: 616px;
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
      /deep/ .el-form-item__content {
        height:30px;
        line-height: 30px;
      }
      .el-radio-button+.el-radio-button {
        margin-left: 10px;
      }
      /deep/ .el-radio-button__inner {
        min-width: 80px;
        height:30px;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        box-shadow: none;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .icon-wenhao {
        margin-left: 3px;
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
    padding: 25px 26px 10px;
    .ul-box {
      display: flex;
      flex-wrap: wrap;
      .ul-li {
        width: 206px;
        height: 300px;
        padding: 9px 16px 15px 9px;
        box-sizing: border-box;
        display: flex;
        background-color: #eef5ff;
        .left {
          width: 20px;
          margin-right: 5px;
          color: #333;
          font-size: 16px;
          font-weight: 400;
          text-align: center;
        }
        .right {
          .goods-img {
            width: 160px;
            height: 160px;
          }
          .price {
            width: 160px;
            font-size: 14px;
            font-weight: bold;
            color: #333;
            padding: 10px 0;
          }
          .skuName {
            width: 160px;
            height: 53px;
            line-height: 18px;
            font-size: 12px;
            font-weight: 400;
            color: #333;
            display: -webkit-box;
            /* ! autoprefixer: off */
            -webkit-box-orient: vertical;
            /* autoprefixer: on */
            -webkit-line-clamp: 3;
            overflow: hidden;
          }
          .evaluateNum {
            color: #333;
            font-size: 12px;
            font-weight: 400;
            margin-top: 15px;
          }
        }
      }
      .ul-li:not(:nth-child(4n)) {
        margin: 0 20px 20px 0;
      }
    }
    // 分页
    .pagination {
      text-align: center;
      margin-top: 10px;
    }
    .null-img {
      width: 100%;
      height: 200px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>