import Vue from 'vue';
import Router from 'vue-router';
import index from './index.vue';
import customerStatement from './views/customerStatement.vue';
import vendorStatement from './views/vendorStatement.vue';
import cus_already from './views/cus_already.vue';
import vendor_already from './views/vendor_already.vue';

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
        {
          path: '/cus_already',
          name: '/cus_already',
          component: cus_already,
        },
        {
          path: '/vendor_already',
          name: '/vendor_already',
          component: vendor_already,
        },
      ],
    },
  ],
});
