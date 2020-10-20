<template>
  <div class="app-layout" ref="app">
    <app-header class="header" />
    <member-main />
    <transition name="el-fade-in-linear" v-if="loginModalToggle">
      <login-dialog :loginRegType="loginType"></login-dialog>
    </transition>
  </div>
</template>
<script>
import appHeader from "./header";
import memberMain from "./memberMain";
import loginDialog from "../../views/login/loginDialog";
import { mapState } from "vuex";
import EventBus from "@/utils/eventBus.js";
import { checkLogin } from '../../api/user';
export default {
  name: "layout",
  data() {
    return {
      loginType: 2
    };
  },
  components: { appHeader, memberMain, loginDialog },
  computed: {
    ...mapState(["loginModalToggle"])
  },
  mounted() {
    window.addEventListener("beforeunload", this.scrollToTop);
    EventBus.$on("login", () => {
      setTimeout(() => {
        location.reload();
      }, 1000);
    });
    this.checkLogin();
  },
  methods: {
    scrollToTop() {
      window.scrollTo(0, 0);
    },
    async checkLogin() {
      let { data: res } = await checkLogin();
      if (res.code !== 200) {
        this.$store.commit("LOGIN_MODAL_TOGGLE", {
          toggle: true,
          loginType: 2
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.app-layout {
  width: 100%;
  background-color: #ebf3ff;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
  .header {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
  }
}
</style>