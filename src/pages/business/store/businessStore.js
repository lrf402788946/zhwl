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
  orderList: '/zhwl/order/order_list', //query:skip,limit,!order_number,!cus_id,!start_time,!end_time / status=0查询的是拆分数据
  orderSubList: '/zhwl/order/order_info?skip=0&limit=10000', //query:skip,limit=10000,order_id
  orderNumber: '/zhwl/order/order_num', //query:cus_id
  orderMainSave: '/zhwl/order/order_save', //params:data
  orderSubSave: '/zhwl/order/order_sub_save', //params:subForm,id--main_id
  orderMainEdit: '/zhwl/order/order_edit', //params:data
  orderSubEdit: '/zhwl/order/order_sub_edit', //params:subForm,id-main_id
  orderDelete: '/zhwl/order/order_delete', //params:id
  orderNum: '/zhwl/order/order_no', //query:cus_id
  orderSubSplit: '/zhwl/order/order_sub_split',
  orderIncome: '/zhwl/in/in_save',
  updateIncome: '/zhwl/in/in_edit',
  //货物
  goodsList: '/zhwl/goods/goods_list',
  goodsSave: '/zhwl/goods/goods_save',
  goodsEdit: '/zhwl/goods/goods_edit',
  goodsDelete: '/zhwl/goods/goods_delete',
  //装车
  transportOrderSubList: '/zhwl/transport/order_sub_list', //query:skip,limit
  transportSelectOrder: '/zhwl/transport/order_sub_list_info', //params:ids[]
  transportList: '/zhwl/transport/transport_list', //query:skip,limit
  transportInfo: '/zhwl/transport/transport_info', //query:id
  transportMainSave: '/zhwl/transport/transport_save', //params:from
  transportSubSave: '/zhwl/transport/transport_sub_save', //params:id,subForm
  transportMainEdit: '/zhwl/transport/transport_edit', //params:from
  transportSubEdit: '/zhwl/transport/transport_sub_edit', //params:id,subForm
  transportDelete: '/zhwl/transport/transport_delete', //params:id
  transportNO: '/zhwl/transport/transport_no', //query:car_no
  orderSign: '/zhwl/transport/transport_sub_sign', //params:拆分单id, sign_name,sign_time
  //费用
  costList: '/zhwl/cost/cost_list',
  costSave: '/zhwl/cost/cost_save',
  costEdit: '/zhwl/cost/cost_edit',
  costDelete: '/zhwl/cost/cost_delete',
  //支出单
  outList: '/zhwl/out/out_list', //transport_main_id
  outSave: '/zhwl/out/out_save',
  outEdit: '/zhwl/out/out_edit',
  outDelete: '/zhwl/out/out_delete',
  //支出单
  inList: '/zhwl/in/in_list', //transport_main_id
  inSave: '/zhwl/in/in_save',
  inEdit: '/zhwl/in/in_edit',
  inDelete: '/zhwl/in/in_delete',
};

export const state = () => ({
  dlyWayList: [],
  orderList: [],
  orderSubList: [],
  goodsList: [],
  transportList: [],
  transportSubList: [],
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
  [types.TRANSPORT_LIST](state, payload) {
    state.transportList = payload;
  },
  [types.TRANSPORT_INFO](state, payload) {
    state.transportSubList = payload;
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
    } catch (error) {
      Message.error('接口加载失败');
      console.error(error);
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
    } catch (error) {
      Message.error('接口加载失败');
      console.error(error);
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
    } catch (error) {
      Message.error('接口加载失败');
      console.error(error);
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
    } catch (error) {
      Message.error('操作失败');
      console.error(error);
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
  //拆分订单
  async orderSubSplit({ commit }, { subForm }) {
    try {
      let result = await this.$axios.post(api.orderSubSplit, {
        data: subForm,
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
  //添加拆分的收入
  async orderIncome({ commit }, { main_id, data }) {
    try {
      let result = await this.$axios.post(api.orderIncome, {
        data,
        main_id: main_id,
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
  //修改拆分的收入
  async updateIncome({ commit }, { main_id, data }) {
    try {
      let result = await this.$axios.post(api.updateIncome, {
        data,
        main_id: main_id,
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
    } catch (error) {
      Message.error('接口加载失败');
      console.error(error);
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
    } catch (error) {
      Message.error('接口加载失败');
      console.error(error);
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
    } catch (error) {
      Message.error('接口加载失败');
      console.error(error);
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
    } catch (error) {
      Message.error('操作失败');
      console.error(error);
    }
  },
  //装车,查询订单子表
  async transportOrderSubList({ commit }, { skip, limit }) {
    try {
      let result = await this.$axios.get(`${api.transportOrderSubList}?skip=${skip}&limit=${limit}`);
      if (result.rescode === '0') {
        commit(types.ORDER_SUB_LIST, result.orderSubList);
        return result.totalRow;
      } else {
        Message.error(result.msg);
        commit(types.ORDER_SUB_LIST, []);
        return 0;
      }
    } catch (error) {
      Message.error('接口加载失败');
      commit(types.ORDER_SUB_LIST, []);
      console.error(error);
    }
  },
  //装车,获取所选订单子表信息
  async transporSelectOrder({ commit }, { ids }) {
    try {
      let result = await this.$axios.post(`${api.transportSelectOrder}`, { data: ids });
      if (result.rescode === '0') {
        return result;
      } else {
        Message.error(result.msg);
        return [];
      }
    } catch (error) {
      Message.error('接口加载失败');
      console.error(error);
    }
  },
  //查询运输记录
  async getTransportList({ commit }, { skip, limit, transport_no, car_no, driver_id, start_time, end_time }) {
    try {
      let result = await this.$axios.get(
        `${
          api.transportList
        }?skip=${skip}&limit=${limit}&transport_no=${transport_no}&car_no=${car_no}&driver_id=${driver_id}&start_time=${start_time}&end_time=${end_time}`
      );
      if (result.rescode === '0') {
        commit(types.TRANSPORT_LIST, result.transportList);
        return result.totalRow;
      } else {
        Message.error(result.msg);
        commit(types.TRANSPORT_LIST, []);
        return 0;
      }
    } catch (error) {
      Message.error('接口加载失败');
      commit(types.TRANSPORT_LIST, []);
      console.error(error);
    }
  },
  //查询运输子表记录
  async getTransportSubList({ commit }, { id }) {
    try {
      let result = await this.$axios.get(`${api.transportInfo}?transport_main_id=${id}`);
      if (result.rescode === '0') {
        commit(types.TRANSPORT_INFO, result.transportSubList);
      } else {
        commit(types.TRANSPORT_INFO, []);
      }
    } catch (error) {
      Message.error('接口加载失败');
      console.error(error);
      commit(types.TRANSPORT_INFO, []);
    }
  },
  //添加装车记录(运输)
  async transportSave({ commit }, { form, subForm, costForm }) {
    try {
      let result = await this.$axios.post(api.transportMainSave, {
        data: form,
      });
      if (result.rescode === '0') {
        let id = result.id;
        result = await this.$axios.post(api.transportSubSave, {
          data: { subForm: subForm, id: id },
        });
        if (result.rescode === '0') {
          result = await this.$axios.post(api.outSave, {
            data: { id: id, outForm: costForm },
          });
          if (result.rescode === '0') {
            Message.success('操作成功');
          } else {
            Message.error('操作失败');
          }
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
  //修改运输记录
  async transportEdit({ commit }, { form, subForm }) {
    let result;
    try {
      result = await this.$axios.post(api.transportMainEdit, {
        data: form,
      });
      if (result.rescode === '0') {
        let id = form.id;
        result = await this.$axios.post(api.transportSubEdit, {
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
  //删除运输记录
  async transportDelete({ commit }, { id }) {
    try {
      let result = await this.$axios.post(api.transportDelete, {
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
  //获取订单号
  async getTransportNo({ commit }, { car_no }) {
    try {
      let result = await this.$axios.get(`${api.transportNO}?car_no=${car_no}`);
      return result.transport_no;
    } catch (error) {
      Message.error('接口加载失败');
      console.error(error);
    }
  },
  //查询费用列表
  async getCostList({ commit }, payload) {
    const { skip, limit, pact_no, cus_id } = payload;
    try {
      let result = await this.$axios.get(`${api.costList}?skip=${skip}&limit=${limit}`);
      if (result.rescode === '0') {
        return {
          totalRow: result.totalRow,
          data: result.clientPactList,
        };
      } else {
        return { totalRow: 0, data: null };
      }
    } catch (error) {
      Message.error('接口加载失败');
      console.error(error);
    }
  },
  //费用操作
  async costOperation({ commit }, { type, data }) {
    let result;
    try {
      let body = type === 'costDelete' ? { data: { id: data } } : { data: data };
      result = await this.$axios.post(_.get(api, type), body);
      if (result.rescode === '0') {
        Message.success('操作成功');
      } else {
        Message.error('操作失败');
        console.warn(`error in:${type}`);
      }
    } catch (error) {
      Message.error('操作失败');
      console.error(error);
    }
  },
  //支出单列表
  async getOutList({ commit }, { skip, limit, sub_id, order_no, slip_no }) {
    try {
      let result = await this.$axios.get(`${api.outList}?skip=${skip}&limit=${limit}&transport_sub_id=${sub_id}&order_no=${order_no}&slip_no=${slip_no}`);
      if (result.rescode === '0') {
        return {
          totalRow: result.totalRow,
          data: result.outList,
        };
      } else {
        return { totalRow: 0, data: null };
      }
    } catch (error) {
      Message.error('接口加载失败');
      console.error(error);
    }
  },
  //支出表操作
  async outOperation({ commit }, { type, data }) {
    let result;
    try {
      let body = type === 'outDelete' ? { data: { id: data } } : { data: data };
      result = await this.$axios.post(_.get(api, type), body);
      if (result.rescode === '0') {
        Message.success('操作成功');
      } else {
        Message.error('操作失败');
        console.warn(`error in:${type}`);
        throw new Error('操作失败');
      }
    } catch (error) {
      Message.error('操作失败');
      console.error(error);
    }
  },
  //收入单列表
  async getInList({ commit }, { skip, limit, slip_id, order_no, slip_no }) {
    try {
      if (slip_id === undefined) {
        slip_id = '';
      }
      if (order_no === undefined) {
        order_no = '';
      }
      let result = await this.$axios.get(`${api.inList}?skip=${skip}&limit=${limit}&slip_id=${slip_id}&order_no=${order_no}&slip_no=${slip_no}`);
      if (result.rescode === '0') {
        return {
          totalRow: result.totalRow,
          data: result.inList,
        };
      } else {
        return { totalRow: 0, data: null };
      }
    } catch (error) {
      Message.error('接口加载失败');
      console.error(error);
    }
  },
  //收入表操作
  async inOperation({ commit }, { type, data }) {
    let result;
    try {
      let body = type === 'inDelete' ? { data: { id: data } } : { data: data };
      result = await this.$axios.post(_.get(api, type), body);
      if (result.rescode === '0') {
        Message.success('操作成功');
      } else {
        Message.error('操作失败');
        console.warn(`error in:${type}`);
        throw new Error('操作失败');
      }
    } catch (error) {
      Message.error('操作失败');
      console.error(error);
    }
  },
  //签收
  async orderSign({ commit }, { signForm }) {
    if (signForm.id === undefined || signForm.id === null) {
      Message.error('id为空');
      throw new Error('id为空');
    }
    try {
      let result = await this.$axios.post(api.orderSign, { data: signForm });
      if (result.rescode === '0') {
        Message.success('操作成功');
      } else {
        Message.error('操作失败');
        console.warn(`error in method:orderSign`);
        throw new Error('操作失败');
      }
    } catch (error) {
      Message.error('操作失败');
      console.error(error);
    }
  },
};
