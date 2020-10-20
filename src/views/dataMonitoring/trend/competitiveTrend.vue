<template>
  <div class="container">
    <div class="module">
      <!-- 导航 -->
      <div class="header-nav">
        <div class="--text-mouse-hover" @click="toHome">京店宝首页</div>
        <i class="iconfont icon-iconfonti"></i>
        <div class="--text-mouse-hover" @click="togglePage">竞品监控</div>
        <i class="iconfont icon-iconfonti"></i>
        <div class="--text-mouse-hover">竞品信息</div>
      </div>
      <div class="goods-info-box">
        <div class="left">
          <img class="goods-img" :src="goodsInfo.img" />
        </div>
        <div class="right">
          <div class="goods-title">
            <span>{{goodsInfo.skuName}}</span>
          </div>
          <div class="goods-sku">sku：{{goodsInfo.skuId}}</div>
        </div>
      </div>
    </div>
    <div class="module btn-group">
      <div :class="activeRadio=='1'?'is-active':''" @click="getMonitorData('1')">标题</div>
      <div :class="activeRadio=='2'?'is-active':''" @click="getMonitorData('2')">广告语</div>
      <div :class="activeRadio=='3'?'is-active':''" @click="getMonitorData('3')">促销</div>
      <div :class="activeRadio=='4'?'is-active':''" @click="getMonitorData('4')">价格</div>
      <div :class="activeRadio=='5'?'is-active':''" @click="getMonitorData('5')">评价</div>
    </div>
    <div class="module table">
      <!-- 标题 -->
      <div v-if="monitorType==='1'">
        <el-table :data="monitorData">
          <el-table-column label="标题" key="1">
            <template slot-scope="scope">
              <div>{{scope.row.indicator}}</div>
            </template>
          </el-table-column>
          <el-table-column label="使用时期" key="2">
            <template slot-scope="scope">
              <div>
                从
                <span>{{scope.row.startTime}}</span> 到
                <span>{{scope.row.endTime}}</span>
              </div>
              <div>
                持续
                <span>{{scope.row.days}}</span>天
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 广告语 -->
      <div v-if="monitorType==='2'">
        <el-table :data="monitorData">
          <el-table-column prop="indicator" label="广告语" key="3"></el-table-column>
          <el-table-column label="使用时期" key="4">
            <template slot-scope="scope">
              <div>
                从
                <span>{{scope.row.startTime}}</span> 到
                <span>{{scope.row.endTime}}</span>
              </div>
              <div>
                持续
                <span>{{scope.row.days}}</span>天
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 促销 -->
      <div v-if="monitorType==='3'">
        <el-table :data="monitorData">
          <el-table-column label="促销" key="5">
            <template slot-scope="scope">
              <div v-if="scope.row.indicator.length">
                <div class="promotion" v-for="(row,index) in scope.row.indicator" :key="index">
                  <div class="promotion-title">{{row.name}}</div>
                  <div class="promoton-content">{{row.content}}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="使用时期" key="6">
            <template slot-scope="scope">
              <div>
                <div>
                  从
                  <span>{{scope.row.startTime}}</span> 到
                  <span>{{scope.row.endTime}}</span>
                </div>
                <div>
                  持续
                  <span>{{scope.row.days}}</span>天
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 价格 -->
      <div v-if="monitorType==='4'">
        <el-table :data="monitorData">
          <el-table-column prop="indicator" label="价格" key="7"></el-table-column>
          <el-table-column label="使用时期" key="8">
            <template slot-scope="scope">
              <div>
                从
                <span>{{scope.row.startTime}}</span> 到
                <span>{{scope.row.endTime}}</span>
              </div>
              <div>
                持续
                <span>{{scope.row.days}}</span>天
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 评价 -->
      <div v-if="monitorType==='5'">
        <competitive-evaluate :monitorId="goodsInfo.id"></competitive-evaluate>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getMonitorTitleData,
  getMonitorAdvertData,
  getMonitorPriceData,
  getMonitorPromotionsData
} from "../../../api/monitor";
import competitiveEvaluate from "./competitiveEvaluate";
export default {
  data() {
    return {
      monitorData: [],
      goodsInfo: {
        id: 0,
        img: "",
        skuName: "",
        skuId: 0
      },
      activeRadio: "1",
      monitorType: ""
    };
  },
  components: {
    competitiveEvaluate
  },
  created() {
    this.activeRadio = this.$route.query.type;
    this.goodsInfo.id = this.$route.query.id; //监控类型  1:标题 2:广告语 3.促销 4.价格 5.评价
    this.goodsInfo.img = this.$route.query.img;
    this.goodsInfo.skuName = this.$route.query.skuName;
    this.goodsInfo.skuId = this.$route.query.skuId;
    this.getMonitorData(this.activeRadio);
  },
  methods: {
    async getMonitorData(type) {
      this.activeRadio = type;
      if (type == "5") return (this.monitorType = "5");
      const apiJson = {
        1: getMonitorTitleData,
        2: getMonitorAdvertData,
        3: getMonitorPromotionsData,
        4: getMonitorPriceData
      };
      const params = { id: this.goodsInfo.id };
      let { data: res } = await apiJson[type]({ params });
      this.monitorType = type;
      if (res.code === 200) {
        this.monitorData = [];
        this.monitorData = res.data;
      }
    },
    toHome() {
      let path = "/home";
      this.$router.push(path);
    },
    togglePage() {
      this.$router.push("/dataMonitoring/competitiveMonitoring");
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}
.module {
  background-color: #fff;
  box-shadow: 0px 3px 24px 0px rgba(168, 168, 236, 0.22);
  border-radius: 10px;
  overflow: hidden;
}
.header-nav {
  height: 30px;
  background-color: #f4f4f4;
  display: flex;
  align-items: center;
  padding-left: 10px;
  font-size: 14px;
  color: #333;
  div {
    cursor: pointer;
  }
}
.goods-info-box {
  display: flex;
  padding: 20px 0 14px 10px;
  .left {
    width: 70px;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 14px;
    /deep/ .el-image__error {
      font-size: 12px;
    }
    .goods-img {
      width: 55px;
      height: 57px;
    }
  }
  .right {
    .goods-title {
      display: block;
      width: 452px;
      height: 37px;
      line-height: 20px;
      font-size: 14px;
      color: #333;
      display: -webkit-box;
      /* ! autoprefixer: off */
      -webkit-box-orient: vertical;
      /* autoprefixer: on */
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
    .goods-sku {
      color: #999;
      font-size: 14px;
      margin-top: 14px;
    }
  }
}
.btn-group {
  margin: 10px 0;
  padding-left: 10px;
  height: 50px;
  line-height: 50px;
  display: flex;
  font-size: 16px;
  color: #666;
  div + div {
    margin-left: 20px;
  }
  div {
    cursor: pointer;
    &:hover {
      color: var(--DBlue);
    }
  }
  .is-active {
    color: #333;
    font-weight: bold;
  }
}
.table {
  flex: 1;
  padding: 20px 10px;
  margin-bottom: 28px;
  /deep/ .el-table {
    border: 1px solid #eee;
    border-bottom: 0;
  }
  /deep/ .el-table th,
  /deep/ .el-table__row td {
    text-align: center;
  }
  // 促销
  .promotion {
    display: flex;
    .promotion-title {
      color: var(--DBlue);
      min-width: 42px;
      height: 20px;
      line-height: 20px;
      padding: 0 5px;
      margin-right: 5px;
      background-color: #d0dbff;
    }
  }
}
</style>