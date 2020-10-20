<!--升级对话框-->
<template>
  <div class="container">
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="isShowDialog"
      :center="true"
      @close="closeDialog"
      width="601px"
      class="dialog"
    >
    <div class="title">详情分析</div>
      <el-table class="table" :data="tableData" v-loading="tableLoading">
        <el-table-column label="促销信息" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.promotions.length">
              <div
                v-for="(item, index) in scope.row.promotions"
                :key="index"
                class="promotions-btn"
              >{{item}}</div>
            </div>
            <div v-else>暂无数据</div>
          </template>
        </el-table-column>
        <el-table-column prop="clockNum" label="预热关注量" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.clockNum">{{scope.row.clockNum}}</div>
            <div v-else>PlUS专享商品没有预热关注量</div>
          </template>
        </el-table-column>
        <el-table-column prop="soldRate" label="是否售罄" align="center">
          <template slot-scope="scope">
            <div class="is-sales-end">
              {{scope.row.soldRate}}
              <img
                src="../../assets/images/isSalesEnd.png"
                v-if="isSalesEnd"
                alt
              />
            </div>
          </template>
        </el-table-column>
      </el-table>
      <a
        class="link"
        :href="Config.rqbUrl + 'newReleaseIndex/jd/spike-reminder'"
        target="_blank"
        v-baidu-count="{event:'外部跳转转化',value:'功能引流转化',label:`秒杀分析-人气宝`}"
      >秒杀是根据预约关注量进行排序的，开场排序靠前销量才能爆。想爆，就用人气宝！</a>
    </el-dialog>
  </div>
</template>
<script>
import { getMiaoshaDetail, searchSzSaleNum } from "../../api/secondKill.js";
import Config from "../../config";
export default {
  data() {
    return {
      isShowDialog: true,
      tableData: [],
      Config,
      tableLoading:true
    };
  },
  props: {
    pid: {
      type: Number,
      default: 1
    }
  },
  computed: {
    isSalesEnd() {
      if (this.tableData) {
        let soldRate = this.tableData[0].soldRate;
        let isOverNum = Number(soldRate.replace("%", ""));
        return isOverNum && isOverNum >= 100;
      }
      return false;
    }
  },
  created(){
    this.render()
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
    async render() {
      this.tableLoading = true
      let { data: res } = await getMiaoshaDetail({
        params: { id: this.pid }
      });
      this.tableLoading = false
      if (res.code) {
        this.tableData = [res.data];
      }
    }
  }
};
</script>
<style lang="scss" scoped>
// 权限不够弹框
.dialog {
  .title{
    text-align: center;
    height:30px;
    font-size:16px;
    font-weight:bold
  }
  .table {
    border: 1px solid #eee;
    .is-sales-end{
      display: flex;
      justify-content: center;
      align-items: center;
      img{
        margin-left:3px;
      }
    }
  }
  .link {
    text-align: center;
    margin-top: 31px;
    display: block;
    color: var(--DBlue);
    font-size: 14px;
  }
  .link:hover {
    color: var(--JBlue);
  }
}
</style>