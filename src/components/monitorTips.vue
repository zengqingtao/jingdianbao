<template>
  <div class="add-tips">
    <el-tooltip tabindex="-1" popper-class="tooltip" placement="right">
      <i class="iconfont icon-wenhao"></i>
      <div slot="content" class="tooltip-content">
        <div v-for="(item,index) in monitorTips" :key="index" :class="item.sort?'':'indent'">
          {{item.sort?(item.sort+'.'):''}}{{item.text}}
        </div>
      </div>
    </el-tooltip>
  </div>
</template>
<script>
export default {
  data(){
    return{
      monitorTips:[
        {sort:1,text:'监控商品后，每天9：00更新数据'},
        {sort:2,text:'若监控数据有异常，请点击【一键刷新】按钮，获取最新的数据。'},
        {sort:3,text:'会员过期31天后，超出监控上限的商品会被移送至【已失效分组】。'},
        {text:'【已失效分组】中的商品是会停止监控的。若需要重新监控商品，'},
        {text:'请升级会员等级，然后手动激活监控已失效的商品。'},
        {sort:4,text:'用户连续90天不活跃，商品也会被移送至【已失效分组】，'},
        {text:'需要用户手动重新激活监控已失效的商品。'}
      ]
    }
  },
  props:{
    content:{
      type:Array,
      default:[]
    }
  },
  mounted(){
    if(this.content.length>0)
    this.monitorTips =this.content
  }
}
</script>
<style lang="scss" scoped>
.add-tips {
  color: #333;
  font-size: 14px;
  font-weight: bold;
}
.tooltip-content {
  line-height: 18px;
  .indent {
    text-indent: 10px;
  }
  div:nth-child(2),
  div:nth-child(3),
  div:nth-child(6) {
    padding-top: 3px;
  }
}
</style>