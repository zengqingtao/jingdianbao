
<template>
  <div class="login">
    <div class="logo" >
      <img @click="toHomePage"  src="../../assets/images/login/jdb-logo.png" alt />
      <p>做京东用京店宝</p>
    </div>
    <div class="content">
      <div class="content-box">
        <img src="../../assets/images/login/login-bg.png" alt />
        <service-agreement v-if="serviceModalToggle"></service-agreement>
        <router-view />
      </div>
    </div>
    <app-footer />
  </div>
</template>

<script>
import appFooter from '@/components/footer'
import serviceAgreement from '../../components/serviceAgreement'
import {mapState, mapMutations} from 'vuex';
import EventBus from '@/utils/eventBus.js'
export default {
  name: "login",
  data(){
    return{

    }
  },
  components: { appFooter,serviceAgreement },
  computed: mapState(['serviceModalToggle']),
  created(){
     document.scrollingElement.scrollTop = 0; //让页面滚动到最顶部
  },
  methods:{
    toHomePage(){
      let path = "/"
      this.$router.push(path)
    }
  }
};
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  flex-direction: column;
  .logo {
    display: flex;
    align-items: flex-end;
    justify-content: flex-start;
    width: 1200px;
    height:90px;
    margin: 0 auto;
    padding-bottom:15px;
    img {
      display: block;
      cursor: pointer;
    }
    p {
      font-size: 18px;
      color: #999;
      padding: 0 0 10px 10px;
    }
  }
  .content {
    width: 100%;
    height: 583px;  
    background: linear-gradient(
      0deg,
      rgba(88, 166, 233, 1) 0%,
      rgba(76, 135, 222, 1) 48%,
      rgba(78, 95, 217, 1) 100%
    );
    .content-box {
      margin: 0 auto;
      width: 1200px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      height: 583px;
    }
    img {
      margin-right: 140px;
    }
  }
}
</style>

