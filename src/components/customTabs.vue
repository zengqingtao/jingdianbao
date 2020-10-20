<!--自定义tabs标签-->
<template>
  <div class="container">
    <div class="tabs-group" >
      <ul>
        <li v-for="(item,i) in data" :key="i" :class="item.id===groupId?'is-active':''">
          <div class="tabs-label" ref="label" @click="tabClick(item.id,i)" :class="item.id===0&&name==='delCommentMonitor'?'tabs-label-margin':''">{{item.name}}</div>
          <div v-if="item.id===0&&name!=='delCommentMonitor'" class="tabs-operation">
            <i class="iconfont icon-tianjia" @click="addOrEditGroup()"></i>
          </div>
          <div v-if="item.id!==0&&item.id!==-1" class="tabs-operation">
            <i class="iconfont icon-bianji" @click="addOrEditGroup(item.name,item.id)"></i>
            <i class="iconfont icon-cuo" @click="openDeleteGroupDialog(item.id)"></i>
          </div>
        </li>
        <div class="tabs-active-bar" v-if="data.length"></div>
      </ul>
    </div>
    <el-dialog
      :visible.sync="editGroupVisible"
      :close-on-click-modal="false"
      :center="true"
      width="530px"
      @close="closeDialog"
      class="addOrUpdateGroupDialog"
    >
      <div class="dialog-body">
        <div class="title">{{editGroupName?'编辑分组':'添加分组'}}</div>
        <el-input
          type="textarea"
          v-model="editGroupName"
          :rows="1"
          :maxlength="5"
          :show-word-limit="true"
        ></el-input>
        <div class="error-tips" :class="errTipsVisible?'showError':''">请输入分组名称</div>
        <el-button type="primary" class="--btn-primary" @click="handleSave" onfocus="this.blur()">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="deleteGroupVisible"
      :center="true"
      :close-on-click-modal="false"
      width="370px"
    >
      <div class="deleteGroupDialog-body">
        <div class="delete-tips">删除分组后，分组内的作品将移动至“默认分组”。是否要删除该分组？</div>
        <div class="btn-group">
          <el-button class="--btn-none" @click="deleteGroupVisible=false">取消</el-button>
          <el-button type="primary" class="--btn-primary" @click="confirmDeleteGroup">删除</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { addRankMonitorGroup,addCompetingMonitorGroup, deleteRankGroup,deleteCompetingGroup } from "../api/monitor";
export default {
  data() {
    return {
      groupId: 0,
      editGroupVisible: false,
      editGroupName: null,
      editGroupId: null,
      errTipsVisible: false,
      deleteGroupVisible: false,
      deleteGroupId: null,
    };
  },
  props: {
    data: {
      type: Array,
      default: [],
    },
    name:{
      type:String,
      default:''
    }
  },
  watch: {
    groupId() {
      this.$emit("changeTabs",this.groupId);
    },
  },
  created() {

  },
  methods: {
    tabClick(id, i) {
      this.groupId = id;
      let doc = document.getElementsByClassName("tabs-active-bar")[0];
      let left = this.$refs.label[i].offsetLeft + "px"; //返回当前元素的相对水平偏移位置的偏移容器
      let width = this.$refs.label[i].clientWidth - 8 + "px"; //	在页面上返回内容的可视宽度（不包括边框，边距或滚动条）
      doc.style.width = `${width}`;
      doc.style.transform = `translateX(${left})`;
      doc.style.transition = ".3s";
    },
    addOrEditGroup(groupName, id) {
      if (groupName) {
        this.editGroupName = groupName;
        this.editGroupId = id;
      } else {
        if (this.data.length >=7)
          return this.$message.error("最多可新创建5个小组");
        this.editGroupName = null;
        this.editGroupId = null;
      }
      this.editGroupVisible = true;
    },
    async handleSave() {
      if (!this.editGroupName) return (this.errTipsVisible = true);
      const params = {
        groupName: this.editGroupName,
        groupId: this.editGroupId,
      };
      const request = {
        "rankMonitor":addRankMonitorGroup,
        "competitiveMonitor":addCompetingMonitorGroup
      }
      const { data: res } = await request[this.name]({ params });
      if (res.code === 200) {
        this.$emit("editSuccess", this.editGroupId ? 1 : "");
        this.editGroupVisible = false;
      } else {
        this.$message.error(res.msg);
      }
    },
    openDeleteGroupDialog(groupId) {
      this.deleteGroupId = groupId;
      this.deleteGroupVisible = true;
    },
    async confirmDeleteGroup() {
      let id = this.groupId
      let params = {
        groupId: this.deleteGroupId,
      };
      const request = {
        "rankMonitor":deleteRankGroup,
        "competitiveMonitor":deleteCompetingGroup
      }
      const { data: res } = await request[this.name]({ params });
      this.deleteGroupVisible = false;
      if (res.code === 200) {
        this.tabClick(0,0)
        this.$emit("deleteSuccess")
        if(id===0){
          this.$emit("changeTabs",this.groupId)
        }
      }else{
        this.$message.error(res.msg)
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.tabs-group {
  padding: 15px 30px 0;
  ul {
    height: 35px;
    line-height: 35px;
    font-size: 14px;
    color: #666;
    display: flex;
    justify-items: center;
    position: relative;
    li {
      display: flex;
      padding: 0 10px;
      &.is-active {
        color: var(--DBlue);
      }
      &:hover {
        color: var(--DBlue);
        .tabs-operation {
          color: var(--DBlue);
        }
      }
      .tabs-label {
        &:hover {
          cursor: pointer;
        }
      }
      .tabs-label-margin{margin-right:19px}
      .tabs-operation {
        color: #fff;
        .iconfont {
          cursor: pointer;
        }
        .icon-tianjia {
          font-weight: bold;
          margin-left:3px;
        }
        .icon-bianji {
          font-weight: bold;
          margin-left:3px;
        }
      }
    }
    li:first-child {
      padding-left: 0;
    }
    .tabs-active-bar {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 48px;
      height: 2px;
      margin-left: 4px;
      transform: translateX(0px);
      box-sizing: border-box;
      background-color: var(--DBlue);
      z-index: 1;
    }
  }
}
.addOrUpdateGroupDialog {
  .dialog-body {
    text-align: center;
  }
  /deep/ .el-dialog--center .el-dialog__body {
    padding: 21px 47px 39px 43px !important;
  }
  .title {
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    color: #333;
  }
  /deep/ .el-textarea {
    padding-top: 30px;
  }
  .error-tips {
    color: #fff;
    padding: 5px 0 15px 0;
  }
  .showError {
    color: #f30213;
  }
  /deep/ .el-button {
    width: 120px;
    height: 30px;
    padding: 0;
  }
}
.deleteGroupDialog-body {
  text-align: center;
  .delete-tips {
    padding: 10px 0;
    line-height: 20px;
  }
  .btn-group {
    padding-top: 30px;
    /deep/ .el-button {
      width: 120px;
      height: 30px;
      padding: 0;
    }
  }
}
</style>