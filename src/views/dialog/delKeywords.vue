<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="showDialog"
      :center="true"
      @close="closeDialog"
      width="430px"
      class="dialog"
    >
      <div class="title">删除关键词</div>
      <div class="content">
        <el-table :data="tableData" class="table" height="403px">
          <el-table-column label="序号" align="center">
            <template slot-scope="scope">
              <div :class="scope.row.checked?'checked':''">{{scope.$index+1}}</div>
            </template>
          </el-table-column>
          <el-table-column label="关键词" prop="currentKeyword" align="center">
            <template slot-scope="scope">
              <div :class="scope.row.checked?'checked':''">{{scope.row.currentKeyword}}</div>
            </template>
          </el-table-column>
          <el-table-column label="选择" align="center">
            <template slot-scope="scope">
              <el-checkbox
                :key="scope.$index"
                v-model="scope.row.checked"
                @change="selectKeyword(scope.$index,scope.row.checked)"
              ></el-checkbox>
            </template>
          </el-table-column>
        </el-table>
        <div class="checkAll">
          <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <div class="checked-count">已选中{{checkedCount}}个</div>
        </div>
        <div class="pleaseSelectKeyword" v-if="!checkedCount&&isShowTips">请选择关键词</div>
        <div class="btn-group">
          <el-button
            type="primary"
            onfocus="this.blur()"
            @click="deleteKeyword"
            :loading="btnLoading"
          >删除</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {deleteKeyword} from "../../api/information"
export default {
  data() {
    return {
      showDialog: true,
      tableData: [],
      checkAll: false,
      checkedCount: 0,
      selectedKeywords:[],
      isShowTips:false
    };
  },
  props: {
    data: {
      type: Array
    }
  },
  created() {
    this.dealTableData();
  },
  methods: {
    dealTableData() {
      let list = this.data;
      this.tableData = [];
      list.forEach(element => {
          let obj = {}
        obj.checked = false;
        obj.currentKeyword = element.currentKeyword
        this.tableData.push(obj);
      });
    },
    selectKeyword(index, checked) {
      //选择关键词
      this.tableData[index].checked = checked;
      this.checkedCount = 0;
      this.selectedKeywords = [];
      this.tableData.forEach(element => {
        if (element.checked) {
          this.checkedCount++;
          this.selectedKeywords.push(element.currentKeyword);
        }
      });
      if (this.checkedCount == this.tableData.length) {
        this.checkAll = true;
      } else {
        this.checkAll = false;
      }
    },
    handleCheckAllChange() {
      // 全选
      this.tableData.forEach(element => {
        element.checked = this.checkAll;
      });
      if (this.checkAll) {
        this.checkedCount = this.tableData.length;
        this.selectedKeywords = this.tableData.map(item => {
          return item.currentKeyword;
        });
      } else {
        this.checkedCount = 0;
        this.selectedKeywords = [];
      }
    },
    async deleteKeyword(){
      if(this.selectedKeywords.length===0) return this.isShowTips = true
      let params = {
        keyword:this.selectedKeywords.join(",")
      }
      let {data:res} = await deleteKeyword({params})
      if(res.code==200){
        this.$emit("successDelete")
        this.closeDialog()
      }else{
        this.$message.error(res.msg)
      }
    },
    closeDialog() {
      this.$emit("closeDialog");
    }
  }
};
</script>
<style lang="scss" scoped>
.dialog {
  /deep/ .el-dialog--center .el-dialog__body {
    padding: 30px 15px 26px !important;
  }
  .title {
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
  }
  .content {
    .table {
      border: 1px solid #eee;
      border-bottom: 0;
      //   height: 403px;
    }
    /deep/ .el-table th,
    /deep/ .el-table td {
      border: 0;
    }
    /deep/ .el-table td,
    /deep/ .el-table th {
      padding: 6px 0;
    }
    .checked {
      color: var(--DBlue);
    }
    .checkAll {
      margin-top: 10px;
      display: flex;
      align-items: center;
      /deep/ .el-checkbox {
        margin-right: 10px;
        color: #333;
      }
      .checked-count {
        color: #999;
        font-size: 12px;
      }
    }
    .pleaseSelectKeyword {
      color: #f56c6c;
      text-align: center;
    }
    .btn-group {
      margin-top: 25px;
      text-align: center;
      /deep/ .el-button {
        width: 120px;
        height: 30px;
        color: #fff;
        padding: 0;
        border-color: #f30213ff;
        background-color: #f30213ff;
        &:hover {
          border-color: #f00 !important;
          background-color: #f00;
        }
      }
    }
  }
}
</style>
