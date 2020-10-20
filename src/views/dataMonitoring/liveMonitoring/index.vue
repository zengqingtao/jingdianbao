<!--直播监控-->
<template>
  <div class="liveMonitoring-container">
    <div class="liveMonitor-content" v-if="liveInfo">
      <!--直播标题和添加时间等-->
      <div class="head-box">
        <div class="addMonitor-btn-box">
          <el-button class="--btn-none" onfocus="this.blur()" @click="validateUpGrade">添加监控</el-button>
        </div>
        <div class="shopName-box">
          <div class="left">
            <img :src="liveInfo.liveLogo" alt />
            <div class="shopName-id-box">
              <div class="shopName">{{liveInfo.title}}</div>
              <div>添加时间：{{liveInfo.createTime}}</div>
            </div>
          </div>
          <div class="right">
            <div>
              <el-tooltip tabindex="-1" popper-class="tooltip" placement="top">
                <i class="iconfont icon-wenhao"></i>
                <div slot="content" class="tooltip-content">
                  <div>1、暂时只支持添加一个直播间。</div>
                  <div>2、平台会收集直播间数据有：直播观看人数、点赞人数、</div>
                  <div class="indent">在直播间加购商品人次、在直播间进入商详人次等数据。</div>
                  <div>3、加入购物车人次，只统计在直播间直接加购的人次，不</div>
                  <div class="indent">包括在商品详情页加购的人次。</div>
                  <div>4、在直播结束后，10分钟后就会更新最新直播场次的数据。</div>
                </div>
              </el-tooltip>
            </div>
            <div class="del-monitor-btn --text-mouse-hover" @click="delMonitorVisible = true">删除监控</div>
          </div>
        </div>
      </div>
      <!-- 最新直播 -->
      <div class="new-liveMonitor">
        <div class="title-details-box">
          <div class="left">
            <span class="title">最新直播</span>
            <span
              class="time"
              v-if="liveInfo.liveInfo&&liveInfo.liveInfo.startTime"
            >{{liveInfo.liveInfo.startTime}}~{{liveInfo.liveInfo.endTime}}</span>
          </div>
          <div
            class="right"
            @click="toLiveDetails(1,liveInfo.monitorId,liveInfo.liveInfo.liveId)"
            v-if="liveInfo.liveInfo"
          >
            <span class="title">详情</span>
            <i class="iconfont icon-iconfonti"></i>
          </div>
        </div>
        <ul v-if="liveInfo.liveInfo">
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
              <i class="iconfont icon-zhibo"></i>
            </div>
            <div>{{liveInfo.liveInfo.liveMin}}</div>
          </li>
        </ul>
        <div class="noData" v-else>
          <img src="../../../assets/images/null.png" alt />
        </div>
      </div>
      <!-- 汇总数据 -->
      <div class="summaryData">
        <div class="title-details-box">
          <div class="left">
            <span class="title">汇总数据</span>
            <span
              class="time"
              v-if="liveInfo.liveStatistics&&liveInfo.liveStatistics.updateTime"
            >(更新时间：{{liveInfo.liveStatistics.updateTime}})</span>
          </div>
          <div
            class="right"
            @click="toLiveDetails(2,liveInfo.monitorId)"
            v-if="liveInfo.liveStatistics"
          >
            <span>详情</span>
            <i class="iconfont icon-iconfonti"></i>
          </div>
        </div>
        <ul v-if="liveInfo.liveStatistics">
          <li class="li1 updatePadding">
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
        <div class="noData" v-else>
          <img src="../../../assets/images/null.png" alt />
        </div>
      </div>
      <!-- 直播场次 -->
      <div class="live-broadcast-times">
        <el-table :data="liveSceneList" v-loading="tableLoading">
          <el-table-column label="序号" width="80px">
            <template slot-scope="scope">
              <div>{{++scope.$index}}</div>
            </template>
          </el-table-column>
          <el-table-column label="直播间ID" prop="liveId"></el-table-column>
          <el-table-column label="直播时间" prop="time" width="200px">
            <template slot-scope="scope">
              <div>开播:{{scope.row.startTime}}</div>
              <div>结播:{{scope.row.endTime}}</div>
            </template>
          </el-table-column>
          <el-table-column label="直播时长" prop="liveMin" width="120px"></el-table-column>
          <el-table-column label="观看人次" prop="watchCount"></el-table-column>
          <el-table-column label="商品数" prop="itemCount"></el-table-column>
          <el-table-column label="进入商详" prop="enterItemCount"></el-table-column>
          <el-table-column label="加入购物车" prop="addCartCount" width="90px"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="text"
                class="review-details-btn"
                @click="toLiveDetails(1,liveInfo.monitorId,scope.row.liveId)"
              >查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination" v-if="pagination.total>pagination.size">
          <el-pagination
            :current-page="pagination.page"
            :page-size="pagination.size"
            :total="pagination.total"
            @current-change="changeCurrentPage"
            prev-text="上一页"
            next-text="下一页"
            background
            layout="prev, pager, next"
          ></el-pagination>
        </div>
      </div>
    </div>
    <div class="init-box" v-else>
      <div class="addMonitor-btn-box">
        <el-button class="--btn-none" onfocus="this.blur()" @click="validateUpGrade">添加监控</el-button>
      </div>
      <div class="noData-box" v-loading="initLoading" v-if="isLogin">
        <img src="../../../assets/images/null-logo.png" v-if="!initLoading" alt />
        <div v-if="!initLoading">你尚未添加直播间监控，请添加</div>
      </div>
      <div class="noLogin-box" v-else>
        <div>
          <img class="img" src="../../../assets/images/noData.png" alt />
          <p class="img-title">尚未登录，请先登录</p>
        </div>
        <el-button class="--btn-primary" type="primary" onfocus="this.blur()" @click="toLogin">去登录</el-button>
      </div>
    </div>
    <!-- 添加监控 -->
    <div class="addMonitor-dialog-box">
      <el-dialog
        :visible.sync="addMonitorVisible"
        :close-on-click-modal="false"
        :center="true"
        width="600px"
      >
        <div class="title">添加达人主页</div>
        <el-input v-model="liveUrl" placeholder="请输入达人主页链接" @focus="errMsg = ''"></el-input>
        <div v-if="errMsg" class="errMsg">{{errMsg}}</div>
        <div class="btn-group">
          <el-button
            type="primary"
            class="--btn-primary"
            onfocus="this.blur()"
            @click="addLiveMonitor"
            :loading="addLiveMonitorLoading"
          >提 交</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 删除监控 -->
    <div class="delMonitor-dialog-box">
      <el-dialog
        :visible.sync="delMonitorVisible"
        :close-on-click-modal="false"
        :center="true"
        width="500px"
      >
        <div class="tips">是否删除监控，删除监控后，数据将会被清空</div>
        <div class="btn-group">
          <el-button class="--btn-none" @click="delMonitorVisible = false">取消</el-button>
          <el-button type="primary" class="--btn-primary" @click="delMonitor">删除</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 权限不够对话框 -->
    <up-grade
      :errorMsg="upGradeTips"
      type="排名监控"
      v-if="upGradeVisible"
      @closeDialog="upGradeVisible = false"
    ></up-grade>
  </div>
</template>
<script>
import upGrade from "../../dialog/upGrade";
import { mapState } from "vuex";
import {
  listLiveMonitorByUserId,
  getJdLiveMonitor,
  addJdLiveMonitor,
  deleteMonitor,
} from "../../../api/monitor";
import { checkLogin } from "../../../api/user";
import {formatData}from "../../../utils/liveMonitorFormatData"
export default {
  data() {
    return {
      isLogin: true,
      pagination: {
        page: 1,
        size: 10,
        total: null,
      },
      liveInfo: null, //直播标题、最新直播数据、汇总数据
      liveSceneList: [], //直播场次列表
      addMonitorVisible: false,
      liveUrl: "", //要添加的直播间
      delMonitorVisible: false, //是否显示删除直播监控的对话框
      upGradeTips: "", //权限不足提示内容
      upGradeVisible: false, //是否显示权限不足对话框
      errMsg: "",
      initLoading: true,
      tableLoading: false,
      addLiveMonitorLoading: false,
    };
  },
  computed: {
    ...mapState(["vipType"]),
  },
  components: {
    upGrade,
  },
  watch: {
    addMonitorVisible() {
      if (!this.addMonitorVisible) {
        this.liveUrl = "";
      }
    },
  },
  created() {
    this.checkLogin();
  },
  methods: {
    async checkLogin() {
      const { data: res } = await checkLogin();
      if (res.code === 200) {
        this.isLogin = true;
        this.getLiveMonitorInfo();
      } else {
        this.isLogin = false;
      }
    },
    validateUpGrade() {
      if (!this.isLogin) {
        this.toLogin();
      } else if (this.vipType === 3) {
        if (this.liveInfo) {
          this.upGradeTips =
            "您当前是高级会员，您直播监控数量已满，无法再添加新的直播间。";
          this.upGradeVisible = true;
        } else {
          this.addMonitorVisible = true;
        }
      } else {
        this.upGradeTips =
          "亲，您的等级权限无法解锁此功能，请阅读会员等级说明了解详情。";
        this.upGradeVisible = true;
      }
    },
    validateUrl() {
      // 校验格式：
      // 1、https://eco.m.jd.com/content/dr_home/index.html?authorId=******
      // 2、https://wqs.jd.com/pglive/author.html?authorId=******
      let regex = /^((https:\/\/eco\.m\.jd\.com\/content\/dr_home\/index\.html\?authorId\=)|(https:\/\/wqs\.jd\.com\/pglive\/author\.html\?authorId=))[\w\-\.,@?^=%&:\/~\+#]+/;
      if (this.liveUrl === "") {
        this.errMsg = "达人主页链接不能为空";
      } else if (!regex.test(this.liveUrl)) {
        this.errMsg =
          "链接错误，参考格式：https://eco.m.jd.com/content/dr_home/index.html?authorId=****";
      } else {
        this.errMsg = "";
      }
    },
    // 添加直播监控
    async addLiveMonitor() {
      await this.validateUrl();
      if (this.errMsg !== "") return;
      let params = {
        darenUrl: this.liveUrl,
      };
      this.addLiveMonitorLoading = true;
      const { data: res } = await addJdLiveMonitor({ params });
      this.addLiveMonitorLoading = false;
      if (res.code === 200) {
        this.getLiveMonitorInfo();
        this.addMonitorVisible = false;
      } else {
        this.$message.error(res.msg);
      }
    },
    // 删除直播监控
    async delMonitor() {
      const params = { monitorId: this.liveInfo.monitorId };
      const { data: res } = await deleteMonitor({ params });
      this.delMonitorVisible = false;
      if (res.code === 200) {
        this.getLiveMonitorInfo();
      } else {
        this.$message.error(res.msg);
      }
    },
    // 获取直播信息
    async getLiveMonitorInfo() {
      const { data: res } = await getJdLiveMonitor();
      this.initLoading = false;
      if (res.code === 200) {
        this.liveInfo = res.data;
        if(res.data){
          this.liveInfo.liveInfo = formatData(this.liveInfo.liveInfo)
          this.liveInfo.liveStatistics = formatData(this.liveInfo.liveStatistics)
          this.getLiveSceneList()//获取直播场次
        }
      } else {
        this.$message.error(res.msg);
      }
    },
    // 获取直播场次
    async getLiveSceneList() {
      let params = {
        monitorId: this.liveInfo.monitorId,
        page: this.pagination.page,
        size: this.pagination.size,
      };
      this.tableLoading = true;
      const { data: res } = await listLiveMonitorByUserId({ params });
      this.tableLoading = false;
      if (res.code === 200) {
        this.liveSceneList = res.data.results;
        this.pagination.total = res.data.totalCount;
      } else {
        this.$message.error(res.msg);
      }
    },
    toLiveDetails(type, monitorId, liveId = "") {
      // type 1：直播详情 2：汇总数据
      let url = this.$router.resolve({
        path: "/trend/liveDetails",
        query: {
          type,
          monitorId,
          liveId,
          liveLogo: this.liveInfo.liveLogo,
        },
      });
      window.open(url.href);
    },
    changeCurrentPage(currentPage) {
      this.pagination.page = currentPage;
      this.getLiveSceneList();
    },
    toLogin() {
      this.$store.commit("LOGIN_MODAL_TOGGLE", {
        toggle: true,
        loginType: 2,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.liveMonitoring-container {
  height: 100%;
  .liveMonitor-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    .head-box {
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0px 3px 24px 0px rgba(168, 168, 236, 0.22);
      .addMonitor-btn-box {
        height: 60px;
        line-height: 60px;
        margin: 0 10px;
        text-align: end;
        /deep/ .el-button {
          width: 120px;
          height: 30px;
          padding: 0;
          margin-right: 10px;
        }
      }
      .shopName-box {
        height: 90px;
        display: flex;
        justify-content: space-between;
        padding: 20px 10px 22px 11px;
        margin: 0 10px;
        box-sizing: border-box;
        border-top: 1px solid #eee;
        .left {
          display: flex;
          img {
            width: 46px;
            height: 47px;
          }
          .shopName-id-box {
            display: flex;
            flex-direction: column;
            color: #333;
            font-size: 14px;
            padding-left: 20px;
            .shopName {
              font-weight: bold;
              padding: 3px 0 10px;
            }
          }
        }
        .right {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          text-align: end;
          color: #333;
          font-size: 14px;
          .del-monitor-btn {
            cursor: pointer;
          }
          .icon-wenhao {
            color: #333;
            font-size: 16px;
            font-weight: bold;
          }
        }
      }
    }
    // 最新直播
    .new-liveMonitor,
    .summaryData {
      margin-top: 10px;
      height: 163px;
      background-color: #fff;
      box-shadow: 0px 3px 24px 0px rgba(168, 168, 236, 0.22);
      border-radius: 10px;
      padding: 20px 16px 20px 14px;
      .title-details-box {
        display: flex;
        justify-content: space-between;
        height: 13px;
        .left {
          .title {
            color: #333;
            font-size: 14px;
          }
          .time {
            color: #999;
            font-size: 12px;
          }
        }

        .right {
          font-size: 14px;
          color: var(--DBlue);
          cursor: pointer;
          display: flex;
          align-items: center;
          &:hover {
            color: var(--JBlue);
          }
        }
      }
      ul {
        padding-top: 20px;
        display: flex;
        justify-content: space-between;
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
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          width: 146px;
          height: 90px;
          border-radius: 10px;
          background-size: 100% 100%;
          color: #fff;
          padding: 11px 17px 18px 19px;
          box-sizing: border-box;
          div:first-child {
            display: flex;
            justify-content: space-between;
            span {
              font-size: 14px;
              padding-top: 3px;
            }
            .icon-guankanrenshu {
              font-size: 20px;
            }
            .icon-dianzan {
              font-size: 23px;
            }
            .icon-shangpin2 {
              font-size: 24px;
            }
            .icon-xiangqing {
              font-size: 20px;
            }
            .icon-gouwuche {
              font-size: 25px;
            }
            .icon-zhibo {
              font-size: 24px;
            }
            .icon-kaoshichangci {
              font-size: 24px;
            }
          }
          div:nth-child(2) {
            font-size: 22px;
            font-weight: bold;
          }
        }
        .updatePadding {
          padding-right: 9px;
        }
      }
      // 暂无数据
      .noData {
        text-align: center;
        height: 110px;
        line-height: 110px;
        img {
          width: 80px;
        }
      }
    }
    //直播场次
    .live-broadcast-times {
      flex: 1;
      margin-top: 10px;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0px 3px 24px 0px rgba(168, 168, 236, 0.22);
      padding: 15px;
      /deep/ .el-table {
        border: 1px solid #eee;
        border-bottom: 0;
        .review-details-btn.el-button {
          color: var(--DBlue);
          &:hover {
            color: var(--JBlue);
          }
        }
      }
      .pagination {
        text-align: center;
        padding: 29px 0 20px;
      }
    }
  }
  // 暂无数据
  .init-box {
    height: 100%;
    display: flex;
    flex-direction: column;
    .addMonitor-btn-box {
      height: 60px;
      line-height: 60px;
      background-color: #fff;
      box-shadow: 0px 3px 24px 0px rgba(168, 168, 236, 0.22);
      border-radius: 10px;
      text-align: end;
      padding-right: 20px;
      .el-button {
        width: 120px;
        height: 30px;
        padding: 0;
      }
    }
    .noData-box,
    .noLogin-box {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top: 10px;
      background-color: #fff;
      box-shadow: 0px 3px 24px 0px rgba(168, 168, 236, 0.22);
      border-radius: 10px;
    }
    .noData-box {
      img {
        width: 92px;
        height: 101px;
        padding-bottom: 10px;
      }
      div {
        color: #999;
        font-size: 14px;
      }
    }
    .noLogin-box {
      div {
        text-align: center;
        img {
          width: 60px;
          height: 60px;
        }
        p {
          font-size: 14px;
          color: #999;
          padding-top: 5px;
        }
      }
      /deep/ .el-button {
        margin-top: 30px;
        width: 130px;
        height: 40px;
        padding: 0;
      }
    }
  }
  // 添加监控
  .addMonitor-dialog-box {
    .title {
      color: #333;
      font-weight: bold;
      text-align: center;
      padding-bottom: 20px;
    }
    .btn-group {
      text-align: center;
      /deep/ .el-button {
        width: 120px;
        height: 30px;
        padding: 0;
        margin-top: 20px;
      }
    }
    .errMsg {
      text-align: center;
      color: #f56c6c;
      padding-top: 10px;
    }
  }
  // 删除监控
  .delMonitor-dialog-box {
    .tips {
      text-align: center;
    }
    .btn-group {
      margin-top: 20px;
      text-align: center;
      /deep/ .el-button {
        width: 120px;
        height: 30px;
        padding: 0;
      }
    }
  }
}
.tooltip-content {
  div {
    line-height: 18px;
  }
  .indent {
    text-indent: 22px;
  }
}
</style>