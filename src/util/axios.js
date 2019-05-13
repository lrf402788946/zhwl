import Vue from 'vue';
import axios from 'axios';
import store from '@/store/index';
import { Loading } from 'element-ui';
import { Message } from 'element-ui';
store.dispatch('login');
let userInfo = store.state.publics.userInfo;
let userRoleList = store.state.publics.userRoleList;
process.env.NODE_ENV === 'production' ? (axios.defaults.baseURL = 'http://192.168.1.217') : '';
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';

axios.interceptors.request.use(
  config => {
    let url = config.url;
    //过滤是否是管理员,管理员则不写login_id
    if (!(userRoleList.filter(item => item.role_code === 'ROLE_ADMIN').length > 0)) url = isLoginFilter(url);
    if (filterUrl(url)) {
      let loading = Loading.service({
        fullscreen: true,
        text: '请求中,请耐心等待',
      });
    }
    config.url = url;
    return config;
  },
  error => {
    let loading = Loading.service({});
    loading.close();
    Message.error('请求接口失败');
    console.error(error);
  }
);

axios.interceptors.response.use(
  response => {
    let url = response.config.url;
    if (filterUrl(url)) {
      let loading = Loading.service({});
      loading.close();
    }
    return response.data;
  },
  error => {
    let loading = Loading.service({});
    loading.close();
    Message.error('请求接口失败');
    console.error(error);
  }
);

/**
 * 过滤请求地址是否需要动画效果
 * @param url 请求地址
 */
let filterUrl = url => {
  if (url.includes('save')) return true;
  else if (url.includes('edit')) return true;
  else if (url.includes('delete')) return true;
  else return false;
};
/**
 * 过滤请求地址是否需要login_id区分自己可以看得数据
 * @param url 请求地址
 */
let isLoginFilter = url => {
  if (url.includes('order_list')) {
    url = newUrl(url);
  } else if (url.includes('transport_list')) {
    url = newUrl(url);
  } else if (url.includes('client_list')) {
    url = newUrl(url);
  } else if (url.includes('transportorder_sub_list')) {
    url = newUrl(url);
  }
  return url;
};

/**
 * 添加login_id
 * @param url 请求地址
 */
let newUrl = url => {
  if (url.includes('?')) {
    return `${url}&login_id=${userInfo.login_id}`;
  } else {
    return `${url}?login_id=${userInfo.login_id}`;
  }
};

export default axios;
