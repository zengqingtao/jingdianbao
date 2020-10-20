<!--查排名---->
<template>
  <div class="container">
    <!-- 即时查询 -->
    <div class="modul instant-query">
      <div class="query-options">
        <el-form class="form" ref="form" :rules="formRules" :model="form" label-width="90px">
          <el-form-item label="查看端口：">
            <el-radio-group v-model="form.queryPort" size="small" @change="changePort">
              <el-radio-button
                label="1"
                v-baidu-count="{
                  event: '点击',
                  value: '查排名-PC端',
                  label: '查排名-PC端'}"
              >PC端</el-radio-button>
              <el-radio-button
                label="2"
                v-baidu-count="{
                  event: '点击',
                  value: '查排名-APP端',
                  label: '查排名-APP端'}"
              >APP端</el-radio-button>
              <el-radio-button
                label="3"
                v-baidu-count="{
                  event: '点击',
                  value: '查排名-京喜',
                  label: '查排名-京喜'}"
              >京喜端</el-radio-button>
              <el-radio-button
                label="4"
                v-baidu-count="{
                  event: '点击',
                  value: '查排名-M端',
                  label: '查排名-M端'}"
              >M端</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="查询模式：">
            <el-radio-group v-model="form.queryModel" size="small" @change="changeQueryModel">
              <el-radio-button label="1">指定商品</el-radio-button>
              <el-radio-button
                label="2"
                v-baidu-count="{
                  event: '点击',
                  value: '查排名-店铺',
                  label: '查排名-店铺'}"
              >指定店铺</el-radio-button>
              <el-radio-button
                label="3"
                v-if="form.queryPort==='1'"
                v-baidu-count="{
                  event: '点击',
                  value: '查排名-类目',
                  label: '查排名-类目'}"
              >类目排名</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <!-- 指定商品-关键词 -->
          <el-form-item label="关键词：" v-if="form.queryModel=='1'" prop="keyword1">
            <el-input
              v-model="form.keyword1"
              ref="myInput"
              size="small"
              :placeholder="form.keywordsList1.length>inpKeywordNum-1?'':'请输入关键词'"
              :disabled="form.keywordsList1.length>inpKeywordNum-1"
              @keyup.enter.native="addkeyword(form.keyword1,form.keywordsList1)"
              @focus="clearValidate('keyword1')"
              @blur="hideSearchHistory"
            >
              <template slot="prepend">
                <span v-for="(item,index) in form.keywordsList1" :key="index">
                  {{item}}
                  <i
                    class="iconfont icon-guanbi"
                    style="cursor:pointer;"
                    @click="delKeyword(index,1)"
                  ></i>
                </span>
              </template>
            </el-input>
            <el-tooltip
              tabindex="-1"
              popper-class="tooltip"
              content="可同时输入5个，按下回车键可分隔开"
              placement="right"
            >
              <i class="iconfont icon-wenhao icon-wenhao-guanjianci"></i>
            </el-tooltip>
          </el-form-item>
          <!-- 指定店铺-关键词 -->
          <el-form-item label="关键词：" v-if="form.queryModel=='2'" prop="keyword2">
            <el-input
              v-model="form.keyword2"
              ref="myInput"
              size="small"
              :placeholder="form.keywordsList2.length>inpKeywordNum-1?'':'请输入关键词'"
              @keyup.enter.native="addkeyword(form.keyword2,form.keywordsList2)"
              :disabled="form.keywordsList2.length>inpKeywordNum-1"
              @focus="clearValidate('keyword2')"
              @blur="hideSearchHistory"
            >
              <template slot="prepend">
                <span v-for="(item,index) in form.keywordsList2" :key="index">
                  {{item}}
                  <i
                    class="iconfont icon-guanbi"
                    style="cursor:pointer;"
                    @click="delKeyword(index,2)"
                  ></i>
                </span>
              </template>
            </el-input>
            <el-tooltip
              tabindex="-1"
              popper-class="tooltip"
              content="可同时输入5个，按下回车键可分隔开"
              placement="right"
            >
              <i class="iconfont icon-wenhao icon-wenhao-guanjianci"></i>
            </el-tooltip>
          </el-form-item>
          <!-- 指定商品-sku -->
          <el-form-item label="SKU：" v-if="form.queryModel=='1'" prop="sku1">
            <el-input
              v-model="form.sku1"
              size="small"
              placeholder="请输入sku链接或者sku"
              @focus="clearValidate('sku1')"
              @blur="hideSearchHistory"
            ></el-input>
          </el-form-item>
          <!-- 类目排名-sku -->
          <el-form-item label="SKU：" v-if="form.queryModel=='3'" prop="sku2">
            <el-input
              v-model="form.sku2"
              ref="myInput"
              size="small"
              placeholder="请输入sku链接或者sku"
              @focus="clearValidate('sku2')"
              @blur="hideSearchHistory"
            ></el-input>
          </el-form-item>
          <el-form-item label="店铺名称：" v-if="form.queryModel=='2'" prop="shopName">
            <el-input
              v-model="form.shopName"
              size="small"
              placeholder="请输入店铺名称"
              @focus="clearValidate('shopName')"
            ></el-input>
          </el-form-item>
          <el-form-item label="排序方式：">
            <el-radio-group v-model="form.sortMode" size="small">
              <el-radio-button label="1">综合</el-radio-button>
              <el-radio-button label="5">价格</el-radio-button>
              <el-radio-button label="2">销量</el-radio-button>
              <el-radio-button label="3">评价</el-radio-button>
              <el-radio-button label="4">新品</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="查询范围：">
            <div class="slider">
              <div class="slider-box">
                <div class="slider-runway">
                  <el-slider
                    v-model="page[form.queryPort+form.queryModel].pageEnd"
                    :max="maxPage"
                    :min="minPage"
                    tooltip-class="tooltip"
                  ></el-slider>
                </div>
                <div class="slider-page-ranking">{{sliderRange[0]}}页/前{{sliderRange[1]}}名</div>
              </div>
              <div class="slider-tips">
                <el-tooltip popper-class="tooltip" content="查询范围越小，查询速度越快" placement="right">
                  <i class="iconfont icon-wenhao icon-wenhao-fawei"></i>
                </el-tooltip>
              </div>
            </div>
          </el-form-item>
          <div
            class="search-history-box"
            v-if="isShowSearchHistory&&searchHistoryData[form.queryModel].length"
            @mouseover="mouseOver"
            @mouseleave="mouseLeave"
            @click="handleClickSearchHistoryBox"
          >
            <!-- 三角箭头 -->
            <div class="triangle"></div>
            <ul class="search-history">
              <!-- 行 -->
              <li
                class="row"
                v-for="(item,index) in searchHistoryData[form.queryModel]"
                :key="index"
                @click.stop="selectRow(item)"
              >
                <div class="goodsImg-box" v-if="form.queryModel!=='2'">
                  <img class="goodsImg" :src="item.img" alt />
                </div>
                <div class="sku" v-if="form.queryModel!=='2'">{{item.sku}}</div>
                <div class="shopName" v-else>{{item.shopName}}</div>
                <div class="keyword" v-if="form.queryModel!=='3'">{{item.keyword}}</div>
                <div
                  class="collect"
                  v-if="item.collect===0"
                  @click.stop="collectSearchHistory(item.id,item.collect)"
                >收藏</div>
                <div class="collected" v-else>已收藏</div>
                <div class="delete" @click.stop="delSearchHistory(item.id)">删除</div>
              </li>
            </ul>
          </div>
        </el-form>
        <div class="progress" v-if="progressToggle">
          <el-progress :progress="progressNumber"></el-progress>
        </div>
        <div class="btn-group">
          <el-button
            class="btn-primary"
            onfocus="this.blur()"
            type="primary"
            v-if="!progressToggle"
            @click="checkLogin"
          >查询</el-button>
          <el-button class="btn-none" type v-if="progressToggle" @click="progressEnd">取消</el-button>
          <el-button class="btn-none" type v-if="!progressToggle" @click="reset">重置</el-button>
        </div>
      </div>
      <div class="query-results" v-if="showResults">
        <div class="title">京东在更新排名时会造成排名有误差，如排名不稳定，请在2小时后再查询。</div>
        <el-table
          :data="tableData.slice((pagination.page-1)*pagination.size,pagination.page*pagination.size)"
          style="width: 100%;"
        >
          <el-table-column label="序号" align="center">
            <template slot-scope="scope">
              {{ (++scope.$index)+(pagination.page-1)*pagination.size}}
              <div class="num-box">
                <div class="is-relation-sku" v-if="scope.row.association === 1">关联SKU</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="商品标题" width="170" align="center">
            <template slot-scope="scope">
              <div class="goods-url-box">
                <img v-if="scope.row.img" :src="scope.row.img" alt class="table-item-img" />
                <a
                  :href="scope.row.url"
                  target="_blank"
                  v-baidu-count="{
                  event: '点击',
                  value: '查排名-商品',
                  label: '查排名-商品'
                }"
                >{{scope.row.skuName}}</a>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="searchWord"
            :label="
            tableData[0] && tableData[0].searchWord ? '关键词' : '三级类目'
          "
            align="center"
          >
            <template slot-scope="scope">
              <div>
                {{
                scope.row.searchWord ? scope.row.searchWord : scope.row.thirdCat
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="skuId" label="sku" align="center"></el-table-column>
          <el-table-column prop="ranking" align="center">
            <template slot="header">
              <span>位置和排名</span>
              <el-tooltip
                popper-class="tooltip"
                content="排名为无痕查询后的结果，排名结果为过滤掉广告和活动页后的排名"
                placement="top"
              >
                <i class="iconfont icon-wenhao"></i>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              <div
                v-if="scope.row.locationPage===0&&scope.row.locationRow===0&&scope.row.rank===0"
              >不在查询范围内</div>
              <div v-else>
                <div>第{{ scope.row.locationPage }}页-{{ scope.row.locationRow }}位</div>
                <div>{{ scope.row.rank }}名</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="date" label="推荐策略" align="center">
            <template>
              <el-tooltip
                v-if="form.sortMode==1"
                popper-class="tooltip"
                content="通过人气宝的【人气排名提升】功能，可真实有效地提高商品的综合排名"
                placement="top"
                :enterable="false"
              >
                <div class="recommend-btn-box">
                  <a
                    class="recommend-btn"
                    target="_blank"
                    onfocus="this.blur()"
                    :href="Config.rqbUrl + 'newReleaseIndex/jd/popular-rank'"
                    v-baidu-count="{
                  event: '外部跳转转化',
                  value: '推荐策略',
                  label: '查排名-提升排名'
                }"
                  >提升排名</a>
                </div>
              </el-tooltip>
              <div v-else>-</div>
            </template>
          </el-table-column>
          <el-table-column prop="date" label="操作" min-width="110px">
            <template slot-scope="scope">
              <div class="opreate-box">
                <span
                  v-if="form.queryModel==='1'"
                  type="text"
                  @click="reviewHistorySearchRanking(scope.row)"
                >历史查询排名</span>
                <span
                  type="text"
                  @click="checkSales(scope.row, scope.$index)"
                  v-baidu-count="{
                  event: '点击',
                  value: '查排名-查询30天销量',
                  label: '查排名-查询30天销量'
                }"
                >{{scope.row.checkSalesLoading?'查询中...':(scope.row.sales?('30天销量:'+scope.row.sales):'查询30天销量')}}</span>
                <span
                  type="text"
                  @click="checkCommentsNum(scope.row, scope.$index)"
                  v-baidu-count="{
                  event: '点击',
                  value: '查排名-查询总评价数',
                  label: '查排名-查询总评价数'
                }"
                >{{scope.row.checkCommentsNumLoading?'查询中...':(scope.row.commentsNum?("查询总评价数:"+scope.row.commentsNum):'查询总评价数')}}</span>
                <span
                  type="text"
                  @click="checkLimit(scope.row, scope.$index)"
                  v-baidu-count="{
                  event: '点击',
                  value: '查排名-查询忽略评价数',
                  label: '查排名-查询忽略评价数'
                }"
                >{{scope.row.checkLimitLoading?'查询中...':(scope.row.ignoreCommentsNum?('查询忽略评价数:'+scope.row.ignoreCommentsNum):'查询忽略评价数')}}</span>
                <span
                  type="text"
                  @click="addRankMonitor(scope.row)"
                  v-baidu-count="{
                  event: '内部跳转转化',
                  value: '每日监控内部跳转',
                  label: '查排名-添加排名监控'
                }"
                >添加排名监控</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination" v-if="form.queryModel==='2'&&tableData.length>pagination.size">
          <el-pagination
            prev-text="上一页"
            next-text="下一页"
            background
            layout="prev, pager, next"
            :page-size="pagination.size"
            :current-page="pagination.page"
            @current-change="tablePageChange"
            :total="pagination.total"
          ></el-pagination>
        </div>
      </div>
    </div>
    <!-- 历史查询记录 -->
    <history-search-ranking
      v-if="isShowhistorySearchRanking"
      :data="historySearchRankingData"
      @closeDialog="isShowhistorySearchRanking = false"
    ></history-search-ranking>
  </div>
</template>
<script>
import Config from "../../../config";
import elProgress from "../../../components/progress";
import { skuReg } from "@/utils/common";
import historySearchRanking from "../../dialog/historySearchRanking";
import {
  searchSales,
  searchIgnoreReview,
  searchTotalReview,
  rankPcProduct,
  rankPcShopName,
  rankPcCat,
  rankH5Product,
  rankH5ShopName,
  rankH5Cat,
  // rankWxProduct,
  // rankWxShopName,
  // rankWxCat,
  rankJXProduct,
  rankJXShopName,
  rankMShopName,
  rankMProduct,
  listRankHistoryData,
  rankRecordList, //查排名查询历史记录
  collectRankRecord, //收藏查询历史记录
  deleterankRecord //删除查排名历史记录
} from "../../../api/ranking";
import { mapState } from "vuex";

let timer = null;
export default {
  name: "ranking",
  data() {
    let keywordValidate = (rule, value, callback) => {
      let list =
        this.form.queryModel == "1"
          ? this.form.keywordsList1
          : this.form.keywordsList2;
      if (value == "" && list.length == 0) {
        callback(new Error("关键词不能为空"));
      }
      callback();
    };
    let skuValidate = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("sku不能为空"));
      } else if (!skuReg(value)) {
        callback(new Error("sku链接格式不正确"));
      } else {
        callback();
      }
    };
    let shopNameValidate = (rule, value, callback) => {
      if (value == "" && this.form.shopName.length == 0) {
        callback(new Error("店铺名称不能为空"));
      }
      callback();
    };
    return {
      Config,
      showResults: false,
      form: {
        queryPort: "1",
        queryModel: "1",
        keywordsList1: [],
        keyword1: "",
        keywordsList2: [],
        keyword2: "",
        sku1: "",
        sku2: "",
        shopName: "",
        sortMode: "1",
        pageStart: 1
      },
      formRules: {
        keyword1: [{ validator: keywordValidate, trigger: ["blur"] }],
        keyword2: [{ validator: keywordValidate, trigger: ["blur"] }],
        sku1: [{ validator: skuValidate, trigger: ["blur"] }],
        sku2: [{ validator: skuValidate, trigger: ["blur"] }],
        shopName: [{ validator: shopNameValidate, trigger: ["blur"] }]
      },
      queryPort: 1, //保存查询成功返回的查询端口
      sortMode: 1, //保存查询成功返回的排序方式
      page: {
        "11": { pageEnd: 50 }, //PC-指定商品
        "12": { pageEnd: 30 }, //PC-指定店铺
        "13": { pageEnd: 50 }, //PC-类目排名
        "21": { pageEnd: 50 }, //APP-指定商品
        "22": { pageEnd: 30 }, //APP-指定店铺
        "23": { pageEnd: 50 }, //APP-类目排名
        "31": { pageEnd: 50 }, //京喜- 指定商品
        "32": { pageEnd: 30 }, //京喜-指定店铺
        "41": { pageEnd: 50 }, //M端-指定商品
        "42": { pageEnd: 30 } //M端-指定店铺
      },
      pagination: {
        //指定店铺的分页
        page: 1,
        size: 10,
        total: null
      },
      sliderRanking: 1, //查询范围的排名
      minPage: 1,
      maxPage: 100,
      tableData: [],
      progressNumber: 0,
      progressToggle: false,
      request: null, //查询的请求接口
      isShowhistorySearchRanking: false,
      historySearchRankingData: [],
      inpKeywordNum: 5, //可输入的查询关键词的个数
      searchHistoryData: {}, //查询记录
      isShowSearchHistory: false,
      mouseIsOnSearchHistoryBox: false
    };
  },
  components: {
    elProgress,
    historySearchRanking
  },
  computed: {
    ...mapState(["isLogin"]),
    sliderRange() {
      //排名范围大小 = 页数*n
      let n = 0,
        page = this.page[this.form.queryPort + this.form.queryModel].pageEnd;
      if (this.form.queryPort === "1") {
        n = 60;
      } else {
        n = 10;
      }
      return [page, page * n];
    }
  },
  mounted() {
    this.getSearchHistoryRecord();
  },
  methods: {
    checkLogin() {
      //检查是否已登录
      if (!this.isLogin) {
        this.$store.commit("LOGIN_MODAL_TOGGLE", {
          toggle: true,
          loginType: 2
        });
        return;
      } else {
        this.search();
      }
    },
    async search() {
      //查询
      this.pagination.page = 1
      this.$refs["form"].validate(async valid => {
        if (valid) {
          await this.judgeRequest();
          this.progressStart();
          let pageEnd = this.page[this.form.queryPort + this.form.queryModel]
            .pageEnd;
          let obj = {
            "1": {
              clientType: this.form.queryPort,
              searchWord: this.dealKeyword(),
              skuId: skuReg(this.form.sku1),
              sortType: this.form.sortMode,
              priceStart: "",
              priceEnd: "",
              pageStart: this.form.pageStart,
              pageEnd: pageEnd
            },
            "2": {
              clientType: this.form.queryPort,
              searchWord: this.dealKeyword(),
              shopName: this.form.shopName,
              sortType: this.form.sortMode,
              priceStart: "",
              priceEnd: "",
              pageStart: this.form.pageStart,
              pageEnd: pageEnd
            },
            "3": {
              clientType: this.form.queryPort,
              skuId: skuReg(this.form.sku2),
              sortType: this.form.sortMode,
              priceStart: "",
              priceEnd: "",
              pageStart: this.form.pageStart,
              pageEnd: pageEnd
            }
          };
          let params = obj[this.form.queryModel];
          const { data: res } = await this.request({ params });
          this.progressEnd();
          if (res.code == 200) {
            this.getSearchHistoryRecord(); //获取查询历史记录
            this.showResults = true;
            this.queryPort = res.data.rankPort;
            this.sortMode = res.data.sort;
            this.tableData = res.data.pcs ?res.data.pcs:(res.data.h5s?res.data.h5s:res.data);
            this.pagination.total = this.tableData.length
          } else {
            this.tableData = [];
            this.$message.error(res.msg);
          }
        }
      });
    },
    judgeRequest() {
      //根据查看端口和查询模式来选择不同的接口
      switch (this.form.queryPort) {
        case "1":
          switch (this.form.queryModel) {
            case "1":
              this.request = rankPcProduct;
              break;
            case "2":
              this.request = rankPcShopName;
              break;
            case "3":
              this.request = rankPcCat;
          }
          break;
        case "2":
          switch (this.form.queryModel) {
            case "1":
              this.request = rankH5Product;
              break;
            case "2":
              this.request = rankH5ShopName;
              break;
            case "3":
              this.request = rankH5Cat;
          }
          break;
        case "3":
          switch (this.form.queryModel) {
            case "1":
              this.request = rankJXProduct;
              break;
            case "2":
              this.request = rankJXShopName;
              break;
          }
          break;
        case "4":
          switch (this.form.queryModel) {
            case "1":
              this.request = rankMProduct;
              break;
            case "2":
              this.request = rankMShopName;
              break;
          }
      }
    },
    dealKeyword() {
      //处理关键词
      let list =
        this.form.queryModel == "1"
          ? this.form.keywordsList1
          : this.form.keywordsList2;
      let keyword =
        this.form.queryModel == "1" ? this.form.keyword1 : this.form.keyword2;
      let keywordsStr = "";

      if (list.length === 0) {
        keywordsStr = keyword;
      } else {
        keywordsStr = list.join(",");
        if(keyword){
          keywordsStr += "," + keyword;
        }
      }
      return keywordsStr;
    },
    async getSearchHistoryRecord() {
      //查询历史记录
      const { data: res } = await rankRecordList();
      if (res.code === 200) {
        let obj = {
          "1": [],
          "2": [],
          "3": []
        };
        res.data.forEach(item => {
          obj[item.rankType].push(item);
        });
        this.searchHistoryData = obj;
      }
    },
    async collectSearchHistory(id, isCollect) {
      //收藏查询历史记录
      if (isCollect === 1) return;
      const params = {
        id
      };
      const { data: res } = await collectRankRecord({ params });
      if (res.code === 200) {
        this.getSearchHistoryRecord();
      }
    },
    async delSearchHistory(id) {
      //删除查询历史记录
      const params = {
        id
      };
      const { data: res } = await deleterankRecord({ params });
      if (res.code === 200) {
        this.getSearchHistoryRecord();
      }
    },
    mouseOver(e) {
      //鼠标移入查询历史列表
      this.mouseIsOnSearchHistoryBox = true;
    },
    mouseLeave(e) {
      //鼠标移出查询历史列表
      this.mouseIsOnSearchHistoryBox = false;
    },
    handleClickSearchHistoryBox() {
      //点击查询历史记录的盒子
      this.$refs.myInput.focus();
    },
    selectRow(item) {
      //选择行
      this.$refs.form.clearValidate(); //清除校验
      switch (this.form.queryModel) {
        case "1":
          this.form.keywordsList1 = this.splitKeyword(item.keyword);
          this.form.keyword1 = ''
          this.form.sku1 = item.sku;
          break;
        case "2":
          this.form.keywordsList2 = this.splitKeyword(item.keyword);
          this.form.keyword2 = ''
          this.form.shopName = item.shopName;
          break;
        default:
          this.form.sku2 = item.sku;
      }
      this.isShowSearchHistory = false;
      this.mouseIsOnSearchHistoryBox = false
    },
    splitKeyword(keywordString) {
      let list = keywordString.split(",");
      if (list.length > this.inpKeywordNum) {
        list.splice(this.inpKeywordNum);
      }
      return list;
    },
    changeQueryModel() {
      this.$refs.form.clearValidate();
      this.isShowSearchHistory = false;
    },
    clearValidate(propValue) {
      this.$refs.form.clearValidate(propValue);
      if (
        propValue === "keyword1" ||
        propValue === "keyword2" ||
        propValue === "sku2"
      ) {
        this.isShowSearchHistory = true;
      } else {
        this.isShowSearchHistory = false;
      }
    },
    // sku输入框,关键词输入框失去焦点隐藏查询历史
    async hideSearchHistory() {
      console.log(this.mouseIsOnSearchHistoryBox)
      if (!this.mouseIsOnSearchHistoryBox) {
        //鼠标不在查询历史列表上，失去焦点就把历史列表隐藏
        this.isShowSearchHistory = false;
      }
    },
    progressStart() {
      //进度条开始跑
      this.progressToggle = true;
      this.progressNumber = 0;
      timer = setInterval(() => {
        this.progressNumber++;
        if (this.progressNumber >= 98) {
          this.progressNumber = 98;
        }
      }, 200);
    },
    progressEnd() {
      //查询结束
      clearInterval(timer);
      this.progressToggle = false;
      this.progressNumber = 0;
    },
    async reviewHistorySearchRanking(row) {
      //点击历史查询排名
      const params = {
        keyword: row.searchWord,
        sku: row.skuId,
        rankType: this.queryPort,
        sortType: this.sortMode
      };
      const { data: res } = await listRankHistoryData({ params });
      if (res.code === 200) {
        this.historySearchRankingData = res.data;
        this.isShowhistorySearchRanking = true;
      } else {
        this.$message.error(res.msg);
      }
    },
    async checkSales(row, index) {
      //查询30天销量
      let item = row;
      item.checkSalesLoading = true;
      this.$set(this.tableData, index, item);
      let { data: results } = await searchSales({
        params: { skuId: row.skuId }
      });
      item.checkSalesLoading = false;
      this.$set(this.tableData, index, item);
      const CALLBACK = {
        200: () => {
          this.tableData[index].sales = results.data;
        },
        default: () => {}
      };
      CALLBACK[results.code]
        ? CALLBACK[results.code]()
        : CALLBACK[results.code]("default");
    },
    async checkCommentsNum(rowData, index) {
      //查询总评价量
      let item = rowData;
      item.checkCommentsNumLoading = true;
      this.$set(this.tableData, index, item);
      let { data: results } = await searchTotalReview({
        params: { skuId: rowData.skuId }
      });
      item.checkCommentsNumLoading = false;
      this.$set(this.tableData, index, item);
      const CALLBACK = {
        200: () => {
          this.tableData[index].commentsNum = results.data;
        },
        default: () => {}
      };
      CALLBACK[results.code]
        ? CALLBACK[results.code]()
        : CALLBACK[results.code]("default");
    },
    async checkLimit(row, index) {
      //查忽略评价数
      let item = row;
      item.checkLimitLoading = true;
      this.$set(this.tableData, index, item);
      let { data: results } = await searchIgnoreReview({
        params: { skuId: row.skuId }
      });
      item.checkLimitLoading = false;
      this.$set(this.tableData, index, item);
      const CALLBACK = {
        200: () => {
          this.tableData[index].ignoreCommentsNum = results.data;
        },
        default: () => {}
      };
      CALLBACK[results.code]
        ? CALLBACK[results.code]()
        : CALLBACK[results.code]("default");
    },
    addRankMonitor(row) {
      this.$router.push("/dataMonitoring/rankingMonitoring");
      this.$store.commit("rank_monitor_sku", row.skuId);
      this.$store.commit("rank_monitor_keyword", row.searchWord);
    },
    changePort() {
      //查看端口绑定值变化时触发
      //选中京喜端或者M端时，如果查看模式是类目排名，就把查看模式改为指定商品
      if (
        (this.form.queryPort == "3" || this.form.queryPort == "4") &&
        this.form.queryModel == "3"
      ) {
        this.form.queryModel = "1";
      }
    },
    delKeyword(index, type) {
      //删除关键词
      type == "1"
        ? this.form.keywordsList1.splice(index, 1)
        : this.form.keywordsList2.splice(index, 1);
    },
    addkeyword(keyword,list) {
      //增加关键词
      //最多可添加三个关键词
      if (list.length < this.inpKeywordNum) {
        if (keyword === "") return;
        list.push(keyword);
        keyword = "";
      }
      this.form.queryModel==='1'?this.form.keyword1=keyword:this.form.keyword2=keyword
    },
    tablePageChange(currentPage) {
      //指定店铺分页
      this.pagination.page = currentPage;
      document.querySelector(".query-results").scrollIntoView(true);
    },
    reset() {
      //重置
      this.form.keyword1 = "";
      this.form.keywordsList1 = [];
      this.form.keyword2 = "";
      this.form.keywordsList2 = [];
      this.form.shopName = "";
      this.form.sku1 = "";
      this.form.sku2 = "";
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  // height: 100%;
  .modul {
    background-color: #fff;
  }
  .instant-query {
    padding: 30px 10px 20px;
    border-radius: 10px;
    box-shadow:0px 3px 24px 0px rgba(168,168,236,0.22);
    .query-options {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      position: relative;
      .form {
        width: 549.8px;
      }
      /deep/ .el-form-item {
        margin-bottom: 18px;
      }
      /deep/ .el-form-item__label {
        color: #333;
        height:30px;
        line-height:30px;
      }
      /deep/ .el-form-item__content {
        display: flex;
        align-items: center;
        height:30px;
      }
      /deep/ .el-radio-button {
        margin-right: 10px;
      }
      /deep/ .el-radio-button__inner {
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        width: 80px;
        height:30px;
        padding: 0;
        line-height: 30px;
        box-shadow: none;
      }
      /deep/ .el-input {
        width: 440px !important;
      }
      /deep/ .el-input__inner {
        min-width: 71px !important;
        height: 30px;
      }
      .icon-wenhao-guanjianci {
        color: #909399;
        margin-left: 3px;
      }
      .icon-wenhao-fawei {
        color: #909399;
        margin-left: 5px;
        line-height: 40px;
      }
      .el-button {
        width: 120px;
        padding: 0;
        line-height: 30px;
      }
      .slider {
        display: flex;
        align-items: center;
        .slider-box {
          display: flex;
          justify-content: space-between;
          .slider-runway {
            width: 263px;
            margin-right: 20px;
          }
          .slider-page-ranking {
            font-size: 12px;
            color: #999;
          }
        }
        .slider-tips {
          display: flex;
          font-size: 12px;
          color: #999;
        }
      }
      .btn-group {
        display: flex;
        .btn-primary:hover {
          background-color: #3159e4;
        }
        .btn-none {
          color: #4d75ff;
          border: 1px solid #4d75ff;
          background-color: #fff;
        }
        .btn-none:hover {
          color: #fff;
          background-color: #4d75ff;
        }
      }
      .progress {
        margin-bottom: 10px;
      }
      //查询历史记录
      .search-history-box {
        position: absolute;
        top: 135px;
        left: 282px;
        z-index: 1002;
        padding: 20px 0 13px 16px;
        background-color: #ffff;
        border-radius: 10px;
        box-shadow: 0px 3px 24px 0px rgba(168, 168, 236, 0.22);
      }
      .triangle {
        width: 0;
        height: 0;
        border-width: 0 4px 4px;
        border-style: solid;
        border-color: #f0f0fc #f0f0fc #f7f7fd;
        box-shadow: 10px 3px 24px 10px rgba(168, 168, 236, 0.22);
        position: absolute;
        top: -4px;
        left: 35px;
      }
      .search-history {
        min-width: 425px;
        max-height: 245px;
        overflow-y: auto;
        padding-right: 16px;
        .row + .row {
          margin-top: 10px;
        }
        .row {
          height: 53px;
          border-radius: 5px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          &:hover {
            cursor: pointer;
            background-color: #f8f8f8;
          }
          .sku,
          .shopName,
          .keyword,
          .collect,
          .collected,
          .delete {
            padding: 0 10px;
            text-align: center;
          }
          .goodsImg-box {
            display: flex;
            align-items: center;
            .goodsImg {
              width: 35px;
              height: 38px;
              padding: 8px 9px 7px;
            }
          }
          .sku {
            width: 110px;
          }
          .keyword {
            width: 250px;
          }
          .shopName {
            width: 150px;
          }
          .keyword,
          .shopName {
            overflow: hidden;
            display: -webkit-box;
            /* ! autoprefixer: off */
            -webkit-box-orient: vertical;
            /* autoprefixer: on */
            -webkit-line-clamp: 1;
          }
          .collect {
            color: var(--DBlue);
            &:hover {
              color: var(--JBlue);
            }
          }
          // 已收藏
          .collected {
            color: #999;
          }
          // 删除
          .delete {
            color: #f30213;
            &:hover {
              color: #f00;
            }
          }
        }
      }
    }
    .query-results {
      margin-top: 25px;
      .el-table {
        border: 1px solid #ebeef5;
        border-bottom: 0;
        .num-box {
          display: flex;
          justify-content: center;
          .is-relation-sku {
            color: #999;
            font-size: 14px;
            width: 65px;
            height: 20px;
            background: rgba(229, 241, 255, 1);
            border-radius: 2px;
            line-height: 20px;
          }
        }
      }
      .title {
        font-size: 14px;
        color: #666;
        padding-bottom: 10px;
      }
      .recommend-btn-box {
        display: flex;
        justify-content: center;
      }
      .recommend-btn {
        width: 65px;
        height: 23px;
        line-height: 23px;
        text-align: center;
        font-size: 14px;
        background-color: #f30213;
        border-radius: 2px;
        color: #fff;
        display: block;
        user-select: none;
        cursor: pointer;
        border-color: #f30213;
        width: 65px;
      }
      .goods-url-box {
        display: flex;
        align-items: center;
        text-align: center;
        a {
          color: #333;
          display: -webkit-box;
          /* ! autoprefixer: off */
          -webkit-box-orient: vertical;
          /* autoprefixer: on */
          -webkit-line-clamp: 2;
          overflow: hidden;
          flex: 1;
        }
        .table-item-img {
          width: 40px;
          height: 40px;
          margin-right: 5px;
        }
      }
      .opreate-box {
        display: flex;
        flex-direction: column;
        text-align: left;
        font-size: 14px;
        color: var(--themeColor);
        span {
          cursor: pointer;
        }
      }
      .pagination{
        text-align: center;
        padding-top:10px;
      }
    }
  }
}
</style>
<style >
.el-slider__button-wrapper::after {
  background-color: #f00 !important;
}
</style>