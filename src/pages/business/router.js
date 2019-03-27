import Vue from 'vue';
import Router from 'vue-router';
import index from './index.vue';
import dly_way from './views/dly_way.vue';
import order from './views/order.vue';
import goods from './views/goods.vue';
import car_loading from './views/car_loading.vue';
import transport from './views/transport.vue';
import split_cargo from './views/split_cargo.vue';
Vue.use(Router);

export default new Router({
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
      ],
    },
  ],
});
