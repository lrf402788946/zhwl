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
  //查询运输信息,管理车辆支出,单车核算用
  tripPackList: '/zhwl/transport/return_trip_list',
  //合并单操作
  tripList: '/zhwl/transport/trip_list', //query:car_no,transport_no
  tripSave: '/zhwl/transport/trip_save',
  tripEdit: '/zhwl/transport/trip_edit', //params: id,subForm
  tripInfo: '/zhwl/transport/trip_info', //query:id
  tripEnd: '/zhwl/transport/trip_end', //params:id
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

  /**
   * 查询单车核算-合并=>运输记录列表
   * @param {car_no} 车号
   */
  async getTripPackList({ commit }, { car_no }) {
    try {
      let result = await this.$axios.get(`${api.tripPackList}?car_no=${car_no}`);
      if (result.rescode === '0') {
        return {
          totalRow: result.totalRow,
          data: result.dataList,
        };
      } else {
        return { totalRow: 0, data: null };
      }
    } catch (error) {
      Message.error('接口加载失败');
      console.error(error);
    }
  },
  /**
   * 支出单操作
   * @param form 合并主表信息
   * @param subForm 车辆支出单信息
   * @param type 具体操作
   * @param id 具体方法不同id
   */
  async tripOperation({ commit }, { form, subForm, type, id }) {
    try {
      let result;
      if (type === 'tripInfo') {
        result = await this.$axios.get(`${_.get(api, type)}?id=${id}`);
        return result;
      } else if (type === 'tripEdit') {
        result = await this.$axios.post(`${_.get(api, type)}`, { data: { id: id, subForm: subForm } });
      } else if (type === 'tripEnd') {
        result = await this.$axios.post(`${_.get(api, type)}`, { data: { id: id } });
      } else {
        result = await this.$axios.post(_.get(api, type), { data: { trip: form, subForm: subForm } });
      }

      if (result.rescode === '0') {
        Message.success('操作成功');
      } else {
        Message.error('操作失败');
        console.warn(`error in method:${type}`);
        throw new Error('操作失败');
      }
    } catch (error) {
      Message.error('操作失败');
      console.error(error);
    }
  },

  /**
   * 查询运输合并列表
   * @param car_no 车号
   * @param transport_no 运输号
   */
  async getTripList({ commit }, { skip, limit, car_no, transport_no }) {
    try {
      let result = await this.$axios.get(`${api.tripList}?skip=${skip}&limit=${limit}&car_no=${car_no}&transport_no=${transport_no}`);
      if (result.rescode === '0') {
        return {
          totalRow: result.totalRow,
          data: result.tripList,
        };
      } else {
        return { totalRow: 0, data: null };
      }
    } catch (error) {
      Message.error('接口加载失败');
      console.error(error);
    }
  },
};
