import Vue from 'vue';
import Vuex from 'vuex';
import _ from 'lodash';
import { Message } from 'element-ui';
import * as types from './mutation-types';

Vue.use(Vuex);

const api = {
  login: '/akyl/user/login',
  userList: '/akyl/user/user_list',
  userSave: '/akyl/user/user_save',
  userEdit: '/akyl/user/user_edit',
  userDelete: '/akyl/user/user_delete',
};

export const state = () => ({
  userList: [],
  userDetail: {},
});

export const mutations = {
  [types.USER_LIST](state, payload) {
    state.userList = payload;
  },
};

export const actions = {
  //查询用户列表
  async getUserList({ commit }, payload) {
    const { skip, limit } = payload;
    try {
      let result = await this.$axios.get(`${api.userList}?skip=${skip}&limit=${limit}`);
      if (result.rescode === '0') {
        commit(types.USER_LIST, result.userList);
        return result.totalRow;
      }
    } catch (err) {
      Message.error('接口加载失败');
      console.error(err);
    }
  },
  //用户操作
  async userOperation({ commit }, { type, data }) {
    let result;
    try {
      if (type === 'userDelete') {
        result = await this.$axios.post(_.get(api, type), { data: { id: data } });
      } else {
        result = await this.$axios.post(_.get(api, type), { data: data });
      }
      if (result.rescode === '0') {
        Message.success('操作成功');
      } else {
        Message.error('操作失败');
        console.warn(`error in:${type}`);
      }
    } catch (err) {
      Message.error('操作失败');
      console.error(err);
    }
  },
};
