import Vue from 'vue';
import Router from 'vue-router';
import index from './index.vue';
import index_contant from './views/index_contant.vue';
import goods from './views/goods.vue';
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index,
      children: [
        {
          path: '/goods',
          name: 'goods',
          component: goods,
        },
      ],
    },
  ],
});
