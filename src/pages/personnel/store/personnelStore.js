import Vue from 'vue';
import Vuex from 'vuex';
import _ from 'lodash';
import { Message } from 'element-ui';
import * as types from './mutation-types';

Vue.use(Vuex);

const api = {
  //用户
  userList: '/akyl/user/user_list',
  userSave: '/akyl/user/user_save',
  userEdit: '/akyl/user/user_edit',
  userDelete: '/akyl/user/user_delete',
  //角色
  roleList: '/akyl/role/role_list?skip=0&limit=100',
  roleSave: '/akyl/role/role_save',
  roleEdit: '/akyl/role/role_edit',
  roleDelete: '/akyl/role/role_delete',
  //客户
  clientList: '/zhwl/client/client_list',
  clientEdit: '/zhwl/client/client_edit',
  clientDelete: '/zhwl/client/client_delete',
  clientSave: '/zhwl/client/client_save',
};

export const state = () => ({
  clientList: [],
});

export const mutations = {
  [types.CLIENT_LIST](state, payload) {
    state.clientList = payload;
  },
};

export const actions = {
  //查询客户列表
  async getClientList({ commit }, payload) {
    const { skip, limit } = payload;
    try {
      let result = await this.$axios.get(`${api.clientList}?skip=${skip}&limit=${limit}`);
      if (result.rescode === '0') {
        commit(types.CLIENT_LIST, result.clientList);
        return result.totalRow;
      }
    } catch (err) {
      Message.error('接口加载失败');
      console.error(err);
    }
  },
  //模糊查询客户列表方法
  async getClientListLike({ commit }, payload) {
    const { skip, limit } = payload;
    try {
      let result = await this.$axios.get(`${api.clientList}?skip=${skip}&limit=${limit}`);
      if (result.rescode === '0') {
        commit(types.CLIENT_LIST, result.clientList);
        return result.totalRow;
      }
    } catch (err) {
      Message.error('接口加载失败');
      console.error(err);
    }
  },
};
