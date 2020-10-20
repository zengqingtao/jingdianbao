import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/'
import './theme/index.css';
import { isPC } from "./utils/common";
import { isRunBuild } from "./utils/checkEnv";
import echarts from 'echarts';
import VeLine from 'v-charts/lib/line.common'
import { BaiduCount, LimitInputNumber } from './directive'
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
Vue.config.productionTip = true;
Vue.prototype.$echart = echarts;

Vue.directive('baiduCount', BaiduCount);
Vue.directive('limit-input-number', LimitInputNumber);

Vue.component(VeLine.name, VeLine)

new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
});