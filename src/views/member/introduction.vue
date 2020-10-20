<template>
  <div class="container">
    <el-carousel
      direction="vertical"
      ref="carousel"
      :initial-index="indicatorIndex"
      :loop="false"
      :autoplay="false"
      @change="changeIndicatorIndex"
    >
      <el-carousel-item name="0">
        <div class="page1">
          <img src="../../assets/images/member/p1.png" alt />
        </div>
      </el-carousel-item>
      <el-carousel-item name="1">
        <div class="page2">
          <img src="../../assets/images/member/p2.png" alt />
        </div>
      </el-carousel-item>

      <el-carousel-item name="2">
        <div class="page3">
          <img src="../../assets/images/member/p3.png" alt />
        </div>
      </el-carousel-item>
      <el-carousel-item name="3">
        <div class="page4">
          <img src="../../assets/images/member/page4.png" alt />
          <div class="btn-group">
            <el-button class="privilege-btn" @click="$router.push('/member/privilege')">特权对比</el-button>
            <el-button class="openMember-btn" @click="checkLogin">开通会员</el-button>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
    <buy-vip
      v-if="showBuyVip"
      :clickType="level==1?2:3"
      :vipLevel="level"
      @closeDialog="showBuyVip = false"
    ></buy-vip>
  </div>
</template>
<script>
import buyVip from "../dialog/buyVip";
import {mapState} from "vuex"
// import { checkLogin } from "../../api/user";
export default {
  data() {
    return {
      animated: 0,
      indicatorIndex: "-1",
      showBuyVip: false,
      level: 1,
      originalScroll: 0,
      num: 0
    };
  },
  components: {
    buyVip
  },
  computed:{
    ...mapState(["isLogin","vipType"])
  },
  mounted() {
    document.addEventListener("DOMMouseScroll", this.scrollFunc, false); //firefox
    window.onmousewheel = document.onmousewheel = this.scrollFunc; //IE/Opera/Chrome
    setTimeout(() => {
      this.indicatorIndex = "0";
    }, 500);
  },
  methods: {
    changeIndicatorIndex(index) {
      this.indicatorIndex = index;
    },
    scrollFunc(e) {
      e = e || window.event;
      this.num++;
      if (e.wheelDelta) {
        //判断浏览器IE，谷歌滑轮事件

        if (e.wheelDelta > 0) {
          // 当滑轮向上滚动时
          this.setActive("prev");
        }
        if (e.wheelDelta < 0) {
          // 当滑轮向下滚动时
          this.setActive("next");
        }
      } else if (e.detail) {
        //Firefox滑轮事件
        if (e.detail > 0) {
          //当滑轮向下滚动时
          this.setActive("next");
        }
        if (e.detail < 0) {
          //当滑轮向上滚动时
          // alert("上滚");
          this.setActive("prev");
        }
      }
    },
    setActive(scroll) {
      if (this.num == 1) {
        if (scroll == "next") {
          this.$refs.carousel.next();
        } else {
          this.$refs.carousel.prev();
        }
        setTimeout(() => {
          this.num = 0;
        }, 500);
      }
    },
    checkLogin() {
      if (this.isLogin) {
        this.level = this.vipType
        this.showBuyVip = true;
      } else {
        this.$store.commit("LOGIN_MODAL_TOGGLE", {
          toggle: true,
          loginType: 2
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../assets/css/animate.min.css";
.container {
  width: 100%;
}
/deep/ .el-carousel,
/deep/ .el-carousel__item,
.page1,
.page2,
.page3,
.page4 {
  height: calc(100vh - 90px);
}
/deep/ .el-carousel__indicator--vertical .el-carousel__button{
  width:17px;
  height:17px;
  border-radius:50%;
  background-color:transparent;
  border:1px solid #fff;
  opacity: 1;
}
/deep/ .el-carousel__indicator.is-active button{
  background-color:#fff;
}
.page1 {
  background: radial-gradient(
      circle,
      rgba(97, 58, 225, 1),
      rgba(32, 12, 119, 1)
    )
    no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 50%;
  }
}
.page2 {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("../../assets/images/member/page2-bg.png");
  img {
    width: 50%;
  }
}
.page3 {
  width: 100%;
  background: radial-gradient(
      circle,
      rgba(97, 58, 225, 1),
      rgba(32, 12, 119, 1)
    )
    no-repeat;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 50%;
  }
}
.page4 {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: radial-gradient(
      circle,
      rgba(97, 58, 225, 1),
      rgba(32, 12, 119, 1)
    )
    no-repeat;
  img {
    width: 50%;
  }
  .btn-group {
    margin-top: 24px;
    margin-right: 6%;
    display: flex;
    justify-content: center;
    /deep/ .el-button + .el-button {
      margin-left: 20px;
    }
    /deep/ .el-button {
      width: 180px;
      height: 46px;
      color: #fff;
      font-size: 18px;
      border-radius: 2px;
    }
    .privilege-btn.el-button {
      border-color: var(--DBlue);
      background-color: var(--DBlue);
    }
    .privilege-btn.el-button:hover {
      border-color: var(--JBlue);
      background-color: var(--JBlue);
    }
    .openMember-btn.el-button {
      border-color: #ccbc4d;
      background-color: #ccbc4d;
    }
    .openMember-btn.el-button:hover {
      border-color: rgb(197, 173, 17);
      background-color: rgb(197, 173, 17);
    }
  }
}
.indicator-box {
  position: fixed;
  top: 50vh;
  right: 24px;
  height: 150px;
  margin-top: -75px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  span {
    width: 17px;
    height: 17px;
    border: 1px solid #fff;
    border-radius: 50%;
    cursor: pointer;
    &.is-active {
      background-color: #fff;
    }
  }
  span + span {
    margin-top: 18px;
  }
}
</style>