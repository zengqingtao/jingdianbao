<template>
  <div class="function-desc">
    <div class="title">功能说明和疑问解答</div>
    <div class="content ql-snow ql-editor" v-html="content" v-loading="loading"></div>
  </div>
</template>
<script>
import { funDes } from "../api/funDes";
import EventBus from "@/utils/eventBus.js";
export default {
  data() {
    return {
      content: "",
      loading: true,
      menuId: "",
      sideMenu: {
        "/dataQuery/ranking": "1",
        "/dataQuery/salesVolume": "2",
        "/dataQuery/weight": "3",
        "/dataQuery/evaluate": "4",//查留评率
        "/dataQuery/express": "5",
        "/dataQuery/industry": "6",
        "/dataQuery/shop": "7",
        "/dataQuery/singleProduct": "8",
        "/dataQuery/flow": "9",
        "/dataAnalysis/secKill": "10",
        "/dataAnalysis/search": "11",//搜索分析
        "/dataQuery/keywords": "12", //关键词查询
        "/dataQuery/JDInternational": "13",//京东国际查排名
        "/dataAnalysis/keywords": "14", //关键词分析
        "/dataQuery/cps": "15", //cps查询
        "/dataQuery/industryMarket": "16", //行业大盘查询
      },
    };
  },
  watch: {
    "$route.fullPath": {
      handler(value) {
        this.menuId = this.sideMenu[value];
        this.getfunDes();
      },
      immediate: true,
    },
  },
  // created(){
  //   this.getfunDes()
  //   EventBus.$on('change_current_menu',val=>{
  //     this.getfunDes()
  //   })
  // },
  methods: {
    async getfunDes() {
      this.content = "";
      this.loading = true;
      let params = {
        menuId: this.menuId,
      };
      let { data: res } = await funDes({ params });
      this.loading = false;
      if (res.code == 200) {
        this.content = res.data.content;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.function-desc {
  width: 100%;
  margin-top: 10px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 3px 24px 0px rgba(168, 168, 236, 0.22);
  padding: 17px 40px;
  .title {
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    padding-bottom: 14px;
  }
  .content {
    line-height: 24px;
    font-size: 14px; //必须是12px,因为富文本的字体大小单位是em,需要根据父元素的字体大小来缩放
    .ql-editor {
      overflow-y: none !important;
    }
    .list-title {
      font-weight: bold;
      font-size: 14px;
    }
    /deep/ img {
      max-width: 100%;
      cursor: default !important;
    }
  }
}
</style>