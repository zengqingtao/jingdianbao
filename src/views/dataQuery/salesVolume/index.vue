<!--查销量-->
<template>
  <div class="container">
    <!-- 即时查询 -->
    <div class="modul instant-query">
      <div class="check-body">
        <el-form
          class="form"
          ref="form"
          :rules="formRules"
          :model="form"
          label-width="90px"
          @submit.native.prevent
        >
          <el-form-item label="统计维度：">
            <el-radio-group v-model="form.dimension" size="small">
              <el-radio-button label="0">sku</el-radio-button>
              <el-radio-button label="1">spu</el-radio-button>
            </el-radio-group>
          </el-form-item>
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
      <div class="check-result" v-if="showResults">
        <el-table class="check-result-table" :data="tableData" style="width: 100%">
          <el-table-column label="序号" width="70">
            <template slot-scope="scope">
              {{++scope.$index}}
              <div class="is-relation-sku" v-if="scope.row.isMainSku === 0">关联SKU</div>
            </template>
          </el-table-column>
          <el-table-column prop="goodsUrl" label="商品链接" min-width="160px" align="center">
            <template slot-scope="scope">
              <div class="goods-url">
                <img class="shop-img" v-if="scope.row.img" :src="scope.row.img" alt />
                <a
                  :href="scope.row.url"
                  target="_blank"
                  class="--text-mouse-hover"
                >{{scope.row.skuName}}</a>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="thirdCat" label="三级类别"></el-table-column>
          <el-table-column prop="brand" label="品牌"></el-table-column>
          <el-table-column prop="last30DaysSales" label="30天销量"></el-table-column>
          <el-table-column prop="last15DaysSales" label="15天销量"></el-table-column>
          <el-table-column prop="last7DaysSales" label="7天销量"></el-table-column>
          <el-table-column prop="last3DaysSales" label="3天销量"></el-table-column>
          <el-table-column label="推荐策略">
            <template>
              <el-tooltip popper-class="tooltip" placement="bottom" :enterable="false">
                <div slot="content">通过提升综合排名，从而实现销量的增长</div>
                <a
                  class="up-btn"
                  target="_blank"
                  :href="Config.rqbUrl + 'newReleaseIndex/jd/popular-rank'"
                  onfocus="this.blur()"
                  v-baidu-count="{event:'外部跳转转化',value:'推荐策略',label:'查销量-提升排名'}"
                >提升排名</a>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 历史查询 -->
    <div class="modul history-query" id="history-query" v-if="historyList.length>0">
      <div class="title">最近查询</div>
      <el-table :data="historyList" style="width: 100%;" @row-click="rowClick">
        <el-table-column label="序号" width="80px">
          <template slot-scope="scope">{{ ++scope.$index }}</template>
        </el-table-column>
        <el-table-column label="商品图片" width="140px">
          <template slot-scope="scope">
            <img :src="scope.row.imgUrl" alt class="goods-img" />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="商品标题" width="350px"></el-table-column>
        <el-table-column prop="skuId" label="sku" align="center"></el-table-column>
        <el-table-column prop="spu" label="统计维度" width="100px"  align="center">
          <template slot-scope="scope">
            <div>{{scope.row.spu===0?'sku':'spu'}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="操作" width="110px" align="center">
          <template slot-scope="scope">
            <div class="btn-group">
              <div class="btn-collection-box">
                <el-button
                  type="text"
                  @click.stop="handleCollection(scope.row)"
                  onfocus="this.blur()"
                >{{scope.row.star==1?'取消收藏':'收藏'}}</el-button>
              </div>
              <el-button type="text" class="delete-btn" @click.stop="handleDelete(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          v-if="historyTotal>10"
          prev-text="上一页"
          next-text="下一页"
          background
          layout="prev, pager, next"
          :current-page="historyListPage"
          @current-change="tablePageChange"
          :total="historyTotal"
        ></el-pagination>
      </div>
    </div>
    <!-- 弹框 -->
    <up-grade
      :errorMsg="errorMsg"
      type="查销量"
      v-if="isShowUpGrade"
      @closeDialog="isShowUpGrade = false"
    ></up-grade>
  </div>
</template>
<script>
import Config from "../../../config";
import elProgress from "../../../components/progress";
import { skuReg } from "@/utils/common";
import upGrade from "../../dialog/upGrade";
import {
  skuSalesValues,
  spuSalesValues,
  getSearchHistoryList,
  addSearchHistory,
  clickStar,
  cancelStar,
  deleteById,
  checkIsGlobal
} from "../../../api/ranking";
import { mapState } from "vuex";
let timer = null;
export default {
  name: "salesVolume",
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
      Config,
      showResults: false,
      form: {
        dimension:'0',
        sku: ""
      },
      formRules: {
        sku: [{ validator: skuValidate, trigger: ["blur"] }]
      },
      tableData: [],
      progressNumber: 0,
      progressToggle: false,
      historyListPage: 1,
      historyList: [],
      historyTotal: 0,
      errorMsg: "",
      isShowUpGrade: false
    };
  },
  components: {
    elProgress,
    upGrade
  },
  computed: {
    ...mapState(["isLogin"])
  },
  created() {
    this._getSearchHistoryList();
  },
  methods: {
    async search() {
      this.isShowUpGrade = false;
      //查询
      this.progressStart();
      let params = {
        skuId: skuReg(this.form.sku)
      };
      let request = {
        "0":skuSalesValues,
        "1":spuSalesValues
      }
      const { data: res } = await request[this.form.dimension]({ params });
      this.showResults = true;
      this.progressEnd();
      if (res.code == 200) {
        this.tableData = res.data;
        //查询成功后需要添加历史记录
        let isMainItem = res.data.find(item => item.isMainSku === 1);
        let historyData = {
          title: isMainItem.skuName,
          imgUrl: isMainItem.img,
          skuId: isMainItem.skuId
        };
        if (this.tableData.length) {
          this._addSearchHistory(historyData);
        }
      } else if (res.code === 8028) {
        //当前会员等级没有权限使用此功能
        this.isShowUpGrade = true;
        this.errorMsg = res.msg;
      } else {
        this.$message.error(res.msg);
      }
    },
    async checkLogin() {
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
            let skuId = skuReg(this.form.sku);
            this.search();
          }
        });
      }
    },
    async checkSaleIsGlobal(skuId) {
      //先判断是否是全球购商品
      let { data: checkGlobalRes } = await checkIsGlobal({
        params: { skuId: skuId }
      });
      if (checkGlobalRes.code === 200) {
        if (checkGlobalRes.data === 1) {
          this.errorMsg = "暂不支持全球购商品查询";
          return;
        }
        this.search();
      }
    },
    async _addSearchHistory(data = { title: "", imgUrl: "", skuId: "" }) {
      const star = 0; //加星 0不加 1加
      const type = 1; //1 销量 2评价
      const params = { star, type, ...data,spu:Number(this.form.dimension) };
      let { data: res } = await addSearchHistory(params);
      if (res.code === 200) {
        this._getSearchHistoryList();
      }
    },
    //历史记录相关
    async _getSearchHistoryList() {
      //type 1 销量 2 评价
      const params = {
        type: 1,
        page: this.historyListPage
      };
      let { data: res } = await getSearchHistoryList({ params });
      if (res.code === 200) {
        this.historyList = res.data.results;
        this.historyTotal = res.data.totalCount;
      }
    },
    rowClick(row, column, event) {
      this.cancelProgress();
      this.form.sku = row.skuId;
      this.form.dimension = row.spu.toString()
      this.checkLogin();
      document.scrollingElement.scrollTop = 0; //让页面滚动到最顶部
    },
    //收藏
    async handleCollection(row) {
      let starType = row.star === 0 ? 0 : 1;
      let itemId = row.id;
      const apiJson = {
        0: clickStar,
        1: cancelStar
      };
      let { data: starRes } = await apiJson[starType]({
        params: { id: itemId }
      });
      if (starRes.code === 200) {
        this._getSearchHistoryList();
      }
    },
    //删除
    async handleDelete(row) {
      const params = { id: row.id };
      let { data: deleteRes } = await deleteById({ params });
      if (deleteRes.code === 200) {
        this._getSearchHistoryList();
      }
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
      this.form = {
        dimension:"0",
        sku: ""
      };
    },
    // 切换历史查询页
    tablePageChange(currentPage) {
      this.historyListPage = currentPage;
      this._getSearchHistoryList();
      document.querySelector("#history-query").scrollIntoView();
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
      /deep/ .el-radio-button {
        margin-right: 10px;
      }
      /deep/ .el-radio-button__inner {
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        width: 80px;
        height:30px;
        padding: 0;
        line-height: 30px;
        box-shadow: none;
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
  .check-result {
    padding-top: 25px;
    /deep/ .el-table {
      border: 1px solid #ebeef5;
      border-bottom: 0;
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
    .goods-url {
      display: flex;
      align-items: center;
      a {
        color: #333;
        display: -webkit-box;
        /* ! autoprefixer: off */
        -webkit-box-orient: vertical;
        /* autoprefixer: on */
        -webkit-line-clamp: 2;
        overflow: hidden;
        margin-left: 5px;
        flex: 1;
      }
      .shop-img {
        width: 50px;
      }
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
}
//历史查询
.history-query {
  margin-top: 10px;
  padding: 15px 10px;
  .title {
    width: 100%;
    font-size: 14px;
    font-weight: 400px;
    color: #333;
    text-align: center;
    padding-bottom: 15px;
  }
  /deep/ .el-table {
    border: 1px solid #ebeef5;
    border-bottom: 0;
    .goods-img {
      //不设置高度使得图片等比缩放
      width: 53px;
    }
    /deep/ .el-table__row:hover {
      cursor: pointer;
    }
    /deep/ .el-table__row td:nth-child(3) {
      padding-right: 30px;
    }
    .btn-group {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .btn-collection-box {
        /deep/ .el-button--text {
          color: #4d75ff;
          padding: 0;
        }
        /deep/ .el-button--text:hover {
          color: #3159e4;
        }
      }
    }
  }
  /deep/ .delete-btn.el-button--text {
    text-align: start;
    padding: 5px 0 0 0;
    margin-left: 0;
    color: #f00;
  }

  .pagination {
    text-align: center;
    margin-top: 10px;
  }
}
// 权限不够弹框
.upGradeDialog {
  .error-msg {
    line-height: 20px;
    color: var(--JBlue);
  }
  /deep/ .el-icon-close {
    width: 30px;
    height: 30px;
    line-height: 30px;
    color: #fff !important;
    border: 1px solid #fff;
    border-radius: 50%;
  }

  /deep/ .el-dialog__headerbtn {
    right: -40px;
    top: 0px;
  }
}
</style>