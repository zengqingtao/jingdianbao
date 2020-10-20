<template>
  <div class="container">
    <div class="rule-item" v-for="(item,index) in ruleList" :key="index">
      <div class="rule-item-title">{{item.title}}</div>
      <div v-if="item.desc" class="rule-item-tip">{{item.desc}}</div>
      <div class="rule-item-point" v-for="(rule,i) in item.rule" :key="i">{{rule}}</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ruleList: [
        {
          title: "京币获取",
          rule: [
            "1.首次注册，赠送50个京币；",
            "2.吐槽送京币，吐槽将根据吐槽的质量赠送5-30京币；",
            "3.每日签到送京币，每日签到去抽奖都可以抽取到一定的京币；"
          ],
          desc: ""
        },
        {
          title: "京币消费",
          rule: [
            "1.查销量，查询时，扣5个京币；",
            "2.查留评率，查询时，扣10个京币；",
            "3.秒杀分析，查一个类目，扣10个京币；",
            "4.查行业，查询时，扣5个京币；",
            "5.查店铺，查询时，扣5个京币；",
            "6.查单品，查询时，扣5个京币；",
            "7.查流量，查询时，扣5个京币。"
          ],
          desc: "使用场景：限制次数的功能，次数用完之后，可以通过消耗京币查询"
        },
        {
          title: "其他规则",
          rule: [
            "1.京币在任何时候都不能办理退币；",
            "2.一个SKU在同个地方查询一天只扣一次京币；",
            "3.排名监控，添加监控达到会员限制的总个数之后，不能使用京币添加；",
            "4.竞品监控，添加监控达到会员限制的总个数之后，不能使用京币添加。"
          ],
          desc: ""
        }
      ]
    };
  }
};
</script>
<style lang="scss" scoped>
.rule-item{
    color:#333;
    font-size:14px;
    .rule-item-title{
        margin:38px 0 10px 0;
        font-weight:bold;
    }
    .rule-item-tip,.rule-item-point{
        line-height: 25px;
    }
}
</style>