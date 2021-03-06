import Vue from 'vue';
import Vuex from 'vuex';
import _ from 'lodash';
import { Message } from 'element-ui';

Vue.use(Vuex);

const api = {
  login: '/api/user/login',
  updatePassword: '/api/user/pwd_edit',
  deptList: '/api/dept/dept_list?skip=0&limit=100',
  postList: '/api/post/post_list?skip=0&limit=100',
  //行政区划
  region: '/api/district/district_list', //params:pid
  //待办消息提醒
  msg: `/api/user/msg_list`,
  msgEdit: `/api/user/msg_edit`,
  msgDelete: `/api/user/msg_delete`,
};

export const state = () => ({
  limit: 15,
  userInfo: {},
  userRoleList: [],
  deptList: [],
  postList: [],
  menuList: [],
});

export const mutations = {
  //登录
  login(state) {
    if (sessionStorage.getItem('userInfo')) {
      state.userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
      state.menuList = JSON.parse(sessionStorage.getItem('menuList'));
      return true;
    } else {
      return false;
    }
  },
  // 登出
  logout(state) {
    state.userInfo = '';
    state.menuList = [];
    sessionStorage.removeItem('userInfo');
    sessionStorage.removeItem('menuList');
  },
  //存列表数据
  setList(state, { type, data }) {
    _.set(state, type, data);
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
        let result = await this.$axios.post(api.login, {
          data: data,
        });
        if (result.rescode === '0') {
          sessionStorage.setItem('userInfo', JSON.stringify(result.user));
          sessionStorage.setItem('menuList', JSON.stringify(result.menuList));
          Message.success(result.msg);
          return true;
        } else {
          Message.error(result.msg);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      return false;
    }
  },
  //获取其他列表,type:什么列表
  //可加载部门表,岗位表
  async loadOtherList({ commit }, payload) {
    const { type } = payload;
    if (type !== undefined) {
      try {
        let result = await this.$axios.get(_.get(api, type));
        if (result.rescode === '0') {
          let list = _.get(result, `${type}`).map(item => {
            let newObject = {
              text: item.dept_name,
              value: item.id,
            };
            return newObject;
          });
          let defalut = {
            text: '请选择部门',
            value: null,
            disabled: true,
          };
          list.unshift(defalut);
          commit('setList', { type: type, data: list });
        } else {
          Message.error(`部门表数据错误`);
        }
      } catch (error) {
        console.error(error);
      }
    }
  },
  //省市字典表
  async getRegion({ commit }, { pid }) {
    try {
      let result = await this.$axios.get(`${api.region}?pid=${pid}`);
      if (result.rescode === '0') {
        return {
          data: result.districtList,
        };
      } else {
        return { totalRow: 0, data: null };
      }
    } catch (err) {
      Message.error('接口加载失败');
      console.error(err);
    }
  },
  //注销
  async logout({ commit }) {
    commit('logout');
  },

  /**
   * 修改密码
   * @param form 含有login_id;password;newPassword
   */
  async updatePassword({ commit }, { form }) {
    try {
      let result = await this.$axios.post(api.updatePassword, {
        data: form,
      });
      if (result.rescode === '0') {
        Message.success('修改成功');
        return true;
      } else {
        Message.error(result.msg);
        return false;
      }
    } catch (error) {
      console.error(error);
    }
  },
  //消息
  async getMsg({ commit }) {
    let result = await this.$axios.get(`${api.msg}`);
    return result;
  },
  async editMsg({ commit }, payload) {
    let result = await this.$axios.post(`${api.msgEdit}`, {
      data: payload,
    });
    return result;
  },
  async deleteMsg({ commit }, payload) {
    let result = await this.$axios.post(`${api.msgDelete}`, {
      data: payload,
    });
    return result;
  },
};
