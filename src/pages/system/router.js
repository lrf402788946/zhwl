import Vue from 'vue';
import Router from 'vue-router';
import user from './views/user.vue';
import index from './index.vue';
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
      ],
    },
  ],
});
