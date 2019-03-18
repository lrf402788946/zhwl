import Vue from 'vue';
import Vuex from 'vuex';
import _ from 'lodash';
import { Message } from 'element-ui';
import * as types from './mutation-types';

Vue.use(Vuex);

const api = {
  //路线
  dly_wayList: '/zhwl/dlyway/dly_way_list',
  dly_waySave: '/zhwl/dlyway/dly_way_save',
  dly_wayEdit: '/zhwl/dlyway/dly_way_edit',
  dly_wayDelete: '/zhwl/dlyway/dly_way_delete',
};

export const state = () => ({
  dly_wayList: [],
});

export const mutations = {
  [types.DLY_WAY_LIST](state, payload) {
    state.dly_wayList = payload;
  },
};

export const actions = {
  //查询路线列表
  async getdly_wayList({ commit }, payload) {
    const { skip, limit } = payload;
    try {
      let result = await this.$axios.get(`${api.dly_wayList}?skip=${skip}&limit=${limit}`);
      if (result.rescode === '0') {
        commit(types.DLY_WAY_LIST, result.dly_wayList);
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
        result = await this.$axios.post(_.get(api, type), {
          data: { id: data },
        });
      } else {
        result = await this.$axios.post(_.get(api, type), {
          data: data,
        });
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
  //权限管理
  async getRoleList({ commit }) {
    try {
      let result = await this.$axios.get(`${api.roleList}`);
      if (result.rescode === '0') {
        commit(types.ROLE_LIST, result.roleList);
        return result.totalRow;
      }
    } catch (err) {
      Message.error('接口加载失败');
      console.error(err);
    }
  },
  //路线操作
  async dlywayOperation({ commit }, { type, data }) {
    let result;
    try {
      if (type === 'roleDelete') {
        result = await this.$axios.post(_.get(api, type), {
          data: { id: data },
        });
      } else {
        result = await this.$axios.post(_.get(api, type), {
          data: data,
        });
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
