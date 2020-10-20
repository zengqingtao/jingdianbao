<template>
  <div class="sliderBar">
    <el-col>
      <el-menu
        :default-active="activePath"
        class="el-menu-vertical-demo"
        @select="handleSelect"
        :router="true"
      >
        <div v-for="(item, index) in sideMenu" :key="index">
          <el-menu-item
            :index="item.path=='/member'?'':item.path"
            @click="selectMenuItem(item.path)"
            onfocus="this.blur()"
            v-if="!item.children"
            class="custom-first"
          >
            <i v-if="item.icon" :class="item.icon"></i>
            <span v-if="item.name&&item.name!=='消息通知'" slot="title">{{item.name}}</span>
            <span v-if="item.name&&item.name==='消息通知'" slot="title" class="message-item-content">
              <span>{{item.name}}</span>
              <span class="point" v-if="messageInfo.active||messageInfo.system"></span>
            </span>
          </el-menu-item>
          <el-submenu v-if="item.children" :index="item.path" :key="index">
            <template slot="title">
              <i v-if="item && item.icon" :class="item.icon"></i>
              <span v-if="item && item.name">{{item.name}}</span>
            </template>
            <el-menu-item-group v-for="(sub,index) in item.children" :key="index">
              <el-menu-item :index="item.path+sub.path">{{sub.name}}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </div>
      </el-menu>
    </el-col>
  </div>
</template>
<script>
import EventBus from "@/utils/eventBus.js";
import { mapState } from "vuex";
export default {
  name: "",
  data() {
    return {
      activePath: "/personal",
      sideMenu: [
        {
          name: "个人资料",
          icon: "iconfont icon-gerenziyuan",
          path: "/personal"
        },
        {
          name: "VIP会员",
          icon: "iconfont icon-VIP",
          path: "/member"
        },
        {
          name: "账户余额",
          icon: "iconfont icon-zhanghuyue",
          path: "/personal/accountBalance"
        },
        {
          name: "京币余额",
          icon: "iconfont icon-jingbiyue",
          path: "/personal/jingCurrency"
        },
        {
          name: "消息通知",
          icon: "iconfont icon-xiaoxi",
          path: "/personal/message"
        }
      ]
    };
  },
  computed: {
    ...mapState(["messageInfo"])
  },
  watch: {
    "$route.fullPath": {
      handler(value) {
        this.activePath = this.$route.path;
        document.scrollingElement.scrollTop = 0; //让页面滚动到最顶部
      },
      immediate: true
    }
  },
  methods: {
    selectMenuItem(path) {
      if (path == "/member") {
        let { href } = this.$router.resolve({
          path: "/member"
        });
        window.open(href, "_blank");
      }
    },
    handleSelect(key, keyPath) {
      document.scrollingElement.scrollTop = 0; //让页面滚动到最顶部
      if (keyPath[0] === "/member") {
        let { href } = this.$router.resolve({
          path: "/member"
        });
        window.open(href, "_blank");
      }
    },
    // handleChange(id) {
    //   console.log("21435686")
    //   if (id) {
    //     this.$store.commit("CHANGE_MENUID", id);
    //     EventBus.$emit("change_current_menu", id);
    //   }
    // }
  }
};
</script>
<style lang="scss" scoped>
.sliderBar {
  width: 234px;
  margin-right: 10px;
  background-color: #fff;
  box-shadow:0px 3px 24px 0px rgba(168,168,236,0.22);
  border-radius: 10px;
  // height: calc(100vh - 90px);
  overflow-x: hidden;
  overflow-y: auto;
  .custom-first {
    font-weight: bold;
  }
  .el-col {
    border: none;
    width: 234px;
    padding: 23px 24px 10px 12px;
    /deep/ .el-submenu__title {
      font-weight: bold;
    }
    /deep/ .el-menu {
      border-right: 0;
    }
    /deep/ .el-submenu__title:focus,
    /deep/ .el-submenu__title:hover,
    /deep/ .el-menu-item:focus,
    /deep/ .el-menu-item:hover {
      color: #4d75ff;
      background-color: #fff;
    }
    /deep/ .el-icon-arrow-down:before {
      content: "\E6DF";
      font-weight: 1000;
      color: #333;
    }
    .el-menu-item-group__title {
      padding: 0 !important;
    }
    /deep/ .el-submenu__title,
    /deep/ .el-menu-item {
      height:34px;
      line-height: 34px;
      margin:10px 0;
      border-radius: 6px;
    }
    /deep/ .el-submenu .el-menu-item {
      height: 34px !important;
      line-height: 34px !important;
    }
    /deep/ .el-menu-item {
      &.is-active {
        background-color: #e5f1ff !important;
      }
    }
    .message-item-content {
      position: relative;
      .point {
        position: absolute;
        top:-1px;
        right:-5px;
        width: 8px;
        height: 8px;
        background-color: #f00;
        border-radius: 50%;
      }
    }
  }
  .el-submenu {
    width: 100%;
  }

  .custom-first i,
  .el-submenu__title i {
    color: #4d75ff;
  }
  .icon-shouye1 {
    font-size: 12px;
  }
  .icon-shujuchaxun {
    font-size: 14px;
  }
  .icon-shujufenxi {
    font-size: 12px;
  }
  .icon-jiankong {
    font-size: 18px;
  }
  .icon-zixun {
    font-size: 14px;
  }
}
</style>
<style lang="scss">
.el-menu-item-group__title {
  padding: 0;
}
</style>