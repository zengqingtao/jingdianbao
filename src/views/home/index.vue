<template>
  <div class="home">
    <home-swiper />
    <hot-func />
    <new-featur />
    <div class="content" >
        <operation-strategy />
        <search-scholar />
    </div>
  </div>
</template>
<script>
import hotFunc from "./hotFunc";
import newFeatur from "./newFeatur"
import homeSwiper from "./swiper";
import searchScholar from './searchScholar'
import operationStrategy from './operationStrategy'
export default {
  name: "home",
  components: { hotFunc,newFeatur, homeSwiper, searchScholar,operationStrategy }
};
</script>
<style lang="scss" scoped>
.home {
  height: 100%;
  .content {
    display: flex;
    justify-content: space-between;
  }
}
</style>