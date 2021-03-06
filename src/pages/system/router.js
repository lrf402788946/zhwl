import Vue from 'vue';
import Router from 'vue-router';
import index from './index.vue';
import index_contant from './views/index_contant.vue';
import user from './views/user.vue';
import role from './views/role.vue';
import user_role from './views/user_role.vue';
import password from './views/password.vue';
import toLogin from '@/components/toLogin.vue';
Vue.use(Router);

const router = new Router({
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
        {
          path: '/user_role',
          name: 'user_role',
          component: user_role,
        },
        {
          path: '/password',
          name: 'update_pw',
          component: password,
        },
      ],
    },
    {
      path: '/toLogin',
      name: 'toLogin',
      component: toLogin,
    },
  ],
});
router.beforeEach((to, from, next) => {
  const is_login = sessionStorage.getItem('userInfo');
  if (is_login) {
    next();
  } else {
    if (to.path.includes('login') || to.path.includes('toLogin')) {
      next();
    } else if (to.path.includes('test')) {
      next();
    } else {
      next({ path: '/toLogin' });
    }
  }
});

export default router;
