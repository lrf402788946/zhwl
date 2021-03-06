import Vue from 'vue';
import Router from 'vue-router';
import index from './index.vue';
import dly_way from './views/dly_way.vue';
import order from './views/order.vue';
import goods from './views/goods.vue';
import car_loading from './views/car_loading.vue';
import transport from './views/transport.vue';
import split_cargo from './views/split_cargo.vue';
import cost from './views/cost.vue';
import out from './views/out.vue';
import in_page from './views/in.vue';
import newIn from './views/newIn.vue';
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
          path: '/dly_way',
          name: 'dly_way',
          component: dly_way,
        },
        {
          path: '/order',
          name: 'order',
          component: order,
        },
        {
          path: '/goods',
          name: 'goods',
          component: goods,
        },
        {
          path: '/car_loading',
          name: 'car_loading',
          component: car_loading,
        },
        {
          path: '/transport',
          name: 'transport',
          component: transport,
        },
        {
          path: '/split_cargo',
          name: 'split_cargo',
          component: split_cargo,
        },
        {
          path: '/cost',
          name: 'cost',
          component: cost,
        },
        {
          path: '/out',
          name: 'out',
          component: out,
        },
        {
          path: '/in_page',
          name: 'in_page',
          component: in_page,
        },
        {
          path: '/newIn',
          name: 'newIn',
          component: newIn,
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
