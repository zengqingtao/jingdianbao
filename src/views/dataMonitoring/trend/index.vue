<template>
  <div class="big-box">
    <app-header></app-header>
    <div class="main">
      <router-view />
    </div>
  </div>
</template>
<script>
import appHeader from "../../../components/header";
export default {
  components: {
    appHeader
  }
};
</script>
<style lang="scss" scoped>
.big-box {
  background-color: #fff;
}
.main {
  width: 1200px;
  height: calc(100vh - 120px);
  margin: 0 auto;
}
</style>