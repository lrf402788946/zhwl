import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const api = {
  login: '/akyl/user/login',
};

export const state = () => ({
  userInfo: {},
  userRoleList: [],
});

export const mutations = {
  //登录
  login(state) {
    if (sessionStorage.getItem('userInfo')) {
      state.userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
      return true;
    } else {
      return false;
    }
  },
  // 登出
  isLogout(state) {
    state.userInfo = '';
    state.userRoleList = [];
    sessionStorage.removeItem('userInfo');
    sessionStorage.removeItem('userRoleList');
  },
};

export const actions = {
  //检测登录与登录
  //1,if检测是否登录,若登录,则返回true
  //2,若未登录过,检测data是否有数据,判断是否是要登录
  //3,若data没有数据,则返回false,表示既没有登录,也不准备登录,只是检测
  async login({ commit }, payload) {
    let is_login = commit('login');
    if (is_login) {
      return true;
    } else if (payload !== undefined) {
      const { data } = payload;
      try {
        let result = await this.$axios.post(api.login, { data: data });
        if (result.data.rescode === '0') {
          sessionStorage.setItem('userInfo', JSON.stringify(result.data.user));
          sessionStorage.setItem('userRoleList', JSON.stringify(result.data.userRoleList));
        }
        return result.data;
      } catch (error) {
        console.log(error);
      }
    } else {
      return false;
    }
  },
};
