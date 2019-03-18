import Vue from 'vue';
import Router from 'vue-router';
import index from './index.vue';
import index_contant from './views/index_contant.vue';
import user from './views/user.vue';
import dly_way from './views/dly_way.vue';
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index,
      children: [
        {
          path: '/user',
          name: 'user',
          component: user,
        },
        {
          path: '/dly_way',
          name: 'dly_way',
          component: dly_way,
        },
      ],
    },
  ],
});
