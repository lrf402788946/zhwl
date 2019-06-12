import Vue from 'vue';
import Router from 'vue-router';
import index from './index.vue';
import client from './views/client.vue';
import dept from './views/dept.vue';
import driver from './views/driver.vue';
import post from './views/post.vue';
import staff from './views/staff.vue';
import contract from './views/contract/contract.vue';
import contract_project from './views/contract/contract_project.vue';
import dly_way from './views/contract/dly_way.vue';
import way from './views/contract/way.vue';
import supplier from './views/supplier.vue';
import supplier_contract from './views/supplier_contract.vue';
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
          path: '/client',
          name: 'client',
          component: client,
        },
        {
          path: '/dept',
          name: 'dept',
          component: dept,
        },
        {
          path: '/driver',
          name: 'driver',
          component: driver,
        },
        {
          path: '/post',
          name: 'post',
          component: post,
        },
        {
          path: '/staff',
          name: 'staff',
          component: staff,
        },
        {
          path: '/contract',
          name: 'contract',
          component: contract,
        },
        {
          path: '/contract_project',
          name: 'contract_project',
          component: contract_project,
        },
        {
          path: '/supplier',
          name: 'supplier',
          component: supplier,
        },
        {
          path: '/supplier_contract',
          name: 'supplier_contract',
          component: supplier_contract,
        },
        {
          path: '/dly_way',
          name: 'dly_way',
          component: dly_way,
        },
        {
          path: '/way',
          name: 'way',
          component: way,
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
