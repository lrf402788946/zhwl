import Vue from 'vue';
import Router from 'vue-router';
import index from './index.vue';
import client from './views/client.vue';
import dept from './views/dept.vue';
import driver from './views/driver.vue';
import post from './views/post.vue';
import staff from './views/staff.vue';
Vue.use(Router);

export default new Router({
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
      ],
    },
  ],
});
