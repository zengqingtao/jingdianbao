<!--运营攻略-->
<template>
  <div class="container">
    <div class="module list" id="list" v-loading="listLoading">
      <div v-if="list.length">
        <ul class="ul-box">
          <li v-for="(item,index) in list" :key="index">
            <a
              :href="item.articleLink"
              class="left"
              target="_blank"
              v-baidu-count="{
                  event: '资讯浏览',
                  value: '运营攻略文章',
                  label: '运营攻略文章'
                }"
            >
              <i class="icon-bg" :style="`background-image:url(${item.imageUrl})`"></i>
            </a>
            <div class="right">
              <a
                class="title --text-mouse-hover"
                :href="item.articleLink"
                target="_blank"
                v-baidu-count="{
                  event: '资讯浏览',
                  value: '运营攻略文章',
                  label: '运营攻略文章'
                }"
              >{{item.articleTitle}}</a>
              <div class="subtitle-box">
                <div class="official-account">
                  <div>微信公众号：</div>
                  <div>京店宝</div>
                </div>
                <div>{{item.createTime}}</div>
              </div>
            </div>
          </li>
        </ul>
        <div class="pagination" v-if="pagination.total>pagination.size">
          <el-pagination
            background
            layout="prev, pager, next"
            prev-text="上一页"
            next-text="下一页"
            :total="pagination.total"
            :current-page="pagination.page"
            @current-change="tablePageChange"
          ></el-pagination>
        </div>
      </div>
      <div class="null-img" v-if="!list.length">
        <img src="../../../assets/images/null.png" v-if="!listLoading" alt />
      </div>
    </div>
  </div>
</template>
<script>
import { strategyList } from "../../../api/information";
export default {
  data() {
    return {
      list: [],
      pagination: {
        page: 1,
        size: 10,
        total: null
      },
      listLoading: false
    };
  },
  created() {
    this.getPageList();
  },
  methods: {
    async getPageList() {
      this.listLoading = true;
      let params = {
        pageNo: this.pagination.page,
        pageSize: this.pagination.size
      };
      const { data: res } = await strategyList({ params });
      this.listLoading = false;
      if (res.code == 200) {
        this.list = res.data.results;
        this.pagination.total = res.data.totalCount;
      }
    },
    tablePageChange(currentPage) {
      this.pagination.page = currentPage;
      this.getPageList();
      document.querySelector("#list").scrollIntoView();
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  height: 100%;
}
.module {
  background-color: #fff;
  height: 100%;
  border-radius: 10px;
  box-shadow: 0px 3px 24px 0px rgba(168, 168, 236, 0.22);
}
.list {
  padding: 20px 20px 16px;
  .ul-box {
    li + li {
      margin-top: 20px;
    }
    li {
      width: 100%;
      height: 106px;
      display: flex;
      border-radius: 10px;
      &:hover {
        background-color: #eef5ff;
        .icon-bg {
          transform: scale(1.1); //背景图片放大1.1倍
        }
      }
      .left {
        display: block;
        border-radius: 10px;
        overflow: hidden;
        .icon-bg {
          display: block;
          width: 249px;
          height: 106px;
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center;
          transition: all 0.2s;
        }
      }
      .right {
        flex: 1;
        padding: 12px 0 23px 21px;
        display: flex;
        flex-flow: column;
        justify-content: space-between;
        .title {
          display: block;
          color: #333;
          line-height: 20px;
          font-size: 16px;
          font-weight: bold;
          padding-right: 50px;
          display: -webkit-box;
          /* ! autoprefixer: off */
          -webkit-box-orient: vertical;
          /* autoprefixer: on */
          -webkit-line-clamp: 2;
          overflow: hidden;
          word-wrap: break-word; //纯字母或者数字可以换行
          word-break: break-all;
        }
        .subtitle-box {
          display: flex;
          color: #999;
          font-size: 14px;
          .official-account {
            display: flex;
            padding-right: 15px;
          }
        }
      }
    }
  }
  .pagination {
    text-align: center;
    margin-top: 20px;
  }
  .null-img {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>