<template>
  <div class="container">
    <el-col>
      <el-menu
        :default-openeds="defaultOpends"
        :default-active="activePath"
        unique-opened
        class="el-menu-vertical-demo"
        @select="handleSelect"
        :router="true"
      >
        <div v-for="(item, index) in sideMenu" :key="index">
          <el-menu-item :index="item.path" v-if="!item.children" class="custom-first">
            <i v-if="item.icon" :class="item.icon"></i>
            <span v-if="item.name" slot="title">{{item.name}}</span>
          </el-menu-item>

          <el-submenu v-else :index="item.path" :key="index">
            <template slot="title">
              <i v-if="item && item.icon" :class="item.icon"></i>
              <span v-if="item && item.name">{{item.name}}</span>
            </template>
            <el-menu-item-group v-for="(sub,index) in item.children" :key="index">
              <el-menu-item :index="item.path+sub.path" v-if="sub.name!=='搜索指数榜'">{{sub.name}}</el-menu-item>
              <el-menu-item
                :index="item.path+sub.path"
                v-else
                v-baidu-count="{
                  event: '资讯浏览',
                  value: '搜索指数榜',
                  label: '搜索指数榜'
                }"
              >{{sub.name}}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </div>
      </el-menu>
    </el-col>
  </div>
</template>
<script>
import EventBus from "@/utils/eventBus.js";
export default {
  name: "sliderBar",
  data() {
    return {
      activePath: "/home",
      defaultOpends: ["/dataQuery"],
      sideMenu: [
        {
          name: "首页",
          icon: "iconfont icon-shouye1",
          path: "/home"
        },
        {
          name: "数据查询",
          icon: "iconfont icon-shujuchaxun",
          path: "/dataQuery",
          children: [
            {
              name: "查排名",
              path: "/ranking"
            },
            // {
            //   name: "京东国际",
            //   path: "/JDInternational"
            // },
            {
              name: "查销量",
              path: "/salesVolume"
            },
            {
              name: "查权重",
              path: "/weight"
            },
            {
              name: "cps查询",
              path: "/cps"
            },
            {
              name: "快车排名",
              path: "/express"
            },
            {
              name: "查行业",
              path: "/industry"
            },
            {
              name: "查店铺",
              path: "/shop"
            },
            {
              name: "查单品",
              path: "/singleProduct"
            },
            {
              name: "查流量",
              path: "/flow"
            },
            {
              name: "查留评率",
              path: "/evaluate"
            },
            {
              name: "关键词查询",
              path: "/keywords"
            },
            {
              name: "行业大盘查询",
              path: "/industryMarket"
            }
          ]
        },
        {
          name: "数据分析",
          icon: "iconfont icon-shujufenxi",
          path: "/dataAnalysis",
          children: [
            {
              name: "秒杀分析",
              path: "/secKill"
            },
            {
              name: "搜索分析",
              path: "/search"
            },
            {
              name: "关键词分析",
              path: "/keywords"
            }
          ]
        },
        {
          name: "数据监控",
          icon: "iconfont icon-jiankong",
          path: "/dataMonitoring",
          children: [
            {
              name: "排名监控",
              path: "/rankingMonitoring"
            },
            {
              name: "竞品监控",
              path: "/competitiveMonitoring"
            },
            // 停用
            // {
            //   name: "删评监控",
            //   path: "/delCommentMonitoring"
            // },
            {
              name: "直播监控",
              path: "/liveMonitoring"
            },
            {
              name: "流量监控",
              path: "/flowMonitoring"
            }
          ]
        },
        {
          name: "资讯",
          icon: "iconfont icon-zixun",
          path: "/information",
          children: [
            // 停用
            // {
            //   name: "搜索指数榜",
            //   path: "/searchIndexList"
            // },
            {
              name: "运营攻略",
              path: "/operationStrategy"
            },
            {
              name: "搜索书生",
              path: "/searchScholars"
            }
          ]
        },
        {
          name: "实用工具",
          icon: "iconfont icon-gongju",
          path: "/utilityTool"
        }
      ]
    };
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
    handleSelect(key, keyPath) {
      document.scrollingElement.scrollTop = 0; //让页面滚动到最顶部
    },
  }
};
</script>
<style lang="scss" scoped>
.container {
  margin-right: 10px;
  background-color: #fff;
  overflow-x: hidden;
  overflow-y: auto;
  box-shadow: 0px 3px 24px 0px rgba(168, 168, 236, 0.22);
  border-radius: 10px;
  .custom-first {
    font-weight: bold;
  }
  .el-col {
    border: none;
    padding: 24px 12px 14px;
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
    /deep/ .el-menu-item-group__title {
      padding: 0 !important;
    }
    /deep/ .el-submenu__title,
    /deep/ .el-menu-item,
    /deep/ .el-submenu .el-menu-item {
      height: 34px !important;
      line-height: 34px !important;
      border-radius: 6px;
    }
    /deep/ .el-submenu__title,
    /deep/ .el-menu-item {
      color: #333;
      margin: 3px 0;
    }
    /deep/ .el-submenu .el-menu-item {
      color: #666;
    }
    /deep/ .el-menu-item {
      &.is-active {
        background-color: #e5f1ff !important;
        color: var(--DBlue);
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
  .iconfont {
    font-size: 14px;
  }
  .icon-jiankong {
    font-size: 18px;
  }
  .icon-zixun {
    font-size: 16px;
  }
}
</style>
<style lang="scss">
.el-menu-item-group__title {
  padding: 0;
}
</style>