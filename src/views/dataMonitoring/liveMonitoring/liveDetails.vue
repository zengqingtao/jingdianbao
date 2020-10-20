<!--直播详情/汇总数据-->
<template>
  <div class="container">
    <div class="head-box" v-if="type==='1'">
      <img :src="liveLogo" alt />
      <div class="title-time-box">
        <div class="title">{{liveInfo.title}}</div>
        <div class="advertising">{{liveInfo.content}}</div>
        <div class="time">直播时间：{{liveInfo.startTime}}~{{liveInfo.endTime}}</div>
      </div>
    </div>
    <div class="summaryData-box" v-if="type==='2'">
      <span>统计时间：{{liveInfo.startTime}} ~ {{liveInfo.endTime}}</span>
      <span>统计直播场次：{{liveInfo.liveStatistics.liveCount}}</span>
    </div>
    <!-- 直播详情 -->
    <ul v-if="type=== '1'">
      <li class="li1">
        <div>
          <span>观看人次</span>
          <i class="iconfont icon-guankanrenshu"></i>
        </div>
        <div>{{liveInfo.liveInfo.watchCount}}</div>
      </li>
      <li class="li2">
        <div>
          <span>点赞数</span>
          <i class="iconfont icon-dianzan"></i>
        </div>
        <div>{{liveInfo.liveInfo.clickCount}}</div>
      </li>
      <li class="li3">
        <div>
          <span>商品数</span>
          <i class="iconfont icon-shangpin2"></i>
        </div>
        <div>{{liveInfo.liveInfo.itemCount}}</div>
      </li>
      <li class="li4">
        <div>
          <span>进入商详</span>
          <i class="iconfont icon-xiangqing"></i>
        </div>
        <div>{{liveInfo.liveInfo.enterItemCount}}</div>
      </li>
      <li class="li5">
        <div>
          <span>加入购物车</span>
          <i class="iconfont icon-gouwuche"></i>
        </div>
        <div>{{liveInfo.liveInfo.addCartCount}}</div>
      </li>
      <li class="li6">
        <div>
          <span>直播时长</span>
          <i class="iconfont icon-shijian"></i>
        </div>
        <div>{{liveInfo.liveInfo.liveMin}}</div>
      </li>
    </ul>
    <!-- 汇总数据 -->
    <ul v-if="type==='2'">
      <li class="li1">
        <div>
          <span>累计观看人次</span>
          <i class="iconfont icon-guankanrenshu"></i>
        </div>
        <div>{{liveInfo.liveStatistics.watchCount}}</div>
      </li>
      <li class="li2">
        <div>
          <span>累计点赞数</span>
          <i class="iconfont icon-dianzan"></i>
        </div>
        <div>{{liveInfo.liveStatistics.clickCount}}</div>
      </li>
      <li class="li3">
        <div>
          <span>总商品数</span>
          <i class="iconfont icon-shangpin2"></i>
        </div>
        <div>{{liveInfo.liveStatistics.itemCount}}</div>
      </li>
      <li class="li4">
        <div>
          <span>累计进入商详</span>
          <i class="iconfont icon-xiangqing"></i>
        </div>
        <div>{{liveInfo.liveStatistics.enterItemCount}}</div>
      </li>
      <li class="li5">
        <div>
          <span>累计加购</span>
          <i class="iconfont icon-gouwuche"></i>
        </div>
        <div>{{liveInfo.liveStatistics.addCartCount}}</div>
      </li>
      <li class="li6">
        <div>
          <span>累计场次</span>
          <i class="iconfont icon-kaoshichangci"></i>
        </div>
        <div>{{liveInfo.liveStatistics.liveCount}}</div>
      </li>
    </ul>
    <!-- 表格 -->
    <div class="table-box">
      <el-table :data="liveInfo.liveGoodsList">
        <el-table-column label="排行" prop="row" align="center">
          <template slot-scope="scope">
            <div>{{scope.$index+1}}</div>
          </template>
        </el-table-column>
        <el-table-column label="商品" width="300px">
          <template slot-scope="scope">
            <div class="merchandise-box">
              <img :src="scope.row.goodsImage" alt />
              <div class="desction-box">
                <div class="title">{{scope.row.goodsTitle}}</div>
                <div class="subTitle">{{scope.row.content}}</div>
                <div class="sku">sku:{{scope.row.sku}}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="京东价" prop="jdPrice">
          <template slot-scope="scope">
            <div>{{scope.row.jdPrice==="-1.0"?'-':('￥'+scope.row.jdPrice)}}</div>
          </template>
        </el-table-column>
        <el-table-column label="优惠价" prop="discountPrice">
          <template slot-scope="scope">
            <div>{{scope.row.discountPrice==="-1.0"?'-':('￥'+scope.row.discountPrice)}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="type==='1'?'进入商详':'累计进入商详'" prop="enterItemCount"></el-table-column>
        <el-table-column :label="type==='1'?'加入购物车':'累计加购'" prop="addCartCount"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { getLiveDetail, getLiveStatisticsDetail } from "../../../api/monitor";
import { formatData } from "../../../utils/liveMonitorFormatData";
export default {
  data() {
    return {
      liveInfo: {},
      type: "0",
      monitorId: "",
      liveId: "",
      liveLogo: "",
    };
  },
  mounted() {
    this.monitorId = this.$route.query.monitorId;
    this.liveId = this.$route.query.liveId;
    this.liveLogo = this.$route.query.liveLogo;
    this.getliveData();
  },
  methods: {
    async getliveData() {
      const params = {
        monitorId: this.monitorId,
        liveId: this.liveId,
      };
      const request = this.liveId ? getLiveDetail : getLiveStatisticsDetail;
      const { data: res } = await request({ params });
      this.type = this.$route.query.type;
      if (res.code === 200) {
        this.liveInfo = res.data;
        this.liveId
          ? (this.liveInfo.liveInfo = formatData(res.data.liveInfo))
          : (this.liveInfo.liveStatistics = formatData(
              res.data.liveStatistics
            ));
      } else {
        this.$message.error(res.msg);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  .head-box {
    min-height: 90px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0px 3px 24px 0px rgba(168, 168, 236, 0.22);
    display: flex;
    padding: 12px 0 11px 9px;
    img {
      width: 46px;
      height: 47px;
      padding: 9px 10px 11px 11px;
    }
    .title-time-box {
      padding-left: 10px;
      color: #333;
      font-size: 14px;
      .title {
        padding-top: 5px;
        font-weight: bold;
      }
      .advertising {
        height: 18px;
        padding-top: 6px;
        color: #999;
        font-size: 12px;
      }
      .title,
      .advertising {
        width: 750px;
        display: -webkit-box;
        /* ! autoprefixer: off */
        -webkit-box-orient: vertical;
        /* autoprefixer: on */
        -webkit-line-clamp: 1;
        overflow: hidden;
      }
      .time {
        padding-top: 12px;
      }
    }
  }
  // 汇总数据头部
  .summaryData-box {
    height: 60px;
    line-height: 60px;
    padding-left: 14px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0px 3px 24px 0px rgba(168, 168, 236, 0.22);
    color: #333;
    font-size: 14px;
    span:nth-child(2) {
      padding-left: 30px;
    }
  }
  ul {
    min-height: 130px;
    box-sizing: border-box;
    padding: 20px 15px 20px 14px;
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    box-shadow: 0px 3px 24px 0px rgba(168, 168, 236, 0.22);
    margin-top: 10px;
    border-radius: 10px;
    color: #fff;
    .li1 {
      background-image: url("../../../assets/images/dataMonitoring/l1.png");
    }
    .li2 {
      background-image: url("../../../assets/images/dataMonitoring/l2.png");
    }
    .li3 {
      background-image: url("../../../assets/images/dataMonitoring/l3.png");
    }
    .li4 {
      background-image: url("../../../assets/images/dataMonitoring/l4.png");
    }
    .li5 {
      background-image: url("../../../assets/images/dataMonitoring/l5.png");
    }
    .li6 {
      background-image: url("../../../assets/images/dataMonitoring/l6.png");
    }
    li {
      width: 189px;
      height: 90px;
      background-size: 100% 100%;
      box-sizing: border-box;
      padding: 11px 11px 18px 18px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      div:first-child {
        display: flex;
        justify-content: space-between;
        span {
          padding-top: 4px;
          font-size: 14px;
        }
        .icon-guankanrenshu {
          font-size: 24px;
        }
        .icon-dianzan {
          font-size: 23px;
        }
        .icon-shangpin2 {
          font-size: 24px;
        }
        .icon-xiangqing {
          font-size: 21px;
        }
        .icon-gouwuche {
          font-size: 25px;
        }
        .icon-shijian {
          font-size: 25px;
        }
        .icon-kaoshichangci {
          font-size: 23px;
        }
      }
      div:nth-child(2) {
        font-size: 22px;
        font-weight: bold;
      }
    }
  }
  .table-box {
    flex: 1;
    padding: 15px 15px 15px 14px;
    margin-bottom: 15px;
    background-color: #fff;
    margin-top: 10px;
    border-radius: 10px;
    box-shadow: 0px 3px 24px 0px rgba(168, 168, 236, 0.22);
    /deep/ .el-table {
      border: 1px solid #eee;
      border-bottom: 0;
      th:nth-child(2) {
        padding-left: 65px;
      }
      .merchandise-box {
        display: flex;
        align-items: center;
        img {
          width: 46px;
          height: 54px;
          padding-right: 19px;
        }
        .desction-box {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          font-size: 12px;
          .title,
          .subTitle {
            width: 177px;
            line-height: 18px;
          }
          .sku {
            height: 10px;
            line-height: 10px;
          }
        }
      }
    }
  }
}
</style>
