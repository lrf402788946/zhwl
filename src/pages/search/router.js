import Vue from 'vue';
import Router from 'vue-router';
import index from './index.vue';
import customerStatement from './views/customerStatement.vue';
import vendorStatement from './views/vendorStatement.vue';
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index,
      children: [
        {
          path: '/customerStatement',
          name: 'customerStatement',
          component: customerStatement,
        },
        {
          path: '/vendorStatement',
          name: 'vendorStatement',
          component: vendorStatement,
        },
      ],
    },
  ],
});
