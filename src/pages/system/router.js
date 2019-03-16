import Vue from 'vue';
import Router from 'vue-router';
import index from './index.vue';
import index_contant from './views/index_contant.vue';
import user from './views/user.vue';
import role from './views/role.vue';
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index,
      children: [
        {
          path: '/',
          name: 'index_contant',
          component: index_contant,
        },
        {
          path: '/user',
          name: 'user',
          component: user,
        },
        {
          path: '/role',
          name: 'role',
          component: role,
        },
      ],
    },
  ],
});
