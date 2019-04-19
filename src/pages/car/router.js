import Vue from 'vue';
import Router from 'vue-router';
import index from './index.vue';
import car from './views/car.vue';
import car_daily_detail from './views/car_daily_detail.vue';
import car_transport from './views/car_transport.vue';
import transport_pack from './views/transport_pack.vue';
import car_cost from './views/car_cost.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index,
      children: [
        {
          path: '/car',
          name: 'car',
          component: car,
        },
        {
          path: '/car_daily_detail',
          name: 'car_daily_detail',
          component: car_daily_detail,
        },
        {
          path: '/car_transport',
          name: 'car_transport',
          component: car_transport,
        },
        {
          path: '/transport_pack',
          name: 'transport_pack',
          component: transport_pack,
        },
        {
          path: '/transport_pack',
          name: 'transport_pack',
          component: transport_pack,
        },
        {
          path: '/car_cost',
          name: 'car_cost',
          component: car_cost,
        },
      ],
    },
  ],
});
