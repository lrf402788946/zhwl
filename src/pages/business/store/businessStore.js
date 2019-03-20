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
  orderMainSave: '/zhwl/order/order_save', //params:data
  orderSubSave: '/zhwl/order/order_sub_save', //params:subForm,id--main_id
  orderMainEdit: '/zhwl/order/order_edit', //params:data
  orderSubEdit: '/zhwl/order/order_sub_edit', //params:subForm,id-main_id
  orderDelete: '/zhwl/order/order_delete', //params:id
  orderNum: '/zhwl/order/order_no', //query:cus_id
  //货物
  goodsList: '/zhwl/goods/goods_list',
  goodsSave: '/zhwl/goods/goods_save',
  goodsEdit: '/zhwl/goods/goods_edit',
  goodsDelete: '/zhwl/goods/goods_delete',
};

export const state = () => ({
  dlyWayList: [],
  orderList: [],
  orderSubList: [],
  goodsList: [],
});

export const mutations = {
  [types.DLY_WAY_LIST](state, payload) {
    state.dlyWayList = payload;
  },
  [types.ORDER_LIST](state, payload) {
    state.orderList = payload;
  },
  [types.ORDER_SUB_LIST](state, payload) {
    state.orderSubList = payload;
  },
  [types.GOODS_LIST](state, payload) {
    state.goodsList = payload;
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
      } else {
        commit(types.DLY_WAY_LIST, []);
      }
    } catch (err) {
      Message.error('接口加载失败');
      console.error(err);
      commit(types.DLY_WAY_LIST, []);
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
        commit(types.DLY_WAY_LIST, result.dlyWayList);
        return result.totalRow;
      } else {
        commit(types.DLY_WAY_LIST, []);
      }
    } catch (err) {
      Message.error('接口加载失败');
      console.error(err);
      commit(types.DLY_WAY_LIST, []);
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
  async getOrderList({ commit }, { skip, limit, order_no, c_id, start_time, end_time }) {
    try {
      let result = await this.$axios.get(
        `${api.orderList}?skip=${skip}&limit=${limit}&order_no=${order_no}&c_id=${c_id}&start_time=${start_time}&end_time=${end_time}`
      );
      if (result.rescode === '0') {
        commit(types.ORDER_LIST, result.orderList);
        return result.totalRow;
      } else {
        Message.error(result.msg);
        commit(types.ORDER_LIST, []);
        return 0;
      }
    } catch (error) {
      Message.error('接口加载失败');
      commit(types.ORDER_LIST, []);
      console.error(error);
    }
  },
  //订单子表查询
  async getOrderSubList({ commit }, { id }) {
    try {
      let result = await this.$axios.get(`${api.orderSubList}&order_id=${id}`);
      if (result.rescode === '0') {
        commit(types.ORDER_SUB_LIST, result.orderSubList);
      } else {
        commit(types.ORDER_SUB_LIST, []);
      }
    } catch (error) {
      Message.error('接口加载失败');
      console.error(error);
      commit(types.ORDER_SUB_LIST, []);
    }
  },
  //获取订单号
  async getOrderNo({ commit }) {
    try {
      let result = await this.$axios.get(`${api.orderNum}`);
      return result.order_no;
    } catch (error) {
      Message.error('接口加载失败');
      console.error(error);
    }
  },
  //订单创建
  async orderSave({ commit }, { form, subForm }) {
    try {
      let result = await this.$axios.post(api.orderMainSave, {
        data: form,
      });
      if (result.rescode === '0') {
        let id = result.id;
        result = await this.$axios.post(api.orderSubSave, {
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
    let result;
    try {
      result = await this.$axios.post(api.orderMainEdit, {
        data: form,
      });
      if (result.rescode === '0') {
        let id = form.id;
        result = await this.$axios.post(api.orderSubEdit, {
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
      let result = await this.$axios.post(api.orderDelete, {
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
  //查询货物列表
  async getGoodslist({ commit }, payload) {
    const { skip, limit } = payload;
    try {
      let result = await this.$axios.get(`${api.goodsList}?skip=${skip}&limit=${limit}`);
      if (result.rescode === '0') {
        commit(types.GOODS_LIST, result.goodsList);
        return result.totalRow;
      } else {
        commit(types.GOODS_LIST, []);
        return 0;
      }
    } catch (err) {
      Message.error('接口加载失败');
      console.error(err);
      commit(types.GOODS_LIST, []);
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
      } else {
        commit(types.GOODS_LIST, []);
        return 0;
      }
    } catch (err) {
      Message.error('接口加载失败');
      console.error(err);
      commit(types.GOODS_LIST, []);
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
