<!--首页-新功能-->
<template>
  <div class="newFeatur-container">
    <div class="title">新功能</div>
    <ul>
      <li v-for="(item,index) in list" :key="index" :style="`background-image:url(${item.bgImg})`" @click="handleJump(item.path)">
        <div class="icon-box">
          <i class="iconfont" :class="item.icon"></i>
        </div>
        <div class="use-heat">
          {{item.name}}
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import EventBus from "@/utils/eventBus.js";
export default {
  name: "hotFunc",
  data() {
    return {
      list: [
        {
          name: "CPS查询",
          path: "/dataQuery/cps",
          bgImg: require("../../assets/images/home/dark-green.png"),
          icon: "icon-CPS_huaban1",
        },
        {
          name: "行业大盘查询",
          path: "/dataQuery/industryMarket",
          bgImg: require("../../assets/images/home/blue.png"),
          icon: "icon-fenxi",
        },
        {
          name: "直播间监控",
          path: "/dataMonitoring/liveMonitoring",
          bgImg: require("../../assets/images/home/red.png"),
          icon: "icon-zhibojian",
        },
        {
          name: "关键词分析",
          path: "/dataAnalysis/keywords",
          bgImg: require("../../assets/images/home/pink.png"),
          icon: "icon-guanjiancizhuanyi",
        },
        {
          name: "关键词查询",
          path: "/dataQuery/keywords",
          bgImg: require("../../assets/images/home/green.png"),
          icon: "icon-guanjianci",
        }
      ],
    };
  },
  methods: {
    handleJump(path) {
      this.$router.push(path);
    },
  },
};
</script>
<style lang="scss" scoped>
.newFeatur-container {
  height: 140px;
  background-color: #fff;
  box-shadow: 0px 3px 24px 0px rgba(168, 168, 236, 0.22);
  border-radius: 10px;
  margin: 20px 0;
  padding: 14px 9px 14px 10px;
  .title {
    height: 12px;
    padding-left: 9px;
    color: #000;
    font-size: 14px;
    font-weight: bold;
  }
  ul {
    margin-top: 10px;
    display: flex;
    li+li{
        margin-left:15px;
    }
    li {
      width: 146px;
      height: 90px;
      border-radius: 10px;
      box-sizing: border-box;
      padding: 22px 0 16px;
      background-size:100% 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      color:#fff;
      cursor: pointer;
      .icon-box{
        .icon-CPS_huaban1{
          font-size:27px;
        }
        .icon-zhibojian{
          font-size:29px;
        }
        .icon-guanjiancizhuanyi{
          font-size: 25px;
        }
        .icon-guanjianci,.icon-fenxi{
          font-size:26px;
        }
      }
      .use-heat{
        font-size:16px;
        font-weight:bold;
      }
    }
  }
}
</style>