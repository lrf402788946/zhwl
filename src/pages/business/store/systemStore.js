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
//vuex 存放变量
export const state = () => ({
  dlyWayList: [],
});

export const mutations = {
  [types.DLY_WAY_LIST](state, payload) {
    state.dlyWayList = payload;
  },
};

export const actions = {
  //查询路线列表
  async getdly_wayList({ commit }, payload) {
    const { skip, limit } = payload;
    try {
      let result = await this.$axios.get(`${api.dly_wayList}?skip=${skip}&limit=${limit}`);
      if (result.rescode === '0') {
        commit(types.DLY_WAY_LIST, result.dlyWayList);
        return result.totalRow;
      }
    } catch (err) {
      Message.error('接口加载失败');
      console.error(err);
    }
  },
  //模糊查询路线列表
  async getdly_wayListlike({ commit }, payload) {
    const { skip, limit, select_name, select_start_city, select_end_city } = payload;
    try {
      let result = await this.$axios.get(
        `${api.dly_wayList}?name=${select_name}&start_city=${select_start_city}&end_city=${select_end_city}&skip=${skip}&limit=${limit}`
      );
      if (result.rescode === '0') {
        console.log(111)
        console.log(result);
        commit(types.DLY_WAY_LIST, result.dlyWayList);
        return result.totalRow;
      }
    } catch (err) {
      Message.error('接口加载失败');
      console.error(err);
    }
  },
  //添加路线
  async adddly_wayList({ commit }, { type, data }) {
    try {
      let result = await this.$axios.post(`/zhwl/dlyway/dly_way_save`, { data: data });
      if (result.rescode === '0') {
        commit(types.DLY_WAY_LIST, result.dlyWayList);
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
      if (type === 'dlywayDelete') {
        result = await this.$axios.post('/zhwl/dlyway/dly_way_delete', { data: { id: data } });
      } else {
        result = await this.$axios.post('/zhwl/dlyway/dly_way_edit', { data: data });
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
