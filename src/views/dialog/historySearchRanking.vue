<!--查排名-历史查询排名-->
<template>
  <div class="container">
    <el-dialog
      width="701px"
      :close-on-click-modal="false"
      :visible.sync="isShowDialog"
      :center="true"
      @close="closeDialog"
    >
      <el-table :data="tableData" class="table" max-height="400">
        <el-table-column label="时间" prop="searchDate">
          <template slot-scope="scope">
            <div>{{scope.row.searchDate.split(" ")[0]}}</div>
            <div>{{scope.row.searchDate.split(" ")[1]}}</div>
          </template>
        </el-table-column>
        <el-table-column label="关键词" prop="searchWord"></el-table-column>
        <el-table-column label="查询端口">
          <template slot-scope="scope">
            <div v-if="scope.row.rankType===1">PC端</div>
            <div v-if="scope.row.rankType===2">APP端</div>
            <div v-if="scope.row.rankType===3">京喜端</div>
            <div v-if="scope.row.rankType===4">M端</div>
          </template>
        </el-table-column>
        <el-table-column label="排序方式">
          <template slot-scope="scope">
            <div v-if="scope.row.sortType===1">综合排序</div>
            <div v-if="scope.row.sortType===2">销量排序</div>
            <div v-if="scope.row.sortType===3">评价排序</div>
            <div v-if="scope.row.sortType===4">新品排序</div>
            <div v-if="scope.row.sortType===5">价格排序</div>
          </template>
        </el-table-column>
        <el-table-column label="排名和位置" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.locationPage===0&&scope.row.locationRow===0&&scope.row.totalRank===0">不在查询范围内</div>
            <div v-else>
              <div>第{{scope.row.locationPage}}页-{{scope.row.locationRow}}位</div>
              <div>{{scope.row.totalRank}}名</div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isShowDialog: true,
      tableData: []
    };
  },
  props: {
    data: {
      type: Array
    }
  },
  created() {
    this.tableData = this.data;
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    }
  }
};
</script>
<style lang="scss" scoped>
.table {
  border: 1px solid #ebeef5;
  border-bottom: 0;
  /deep/ .cell {
    font-size: 12px;
    color: #333;
    text-align: center;
  }
}
</style>