import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import '@/plugins/meta';
import '@/plugins/element';
import '@/plugins/filters';
import '@/plugins/axios';
import toExcel from '@/util/json2excel';

Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.prototype.$toExcel = toExcel;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
