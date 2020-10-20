<template>
  <div class="app-layout" ref="app">
    <app-header />
    <personal-main />
    <app-footer />
    <transition name="el-fade-in-linear" v-if="loginModalToggle">
      <login-dialog :loginRegType="loginType"></login-dialog>
    </transition>
  </div>
</template>
<script>
import appHeader from "../../components/header";
import personalMain from "./personalMain";
import appFooter from "@/components/footer";
import loginDialog from "../../views/login/loginDialog";
import { mapState } from "vuex";
import EventBus from "@/utils/eventBus.js";
export default {
  name: "layout",
  data() {
    return {
      loginType: 2
    };
  },
  components: { appHeader, personalMain, appFooter, loginDialog },
  computed: {
    ...mapState(["loginModalToggle"])
  },
  created() {
    window.addEventListener("beforeunload", this.scrollToTop);
  },
  methods: {
    scrollToTop() {
      window.scrollTo(0, 0);
    }
  }
};
</script>
<style lang="scss" scoped>
.app-layout {
  width: 100%;
  background-color: #fff;
  overflow-x: hidden;
  overflow-y: auto;
  .footer {
    margin-top: 15px;
  }
}
</style>