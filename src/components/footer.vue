<!--脚步---->
<template>
  <div class="footer" :class="bgColor">
    <div class="footer-content">
      <div class="footer-box">
        <div class="list">
          <div class="list-title">活动资源</div>
          <div class="item">
            <a class="nav" href="https://www.jdyoupinku.com/#/home" target="_blank">带货推广</a>
            <a class="nav" href="https://rqb.jingkejishi.com/#/releaseTask" target="_blank">提升搜索排名</a>
            <a class="nav" href="https://jkjs.jingkejishi.com/#/home" target="_blank">内容营销</a>
            <a class="nav" href="https://ggb.jingkejishi.com/#/home" target="_blank">快车托管</a>
          </div>
        </div>
        <div class="line"></div>
        <div class="list">
          <div class="list-title">行业资讯</div>
          <div class="item">
            <div class="nav" @click="toOperationRule">搜索书生文章</div>
          </div>
        </div>
        <div class="line"></div>
        <div class="list">
          <div class="list-title">友情链接</div>
          <div class="item">
            <a class="nav" :href="amgjUrl" target="_blank">阿明工具</a>
            <a class="nav" :href="wlkbUrl" target="_blank">物流空包</a>
          </div>
        </div>
      </div>
      <div class="customer-service">
        <div>
          <p>京店宝公众号</p>
          <img src="https://yushukeji.oss-cn-shenzhen.aliyuncs.com/jdb_contact_us.jpg?123456" alt />
        </div>
        <div>
          <p>在线客服</p>
          <img :src="bdQrCodeImg" alt />
        </div>
      </div>
    </div>
    <div class="copyright" @click="jump">广州鱼数科技有限公司 | Copyright 2013-2020 yushu Ltd.粤ICP备18057269号-10</div>
  </div>
</template>
<script>
import EventBus from "@/utils/eventBus.js";
import Config from "../config";
import { mapState } from "vuex";
export default {
  name: "appFooter",
  data() {
    return {
      bgColor: "home",
      amgjUrl: "",
      wlkbUrl: ""
    };
  },
  computed: {
    ...mapState(["token", "bdQrCodeImg"])
  },
  created() {
    this.amgjUrl =
      Config.serverUrl +
      "yushu-server/general/redirectMingTool?token=" +
      this.token;
    this.wlkbUrl =
      Config.serverUrl + "yushu-server/general/redirect88?token=" + this.token;
    const path = this.$route.path;
    if (["/login", "/register"].includes(path)) {
      this.bgColor = "login";
    } else {
      this.bgColor = "home";
    }
  },
  methods: {
    toOperationRule() {
      let path = "/information/searchScholars";
      this.$router.push(path);

    },
    jump(){
      window.open("http://beian.miit.gov.cn")
    }
  }
};
</script>
<style lang="scss" scoped>
.home {
  //首页和个人中心时的样式
  background-color: #363a46;
  .line {
    background-color: #f4f4f4;
    opacity: 0.1;
  }
  .list-title {
    color: #d9ddee;
  }
  .item {
    .nav {
      color: #9398b3;
      &:hover {
        color: #d9ddee;
      }
    }
  }
  .customer-service {
    color: #D9DDEE
  }
  .copyright {
    color: #9398B3

  }
}
.login {
  //登录注册时的样式
  background-color: #fff;
  .line {
    background-color: #d3d3d3;
  }
  .list-title {
    color: #333;
  }
  .item {
    .nav {
      color: #333;
      &:hover {
        color: var(--DBlue);
      }
    }
  }
  .customer-service {
    color: #333;
  }
  .copyright {
    color: #666;
  }
}
.footer {
  .footer-content {
    display: flex;
    width: 1200px;
    justify-content: space-between;
    margin: 0 auto;
    .footer-box {
      display: flex;
      justify-content: flex-start;
      padding-top: 26px;
      .line {
        height: 67px;
        width: 1px;
        margin: 0 60px 0 40px;
        align-self: center;
      }
      .list {
        .list-title {
          font-size: 14px;
          font-weight: bold;
          padding-bottom: 14px;
        }
        .item {
          display: flex;
          flex-wrap: wrap;
          width: 220px;
          a,
          .nav {
            width: 50%;
            font-size: 14px;
            margin-bottom: 14px;
          }
          .nav {
            cursor: pointer;
          }
        }
      }
    }
    .customer-service {
      display: flex;
      font-size: 12px;
      padding: 15px 40px 0 0;
      div + div {
        margin-left: 14px;
      }
      div {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        img {
          width: 81px;
          height: 79px;
          display: block;
          margin-top: 5px;
        }
      }
    }
  }
  .copyright {
    font-size: 12px;
    padding: 28px 0 11px 0;
    width: 1200px;
    margin:0 auto;
    text-align: center;
    cursor: pointer;
  }
}
</style>