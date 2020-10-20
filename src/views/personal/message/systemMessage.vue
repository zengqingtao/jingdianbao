<template>
  <div class="container">
    <div class="msg-list" v-loading="msgLoading" v-if="msgLoading||messageList.length">
      <div
        class="msg-item"
        :class="{'is-old':!item.new}"
        v-for="(item,index) in messageList"
        :key="index"
      >
        <div class="msg-content">{{item.content}}</div>
        <div class="msg-img-box" v-if="item.images.length">
          <img v-for="(img,i) in item.images" :key="i" :src="img" alt @click="clickPreviewImg(img)" />
        </div>
        <div class="msg-time">{{item.authTime}}</div>
        <div v-if="item.targetUrl" class="review-box">
          <a class="review-a" target="_blank" :href="item.targetUrl">
            查看详情
            <i class="el-icon-d-arrow-right"></i>
          </a>
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
    <transition name="el-fade-in-linear">
      <preview-img-modal
        v-if="previewImgSrc"
        @closeModal="previewImgSrc = ''"
        :img-src="previewImgSrc"
      ></preview-img-modal>
    </transition>
  </div>
</template>
<script>
import { getFeedbackShowList } from "../../../api/feedback";
import previewImgModal from "../../../components/previewImgModal";
export default {
  data() {
    return {
      messageList: [],
      pagination: {
        page: 1,
        size: 5,
        total: 0
      },
      time: "",
      msgLoading: true,
      previewImgSrc: ""
    };
  },
  components: {
    previewImgModal
  },
  created() {
    this.getAdminMessage();
  },
  methods: {
    async getAdminMessage() {
      const params = {
        page: this.pagination.page,
        type: 2,
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
    },
    clickPreviewImg(img) {
      this.previewImgSrc = img;
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  margin-top: 20px;
}
.msg-list {
  height: calc(100% - 50px);
  .msg-item + .msg-item {
    margin-top: 10px;
  }
  .msg-item {
    padding: 19px 14px 10px 14px;
    background-color: #f4f4f4;
    color: #333;
    font-size: 14px;
    .msg-content {
      line-height: 20px;
      margin-bottom: 6px;
    }
    .msg-img-box {
      display: flex;
      flex-flow: wrap;
      margin-top: 6px;
      img {
        width: 86px;
        height: 86px;
        margin: 0 6px 6px 0;
        cursor: pointer;
      }
    }
    .review-box {
      margin-top: 14px;
      .review-a {
        color: var(--DBlue);
        font-size: 12px;
      }
      .review-a:hover {
        color: var(--JBlue);
      }
    }
    .msg-time {
      color: #666;
      font-size: 12px;
    }
  }
  .pagination {
    margin-top: 20px;
    text-align: center;
  }
}
.null-img {
  width: 100%;
  height: calc(100% - 50px);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>