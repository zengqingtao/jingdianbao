<template>
  <div class="consumption-box">
    <div class="consumption-options">
      <el-select v-model="activeOption">
        <el-option
          v-for="(item,index) in options"
          :key="index"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-date-picker
        v-model="searchDate"
        type="daterange"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
      <el-button type="primary" class="--btn-primary" :loading="searchLoading" @click="search">查询</el-button>
    </div>
    <div class="consumption-details">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="dateTime" label="时间"></el-table-column>
        <el-table-column prop="inOrOut" label="收支类型"></el-table-column>
        <el-table-column prop="desc" label="描述"></el-table-column>
        <el-table-column prop="jb" label="京币">
          <template
            slot-scope="scope"
          >{{scope.row.type === 1 ? `+${scope.row.jb}`:`-${scope.row.jb}`}}</template>
        </el-table-column>
        <el-table-column prop="now_jb" label="剩余京币"></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          v-if="pagination.total>10"
          prev-text="上一页"
          next-text="下一页"
          background
          layout="prev, pager, next"
          @current-change="changePage"
          :total="pagination.total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { getUserJbLog } from "../../../api/gold";
export default {
  data() {
    return {
      activeOption: "",
      options: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "1",
          label: "充值"
        },
        {
          value: "2",
          label: "支出"
        },
        {
          value: "3",
          label: "免费领取"
        }
      ],
      searchLoading: false,
      searchDate: "",
      tableData: [],
      pagination: {
        page: 1,
        total: 0
      }
    };
  },
  computed: {
    searchStartTime() {
      return this.searchDate ? this.searchDate[0] : "";
    },
    searchEndTime() {
      return this.searchDate ? this.searchDate[1] : "";
    }
  },
  created() {
    this.searchTable();
  },
  methods: {
    async searchTable() {
      let params = {
        page: this.pagination.page,
        type: this.activeOption,
        startTime: this.searchStartTime,
        endTime: this.searchEndTime
      };
      let { data: res } = await getUserJbLog(params);
      if (res.code === 200) {
        this.tableData = res.data.results;
        // this.pagination.page = res.data.pageNo;
        this.pagination.total = res.data.totalCount;
      } else {
        this.tableData = [];
        // this.pagination.page = 1;
        this.pagination.total = 0;
      }
    },
    changePage(currentPage) {
      this.pagination.page = currentPage;
      this.searchTable();
    },
    async search() {
      this.pagination.page = 1;
      this.searchLoading = true;
      await this.searchTable();
      this.searchLoading = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.consumption-box {
  .consumption-options {
    margin-top: 26px;
    /deep/ .el-select {
      margin-right: 26px;
    }
    /deep/ .el-select .el-input__inner {
      width: 120px;
      height: 30px;
    }
    /deep/ .el-select .el-input .el-select__caret {
      line-height: 30px;
    }
    /deep/ .el-range-editor.el-input__inner {
      height: 30px;
      line-height: 30px;
    }
    /deep/ .el-date-editor .el-range__icon {
      line-height: 22px;
    }
    /deep/ .el-date-editor .el-range-separator {
      line-height: 22px;
    }
    /deep/ .el-button {
      margin-left: 10px;
      width: 80px;
      height: 30px;
      padding: 0;
    }
  }
  .consumption-details {
    margin-top: 20px;
    .el-table {
      border: 1px solid #ebeef5;
      border-bottom: 0;
    }
  }
  .pagination{
    padding-top: 10px;
    text-align: center;
  }
}
</style>