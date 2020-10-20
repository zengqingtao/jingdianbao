<!--删评监控-->
<template>
  <div class="container">
    <div class="delComment-box">
      <div class="module">
        <div class="add-goods-search-box">
          <div class="add-goods-box">
            <el-button class="add-btn --btn-none" @click="addGoodsDialog = true">添加商品</el-button>
            <monitor-tips></monitor-tips>
          </div>
          <div class="search-box">
            <el-input v-model="searchSku" placeholder="请输入要查询的SKU"></el-input>
            <el-button class="--btn-none" @click="getCommentMonitors">查询</el-button>
          </div>
        </div>
        <custom-tabs :data="groupList" name="delCommentMonitor" @changeTabs="changeTabs"></custom-tabs>
      </div>
      <div v-if="tableData && tableData.length">
        <div class="monitoring-list module" v-for="(item,index) in tableData" :key="index">
          <div v-if="groupId===-1" class="btn-group add-btn-box">
            <el-button onfocus="this.blur()" @click="moveToDefaultGroup(item.skuId)">
              <i class="iconfont icon-tianjia1"></i>
            </el-button>
          </div>
          <div v-else class="btn-group">
            <el-button
              class="--btn-primary"
              @click="toCheckAssess(item)"
              type="primary"
              v-baidu-count="{event:'内部跳转优化',value:'删评监控内部跳转',label:'删评监控-查留评率'}"
            >查留评率</el-button>
            <el-button class="--btn-none" @click="itemClickTop(item)">{{item.top?'取消置顶':'置顶'}}</el-button>
          </div>
          <hr class="gray-hr" />
          <!-- 商品图片等信息 -->
          <div class="goods-info-box">
            <a class="left" :href="item.url" target="_blank">
              <el-image class="goods-img" :src="item.img"></el-image>
            </a>
            <div class="right">
              <a class="goods-title --text-mouse-hover" :href="item.url" target="_blank">
                <span>{{item.skuName}}</span>
              </a>
              <div class="goods-sku">sku：{{item.skuId}}</div>
            </div>
          </div>
          <el-table
            :data="item.comment"
            ref="monitorTable"
            header-row-class-name="table-header"
            style="width: 100%"
            class="table"
          >
            <el-table-column prop="totalCount" label="总评数">
              <template slot-scope="scope">
                <span>{{scope.row.createDate !== today ? (scope.row.totalCount ? scope.row.totalCount : 0) : `-`}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="goodCount" label="好评数">
              <template slot-scope="scope">
                <span>{{scope.row.createDate !== today ? (scope.row.goodCount ? scope.row.goodCount : 0) : `-`}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="leaveReviewRate" label="好评率" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.createDate !== today ? (scope.row.goodCount / scope.row.totalCount) ? `${((scope.row.goodCount / scope.row.totalCount) * 100).toFixed(0)}%` : `0%` : `-`}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="right" label="操作" width="100" align="center">
              <template slot-scope="scope">
                <div class="operation-column">
                  <el-button
                    @click="trendClick(scope.row)"
                    type="primary"
                    size="small"
                    class="--btn-primary"
                    onfocus="this.blur()"
                  >走势</el-button>
                  <el-button
                    @click="clickCancelMonitor(scope.row,'确定要取消监控吗?')"
                    type="default"
                    size="small"
                    class="--btn-default-DBlue"
                  >取消监控</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="pagination-box module" v-if="pagination.total>10">
        <el-pagination
          :current-page="pagination.page"
          class="page-limit"
          prev-text="上一页"
          next-text="下一页"
          background
          layout="prev, pager, next"
          @current-change="changeCurrentPage"
          :total="pagination.total"
        ></el-pagination>
      </div>
      <div class="noData-tips-box module" v-if="!isLogin">
        <div class="noLogin-box">
          <img class="img" src="../../../assets/images/noData.png" alt />
          <p class="img-title">尚未登录，请先登录</p>
        </div>
        <el-button class="btn-primary" type="primary" @click="toLogin">去登录</el-button>
      </div>
      <div
        class="noData-tips-box module"
        v-if="isLogin&&!tableData.length"
        v-loading="tableLoading"
      >
        <div class="login-noData-box" v-if="!tableLoading">
          <img class="img" src="../../../assets/images/null.png" alt />
        </div>
      </div>
      <add-goods
        v-if="addGoodsDialog"
        @closeDialog="addGoodsDialog = false"
        title="添加删评监控"
        @successGetData="getCommentMonitors"
        @upGrade="upGrade"
        :monitor-type="3"
      ></add-goods>
      <!-- 权限不够对话框 -->
      <up-grade
        :errorMsg="upGradeTips"
        type="删评监控"
        v-if="isShowUpGrade"
        @closeDialog="isShowUpGrade = false"
      ></up-grade>
      <!-- 取消/删除监控 -->
      <cancel-monitoring
        :dialogTips="cancelMonitoringTips"
        @cancelMonitoring="confirmCancelMonitoring"
        @closeDialog="isShowCancelMonitoring = false"
        v-if="isShowCancelMonitoring"
      ></cancel-monitoring>
    </div>
  </div>
</template>
<script>
// import { checkLogin } from "../../../api/user";
import addGoods from "../../dialog/addGoods";
import upGrade from "../../dialog/upGrade";
import cancelMonitoring from "../../dialog/cancelMonitoring";
import { skuReg, secondToDate } from "@/utils/common";
import EventBus from "@/utils/eventBus.js";
import {
  deleteTop,
  searchDeleteMonitor,
  deleteCancel,
  validDeleteCommentMonitor
} from "../../../api/monitor";
import { mapState } from "vuex";
import customTabs from "../../../components/customTabs";
import monitorTips from "../../../components/monitorTips";
import { checkLogin } from "../../../api/user";
export default {
  name: "delCommentMonitoring",
  data() {
    return {
      addGoodsDialog: false,
      pagination: {
        page: 1,
        total: 0,
      },
      searchSku: "",
      upGradeTips: "",
      isShowUpGrade: false,
      cancelMonitoringTips: "",
      isShowCancelMonitoring: false,
      cancelMonitorRow: null,
      tableData: [],
      tableLoading: true,
      groupList: [
        { id: 0, name: "默认分组" },
        { id: -1, name: "已失效分组" },
      ],
      groupId: 0,
      isLogin: true,
    };
  },
  components: {
    addGoods,
    upGrade,
    cancelMonitoring,
    customTabs,
    monitorTips,
  },
  computed: {
    today() {
      let dateTime = new Date();
      let year = dateTime.getFullYear();
      let month =
        dateTime.getMonth() + 1 < 10
          ? `0${dateTime.getMonth() + 1}`
          : dateTime.getMonth() + 1;
      let date =
        dateTime.getDate() < 10 ? `0${dateTime.getDate()}` : dateTime.getDate();
      return `${year}-${month}-${date}`;
    },
  },
  created() {
    this.checkLogin();
  },
  methods: {
    async checkLogin() {
      const { data: res } = await checkLogin();
      if (res.code === 200) {
        this.isLogin = true;
        this.getCommentMonitors();
      } else {
        this.isLogin = false;
      }
    },
    async getCommentMonitors() {
      if (!this.isLogin) return;
      this.tableLoading = true;
      const params = {
        page: this.pagination.page,
        skuId: skuReg(this.searchSku),
        groupId: this.groupId,
      };
      let { data: listRes } = await searchDeleteMonitor({ params });
      this.tableLoading = false;
      if (listRes.code === 200) {
        this.pagination.total = listRes.size;
        this.tableData = listRes.data.map((item) => {
          return {
            top: item.comment.top,
            img: item.img,
            skuId: item.skuId,
            skuName: item.skuName,
            url: item.url,
            comment: [item.comment],
          };
        });
      } else if (listRes.code === 2003) {
        this.isLogin = false;
      } else {
        this.$message.error(listRes.msg);
      }
    },
    changeTabs(groupId) {
      this.groupId = groupId;
      this.pagination.page = 1;
      this.getCommentMonitors();
    },
    // 将已失效分组的数据移动到默认分组
    async moveToDefaultGroup(skuId) {
      const params = {
        skuId:skuId
      }
      const {data:res} = await validDeleteCommentMonitor({params})
      switch (res.code) {
        case 200:
          this.getCommentMonitors()
          this.$message.success(res.msg || "监控已激活，并添加到默认分组中。");
          break;
        case 8028:
          this.upGradeTips = res.msg;
          this.isShowUpGrade = true;
          break
        default:
          this.$message.error(res.msg)
      }
    },
    changeCurrentPage(currentPage) {
      this.pagination.page = currentPage;
      this.getCommentMonitors();
      document.scrollingElement.scrollTop = 0; //让页面滚动到最顶部
    },
    //置顶
    async itemClickTop(rowData) {
      //top 0:未置顶 1:已置顶
      let topParams = {
        skuId: rowData.skuId,
        top: rowData.top ? 0 : 1,
      };
      let { data: topRes } = await deleteTop({ params: topParams });
      if (topRes.code === 200) {
        this.getCommentMonitors();
      }
    },

    // 走势
    trendClick(row) {
      let url = this.$router.resolve({
        path: "/trend/delCommentTrend",
        query: {
          trendMonitorId: row.skuId,
        },
      });
      window.open(url.href);
    },
    // 取消监控
    clickCancelMonitor(row, showText = "确定要取消监控吗?") {
      this.isShowCancelMonitoring = true;
      this.cancelMonitoringTips = showText;
      this.cancelMonitorRow = row;
    },
    async confirmCancelMonitoring() {
      this.isShowCancelMonitoring = false;
      let res = await deleteCancel({
        params: { skuId: this.cancelMonitorRow.skuId },
      });
      if (res.data.code === 200) {
        if (this.tableData.length === 1 && this.pagination.page !== 1) {
          this.pagination.page--;
        }
        this.getCommentMonitors();
      }
    },
    // 调转查留评率
    toCheckAssess(item) {
      let path = "/dataQuery/evaluate";
      this.$router.push({
        path,
        query: { skuId: item.skuId },
      });
    },
    toLogin() {
      this.$store.commit("LOGIN_MODAL_TOGGLE", {
        toggle: true,
        loginType: 2,
      });
    },
    // 升级
    upGrade(value) {
      this.upGradeTips = value;
      this.isShowUpGrade = true;
    },
  },
};
</script>
<style lang="scss" scoped>
.container,
.delComment-box {
  height: 100%;
}
.module {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 3px 24px 0px rgba(168, 168, 236, 0.22);
}
.add-goods-search-box {
  padding: 20px 20px 0;
  display: flex;
  justify-content: space-between;
  /deep/ .el-button {
    width: 90px;
    height: 30px;
    padding: 0;
  }
  .add-goods-box {
    display: flex;
    align-items: center;
    .add-btn {
      margin-right: 5px;
    }
  }
  .search-box {
    display: flex;
    /deep/ .el-input {
      width: 180px;
      margin-right: 8px;
    }
    /deep/ .el-input__inner {
      width: 180px;
      height: 30px;
    }
  }
}

.monitoring-list {
  margin-top: 9px;
  background-color: #fff;
  padding: 10px 10px;
  .btn-group {
    text-align: right;
    margin-bottom: 7px;
    padding-right: 10px;
    /deep/ .el-button {
      width: 70px;
      height: 30px;
      padding: 0;
    }
    /deep/ .el-button + .el-button {
      margin-left: 5px;
    }
  }
  .add-btn-box {
    .icon-tianjia1 {
      font-size: 17px;
    }
    /deep/ .el-button {
      width: 30px;
      border: 0;
      color:var(--DBlue);
      &:hover {
        color:var(--JBlue);
        background-color: #fff;
      }
    }
  }
  .gray-hr {
    margin: 0;
    border: 0;
    height: 1px;
    background-color: #eee;
    margin-bottom: 10px;
  }
  .goods-info-box {
    display: flex;

    .left {
      width: 70px;
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 14px;
      /deep/ .el-image__error {
        font-size: 12px;
      }
      .goods-img {
        width: 55px;
        height: 57px;
      }
    }
    .right {
      .goods-title {
        display: block;
        width: 452px;
        height: 37px;
        line-height: 20px;
        font-size: 14px;
        color: #333;
        display: -webkit-box;
        /* ! autoprefixer: off */
        -webkit-box-orient: vertical;
        /* autoprefixer: on */
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
      .goods-sku {
        color: #999;
        font-size: 14px;
        margin-top: 14px;
      }
    }
  }
  .table {
    border: 1px solid #ebeef5;
    border-bottom: 0;
    margin-top: 20px;
    .no-change {
      color: #999;
      font-size: 12px;
    }
    .is-up {
      color: #e92312;
      font-size: 12px;
    }
    .is-down {
      color: #00ff00;
      font-size: 12px;
    }
    .operation-column {
      text-align: center;
      /deep/ .el-button {
        width: 65px;
        height: 23px;
        line-height: 23px;
        margin: 0;
        text-align: center;
        padding: 0;
      }
      /deep/ .el-button + .el-button {
        margin-top: 6px;
      }
    }
    .evaluate-btn {
      /deep/ .el-button {
        width: 65px;
        height: 23px;
        line-height: 23px;
        padding: 0;
      }
    }
  }
  .toggle-group {
    text-align: center;
    color: #333;
    font-size: 14px;
    cursor: pointer;
    margin-top: 10px;
    .iconfont {
      display: inline-block;
      margin-left: 5px;
      animation: upDown 0.7s infinite alternate;
      @keyframes upDown {
        0% {
          transform: translateY(3px);
        }
        100% {
          transform: translateY(-3px);
        }
      }
    }
  }
}
.pagination-box {
  text-align: center;
  margin-top: 10px;
  padding: 10px;
  background-color: #fff;
}
.noData-tips-box {
  width: 100%;
  height: calc(100% - 110px);
  background-color: #fff;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  .noLogin-box {
    text-align: center;
    .img {
      width: 60px;
      height: 60px;
    }
    .img-title {
      padding-top: 5px;
      color: #999;
      font-size: 14px;
    }
  }
  .login-noData-box {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .btn-primary {
    width: 130px;
    margin-top: 30px;
  }
  .btn-primary:hover {
    background-color: #3159e4;
  }
}
</style>