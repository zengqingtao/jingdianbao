<!--首页的搜索书生列表-->
<template>
  <div class="container" v-loading="pageLoading">
    <div v-if="list.length>0">
      <div class="head-title-reviewMore">
        <div class="title">搜索书生</div>
        <div class="reviewMore-btn" @click="reviewMore" v-if="isShowMore">
          查看更多
          <i class="el-icon-arrow-right"></i>
        </div>
      </div>
      <div class="list-item" v-for="(item,index) in list" :key="index">
        <a
          class="article-img"
          :href="item.articleLink"
          target="_blank"
          v-baidu-count="{
                  event: '资讯浏览',
                  value: '搜索书生文章',
                  label: '搜索书生文章'
                }"
        >
          <i class="icon-bg" :style="`background-image:url(${item.imageUrl})`"></i>
        </a>
        <div class="article-description">
          <a
            :href="item.articleLink"
            target="_blank"
            class="title --text-mouse-hover"
            v-baidu-count="{
                  event: '资讯浏览',
                  value: '搜索书生文章',
                  label: '搜索书生文章'
                }"
          >{{item.articleTitle}}</a>
          <div class="date">
            <span>微信公众号：搜索书生</span>
            <span>{{item.createTime.split(" ")[0]}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="noData" v-if="list.length==0">暂无数据</div>
  </div>
</template>
<script>
import { getArticleList } from "../../api/information";
import EventBus from "@/utils/eventBus.js";
export default {
  data() {
    return {
      page: 1,
      size: 5,
      list: [],
      queryData: [],
      isShowMore: false,
      pageLoading: true
    };
  },
  created() {
    this.getPageList();
  },
  methods: {
    async getPageList() {
      this.isShowMore = false;
      let params = {
        pageNo: this.page,
        pageSize: this.size
      };
      let { data: res } = await getArticleList({ params });
      if (res.code == 200) {
        this.pageLoading = false;
        this.list = res.data.results;
        if (res.data.totalCount > 5) {
          this.isShowMore = true;
        }
      }
    },
    reviewMore() {
      let path = "/information/searchScholars";
      this.$router.push(path);
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  background-color: #fff;
  width: 470px;
  height: 561px;
  padding: 24px 20px 15px;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 3px 24px 0px rgba(168, 168, 236, 0.22);
  border-radius: 10px;
  .head-title-reviewMore {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 12px;
    .title {
      color: #333;
      font-weight: bold;
      font-size: 14px;
    }
    .reviewMore-btn {
      cursor: pointer;
      color: #666;
      font-size: 12px;
    }
    .reviewMore-btn:hover {
      color: #4d75ff;
    }
  }
  .list-item {
    display: flex;
    margin-top: 20px;
    border-radius: 10px;
    &:hover {
      background-color: #f8f8f8;
      .icon-bg {
        transform: scale(1.1); //背景图片放大1.1倍
      }
    }
    .article-img {
      display: block;
      border-radius: 10px;
      overflow: hidden;
      .icon-bg {
        display: block;
        width: 192px;
        height: 82px;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        transition: all 0.2s;
      }
    }
    .article-description {
      flex: 1;
      padding: 10px 0 0 20px;
      .title {
        width: 210px;
        height: 35px;
        font-size: 14px;
        font-weight: bold;
        line-height: 18px;
        color: #333;
        overflow: hidden;
        display: -webkit-box;
        //下面的注释不能去掉，如果去掉了打包会过滤掉 -webkit-box-orient: vertical;
        /* ! autoprefixer: off */
        -webkit-box-orient: vertical;
        /* autoprefixer: on */
        -webkit-line-clamp: 2;
        word-wrap: break-word;
        word-break: break-all;
      }
      .date {
        width: 218px;
        height: 11px;
        line-height: 18px;
        margin-top: 18px;
        color: #999;
        font-size: 12px;
        padding-right: 10px;
        span:first-child {
          margin-right: 10px;
        }
      }
    }
  }
  .noData {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>