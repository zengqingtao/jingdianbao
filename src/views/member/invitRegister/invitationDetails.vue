<template>
  <div class="container">
    <div class="module">
      <!-- 邀请记录 -->
      <div class="invitation-record">
        <div class="invitation-record-table">
          <div class="title">邀请注册记录</div>
          <el-table :data="invitTable" v-if="invitTable.length" v-loading="invitLoading">
            <el-table-column label="序号">
              <template slot-scope="scope">
                <div>{{scope.$index+1}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="phoneNumber" label="手机号"></el-table-column>
            <el-table-column prop="registerDate" label="注册时间"></el-table-column>
            <el-table-column prop="status" label="通过验证"></el-table-column>
          </el-table>
          <div class="null-img" v-else>
            <div class="content">
              <div class="img-box">
                <img src="../../../assets/images/null.png" alt />
              </div>
              <el-button
                type="primary"
                class="--btn-primary"
                onfocus="this.blur()"
                @click="showShareCode = true"
              >邀请好友注册</el-button>
            </div>
          </div>
        </div>
        <div class="pagination" v-if="invitPagination.total > invitPagination.size">
          <el-pagination
            @current-change="invitChangePage"
            background
            prev-text="上一页"
            next-text="下一页"
            layout="prev, pager, next"
            :total="invitPagination.total"
            :page-size="invitPagination.size"
          ></el-pagination>
        </div>
      </div>
      <!-- 兑换记录 -->
      <div class="invitation-record">
        <div class="invitation-record-table">
          <div class="title">兑换记录</div>
          <el-table :data="exchangeTable" v-if="exchangeTable.length" v-loading="exchangeLoading">
            <el-table-column label="序号">
              <template slot-scope="scope">
                <div>{{scope.$index+1}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="date" label="兑换时间"></el-table-column>
            <el-table-column prop="vipLevel" label="兑换会员"></el-table-column>
            <el-table-column prop="desc" label="自动兑换消耗数"></el-table-column>
          </el-table>
          <div class="null-img" v-else>
            <div class="content">
              <div class="img-box">
                <img src="../../../assets/images/null.png" alt />
              </div>
            </div>
          </div>
        </div>
        <div class="pagination" v-if="exchangePagination.total > exchangePagination.size">
          <el-pagination
            @current-change="exchangeChangePage"
            background
            prev-text="上一页"
            next-text="下一页"
            layout="prev, pager, next"
            :total="exchangePagination.total"
            :page-size="exchangePagination.size"
          ></el-pagination>
        </div>
      </div>
      <share-code v-if="showShareCode" @closeDialog="showShareCode = false"></share-code>
    </div>
  </div>
</template>
<script>
import shareCode from "../../dialog/shareCode";
import {
  listUserInviteConsumeRecord,
  listUserInviteRecord
} from "../../../api/ind";
export default {
  data() {
    return {
      invitPagination: {
        page: 1,
        size: 10,
        total: 0
      },
      invitTable: [],
      exchangePagination: {
        page: 1,
        size: 10,
        total: 0
      },
      exchangeTable: [],
      showShareCode: false,
      invitLoading: false,
      exchangeLoading: false
    };
  },
  components: {
    shareCode
  },
  created() {
     document.scrollingElement.scrollTop = 0; //让页面滚动到最顶部
    this.getInvitData();
    this.getExchangeData();
  },
  methods: {
    async getInvitData() {
      this.invitLoading= true;
      let params = { page: this.invitPagination.page };
      let { data: results } = await listUserInviteRecord({ params });
      this.invitLoading = false;
      if (results.code == 200) {
        this.invitTable = results.data.results;
        this.invitPagination.total = results.data.totalCount;
      }
    },
    invitChangePage(currentPage) {
      this.invitPagination.page = currentPage;
      this.getInvitData();
    },
    async getExchangeData() {
      this.exchangeLoading = true;
      let params = { page: this.exchangePagination.page };
      let { data: results } = await listUserInviteConsumeRecord({ params });
      this.exchangeLoading = false;
      if (results.code === 200) {
        this.exchangeTable = results.data.results;
        this.exchangePagination.total = results.data.totalCount;
      }
    },
    exchangeChangePage(currentPage) {
      this.exchangePagination.page = currentPage;
      this.getExchangeData();
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
  background-color: #fff;
  .module {
    margin-top: 20px;
    width: 1200px;
    .invitation-record {
      width: 100%;
      .invitation-record-table {
        color: #333;
        font-size: 14px;
        .title {
          height: 47px;
          line-height: 47px;
          background-color: #f4f4f4;
          font-size: 16px;
          font-weight: bold;
          padding-left: 20px;
          border: 1px solid #eee;
          border-bottom: 0;
        }
        /deep/ .el-table {
          border: 1px solid #eee;
          border-bottom: 0;
        }
        /deep/ .el-table th {
          font-weight: bold;
        }
        /deep/ .el-table th,
        /deep/ .el-table__row td {
          text-align: center;
        }
        // 暂无数据
        .null-img {
          height: 350px;
          border: 1px solid #eee;
          display: flex;
          justify-content: center;
          align-items: center;
          .img-box {
            text-align: center;
          }
          /deep/ .el-button {
            margin-top: 10px;
          }
        }
      }
      .pagination {
        text-align: center;
        margin-top: 20px;
      }
    }
    .invitation-record + .invitation-record {
      margin-top: 30px;
    }
  }
}
</style>