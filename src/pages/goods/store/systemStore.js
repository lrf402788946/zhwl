import Vue from 'vue';
import Vuex from 'vuex';
import _ from 'lodash';
import { Message } from 'element-ui';
import * as types from './mutation-types';

Vue.use(Vuex);

const api = {
  //路线
  goodsList: '/zhwl/goods/goods_list',
  goodsSave: '/zhwl/goods/goods_save',
  goodsEdit: '/zhwl/goods/goods_edit',
  goodsDelete: '/zhwl/goods/goods_delete',
};
//vuex 存放变量
export const state = () => ({
  goodsList: [],
});

export const mutations = {
  [types.GOODS_LIST](state, payload) {
    state.goodsList = payload;
  },
};

export const actions = {
  //查询货物列表
  async getGoodslist({ commit }, payload) {
    const { skip, limit } = payload;
    try {
      let result = await this.$axios.get(`${api.goodsList}?skip=${skip}&limit=${limit}`);
      console.log(this.goodsList);
      if (result.rescode === '0') {
        commit(types.GOODS_LIST, result.goodsList);
        return result.totalRow;
      }
    } catch (err) {
      Message.error('接口加载失败');
      console.error(err);
    }
  },
  //模糊查询货物列表
  async getGoodslistlike({ commit }, payload) {
    const { skip, limit, select_name } = payload;
    try {
      let result = await this.$axios.get(`${api.goodsList}?goods_name=${select_name}&skip=${skip}&limit=${limit}`);
      if (result.rescode === '0') {
        commit(types.GOODS_LIST, result.goodsList);
        return result.totalRow;
      }
    } catch (err) {
      Message.error('接口加载失败');
      console.error(err);
    }
  },
  //添加货物
  async addGoodslist({ commit }, { type, data }) {
    try {
      let result = await this.$axios.post(`/zhwl/goods/goods_save`, { data: data });
      if (result.rescode === '0') {
        commit(types.GOODS_LIST, result.goodsList);
        return result.totalRow;
      }
    } catch (err) {
      Message.error('接口加载失败');
      console.error(err);
    }
  },
  //货物操作删除，修改
  async goodsOperation({ commit }, { type, data }) {
    let result;
    try {
      if (type === 'goodsDelete') {
        result = await this.$axios.post('/zhwl/goods/goods_delete', { data: { id: data } });
      } else {
        result = await this.$axios.post('/zhwl/goods/goods_edit', { data: data });
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
