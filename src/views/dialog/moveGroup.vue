<template>
  <div>
    <el-dialog
      :visible.sync="moveGroupVisible"
      :center="true"
      :close-on-click-modal="false"
      @close="closeDialog"
      width="530px"
      class="moveGroupDialog-dialog"
    >
      <div class="moveGroupDialog-body">
        <div class="moveGroup-title">移动至</div>
        <el-radio-group v-model="moveGroupRadio">
          <el-radio v-for="(item,i) in groupList.slice(0,groupList.length-1)" :key="i" :label="item.id">{{item.name}}</el-radio>
        </el-radio-group>
        <div class="btn-group">
          <el-button class="--btn-none" @click="closeDialog">取消</el-button>
          <el-button
            type="primary"
            class="--btn-primary"
            @click="confirmMoveGroup"
            onfocus="this.blur()"
          >确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { moveGroupRank,moveCompetingMonitorToGroup } from "../../api/monitor";
export default {
  data() {
    return {
      moveGroupVisible: true,
      moveGroupRadio: 0,
      groupList: [],
    };
  },
  props: {
    name: {
      type: String,
      default: "",
    },
    sku:{
        type:Number,
        default:""
    },
    monitorId:{
      type:Number,
      default:""
    },
    groupList:{
        type:Array,
        default:[]
    }
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
    async confirmMoveGroup() {
      const params = {
        monitorId:this.monitorId,
        sku: this.sku,
        groupId: this.moveGroupRadio,
      };
        const request = {
        rankMonitor: moveGroupRank,
        competitiveMonitor:moveCompetingMonitorToGroup
      };
      const { data: res } = await request[this.name]({ params });
      if (res.code === 200) {
        this.closeDialog();
        this.$emit("success");
      } else {
        this.$message.error(res.msg);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.moveGroupDialog-dialog {
  /deep/ .el-dialog__body {
    padding: 21px 30px !important;
  }
  .moveGroupDialog-body {
    text-align: center;
    .moveGroup-title {
      color: #333;
      font-size: 16px;
      font-weight: bold;
    }
    /deep/ .el-radio-group {
      display: flex;
      flex-wrap: wrap;
      padding: 20px 7px 31px;
      /deep/ .el-radio {
        margin: 9px 53px 9px 0;
        min-width: 99px;
        text-align: start;
      }
    }
    .btn-group {
      /deep/ .el-button {
        width: 120px;
        height: 30px;
        padding: 0;
      }
    }
  }
}
</style>