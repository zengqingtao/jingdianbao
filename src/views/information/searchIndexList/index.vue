<!--搜索指数榜-->
<template>
  <div class="container">
    <div class="module">
      <div class="query-box">
        <div class="query-options">
          <div class="query-title-icon">
            <p class="query-title">搜索指数榜</p>
            <el-tooltip tabindex="-1" popper-class="tooltip" placement="right">
              <i class="iconfont icon-wenhao"></i>
              <div slot="content" class="tooltip-content">
                <div>
                  <p>1、搜索指数榜：显示某个关键词在京东平台中搜索、点击、成交等指标数据。</p>
                  <p class="indent">指数数据来源官方途径，数据数值与商智一致。</p>
                </div>
                <div>
                  <p>2、指数数据，统计的范围是京东全部渠道全部类目，分析这个关键词</p>
                  <p class="indent">在全平台全类目中的表现情况。查询时间范围是昨日。</p>
                </div>
                <div>
                  <p>3、每天上午8点更新完数据。</p>
                </div>
              </div>
            </el-tooltip>
          </div>
          <div>
            <el-button
              class="--btn-none delKeywords-btn"
              @click="showDelKeywords = true"
              v-if="tableData.length"
            >删除关键词</el-button>
            <el-button class="--btn-none" @click="addKeyword">添加关键词</el-button>
          </div>
        </div>
        <div class="query-results">
          <el-table
            v-if="tableData.length"
            class="table"
            :data="tableData"
            style="width: 100%"
            :default-sort="{prop: 'searchIndex', order: 'descending'}"
            v-loading="tableLoading"
          >
            <el-table-column label="序号" width="75px">
              <template slot-scope="scope">
                <div>{{scope.$index+1}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="currentKeyword" label="关键词" width="78px"></el-table-column>
            <el-table-column
              prop="searchIndex"
              label="搜索指数"
              sortable
              :sort-orders="['descending','ascending']"
              width="85px"
            ></el-table-column>
            <el-table-column
              prop="searchClickIndex"
              label="搜索点击指数"
              sortable
              :sort-orders="['descending','ascending']"
              width="110px"
            ></el-table-column>
            <el-table-column
              prop="ordAmtIndex"
              label="成交金额指数"
              sortable
              :sort-orders="['descending','ascending']"
              width="110px"
            ></el-table-column>
            <el-table-column
              prop="ordNumIndex"
              label="成交单量指数"
              sortable
              :sort-orders="['descending','ascending']"
              width="110px"
            ></el-table-column>
            <el-table-column
              prop="convertRate"
              label="成交转化率"
              sortable
              :sort-orders="['descending','ascending']"
              width="98px"
            >
              <template slot-scope="scope">
                <div>{{(scope.row.convertRate*100).toFixed(2)+'%'}}</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="clickRate"
              label="点击率"
              sortable
              :sort-orders="['descending','ascending']"
              width="75px"
            >
              <template slot-scope="scope">
                <div>{{(scope.row.clickRate*100).toFixed(2)+'%'}}</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="commodityNumber"
              label="全网商品数"
              sortable
              :sort-orders="[ 'descending','ascending']"
              width="98px"
            ></el-table-column>
            <el-table-column
              prop="competition"
              label="潜力值"
              sortable
              :sort-orders="['descending','ascending']"
              width="75px"
            ></el-table-column>
          </el-table>
        </div>
        <!-- 尚未添加关键词 -->
        <div class="null-box" v-if="!tableData.length" v-loading="tableLoading">
          <div v-if="isLogin&&!tableLoading">
            <div class="img-box">
              <img src="../../../assets/images/null-logo.png" alt />
            </div>
            <p>尚未添加关键词，请添加</p>
          </div>
          <div v-if="!isLogin&&!tableLoading">
            <div class="img-box">
              <img src="../../../assets/images/noData.png" alt />
            </div>
            <p>尚未登录，请先登录</p>
            <div class="btn-box">
              <el-button type="primary" class="--btn-primary" @click="toLogin">去登录</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加关键词对话框 -->
    <search-index-add-keywords
      v-if="isShowAddKeywords"
      :keywordInfo="keywordInfo"
      :num="keywordInfo.addCount"
      @closeDialog="isShowAddKeywords = false"
      @success="getpageList"
    ></search-index-add-keywords>
    <del-keywords
      v-if="showDelKeywords"
      :data="tableData"
      @successDelete="getpageList"
      @closeDialog="showDelKeywords = false"
    ></del-keywords>
    <up-grade-member
      v-if="showUpGradeMember"
      @closeDialog="showUpGradeMember = false"
      :num="keywordInfo.power"
    ></up-grade-member>
  </div>
</template>
<script>
import { checkLogin } from "../../../api/user";
import { searchIndex, getKeywordsInfo } from "../../../api/information";
import searchIndexAddKeywords from "../../dialog/searchIndexAddkeywords";
import delKeywords from "../../dialog/delKeywords";
import upGradeMember from "../../dialog/upGradeMember";
import { mapState } from "vuex";
export default {
  data() {
    return {
      tableData: [],
      isShowAddKeywords: false,
      tableLoading: true,
      showDelKeywords: false,
      isLogin: false,
      keywordInfo: {},
      showUpGradeMember: false
    };
  },
  components: { searchIndexAddKeywords, delKeywords, upGradeMember },
  computed: mapState(["searchIndexListKeyword"]),
  watch: {
    isShowAddKeywords() {
      if (!this.isShowAddKeywords) {
        this.$store.commit("search_index_list_keyword", false);
      }
    }
  },

  created() {
    this.checkLogin();
    if (this.searchIndexListKeyword) {
      this.isShowAddKeywords = true;
    }
  },
  methods: {
    async checkLogin() {
      let { data: res } = await checkLogin();
      if (res.code === 200) {
        this.isLogin = true;
        this.getpageList();
      } else {
        this.isLogin = false;
        this.tableLoading = false;
      }
    },
    async getpageList() {
      this.tableLoading = true;
      const { data: res } = await searchIndex();
      this.tableLoading = false;
      if (res.code == 200) {
        this.tableData = res.data;
      } else {
        this.$message.error(res.msg);
      }
    },
    async addKeyword() {
      if (this.isLogin) {
        this.keywordInfo = await this.getKeywordsInfo();
        if (this.keywordInfo.addCount === 0) {
          this.showUpGradeMember = true;
        } else {
          this.isShowAddKeywords = true;
        }
      } else {
        this.$store.commit("LOGIN_MODAL_TOGGLE", {
          toggle: true,
          loginType: 2
        });
      }
    },
    async getKeywordsInfo() {
      let { data: res } = await getKeywordsInfo();
      if (res.code == 200) {
        return res.data;
      }
    },
    toLogin() {
      this.$store.commit("LOGIN_MODAL_TOGGLE", {
        toggle: true,
        loginType: 2
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  height: 100%;
}
.module {
  height: 100%;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 3px 24px 0px rgba(168, 168, 236, 0.22);
  padding: 20px;
}
// 搜索指数榜标题提示语的样式
.tooltip-content {
  div {
    line-height: 18px;
    .indent {
      padding-left: 20px;
    }
  }
  div + div {
    padding-top: 5px;
  }
}
.query-box {
  height: 100%;
  .query-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .query-title-icon {
      display: flex;
      .query-title {
        color: #333;
        font-size: 18px;
        font-weight: bold;
        margin-right: 3px;
      }
      .iconfont {
        color: #333;
        font-weight: bold;
        cursor: pointer;
      }
    }
    /deep/ .el-button {
      width: 90px;
      height: 30px;
      font-size: 14px;
      padding: 0;
    }
    .delKeywords-btn.el-button {
      color: #f30213ff !important;
      border-color: #f30213ff !important;
      &:hover {
        color: #fff !important;
        background-color: #f30213ff !important;
      }
    }
  }
  .query-results {
    margin-top: 10px;
    .table {
      border: 1px solid #ebeef5;
      border-bottom: 0;
    }
    /deep/ .caret-wrapper .sort-caret {
      pointer-events: none;
    }
    /deep/ .el-table,
    /deep/ .el-table thead {
      color: #333 !important;
      font-size: 12px !important;
    }
    /deep/ .el-table .caret-wrapper {
      width: 15px;
      text-align: center;
    }
  }
}
.null-box {
  height: calc(100% - 80px);
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  .img-box {
    text-align: center;
    img {
      width: 60px;
      height: 60px;
    }
  }
  p {
    color: #999;
    font-size: 14px;
  }
  .btn-box {
    text-align: center;
    margin-top: 30px;
    /deep/ .el-button {
      width: 130px;
      height: 40px;
      padding: 0;
    }
  }
}
</style>