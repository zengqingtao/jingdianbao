<template>
  <div class="app-main">
    <div class="app-main-content">
      <div class="content">
        <router-view />
      </div>
    </div>
    <fix-advertise class="rightFix-box" v-if="isIntroduction&&isLogin"></fix-advertise>
  </div>
</template>
<script>
import fixAdvertise from "../../components/fixAdvertise";
import { mapState } from "vuex";
export default {
  data() {
    return {
      isIntroduction:true
    };
  },
  computed: { ...mapState(["isLogin"]) },
  components: { fixAdvertise },
  watch: {
    "$route.fullPath": {
      handler(value) {
        if(value==='/member'){
          this.isIntroduction=false
        }else{
          this.isIntroduction=true
        }
      },
      immediate: true
    }
  }
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
    display: flex;
    width: 100%;
  }
  .content {
    width: 100%;
    margin-top: 90px;
  }
}
</style>