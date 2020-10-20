<template>
  <div class="container">
    <div class="module">
      <div class="radio-group">
        <el-radio-group v-model="queryType" size="small" @change="changeRadio">
          <el-radio-button label="1">
            吐槽反馈
            <span class="redPoint" v-if="messageInfo.active"></span>
          </el-radio-button>
          <el-radio-button label="2">
            系统通知
            <span class="redPoint" v-if="messageInfo.system"></span>
          </el-radio-button>
        </el-radio-group>
      </div>
      <activity-message class="activity-component" v-if="queryType=='1'"></activity-message>
      <system-message v-if="queryType=='2'"></system-message>
    </div>
  </div>
</template>
<script>
import activityMessage from "./activityMessage";
import systemMessage from "./systemMessage";
import { mapState } from 'vuex';
export default {
  data() {
    return {
      queryType: "1",
    };
  },
  computed: {
    ...mapState(["messageInfo"])
  },
  components: {
    activityMessage,
    systemMessage
  },
  beforeDestroy(){
     let messageInfo = {
        active:false,
        system:this.messageInfo.system
      }
    if(this.queryType==='2'){
      messageInfo.system = false
    }
    this.$store.commit("CHANGE_MESSAGE_STATUS", messageInfo);
  },
  methods: {
    changeRadio() {
      let messageInfo = {
        active:this.messageInfo.active,
        system:this.messageInfo.system
      }
     if(this.queryType==='2'){
       messageInfo.active = false
     }else{
       messageInfo.system = false
     }
     this.$store.commit("CHANGE_MESSAGE_STATUS", messageInfo);
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
  box-shadow: 0px 3px 24px 0px rgba(168, 168, 236, 0.22);
  border-radius: 10px;
  padding: 20px;
}
.radio-group {
  /deep/ .el-radio-button {
    margin-right: 6px;
    position: relative;
    .redPoint {
      width: 8px;
      height: 8px;
      background-color: #f00;
      border-radius: 50%;
      position: absolute;
      right: 10px;
      top: 4px;
    }
  }
  /deep/ .el-radio-button__inner {
    width: 76px;
    height: 30px;
    border-radius: 0 !important;
    color: #999999 !important;
    border: 1px solid #999 !important;
    background-color: #fff;
    box-shadow: none !important;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  /deep/ .el-radio-button.is-active .el-radio-button__inner {
    border-color: var(--DBlue) !important;
    color: var(--DBlue) !important;
    background-color:#fff !important;
  }
  /deep/ .el-radio-button.is-active .el-radio-button__inner:hover {
    background-color: var(--DBlue) !important;
    color: #fff !important;
  }
  /deep/ .el-radio-button__inner:hover {
    border-color: var(--DBlue) !important;
    color: var(--DBlue) !important;
    background-color: #fff !important;
  }
}
.activity-component {
  margin-top: 17px;
}
</style>