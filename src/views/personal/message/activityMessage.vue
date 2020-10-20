<template>
  <div class="container">
    <div class="msg-box" v-loading="msgLoading" v-if="msgLoading||messageList.length">
      <div class="msg-item" v-for="(item,index) in messageList" :key="index">
        <div class="result">
          <span class="title">采纳结果：</span>
          <span>{{item.content}}</span>
        </div>
        <div class="result">
          <span class="title">回复内容：</span>
          <span>{{item.authContent}}</span>
        </div>
        <div class="content-time-box">
          <div class="time-box">
            <div>{{item.title}}</div>
            <div class="time">{{item.authTime}}</div>
          </div>
          <div class="content">{{item.contentDetail}}</div>
        </div>
      </div>
      <div class="pagination">
        <el-pagination
          v-if="pagination.total > 5"
          background
          layout="prev, pager, next"
          :page-size="pagination.size"
          :total="pagination.total"
          @current-change="changePage"
        ></el-pagination>
      </div>
    </div>
    <div class="null-img" v-else>
      <img src="../../../assets/images/null.png" alt />
    </div>
  </div>
</template>
<script>
import { getFeedbackShowList } from "../../../api/feedback";
export default {
  data() {
    return {
      time: "",
      msgLoading: true,
      messageList: [],
      pagination: {
        page: 1,
        size: 5,
        total: 0
      }
    };
  },
  created() {
    this.getAdminMessage();
  },
  methods: {
    async getAdminMessage() {
      const params = {
        page: this.pagination.page,
        type: 1,
        version: 0,
        time: this.time
      };
      this.msgLoading = true;
      let { data: res } = await getFeedbackShowList({ params });
      this.msgLoading = false;
      if (res.code == 200) {
        this.time = res.data.time;
        this.messageList = res.data.pageResponse.results;
        this.pagination.total = res.data.pageResponse.totalCount;
      } else {
        this.$message.error(res.msg);
      }
    },
    changePage(currentPage) {
      this.pagination.page = currentPage;
      this.getAdminMessage();
    }
  }
};
</script>
<style lang="scss" scope>
.container {
  .msg-box {
    height: calc(100% - 50px);
    .msg-item + .msg-item {
      margin-top: 40px;
    }
    .msg-item {
      color: #333;
      font-size: 14px;
      .result {
        line-height: 25px;
        .title {
          color: #999;
        }
      }
      .content-time-box {
        background-color: #f4f4f4;
        margin-top: 5px;
        padding: 12px 16px 19px 16px;
        .time-box {
          display: flex;
          .time {
            margin-left: 30px;
          }
        }
        .content {
          margin-top: 12px;
          line-height: 20px;
        }
      }
    }
    .pagination {
      text-align: center;
      margin-top: 20px;
    }
  }
  .null-img {
    width: 100%;
    height: calc(100% - 50px);
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>