<!--竞品监控-->
<template>
  <div class="container">
    <div class="competitive-box">
      <div class="module">
        <div class="add-goods-search-box">
          <div class="add-goods-box">
            <el-button class="add-btn --btn-none" @click="addGoodsDialog = true">添加商品</el-button>
            <monitor-tips></monitor-tips>
          </div>
          <div class="search-box">
            <el-input v-model="searchSku" placeholder="请输入要查询的SKU"></el-input>
            <el-button class="--btn-none" @click="_getListCompetitorItemMonitors">查询</el-button>
          </div>
        </div>
        <custom-tabs
          :data="groupList"
          name="competitiveMonitor"
          @editSuccess="getGroupList"
          @deleteSuccess="getGroupList"
          @changeTabs="changeTabs"
        ></custom-tabs>
      </div>
      <div v-if="tableData.length">
        <div class="monitoring-list module" v-for="(item,index) in tableData" :key="index">
          <div class="btn-group" v-if="groupId===-1">
            <el-button onfocus="this.blur()" @click="moveToDefaultGroup(item.monitorId)">
              <i class="iconfont icon-tianjia1"></i>
            </el-button>
            <el-button onfocus="this.blur()" @click="clickCancelMonitor(item,'确认删除？')">
              <i class="iconfont icon-shanchu1"></i>
            </el-button>
          </div>
          <div class="btn-group" v-else>
            <el-button @click="reloadMonitor(item,index)" :loading="item.isReloading">
              <i class="iconfont icon-shuaxin" v-if="!item.isReloading"></i>
            </el-button>
            <div class="more-btn" @mouseleave="mouseleave(index)" @mouseenter="mouseenter(index)">
              <el-button onfocus="this.blur()">
                <i class="iconfont icon-gengduo"></i>
              </el-button>
              <div class="more-btn-group">
                <el-button onfocus="this.blur()" @click="setTopClick(item)">{{item.top?'取消置顶':'置顶'}}</el-button>
                <el-button onfocus="this.blur()" @click="clickCancelMonitor(item,'确认删除？')">删除监控</el-button>
                <el-button
                  onfocus="this.blur()"
                  @click="openMoveGroup(item.monitorId,item.skuId)"
                >移动至</el-button>
              </div>
              <div class="triangle"></div>
            </div>
          </div>

          <hr class="gray-hr" />
          <!-- 商品图片等信息 -->
          <div class="goods-info-box">
            <div class="left">
              <img @click="reviewGoods(item.url)" class="goods-img" :src="item.img" alt />
              <div class="sku">sku:{{item.skuId}}</div>
            </div>
            <div class="right">
              <ul>
                <!-- 标题 -->
                <li class="first-title-li">
                  <div class="title-box">
                    <div class="title title-title">标题：</div>
                    <div
                      @click="reviewGoods(item.url)"
                      class="title-content --text-mouse-hover"
                    >{{item.skuName || '-'}}</div>
                  </div>
                  <div class="right-btn-box">
                    <div v-if="item.titleChange === -1">今天无变动</div>
                    <div v-if="item.titleChange === 0">今天有变动</div>
                    <div v-if="item.titleChange > 0">{{item.titleChange}}天前有变化</div>
                    <el-button
                      class="review-btn --btn-primary"
                      type="primary"
                      @click="review('1',item)"
                      onfocus="this.blur()"
                    >查看</el-button>
                  </div>
                </li>
                <!-- 广告语 -->
                <li class="advertising-li" v-if="item.advert&&item.advert.length">
                  <div class="advertising-box">
                    <div class="title advertising-title">广告语：</div>
                    <div class="content">{{item.advert[0]}}</div>
                  </div>
                  <div class="right-btn-box">
                    <div v-if="item.advertChange === -1">今天无变动</div>
                    <div v-if="item.advertChange === 0">今天有变动</div>
                    <div v-if="item.advertChange > 0">{{item.advertChange}}天前有变化</div>
                    <el-button
                      class="review-btn --btn-primary"
                      type="primary"
                      @click="review('2',item)"
                      onfocus="this.blur()"
                    >查看</el-button>
                  </div>
                </li>
                <!-- 促销 -->
                <li
                  v-if="item.promotions && item.promotions.coupons.length ||item.promotions && item.promotions.giftList.length || item.promotions && item.promotions.promotionItemList.length"
                  class="promotion-li"
                >
                  <div class="promotion-box">
                    <div class="title promotion-title">促销：</div>
                    <div class="promotion-content">
                      <div class="promotions" v-if="item.promotions.coupons.length">
                        <div class="coupon-title">满减</div>
                        <div class="coupon-list">
                          <div
                            class="coupon-item"
                            v-for="(coupons,index) in item.promotions.coupons"
                            :key="index"
                          >
                            <div class="type-detail">{{coupons}}</div>
                          </div>
                        </div>
                      </div>
                      <div class="promotions" v-if="item.promotions.giftList.length">
                        <div class="coupon-title">赠品</div>
                        <div class="coupon-list">
                          <div
                            class="coupon-item"
                            v-for="(gift,index) in item.promotions.giftList"
                            :key="index"
                          >
                            <div class="type-detail">
                              <img
                                :src="gift.img"
                                alt
                                width="25"
                                height="25"
                                style="margin-right: 10px;"
                              />
                              {{gift.name}} X {{gift.number}}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="promotions">
                        <div class="coupon-title">促销</div>
                        <div class="coupon-list">
                          <div
                            class="coupon-item"
                            v-for="(promotion,index) in item.promotions.promotionItemList"
                            :key="index"
                          >
                            <div class="type-name">{{promotion.name}}</div>
                            <div class="type-detail">{{promotion.content}}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="right-btn-box">
                    <div v-if="item.titleChange === -1">今天无变动</div>
                    <div v-if="item.titleChange === 0">今天有变动</div>
                    <div v-if="item.titleChange > 0">{{item.titleChange}}天前有变化</div>
                    <el-button
                      class="review-btn --btn-primary"
                      type="primary"
                      @click="review('3',item)"
                      onfocus="this.blur()"
                    >查看</el-button>
                  </div>
                </li>
                <!-- 价格 -->
                <li class="price-li">
                  <div class="price-box">
                    <div class="title price-title">价格：</div>
                    <div class="price-content" v-if="item.price>0">￥{{item.price}}</div>
                    <div class="price-content" v-else>商品已下架</div>
                  </div>
                  <div class="right-btn-box">
                    <div v-if="item.priceChange === -1">今天无变动</div>
                    <div v-if="item.priceChange === 0">今天有变动</div>
                    <div v-if="item.priceChange > 0">{{item.priceChange}}天前有变化</div>
                    <el-button
                      class="review-btn --btn-primary"
                      type="primary"
                      @click="review('4',item)"
                      onfocus="this.blur()"
                    >查看</el-button>
                  </div>
                </li>
                <!-- 评价 -->
                <li class="evaluate-li">
                  <div class="evaluate-box">
                    <div class="title evaluate-title">评价：</div>
                    <div class="evaluate-content">
                      <div class="content-first">
                        <div>
                          <p class="total-evaluate">总评价:</p>
                          <span class="evaluate-num">{{item.commentsNum || 0}}</span>
                        </div>
                        <div>
                          <p class="ignore-evaluate">忽略评价:</p>
                          <span class="evaluate-num">{{item.ignoreCommentsNum || 0}}</span>
                        </div>
                        <div>
                          <p>晒单:</p>
                          <span class="evaluate-num">{{item.picComment || 0}}</span>
                        </div>
                      </div>
                      <div class="content-second">
                        <div>
                          <p class="total-evaluate">好评:</p>
                          <span class="evaluate-num">{{item.goodComment || 0}}</span>
                        </div>
                        <div>
                          <p class="ignore-evaluate">中评:</p>
                          <span class="evaluate-num">{{item.normalComment || 0}}</span>
                        </div>
                        <div>
                          <p>差评:</p>
                          <span class="evaluate-num">{{item.badComment || 0}}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="right-btn-box">
                    <div v-if="item.commentChange === -1">今天无变动</div>
                    <div v-if="item.commentChange === 0">今天有变动</div>
                    <div v-if="item.commentChange > 0">{{item.commentChange}}天前有变化</div>
                    <el-button
                      class="review-btn --btn-primary"
                      type="primary"
                      @click="review('5',item)"
                      onfocus="this.blur()"
                    >查看</el-button>
                  </div>
                </li>
                <!-- 店铺 -->
                <li class="shopName-li" v-if="item.shopName">
                  <div class="title">店铺：</div>
                  <div>{{item.shopName}}</div>
                </li>
                <!-- 添加(时间) -->
                <li class="addTime-li" v-if="item.createTime">
                  <div class="title">添加：</div>
                  <div>{{item.createTime}}</div>
                </li>
                <!-- 更新(时间) -->
                <li class="updateTime-li" v-if="item.updateTime">
                  <div class="title">更新：</div>
                  <div>{{item.updateTime}}</div>
                </li>
              </ul>
              <div class="offShelf-box" v-if="item.price==='-1'">
                <img src="../../../assets/images/dataMonitoring/offShelf.png" alt />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination-box module" v-if="pagination.total>5">
        <el-pagination
          :current-page="pagination.page"
          class="page-limit"
          prev-text="上一页"
          next-text="下一页"
          background
          layout="prev, pager, next"
          @current-change="changeCurrentPage"
          :page-size="pagination.size"
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
      <move-group
        v-if="moveGroupVisible"
        name="competitiveMonitor"
        :groupList="groupList"
        :sku="moveSku"
        :monitorId="moveMonitorId"
        @closeDialog="moveGroupVisible = false"
        @success="moveGroupSuccess"
      ></move-group>
      <add-goods
        v-if="addGoodsDialog"
        @closeDialog="addGoodsDialog = false"
        title="添加竞品"
        @successGetData="_getListCompetitorItemMonitors"
        @upGrade="upGrade"
        :monitor-type="2"
        :groupOptions="groupList"
      ></add-goods>
      <add-keywords
        title="添加关键词"
        :skuId="keywordSkuId"
        @successGetData="_getListCompetitorItemMonitors"
        @upGrade="upGrade"
        v-if="addKeywordsDialog"
        @closeDialog="addKeywordsDialog = false"
      ></add-keywords>
      <add-category
        title="添加类目监控"
        :skuId="checkCatSku"
        v-if="addCategoryDialog"
        @successGetData="_getListCompetitorItemMonitors"
        @upGrade="upGrade"
        @closeDialog="addCategoryDialog = false"
      ></add-category>
      <!-- 权限不够对话框 -->
      <up-grade
        :errorMsg="upGradeTips"
        type="竞品监控"
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
import { checkLogin } from "../../../api/user";
import addGoods from "../../dialog/addGoods";
import addKeywords from "../../dialog/addKeywords";
import addCategory from "../../dialog/addCategory";
import upGrade from "../../dialog/upGrade";
import cancelMonitoring from "../../dialog/cancelMonitoring";
import Sortable from "sortablejs";
import { skuReg, secondToDate } from "@/utils/common";
import Config from "../../../config";
import {
  getListCompetitorItemMonitors,
  cancelMonitor,
  freshMonitor,
  topMonitor,
  listCompetingGroups,
  invalidCompetingMoveToDefault,
} from "../../../api/monitor";
import { mapState } from "vuex";
import customTabs from "../../../components/customTabs";
import monitorTips from "../../../components/monitorTips";
import moveGroup from "../../dialog/moveGroup";
export default {
  data() {
    return {
      reviewId: "",
      reviewItem: "",
      addGoodsDialog: false,
      tableData: [],
      tableLoading: true,
      pagination: {
        page: 1,
        size: 5,
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
      groupList: [],
      moveGroupVisible: false,
      moveSku: "",
      groupId: 0,
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
  created() {
    this.checkLogin();
  },
  methods: {
    async checkLogin() {
      const { data: res } = await checkLogin();
      if (res.code === 200) {
        this.isLogin = true;
        await this.getGroupList();
        this._getListCompetitorItemMonitors();
      } else {
        this.isLogin = false;
      }
    },
    async getGroupList() {
      const { data: res } = await listCompetingGroups();
      if (res.code === 200) {
        this.groupList = res.data;
      } else {
        this.$message.error(res.msg);
      }
    },
    changeTabs(groupId) {
      this.groupId = groupId;
      this.pagination.page = 1;
      this._getListCompetitorItemMonitors();
    },
    openMoveGroup(monitorId, skuId) {
      this.moveMonitorId = monitorId;
      this.moveSku = skuId;
      this.moveGroupVisible = true;
    },
    moveGroupSuccess() {
      if (this.tableData.length === 1 && this.pagination.page > 1) {
        this.pagination.page--;
      }
      this._getListCompetitorItemMonitors();
    },
    async moveToDefaultGroup(monitorId) {
      const params = {
        monitorId: monitorId,
      };
      const { data: res } = await invalidCompetingMoveToDefault({ params });
      switch (res.code) {
        case 200:
          this._getListCompetitorItemMonitors()
          this.$message.success(res.msg || "监控已激活，并添加到默认分组中。");
          break;
        case 8028:
          this.upGradeTips = res.msg;
          this.isShowUpGrade = true;
          break;
        default:
          this.$message.error(res.msg)
      }
    },
    async _getListCompetitorItemMonitors() {
      if (!this.isLogin) return;
      this.tableLoading = true;
      const params = {
        page: this.pagination.page,
        skuId: skuReg(this.searchSku),
        groupId: this.groupId,
      };
      let { data: res } = await getListCompetitorItemMonitors({ params });
      this.tableLoading = false;
      if (res.code === 200) {
        if (!res.data.results.length) {
          this.tableData = [];
          this.pagination.total = 0;
          return;
        }
        this.tableData = res.data.results;
        this.pagination.total = res.data.totalCount;
      } else {
        this.$message.error(res.msg);
      }
    },

    changeCurrentPage(currentPage) {
      this.pagination.page = currentPage;
      this._getListCompetitorItemMonitors();
      document.scrollingElement.scrollTop = 0; //让页面滚动到最顶部
    },
    // 刷新
    async reloadMonitor(item, index) {
      let obj = this.tableData[index];
      obj.isReloading = true;
      this.$set(this.tableData, index, obj);
      let { data: monitorRes } = await freshMonitor({
        skuId: "",
        monitorId: item.id,
      });
      obj.isReloading = false;
      this.$set(this.tableData, index, obj);
      if (monitorRes.code === 200) {
        this._getListCompetitorItemMonitors();
        this.$message.success("刷新成功");
      } else {
        this.$message({ type: "error", message: monitorRes.msg });
      }
    },
    // 删除
    clickCancelMonitor(item, showText = "确认删除？") {
      this.isShowCancelMonitoring = true;
      this.cancelMonitoringTips = showText;
      this.cancelMonitorRow = item;
    },
    async confirmCancelMonitoring() {
      this.isShowCancelMonitoring = false;
      let params = {
        id: this.cancelMonitorRow.id,
        skuId: this.cancelMonitorRow.skuId,
      };
      let { data: res } = await cancelMonitor(params);
      if (res.code === 200) {
        if (this.tableData.length === 1 && this.pagination.page !== 1) {
          this.pagination.page--;
        }
        this._getListCompetitorItemMonitors();
      }
    },
    // 置顶
    async setTopClick(item) {
      const top = item.top === 1 ? 0 : 1;
      const params = { top, skuId: "", monitorId: item.id };
      let { data: topRes } = await topMonitor(params);
      if (topRes.code === 200) {
        this._getListCompetitorItemMonitors();
      }
    },
    toLogin() {
      this.$store.commit("LOGIN_MODAL_TOGGLE", {
        toggle: true,
        loginType: 2,
      });
    },
    // 新标签打开商品
    reviewGoods(url) {
      window.open(url);
    },
    // 查看
    review(id, item) {
      let url = this.$router.resolve({
        path: "/trend/competitiveTrend",
        query: {
          type: id,
          id: item.id,
          img: item.img,
          skuName: item.skuName,
          skuId: item.skuId,
        },
      });
      window.open(url.href);
    },
    // 升级
    upGrade(value) {
      this.upGradeTips = value;
      this.isShowUpGrade = true;
    },
    goToRQB() {
      window.open(Config.rqbUrl);
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
.competitive-box {
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
  margin-top: 10px;
}
.monitoring-list {
  background-color: #fff;
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
        right: -24px;
        z-index: 10;
        width: 75px;
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
        height: 78px;
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
      padding-right: 42px;
      .goods-img {
        width: 141px;
        cursor: pointer;
      }
      .sku {
        color: #999;
        font-size: 14px;
        text-align: center;
        padding: 15px 0;
      }
    }
    .right {
      flex: 1;
      padding-right: 10px;
      position: relative;
      ul {
        li {
          display: flex;
          font-size: 14px;
          color: #333;
          .title {
            font-weight: bold;
          }
        }
        // 标题
        .first-title-li {
          .title-box {
            width: 465px;
            height: 39px;
            line-height: 20px;
            display: flex;
            .title-title {
              width: 42px;
            }
            .title-content {
              flex: 1;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;
              cursor: pointer;
            }
          }
        }
        // 广告语
        .advertising-li {
          margin-top: 24px;
          .advertising-box {
            width: 476px;
            height: 37px;
            line-height: 20px;
            display: flex;
            .advertising-title {
              width: 56px;
            }
            .content {
              flex: 1;
              display: -webkit-box;
              /* ! autoprefixer: off */
              -webkit-box-orient: vertical;
              /* autoprefixer: on */
              -webkit-line-clamp: 2;
              overflow: hidden;
            }
          }
        }
        // 促销
        .promotion-li {
          margin-top: 30px;
          .promotion-box {
            width: 465px;
            display: flex;
            .promotion-title {
              width: 42px;
              height: 20px;
              line-height: 20px;
            }
            .promotion-content {
              flex: 1;
              display: flex;
              flex-flow: column;
              // 满减
              .promotions + .promotions {
                margin-top: 10px;
              }
              .promotions {
                display: flex;
                .coupon-title {
                  width: 35px;
                  height: 20px;
                  line-height: 20px;
                }
                .coupon-list {
                  flex: 1;
                  .coupon-item {
                    display: flex;
                    .type-name {
                      min-width: 20px;
                      height: 20px;
                      line-height: 20px;
                      text-align: center;
                      margin-right: 5px;
                      padding: 0 5px;
                      font-size: 12px;
                      color: var(--DBlue);
                      background-color: #d0dbff;
                    }
                    .type-detail {
                      flex: 1;
                      min-height: 20px;
                      line-height: 20px;
                      display: -webkit-box;
                      /* ! autoprefixer: off */
                      -webkit-box-orient: vertical;
                      /* autoprefixer: on */
                      -webkit-line-clamp: 2;
                      overflow: hidden;
                    }
                  }
                  .coupon-item + .coupon-item {
                    margin-top: 5px;
                  }
                }
              }
            }
          }
        }
        // 价格
        .price-li {
          margin-top: 30px;
          .price-box {
            display: flex;
          }
        }
        //评价
        .evaluate-li {
          margin-top: 20px;
          .evaluate-box {
            width: 476px;
            display: flex;
            .evaluate-title {
              width: 42px;
              line-height: 20px;
            }
            .evaluate-content {
              flex: 1;
              height: 40px;
              line-height: 20px;
              .content-first,
              .content-second {
                display: flex;
                div {
                  width: 140px;
                  padding-right: 5px;
                  display: flex;
                  .evaluate-num {
                    color: var(--DBlue);
                  }
                  .total-evaluate {
                    width: 46px;
                    text-align: right;
                  }
                  .ignore-evaluate {
                    width: 62px;
                    text-align: right;
                  }
                }
              }
            }
          }
        }
        .shopName-li {
          padding-top: 18px;
        }
        // 店铺/添加/更新
        .shopName-li,
        .addTime-li,
        .updateTime-li {
          line-height: 25px;
        }
        .right-btn-box {
          height: 26px;
          line-height: 26px;
          flex: 1;
          display: flex;
          justify-content: flex-end;
          .review-btn {
            margin-left: 10px;
          }
          /deep/ .el-button {
            width: 48px;
            height: 26px;
            padding: 0;
          }
        }
      }
      .offShelf-box {
        position: absolute;
        top: -3px;
        left: 425px;
        img {
          width: 82px;
          height: 73px;
          opacity: 0.5;
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
  align-items: center;
  flex-direction: column;
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