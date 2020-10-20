<!--添加排名监控---->
<template>
  <div class="container">
    <div class="ranking-box">
      <div class="module">
        <div class="add-goods-search-box">
          <div class="add-goods-box">
            <el-button class="add-btn --btn-none" @click="addGoodsDialog = true">添加商品</el-button>
            <monitor-tips></monitor-tips>
          </div>
          <div class="search-box">
            <el-input v-model="searchSku" placeholder="请输入要查询的SKU"></el-input>
            <el-button class="--btn-none" @click="_getListSelfItemMonitors">查询</el-button>
          </div>
        </div>
        <custom-tabs
          :data="groupList"
          name="rankMonitor"
          @editSuccess="getGroupLists"
          @deleteSuccess="getGroupLists"
          @changeTabs="changeTabs"
        ></custom-tabs>
      </div>
      <div v-if="tableToggleData && tableToggleData.length">
        <div class="monitoring-list module" v-for="(item,index) in tableToggleData" :key="index">
          <div class="btn-group" v-if="groupId===-1">
            <el-button onfocus="this.blur()" @click="moveToDefaultGroup(item.skuId)">
              <i class="iconfont icon-tianjia1"></i>
            </el-button>
            <el-button onfocus="this.blur()" @click="clickCancelMonitor(item,'确认删除？')">
              <i class="iconfont icon-shanchu1"></i>
            </el-button>
          </div>
          <div class="btn-group" v-else>
            <el-button @click="reloadMonitor(item,index)" :loading="reloadingArr[index]">
              <i class="iconfont icon-shuaxin" v-if="!reloadingArr[index]"></i>
              <span>{{item.reloadCountDown}}</span>
            </el-button>
            <div class="more-btn" @mouseleave="mouseleave(index)" @mouseenter="mouseenter(index)">
              <el-button onfocus="this.blur()">
                <i class="iconfont icon-gengduo"></i>
              </el-button>
              <div class="more-btn-group">
                <el-button onfocus="this.blur()" @click="addItemKeyword(item)">添加关键词</el-button>
                <el-button onfocus="this.blur()" @click="addCategory(item)">添加类目排名</el-button>
                <el-button
                  onfocus="this.blur()"
                  @click="itemClickTop(item)"
                >{{item.top==1?'取消置顶':'置顶'}}</el-button>
                <el-button onfocus="this.blur()" @click="clickCancelMonitor(item,'确认删除？')">删除监控</el-button>
                <el-button onfocus="this.blur()" @click="openMoveGroupDialog(item.skuId)">移动至</el-button>
              </div>
              <div class="triangle"></div>
            </div>
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
            <div class="ranking-slide" v-if="item.notifyRqbAds">
              <img
                class="ranking-slide-logo"
                src="../../../assets/images/dataMonitoring/rankingSlide.png"
              />
              <div class="up-ranking-btn-box">
                <el-button
                  class="up-ranking-btn --btn-primary"
                  type="primary"
                  onfocus="this.blur()"
                  @click="goToRQB"
                  v-baidu-count="{event:'外部跳转转化',value:'推荐策略',label:'排名监控-提升排名'}"
                >提升排名</el-button>
              </div>
            </div>
          </div>
          <el-table
            :data="item.monitors"
            ref="monitorTable"
            header-row-class-name="table-header"
            style="width: 100%"
            class="table"
          >
            <el-table-column prop="searchWord" label="关键词" align="center">
              <template slot-scope="scope">
                <div v-if="!scope.row.searchWord">{{columnTips}}</div>
                <div v-else>
                  <div
                    v-if="scope.row.searchWord && scope.row.searchWord.split('->').length<=1"
                  >{{scope.row.searchWord}}</div>
                  <div v-else>
                    <div
                      v-for="(searchWord,index) in scope.row.searchWord && scope.row.searchWord.split('->')"
                      :key="index"
                    >
                      {{searchWord}}
                      <span v-if="index< 2">-></span>
                      <span class="cat-desc" v-if="index===2">[类目]</span>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="100px">
              <template slot-scope="scope">
                <div v-if="!scope.row.createTime">{{columnTips}}</div>
                <div v-else>{{scope.row.createTime}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="updateTime" label="更新时间" width="100px">
              <template slot-scope="scope">
                <div v-if="!scope.row.updateTime">{{columnTips}}</div>
                <div v-else>{{scope.row.updateTime}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="sortType" label="排序方式">
              <template slot-scope="scope">
                <div v-if="!scope.row.sortType">{{columnTips}}</div>
                <div v-else>
                  <span
                    v-if="scope.row.sortType==='GENERAL' || scope.row.sortType==='GENERAL_'"
                  >综合排序</span>
                  <span v-if="scope.row.sortType==='SALE'">销量排序</span>
                  <span v-if="scope.row.sortType==='COMMENT'">评价排序</span>
                  <span v-if="scope.row.sortType==='NEW_ITEM'">新品排序</span>
                  <span v-if="scope.row.sortType==='PRICE_UP'">价格升序</span>
                  <span v-if="scope.row.sortType==='PRICE_DOWN'">价格降序</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="mobileRank" label="手机端排名">
              <template slot-scope="scope">
                <div v-if="!scope.row.mobileRank&&scope.row.mobileRank!==0">{{columnTips}}</div>
                <div class="rank-table-item" v-else>
                  <div>
                    <div v-if="scope.row.mobileRank">
                      <div>第{{scope.row.mobileLocationPage}}页{{scope.row.mobileLocationRow}}位</div>
                      <div>总排名第{{scope.row.mobileRank}}位</div>
                    </div>
                    <span v-else>今天排名不在查询范围内</span>
                  </div>
                  <div
                    :class="[{'no-change':scope.row.mobileChange === 0},
                    {'is-up':scope.row.mobileChange > 0},
                    {'is-down':scope.row.mobileChange < 0},]"
                  >
                    <i
                      class="iconfont"
                      v-if="scope.row.mobileChange!==0"
                      :class="[{'icon-tubiaoshangshengqushi':scope.row.mobileChange>0},
                                                {'icon-tubiaoxiajiangqushi':scope.row.mobileChange<0},]"
                    ></i>
                    {{scope.row.mobileChange === 0 ?
                    '无变动':Math.abs(scope.row.mobileChange)}}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="pcRank" label="电脑端排名">
              <template slot-scope="scope">
                <div v-if="!scope.row.pcRank&&scope.row.pcRank!==0">{{columnTips}}</div>
                <div class="rank-table-item" v-else>
                  <div>
                    <div v-if="scope.row.pcRank">
                      <div>第{{scope.row.pcLocationPage}}页{{scope.row.pcLocationRow}}位</div>
                      <div>总排名第{{scope.row.pcRank}}位</div>
                    </div>
                    <span v-else>今天排名不在查询范围内</span>
                  </div>
                  <div
                    :class="[{'no-change':scope.row.pcChange === 0},
                                                        {'is-up':scope.row.pcChange > 0},
                                                        {'is-down':scope.row.pcChange < 0},]"
                  >
                    <i
                      class="iconfont"
                      v-if="scope.row.pcChange!==0"
                      :class="[{'icon-tubiaoshangshengqushi':scope.row.pcChange>0},
                                                {'icon-tubiaoxiajiangqushi':scope.row.pcChange<0},]"
                    ></i>
                    {{scope.row.pcChange === 0 ?
                    '无变动':Math.abs(scope.row.pcChange)}}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="commentsNum" label="总评价数">
              <template slot-scope="scope">
                <div v-if="!scope.row.commentsNum&&scope.row.commentsNum!==0">{{columnTips}}</div>
                <div v-else>{{scope.row.commentsNum}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="ignoreCommentsNum" label="忽略评价数">
              <template slot-scope="scope">
                <div
                  v-if="!scope.row.ignoreCommentsNum&&scope.row.ignoreCommentsNum!==0"
                >{{columnTips}}</div>
                <div v-else>{{scope.row.ignoreCommentsNum}}</div>
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
                    onfocus="this.blur()"
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
        v-if="isLogin&&!tableToggleData.length"
        v-loading="tableLoading"
      >
        <div class="login-noData-box" v-if="!tableLoading">
          <img class="img" src="../../../assets/images/null.png" alt />
        </div>
      </div>
      <move-group
        v-if="moveGroupVisible"
        name="rankMonitor"
        :groupList="groupList"
        :sku="moveSkuId"
        @closeDialog="moveGroupVisible = false"
        @success="moveGroupSuccess"
      ></move-group>
      <add-goods
        v-if="addGoodsDialog"
        @closeDialog="addGoodsDialog = false"
        title="添加商品"
        @successGetData="_getListSelfItemMonitors"
        @upGrade="upGrade"
        :monitor-type="1"
        :groupOptions="groupList"
      ></add-goods>
      <add-keywords
        title="添加关键词"
        :skuId="keywordSkuId"
        :groupId="groupId"
        @successGetData="_getListSelfItemMonitors"
        @upGrade="upGrade"
        v-if="addKeywordsDialog"
        @closeDialog="addKeywordsDialog = false"
      ></add-keywords>
      <add-category
        title="添加类目监控"
        :skuId="checkCatSku"
        v-if="addCategoryDialog"
        @successGetData="_getListSelfItemMonitors"
        @upGrade="upGrade"
        @closeDialog="addCategoryDialog = false"
      ></add-category>
      <!-- 权限不够对话框 -->
      <up-grade
        :errorMsg="upGradeTips"
        type="排名监控"
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
import addGoods from "../../dialog/addGoods";
import addKeywords from "../../dialog/addKeywords";
import addCategory from "../../dialog/addCategory";
import upGrade from "../../dialog/upGrade";
import cancelMonitoring from "../../dialog/cancelMonitoring";
import Sortable from "sortablejs";
import { skuReg, secondToDate } from "@/utils/common";
import Config from "../../../config";
import { mapState } from "vuex";
import { checkLogin } from "../../../api/user";
import customTabs from "../../../components/customTabs";
import moveGroup from "../../dialog/moveGroup";
import monitorTips from "../../../components/monitorTips";
import {
  getListSelfItemMonitors,
  topMonitor,
  freshMonitor,
  cancelMonitor,
  changePosition,
  listGroups,
  selfRankInvalidMoveToDefault,
} from "../../../api/monitor";
let timer = [];
export default {
  data() {
    return {
      addGoodsDialog: false,
      itemTableData: [],
      tableToggleData: [],
      reloadingArr: [],
      tableLoading: true,
      pagination: {
        page: 1,
        total: 0,
      },
      searchSku: "",
      keywordSkuId: "", //添加关键词的商品的skuId
      addKeywordsDialog: false,
      addCategoryDialog: false,
      upGradeTips: "",
      isShowUpGrade: false,
      cancelMonitoringTips: "",
      isShowCancelMonitoring: false,
      cancelMonitorRow: null,
      isLogin: true,
      columnTips: "查询中，稍后刷新页面",
      groupList: [], //tabs的数组
      groupId: 0, //小组对应的编号
      moveGroupVisible: false,
      moveSkuId: "",
    };
  },
  components: {
    addGoods,
    addKeywords,
    addCategory,
    upGrade,
    cancelMonitoring,
    customTabs,
    monitorTips,
    moveGroup,
  },
  computed: mapState(["rankMonitorKeyword"]),
  watch: {
    addGoodsDialog() {
      if (!this.addGoodsDialog) {
        this.$store.commit("rank_monitor_keyword", false);
      }
    },
  },
  created() {
    this.checkLogin();
    if (this.rankMonitorKeyword) {
      this.addGoodsDialog = true;
    }
  },
  methods: {
    async checkLogin() {
      let { data: res } = await checkLogin();
      if (res.code === 200) {
        this.isLogin = true;
        await this.getGroupLists();
        this._getListSelfItemMonitors();
      } else {
        this.isLogin = false;
      }
    },
    async getGroupLists() {
      const { data: res } = await listGroups();
      if (res.code === 200) {
        this.groupList = res.data;
      } else {
        this.$message.error(res.msg);
      }
    },
    changeTabs(groupId) {
      this.groupId = groupId;
      this.pagination.page = 1;
      this.reloadingArr = [];
      timer.forEach((item, i) => {
        clearInterval(timer[i]);
      });
      this._getListSelfItemMonitors();
    },
    // 打开移动至分组对话框
    openMoveGroupDialog(skuId) {
      this.moveSkuId = skuId;
      this.moveGroupVisible = true;
    },
    moveGroupSuccess() {
      if (this.tableToggleData.length === 1 && this.pagination.page > 1) {
        this.pagination.page--;
      }
      this._getListSelfItemMonitors();
    },
    async _getListSelfItemMonitors() {
      if (!this.isLogin) return;
      this.tableLoading = true;
      const params = {
        page: this.pagination.page,
        skuId: skuReg(this.searchSku),
        groupId: this.groupId,
      };
      let { data: res } = await getListSelfItemMonitors({ params });
      this.tableLoading = false;
      if (res.code === 200) {
        if (!res.data.results.length) {
          this.itemTableData = [];
          this.pagination.total = 0;
          this.tableToggleData = [];
          return;
        }
        this.itemTableData = res.data.results;
        this.pagination.total = res.data.totalCount;
        this.itemTableData.forEach((item, index) => {
          item.tableToggle = true;
        });
        this.setTableToggleData(this.itemTableData);
        this.setTableSort();
      } else {
        this.$message.error(res.msg);
      }
    },
    // 将已失效分组的数据移动至默认分组
    async moveToDefaultGroup(skuId) {
      const params = {
        skuId: skuId,
      };
      const { data: res } = await selfRankInvalidMoveToDefault({ params });
      switch (res.code) {
        case 200:
          this._getListSelfItemMonitors()
          this.$message.success(res.msg || "监控已激活，并添加到默认分组中。");
          break;
        case 8028:
          this.upGradeTips = res.msg;
          this.isShowUpGrade = true;
          break;
        default:
          this.$message.error(res.msg);
      }
    },
    setTableToggleData(tableData) {
      if (!tableData.length) return;
      let newList = [].concat(JSON.parse(JSON.stringify(tableData)));
      newList.forEach((item) => {
        item.reloadCountDown = "";
        item.timer = null;
      });
      this.tableToggleData = newList;
    },
    setTableSort() {
      this.$nextTick(() => {
        let tableList = this.$refs.monitorTable;
        if (!tableList || !tableList.length) return;
        tableList.forEach((item, index) => {
          let target = item.$el.querySelector(".el-table__body-wrapper tbody");
          Sortable.create(target, {
            onEnd: ({ newIndex, oldIndex }) => {
              let targetId = this.itemTableData[index].monitors[newIndex]
                .monitorId;
              let sourceId = this.itemTableData[index].monitors[oldIndex]
                .monitorId;
              this.changeTablePosition({ sourceId, targetId });
            },
          });
        });
      });
    },
    login() {
      this.$store.commit("LOGIN_MODAL_TOGGLE", {
        toggle: true,
        loginType: 2,
      });
    },
    async changeTablePosition(params = {}) {
      await changePosition({ params });
    },
    changeCurrentPage(currentPage) {
      this.pagination.page = currentPage;
      this._getListSelfItemMonitors();
      document.scrollingElement.scrollTop = 0; //让页面滚动到最顶部
    },

    //置顶
    async itemClickTop(rowData) {
      //top 0:未置顶 1:已置顶
      let topType = rowData.top ? 0 : 1;
      let topParams = {
        skuId: rowData.skuId || "",
        monitorId: rowData.id || "",
        top: topType,
      };
      let { data: topRes } = await topMonitor(topParams);
      if (topRes.code === 200) {
        this._getListSelfItemMonitors();
      }
    },
    //一键刷新
    async reloadMonitor(item, index) {
      this.reloadingArr[index] = true;
      clearInterval(timer[index]);
      let params = {
        skuId: item.skuId,
        monitorId: "",
      };
      //倒计时逻辑
      let targetTableLen = this.itemTableData[index].monitors.length - 1;
      let waitTime = targetTableLen * 30 + 60;
      this.tableToggleData[index].reloadCountDown = `(${secondToDate(
        waitTime
      )})`;
      timer[index] = setInterval(() => {
        if (waitTime <= 0) {
          clearInterval(timer[index]);
          this.tableToggleData[index].reloadCountDown = ``;
          this.reloadingArr[index] = false;
          if (this.tableToggleData[index].code === 8027) {
            this._getListSelfItemMonitors();
          } else {
            this.$message({
              type: "error",
              message: "一键刷新失败,请稍后重试",
            });
          }
          return;
        }
        waitTime--;
        this.tableToggleData[index].reloadCountDown = `(${secondToDate(
          waitTime
        )})`;
      }, 1000);
      let { data: monitorRes } = await freshMonitor(params);

      if (monitorRes.code === 200) {
        clearInterval(timer[index]);
        this.tableToggleData[index].reloadCountDown = ``;
        this.reloadingArr[index] = false;
        this._getListSelfItemMonitors();
        this.$message.success("刷新成功");
      } else if (monitorRes.code === 8027) {
        this.tableToggleData[index].code = 8027;
        this.$message({ type: "warning", message: monitorRes.msg });
      } else {
        clearInterval(timer[index]);
        this.tableToggleData[index].reloadCountDown = ``;
        this.reloadingArr[index] = false;
        this.$message({ type: "error", message: monitorRes.msg });
      }
    },
    // 走势
    trendClick(row) {
      let url = this.$router.resolve({
        path: "/trend/rankingTrend",
        query: {
          trendMonitorId: row.monitorId,
        },
      });
      window.open(url.href);
    },
    // 删除
    clickCancelMonitor(row, showText = "确认删除？") {
      this.isShowCancelMonitoring = true;
      this.cancelMonitoringTips = showText;
      this.cancelMonitorRow = row;
    },
    async confirmCancelMonitoring() {
      this.isShowCancelMonitoring = false;
      let monitorId = this.cancelMonitorRow.monitorId
        ? this.cancelMonitorRow.monitorId
        : this.cancelMonitorRow.id;
      let res = await cancelMonitor({
        id: monitorId,
        skuId: this.cancelMonitorRow.skuId,
      });
      if (res.data.code === 200) {
        if (this.itemTableData.length === 1 && this.pagination.page !== 1) {
          this.pagination.page--;
        }
        this._getListSelfItemMonitors();
      }
    },
    // 添加关键词
    addItemKeyword(item) {
      this.keywordSkuId = item.skuId;
      this.addKeywordsDialog = true;
    },
    //添加指定类目
    addCategory(item) {
      this.addCategoryDialog = true;
      this.checkCatSku = item.skuId;
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
    goToRQB() {
      window.open(Config.rqbUrl + "newReleaseIndex/jd/popular-rank");
    },
    // 鼠标移入更多按钮
    mouseenter(index) {
      let doc = document.getElementsByClassName("more-btn-group")[index];
      doc.classList.add("is-show");
      let triangleDoc = document.getElementsByClassName("triangle")[index];
      triangleDoc.classList.add("triangle-position");
    },
    // 鼠标移出更多按钮
    mouseleave(index) {
      let doc = document.getElementsByClassName("more-btn-group")[index];
      doc.classList.remove("is-show");
      let triangleDoc = document.getElementsByClassName("triangle")[index];
      triangleDoc.classList.remove("triangle-position");
    },
  },
};
</script>
<style lang="scss" scoped>
.container,
.ranking-box {
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
  background-color: #fff;
  margin-top: 9px;
  padding: 10px 10px;
  .btn-group {
    height: 30px;
    line-height: 30px;
    text-align: right;
    margin-bottom: 7px;
    padding-right: 10px;
    display: flex;
    justify-content: flex-end;
    /deep/ .el-button {
      min-width: 0px;
      border: 0;
      color: var(--DBlue);
      padding: 0;
      &:hover {
        color: var(--JBlue);
        background-color: #fff;
      }
      .icon-shuaxin {
        font-size: 18px;
      }
      .icon-gengduo {
        font-size: 30px;
      }
      .icon-tianjia1,
      .icon-shanchu1 {
        font-size: 17px;
        padding: 0 2px;
      }
    }
    .more-btn {
      margin-left: 10px;
      position: relative;
      .more-btn-group {
        position: absolute;
        top: 28px;
        right: -35px;
        z-index: 10;
        width: 90px;
        height: 0;
        overflow: hidden;
        background-color: #fff;
        box-shadow: 0px 0px 24px 0px rgba(168, 168, 236, 0.22);
        transition: all 0.25s;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        /deep/ .el-button:first-child {
          padding-top: 9px;
        }
        /deep/ .el-button {
          width: 100%;
          color: #333;
          font-size: 12px;
          padding: 6px;
          margin: 0;
          &:hover {
            color: var(--DBlue);
          }
        }
      }
      .triangle-position {
        position: absolute;
        top: 22px;
        left: 10px;
        z-index: 1000;
        border-width: 0 6px 6px;
        border-style: solid;
        border-color: transparent transparent #fff;
        box-shadow: 0px 0px 24px 0px rgba(168, 168, 236, 0.22);
      }
      .is-show {
        height: 126px;
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
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 6.5px 0;
      margin-right: 14px;
      /deep/ .el-image__error {
        font-size: 12px;
      }
      .goods-img {
        width: 55px;
      }
    }
    .right {
      display: flex;
      flex-direction: column;
      justify-content: center;
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
    .ranking-slide {
      margin-left: -40px;
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .ranking-slide-logo {
        width: 88px;
        height: 69px;
      }
      .up-ranking-btn-box {
        display: flex;
        align-items: center;
        margin: 10px 10px 0 0;
        .up-ranking-btn {
          width: 89px;
          height: 30px;
        }
        /deep/ .el-button {
          padding: 0;
        }
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
.deleteGroupDialog-body {
  text-align: center;
  .delete-tips {
    padding: 10px 0;
    line-height: 20px;
  }
  .btn-group {
    padding-top: 30px;
    /deep/ .el-button {
      width: 120px;
      height: 30px;
      padding: 0;
    }
  }
}
</style>