<template>
  <div class="app-main">
    <div class="app-main-content">
      <side-bar class="sliderBar" />
      <div class="content">
        <router-view />
      </div>
    </div>
    <fix-advertise class="rightFix-box" v-if="isLogin"></fix-advertise>
  </div>
</template>
<script>
import sideBar from "./sideBar";
import fixAdvertise from "../../components/fixAdvertise";
import { mapState } from "vuex";
export default {
  name: "silderBar",
  data() {
    return {};
  },
  computed: {
    ...mapState(["isLogin"])
  },
  components: { sideBar, fixAdvertise }
};
</script>
<style lang="scss" scoped>
.app-main {
  position: relative;
  .rightFix-box {
    position: fixed;
    top: 235px;
    right: 0;
    z-index: 1100;
  }
  .app-main-content {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    .sliderBar {
      width: 224px;
    }
    .content {
      width: 966px;
      min-height: calc(100vh - 120px - 15px);
    }
  }
}
</style>