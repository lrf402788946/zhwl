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
  //订单
  orderList: '/zhwl/order/order_list', //query:skip,limit,!order_number,!cus_id,!start_time,!end_time
  orderSubList: '/zhwl/order/order_info?skip=0&limit=10000', //query:skip,limit=10000,order_id
  orderNumber: '/zhwl/order/order_num', //query:cus_id
  orderMainSave: '/akyl/order/order_save', //params:data
  orderSubSave: '/akyl/order/order_sub_save', //params:subForm,id--main_id
  orderMainEdit: '/akyl/order/order_edit', //params:data
  orderSubEdit: '/akyl/order/order_sub_edit', //params:subForm,id-main_id
  orderDelete: '/akyl/order/order_delete', //params:id
  orderNum: '/akyl/order/order_num', //query:cus_id
};

export const state = () => ({
  dlyWayList: [],
  orderList: [],
  orderSubList: [],
});

export const mutations = {
  [types.DLY_WAY_LIST](state, payload) {
    state.dlyWayList = payload;
  },
  [types.ORDER_LIST](state, payload) {
    state.orderlist = payload;
  },
  [types.ORDER_SUB_LIST](state, payload) {
    state.orderSubList = payload;
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
        console.log(111);
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
  //订单查询
  async getOrderList({ commit }, { skip, limit, order_num, cus_id, start_time, end_time }) {
    try {
      let result = await this.$axios.get(
        `${api.orderList}?skip=${skip}&limit=${limit}&order_num=${order_num}&cus_id=${cus_id}&start_time=${start_time}&end_time=${end_time}`
      );
      if (result.rescode === '0') {
        commit(types.ORDER_LIST, result.orderList);
        return result.totalRow;
      } else {
        Message.error(result.msg);
      }
    } catch (error) {
      Message.error('接口加载失败');
      console.error(error);
    }
  },
  //订单子表查询
  async getOrderSubList({ commit }, { id }) {
    try {
      let result = await this.$axios.get(`${api.orderSubList}order_id=${id}`);
      if (result.rescode === '0') {
        commit(types.ORDER_SUB_LIST, result.orderSubList);
      }
    } catch (error) {
      Message.error('接口加载失败');
      console.error(error);
    }
  },
  //获取订单号
  async getOrderNo({ commit }, { cus_id }) {
    try {
      let result = this.$axios.get(`${api.orderNum}?cus_id=${cus_id}`);
      return result.order_num;
    } catch (error) {
      Message.error('接口加载失败');
      console.error(error);
    }
  },
  //订单创建
  async orderSave({ commit }, { form, subForm }) {
    try {
      let result = this.$axios.post(api.orderMainSave, {
        data: form,
      });
      if (result.rescode === '0') {
        let id = result.id;
        result = this.$axios.post(api.orderSubSave, {
          data: { subForm: subForm, id: id },
        });
        if (result.rescode === '0') {
          Message.success('操作成功');
        } else {
          Message.error('操作失败');
        }
      } else {
        Message.error('操作失败');
      }
    } catch (error) {
      Message.error('接口加载失败');
      console.error(error);
    }
  },
  //订单修改
  async orderEdit({ commit }, { form, subForm }) {
    try {
      let result = this.$axios.post(api.orderEdit, {
        data: form,
      });
      if (result.rescode === '0') {
        let id = form.id;
        result = this.$axios.post(api.orderSubEdit, {
          data: { subForm: subForm, id: id },
        });
        if (result.rescode === '0') {
          Message.success('操作成功');
        } else {
          Message.error('操作失败');
        }
      } else {
        Message.error('操作失败');
      }
    } catch (error) {
      Message.error('接口加载失败');
      console.error(error);
    }
  },
  //订单删除
  async orderDelete({ commit }, { id }) {
    try {
      let result = this.$axios.post(api.orderDelete, {
        data: { id: id },
      });
      if (result.rescode === '0') {
        Message.success('操作成功');
      } else {
        Message.error('操作失败');
      }
    } catch (error) {
      Message.error('接口加载失败');
      console.error(error);
    }
  },
};
