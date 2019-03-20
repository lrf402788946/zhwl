import Vue from 'vue';
import Router from 'vue-router';
import index from './index.vue';
import index_contant from './views/index_contant.vue';
// import user from './views/user.vue';
// import role from './views/role.vue';
import car from './views/car.vue';
import car_daily_detail from './views/car_daily_detail.vue';
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
          path: '/car',
          name: 'car',
          component: car,
        },
        {
          path: '/car_daily_detail',
          name: 'car_daily_detail',
          component: car_daily_detail,
        },
      ],
    },
  ],
});
