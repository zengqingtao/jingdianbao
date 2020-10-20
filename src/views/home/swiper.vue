<template>
  <div class="container" v-loading="loading">
    <el-carousel arrow="never" height="198px" :class="bannerList.length<=1?'showInitialIndex':''">
      <el-carousel-item v-for="(item,index) in bannerList" :key="index">
        <a :href="item.link" target="_blank">
          <img class="swiper-img" :src="item.imageUrl" alt />
        </a>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>
<script>
import { getImgsUrl } from "../../api/banner";
export default {
  data() {
    return {
      bannerList: [],
      loading: true
    };
  },
  created() {
    this.getbannerImg();
  },
  methods: {
    async getbannerImg() {
      this.loading = true;
      const { data: res } = await getImgsUrl({ params: { location: 9 } });
      this.loading = false;
      if (res.code === 200) {
        this.bannerList = res.data;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0px 3px 24px 0px rgba(168, 168, 236, 0.22);
}
/deep/ .el-carousel--horizontal {
  overflow-x: hidden;
  overflow-y: hidden;
}
.swiper-img {
  width: 100%;
  height: 100%;
  display: block;
}
// 如果轮播图片只有一张，就不显示指示器
.showInitialIndex {
  /deep/ .el-carousel__indicator--horizontal {
    display: none;
  }
}
</style>