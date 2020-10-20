<!--流量监控-->
<template>
  <div class="flowMonitoring-container">
    <div class="header">
      <div class="left">
        <el-button
          class="--btn-none"
          @click="addFlowMonitorDialogVisible = true"
          >添加商品</el-button
        >
        <monitor-tips :content="monitorTips"></monitor-tips>
      </div>
      <div class="right">
        <el-input
          placeholder="请输入商品sku链接或sku"
          v-model="skuOfSearch"
        ></el-input>
        <el-button class="--btn-none" @click="search">查询</el-button>
      </div>
    </div>
    <!-- 未登录 -->
    <div class="empty-box" v-if="!isLogin">
      <div class="please-to-login-box">
        <div>
          <img class="img" src="../../../assets/images/noData.png" alt />
          <p class="img-title">尚未登录，请先登录</p>
        </div>
        <el-button
          class="btn-primary"
          type="primary"
          @click="toLogin"
          onfocus="this.blur()"
          >去登录</el-button
        >
      </div>
    </div>
    <!-- 已登录，没数据 "-->
    <div
      class="empty-box"
      v-loading="pageLoading"
      v-if="isLogin && tableData.length === 0"
    >
      <div class="noData-box" v-if="!pageLoading">
        <img src="../../../assets/images/null-logo.png" alt />
        <div>你尚未添加流量监控，请添加</div>
      </div>
    </div>
    <div class="table-box" v-if="tableData.length !== 0">
      <el-table :data="tableData">
        <el-table-column label="商品" width="210px">
          <template slot-scope="scope">
            <div class="goods-box">
              <img :src="scope.row.skuImg" alt />
              <div class="right">
                <a
                  class="goods-title"
                  :href="scope.row.skuUrl"
                  target="_blank"
                  onfocus="this.blur()"
                  :title="scope.row.skuTitle"
                  >{{ scope.row.skuTitle }}</a
                >
                <div class="sku">sku:{{ scope.row.skuId }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="上周访客数(sku)" prop="lastWeekVisitors">
        </el-table-column>
        <el-table-column label="上周成交客户数(sku)" prop="lastWeekTurnover">
        </el-table-column>
        <el-table-column label="更新时间" prop="updateTime">
          <template slot-scope="scope">
            <div>{{ scope.row.updateTime || "-" }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div class="operation-box">
              <el-button
                type="primary"
                class="--btn-primary"
                @click="openDetails(scope.row)"
                onfocus="this.blur()"
                >详情</el-button
              >
              <el-button @click="clickCancelMonitor(scope.row)"
                >取消监控</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <add-flow-monitor-dialog
      v-if="addFlowMonitorDialogVisible"
      @closeDialog="addFlowMonitorDialogVisible = false"
      @upGrade="upGrade"
      @addFlowMonitorSuccess="addFlowMonitorSuccess"
    ></add-flow-monitor-dialog>
    <cancel-monitoring
      :dialogTips="cancelMonitoringTips"
      @cancelMonitoring="confirmCancelMonitoring"
      @closeDialog="isShowCancelMonitoring = false"
      v-if="isShowCancelMonitoring"
    ></cancel-monitoring>
    <!-- 权限不够对话框 -->
    <up-grade
      :errorMsg="upGradeTips"
      type="流量监控"
      v-if="isShowUpGrade"
      @closeDialog="isShowUpGrade = false"
    ></up-grade>
  </div>
</template>
<script>
import monitorTips from "../../../components/monitorTips";
import { getFlowMonitorList, cancelFlowMonitor } from "../../../api/monitor";
import addFlowMonitorDialog from "../../dialog/addFlowMonitoring";
import cancelMonitoring from "../../dialog/cancelMonitoring";
import { skuReg } from "../../../utils/common";
import upGrade from "../../dialog/upGrade";
export default {
  data() {
    return {
      skuOfSearch: "",
      monitorTips: [
        { sort: 1, text: "每周星期一更新得到上周的访客数、成交客户数。" },
        { sort: 2, text: "每个月1号更新得到上一个月的访客数、成交客户数。" },
      ],
      tableData: [],
      addFlowMonitorDialogVisible: false,
      cancelMonitoringTips: "确认删除？",
      isShowCancelMonitoring: false,
      cancelMonitorRow: "",
      pageLoading: true,
      isLogin: true,
      upGradeTips: "",
      isShowUpGrade: false,
    };
  },
  components: {
    monitorTips,
    addFlowMonitorDialog,
    cancelMonitoring,
    upGrade,
  },
  mounted() {
    this.getMonitorList();
  },
  methods: {
    async addFlowMonitorSuccess() {
      this.getMonitorList();
      this.addFlowMonitorDialogVisible = false;
    },
    async getMonitorList(sku = "") {
      let { data: res } = sku
        ? await getFlowMonitorList({ params: { sku } })
        : await getFlowMonitorList();
      this.pageLoading = false;
      if (res.code === 200) {
        this.isLogin = true;
        this.tableData = res.data;
      } else if (res.code === 2003) {
        this.isLogin = false;
      } else {
        this.$message.error(res.msg);
      }
    },
    openDetails(row) {
      let url = this.$router.resolve({
        path: "/trend/flowTrend",
        query: {
          trendMonitorId: row.id,
          imgUrl: row.skuImg,
          title: row.skuTitle,
          skuId: row.skuId,
        },
      });
      window.open(url.href);
    },
    clickCancelMonitor(row) {
      this.isShowCancelMonitoring = true;
      this.cancelMonitorRow = row;
    },
    async confirmCancelMonitoring() {
      let params = new FormData();
      params.append("flowMonitorId", this.cancelMonitorRow.id);
      let { data: res } = await cancelFlowMonitor(params);
      this.isShowCancelMonitoring = false;
      console.log(res);
      if (res.code === 200) {
        this.getMonitorList();
      } else {
        this.$message.error(res.msg);
      }
    },
    search() {
      if (skuReg(this.skuOfSearch) || this.skuOfSearch === "") {
        this.getMonitorList(this.skuOfSearch);
      } else {
        this.$message.error("sku输入有误");
      }
    },
    upGrade(upGradeTips) {
      this.upGradeTips = upGradeTips;
      this.isShowUpGrade = true;
    },
    toLogin() {
      this.$store.commit("LOGIN_MODAL_TOGGLE", {
        toggle: true,
        loginType: 2,
      });
    },
  },
};
</script>
<style lang="scss">
.flowMonitoring-container {
  height: 100%;
  .header {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    margin-bottom: 10px;
    box-shadow: 0px 3px 24px 0px rgba(168, 168, 236, 0.22);
    border-radius: 10px;
    /deep/ .el-button {
      width: 90px;
      height: 30px;
      padding: 0;
    }
    .left {
      display: flex;
      align-items: center;
      /deep/ .el-button {
        margin-right: 5px;
      }
    }
    .right {
      display: flex;
      /deep/ .el-input {
        margin-right: 10px;
      }
      /deep/ .el-input,
      /deep/ .el-input__inner {
        width: 200px;
        height: 30px;
      }
    }
  }
  .empty-box {
    height: calc(100% - 70px);
    background-color: #fff;
    box-shadow: 0px 3px 24px 0px rgba(168, 168, 236, 0.22);
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    .please-to-login-box {
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
      .btn-primary {
        width: 130px;
        margin-top: 30px;
      }
      .btn-primary:hover {
        background-color: #3159e4;
      }
    }
    .noData-box {
      text-align: center;
      img {
        width: 92px;
        height: 101px;
        padding-bottom: 10px;
      }
      div {
        color: #999;
        font-size: 14px;
      }
    }
  }
  .table-box {
    height: calc(100% - 70px);
    padding: 20px;
    background-color: #fff;
    box-shadow: 0px 3px 24px 0px rgba(168, 168, 236, 0.22);
    border-radius: 10px;
    /deep/ .el-table {
      border: 1px solid #ebeef5;
      border-bottom: 0;
      .cell {
        text-align: center;
      }
      thead th:first-child {
        .cell {
          text-align: start;
          padding-left: 73px;
        }
      }
      .goods-box {
        display: flex;
        img {
          width: 58px;
          height: 58px;
          cursor: pointer;
        }
        .right {
          padding-left: 5px;
          .goods-title {
            height: 40px;
            line-height: 20px;
            color: #333;
            display: -webkit-box;
            /* ! autoprefixer: off */
            -webkit-box-orient: vertical;
            /* autoprefixer: on */
            -webkit-line-clamp: 2;
            overflow: hidden;
          }
          .goods-title:hover {
            color: #4d75ff;
          }
          .sku {
            text-align: start;
          }
        }
      }
      .operation-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        .el-button {
          width: 65px;
          height: 23px;
          padding: 0;
          font-size: 12px;
        }
        .el-button:last-child {
          margin: 6px 0 0;
          color: #606266;
          background-color: #fff;
          border: 1px solid #dcdfe6;
        }
        .el-button:last-child:hover {
          color: #4d75ff;
          border-color: #4d75ff;
        }
      }
    }
  }
}
</style>