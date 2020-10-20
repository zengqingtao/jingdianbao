<template>
  <div class="app-layout" id="app-layout" ref="app">
    <app-header />
    <home-main />
    <app-footer />
    <transition name="el-fade-in-linear" v-if="loginModalToggle">
      <login-dialog :loginRegType="loginType"></login-dialog>
    </transition>
  </div>
</template>
<script>
import appHeader from "../../components/header";
import homeMain from "./homeMain";
import appFooter from "@/components/footer";
import loginDialog from "../../views/login/loginDialog";
import { mapState } from "vuex";
import { checkLogin } from "@/api/user";
import EventBus from "@/utils/eventBus.js";
export default {
  name: "layout",
  data() {
    return {
      loginType: 2
    };
  },
  components: { appHeader, homeMain, appFooter, loginDialog },
  computed: {
    ...mapState(["loginModalToggle"])
  },
  mounted() {
    this.checkUserLogin();
    window.addEventListener("beforeunload", this.scrollToTop);
  },
  methods: {
    scrollToTop() {
      window.scrollTo(0, 0);
    },
    async checkUserLogin() {
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
  background-color: #fff;
  overflow-x: hidden;
  overflow-y: auto;
  .footer {
    margin-top: 15px;
  }
}
</style>