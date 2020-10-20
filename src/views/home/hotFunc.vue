<!--首页-热门功能-->
<template>
  <div class="hotFeatur-container">
    <div class="title">热门功能</div>
    <ul>
      <li v-for="(item,index) in list" :key="index" :style="`background-image:url(${item.bgImg})`" @click="handleJump(item.path)">
        <div class="name-icon-box">
          <span class="name">{{item.name}}</span> 
          <i class="iconfont" :class="item.icon"></i>
        </div>
        <div class="use-heat">
          <span>{{useUserNum[index]}}</span>
          <span>使用热度</span>  
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import EventBus from "@/utils/eventBus.js";
import { userNum } from "../../api/funDes";
export default {
  name: "hotFunc",
  data() {
    return {
      list: [
        {
          name: "查排名",
          path: "/dataQuery/ranking",
          bgImg: require("../../assets/images/dataMonitoring/l1.png"),
          icon: "icon-paiming",
        },
        {
          name: "查销量",
          path: "/dataQuery/salesVolume",
          bgImg: require("../../assets/images/dataMonitoring/l2.png"),
          icon: "icon-xiaoliang1",
        },
        {
          name: "快车排名",
          path: "/dataQuery/express",
          bgImg: require("../../assets/images/dataMonitoring/l3.png"),
          icon: "icon-xiaoliang",
        },
        {
          name: "排名监控",
          path: "/dataMonitoring/rankingMonitoring",
          bgImg: require("../../assets/images/dataMonitoring/l4.png"),
          icon: "icon-paimingjiankong1",
        },
        {
          name: "竞品监控",
          path: "/dataMonitoring/competitiveMonitoring",
          bgImg: require("../../assets/images/dataMonitoring/l6.png"),
          icon: "icon-jingpinjiankong1",
        },
      ],
      useUserNum: [],
    };
  },
  mounted() {
    this.getUseUserNum();
  },
  methods: {
    async getUseUserNum() {
      //获取功能的使用用户数
      let params = {
        //查询功能代号，多个用逗号隔开： 1查排名，2查快车，3查销量，4查留评，5秒杀分析，6查行业，7查店铺，8查单品，9查流量，10查权重，11搜索分析，17排名监控，18竞品监控，19删评监
        ids: "1,2,3,17,18",
      };
      const { data: res } = await userNum({ params });
      if (res.code === 200 && res.data) {
        let arr = [];
        res.data.forEach((item) => {
          let i = 0;
          switch (item.id) {
            case 1:
              i = 0;
              break;
            case 2:
              i = 2;
              break;
            case 3:
              i = 1;
              break;
            case 17:
              i = 3;
              break;
            case 18:
              i = 4;
              break;
          }
          arr[i] = item.number;
        });
        this.useUserNum = arr;
      }
    },
    handleJump(path) {
      this.$router.push(path);
    },
  },
};
</script>
<style lang="scss" scoped>
.hotFeatur-container {
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
      padding: 10px 0 18px 10px;
      background-size:100% 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color:#fff;
      cursor: pointer;
      .name-icon-box{
        display: flex;
        justify-content: space-between;
        padding:0 17px 0 10px;
        .name{
          font-size:14px;
          padding-top:5px;
        }
        .icon-paiming{
          font-size:25px;
        }
        .icon-xiaoliang1{
          font-size:20px;
        }
        .icon-xiaoliang{
          font-size: 24px;
        }
        .icon-paimingjiankong1{
          font-size:24px;
        }
        .icon-shanpingjiankong_huaban1-01{
          font-size:24px;
        }
        .icon-jingpinjiankong1{
          font-size:25px;
        }
      }
      .use-heat{
        span:first-child{
          font-size: 18px;
          font-weight: bold;
        }
        span:last-child{
          font-size: 14px;
        }
      }
    }
  }
}
</style>