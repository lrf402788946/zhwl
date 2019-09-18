import Vue from 'vue';
import Vuex from 'vuex';
import _ from 'lodash';
import { Message } from 'element-ui';
import * as types from './mutation-types';

Vue.use(Vuex);

const api = {
  //客户
  clientList: '/api/client/client_list',
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
    const { skip, limit, type } = payload;
    try {
      let result = await this.$axios.get(`${api.clientList}?skip=${skip}&limit=${limit}&type=${type}`);
      if (result.rescode === '0') {
        commit(types.CLIENT_LIST, result.clientList);
        return result.totalRow;
      } else {
        commit(types.CLIENT_LIST, []);
        return result.totalRow;
      }
    } catch (err) {
      commit(types.CLIENT_LIST, []);
      Message.error('接口加载失败');
      console.error(err);
    }
  },
  //模糊查询客户列表方法
  async getClientListLike({ commit }, payload) {
    const { skip, limit, select_client_name, type } = payload;
    try {
      let result = await this.$axios.get(`${api.clientList}?skip=${skip}&limit=${limit}&type=${type}&name=${select_client_name}`);
      if (result.rescode === '0') {
        commit(types.CLIENT_LIST, result.clientList);
        return result.totalRow;
      } else {
        commit(types.CLIENT_LIST, []);
        return result.totalRow;
      }
    } catch (err) {
      commit(types.CLIENT_LIST, []);
      Message.error('接口加载失败');
      console.error(err);
    }
  },
};
