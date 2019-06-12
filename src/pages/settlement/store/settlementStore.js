import Vue from 'vue';
import Vuex from 'vuex';
import _ from 'lodash';
import { Message } from 'element-ui';
import * as types from './mutation-types';

Vue.use(Vuex);

const api = {
  //查询供应商费用信息
  gysCostList: '/zhwl/count/gys_count', //query:id
  //获取选取供应商的结算信息
  gysList: '/zhwl/count/gys_statement', //query:ids
  //供应商打印结算
  gysEdit: '/zhwl/count/gys_edit', //params:{data:ids}
  //供应商已结算列表
  gysAlreadyList: '/zhwl/count/gys_bill', //query:c_id,skip,limit
  //供应商结算账单详情
  gysAlreadyBillInfo: '/zhwl/count/gys_bill_info', //query:id
  //客户结算单列表查询
  clientList: '/zhwl/count/client_count', //query:c_id,item_name,order_no,startTime,endTime,skip,limit
  //获取选取客户的结算信息
  clientSelectList: '/zhwl/count/client_count_sel', //params:{data:ids}
  //客户结算
  clientEdit: '/zhwl/count/client_count_edit', //params:{data:ids}
};

export const state = () => ({
  clientList: [],
  billList: {},
  client: {},
});

export const mutations = {
  [types.CLIENT_LIST](state, payload) {
    state.clientList = payload;
  },
  [types.BILL_INFO](state, { billInfo, billList }) {
    state.billInfo = {};
    state.billInfo = billInfo;
    state.billList = [];
    state.billList = billList;
  },
  [types.CLIENT](state, payload) {
    state.client = payload;
  },
};

export const actions = {
  /**
   * 查询供应商的费用列表
   * @param c_id 供应商id
   */
  async getGysCostList({ commit }, { c_id, skip, limit }) {
    try {
      let result = await this.$axios.get(`${api.gysCostList}?skip=0&limit=10000&c_id=${c_id}&skip=${skip}&limit=${limit}`);
      if (result.rescode === '0') {
        return result;
      } else {
        return false;
      }
    } catch (err) {
      Message.error('接口加载失败');
      console.error(err);
    }
  },
  /**
   * 查询选取的所有id的集合
   * @param ids 选取的所有id
   */
  async gysGysSelectList({ commit }, { ids }) {
    try {
      let result = await this.$axios.post(`${api.gysList}`, { data: ids });
      if (result.rescode === '0') {
        return { result: result, ids: ids };
      } else {
        return false;
      }
    } catch (err) {
      commit(types.CLIENT_LIST, []);
      Message.error('接口加载失败');
      console.error(err);
    }
  },
  /**
   * 提交最后打印的数据并打印
   * @param form 修改后的数据 ---- 议价
   */
  async gysEditAndPrint({ commit }, { form }) {
    try {
      let result = await this.$axios.post(`${api.gysEdit}`, { data: form });
      if (result.rescode === '0') {
        return result;
      } else {
        return false;
      }
    } catch (err) {
      commit(types.CLIENT_LIST, []);
      Message.error('接口加载失败');
      console.error(err);
    }
  },

  /**
   * 查询供应商已结算的账单列表
   * @param c_id 供应商id
   */
  async gysAlreadylist({ commit }, { c_id, skip, limit }) {
    try {
      let result = await this.$axios.get(`${api.gysAlreadyList}?skip=0&limit=10000&c_id=${c_id}&skip=${skip}&limit=${limit}`);
      if (result.rescode === '0') {
        return result;
      } else {
        return false;
      }
    } catch (err) {
      Message.error('接口加载失败');
      console.error(err);
    }
  },
  /**
   * 获取供应商已结账单的详情
   * @param id 选取查看的账单ID
   */
  async gysBillInfo({ commit }, { id }) {
    try {
      let result = await this.$axios.get(`${api.gysAlreadyBillInfo}?skip=0&limit=10000&id=${id}`);
      if (result.rescode === '0') {
        return result;
      } else {
        return false;
      }
    } catch (err) {
      Message.error('接口加载失败');
      console.error(err);
    }
  },
  /**
   * 查询客户结算单列表
   * @param c_id 客户id
   * @param item_name 合同名称
   * @param order_no 订单号
   * @param startTime 起始时间
   * @param endTime 结束时间
   */
  async clientInList({ commit }, { c_id, item_name, order_no, startTime, endTime, skip, limit }) {
    try {
      let result = await this.$axios.get(
        `${api.clientList}?c_id=${c_id}&item_name=${item_name}&order_no=${order_no}&startTime=${startTime}&endTime=${endTime}&skip=${skip}&limit=${limit}`
      );
      if (result.rescode === '0') {
        return result;
      } else {
        return false;
      }
    } catch (err) {
      Message.error('接口加载失败');
      console.error(err);
    }
  },

  /**
   * 查询选取的客户订单信息
   * @param ids 选择的客户订单id列表
   */
  async clientSelectList({ commit }, { ids }) {
    try {
      let result = await this.$axios.post(`${api.clientSelectList}`, { data: ids });
      if (result.rescode === '0') {
        return result;
      } else {
        return false;
      }
    } catch (err) {
      commit(types.CLIENT_LIST, []);
      Message.error('接口加载失败');
      console.error(err);
    }
  },

  /**
   * 客户结算
   * @param ids 结算id集合
   */
  async clientToEdit({ commit }, { ids }) {
    try {
      let result = await this.$axios.post(`${api.clientEdit}`, { data: ids });
      if (result.rescode === '0') {
        return result;
      } else {
        return false;
      }
    } catch (err) {
      commit(types.CLIENT_LIST, []);
      Message.error('接口加载失败');
      console.error(err);
    }
  },

  /**
   * 查询客户已经结算的单子(允许补打)
   * @param c_id 客户id
   * @param item_name 合同名称
   * @param order_no 订单号
   * @param startTime 起始时间
   * @param endTime 结束时间
   */
  async clientAlreadyList({ commit }, { c_id, item_name, order_no, startTime, endTime, skip, limit }) {
    try {
      let result = await this.$axios.get(
        `${api.clientList}?c_id=${c_id}&item_name=${item_name}&order_no=${order_no}&startTime=${startTime}&endTime=${endTime}&skip=${skip}&limit=${limit}`
      );
      if (result.rescode === '0') {
        return result;
      } else {
        return false;
      }
    } catch (err) {
      commit(types.CLIENT_LIST, []);
      Message.error('接口加载失败');
      console.error(err);
    }
  },
};
