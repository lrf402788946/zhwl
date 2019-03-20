import Vue from 'vue';
import Vuex from 'vuex';
import _ from 'lodash';
import { Message } from 'element-ui';
import * as types from './mutation-types';

Vue.use(Vuex);

const api = {
  // car
  carList: '/zhwl/car/car_list',
  carSave: '/zhwl/car/car_save',
  carEdit: '/zhwl/car/car_edit',
  carDelete: '/zhwl/car/car_delete',
  // car_detail
  carDetailList: '/zhwl/car/car_daily_detail_list',
  carDetailSave: '/zhwl/car/car_daily_detail_save',
  carDetailEdit: '/zhwl/car/car_daily_detail_edit',
  carDetailDelete: '/zhwl/car/car_daily_detail_delete',
};

export const state = () => ({
  carList: [],
  carDetailList: [],
});

export const mutations = {
  [types.CAR_LIST](state, payload) {
    state.carList = payload;
  },
  [types.CAR_DETAIL](state, payload) {
    state.carDetailList = payload;
  },
};

export const actions = {
  //查询car列表
  async getCarList({ commit }, payload) {
    const { skip, limit } = payload;
    try {
      let result = await this.$axios.get(`${api.carList}?skip=${skip}&limit=${limit}`);
      if (result.rescode === '0') {
        commit(types.CAR_LIST, result.carList);
        return result.totalRow;
      } else {
        commit(types.CAR_LIST, []);
      }
    } catch (err) {
      Message.error('接口加载失败');
      console.error(err);
    }
  },
  //car操作
  async carOperation({ commit }, { type, data }) {
    let result;
    console.log(data);
    try {
      if (type === 'carDelete') {
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

  //查询CarDetail列表
  async getCarDetailList({ commit }, payload) {
    const { skip, limit } = payload;
    try {
      let result = await this.$axios.get(`${api.carDetailList}?skip=${skip}&limit=${limit}`);
      if (result.rescode === '0') {
        commit(types.CAR_DETAIL, result.carDetailList);
        return result.totalRow;
      } else {
        commit(types.CAR_DETAIL, []);
      }
    } catch (err) {
      Message.error('接口加载失败');
      console.error(err);
    }
  },

  //carDetail操作
  async carDetailOperation({ commit }, { type, data }) {
    let result;
    try {
      if (type === 'carDetailDelete') {
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
