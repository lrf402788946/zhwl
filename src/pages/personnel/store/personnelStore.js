import Vue from 'vue';
import Vuex from 'vuex';
import _ from 'lodash';
import { Message } from 'element-ui';
import * as types from './mutation-types';

Vue.use(Vuex);

const api = {
  //客户
  clientList: '/zhwl/client/client_list',
  clientEdit: '/zhwl/client/client_edit',
  clientDelete: '/zhwl/client/client_delete',
  clientSave: '/zhwl/client/client_save',
  //部门
  deptList: '/zhwl/dept/dept_list',
  deptEdit: '/zhwl/dept/dept_edit',
  deptDelete: '/zhwl/dept/dept_delete',
  deptSave: '/zhwl/dept/dept_save',
  //驾驶员
  driverList: '/zhwl/driver/driver_list',
  driverEdit: '/zhwl/driver/driver_edit',
  driverDelete: '/zhwl/driver/driver_delete',
  driverSave: '/zhwl/driver/driver_save',
  //岗位
  postList: '/zhwl/post/post_list',
  postEdit: '/zhwl/post/post_edit',
  postDelete: '/zhwl/post/post_delete',
  postSave: '/zhwl/post/post_save',
  //员工
  staffList: '/zhwl/staff/staff_list',
  staffEdit: '/zhwl/staff/staff_edit',
  staffDelete: '/zhwl/staff/staff_delete',
  staffSave: '/zhwl/staff/staff_save',
};

export const state = () => ({
  clientList: [],
});

export const mutations = {
  [types.CLIENT_LIST](state, payload) {
    state.clientList = payload;
  },
  [types.DEPT_LIST](state, payload) {
    state.deptList = payload;
  },
  [types.DRIVER_LIST](state, payload) {
    state.driverList = payload;
  },
  [types.POST_LIST](state, payload) {
    state.postList = payload;
  },
  [types.STAFF_LIST](state, payload) {
    state.staffList = payload;
  },
};

export const actions = {
  //查询客户列表
  async getStaffList({ commit }, payload) {
    const { skip, limit } = payload;
    try {
      let result = await this.$axios.get(`${api.staffList}?skip=${skip}&limit=${limit}`);
      if (result.rescode === '0') {
        commit(types.STAFF_LIST, result.staffList);
        return result.totalRow;
      } else {
        commit(types.STAFF_LIST, []);
        return result.totalRow;
      }
    } catch (err) {
      Message.error('接口加载失败');
      console.error(err);
    }
  },
  //模糊查询客户列表方法
  async getStaffListLike({ commit }, payload) {
    const { skip, limit, select_staff_name, select_staff_job_num } = payload;
    try {
      let result = await this.$axios.get(`${api.staffList}?skip=${skip}&limit=${limit}&name=${select_staff_name}&job_num=${select_staff_job_num}`);
      if (result.rescode === '0') {
        commit(types.STAFF_LIST, result.staffList);
        return result.totalRow;
      } else {
        commit(types.STAFF_LIST, []);
        return result.totalRow;
      }
    } catch (err) {
      Message.error('接口加载失败');
      console.error(err);
    }
  },
  //添加客户
  async addStafflist({ commit }, { data }) {
    try {
      let result = await this.$axios.post(`${api.staffSave}`, { data: data });
      if (result.rescode === '0') {
        commit(types.STAFF_LIST, result.staffList);
        return result.totalRow;
      }
    } catch (err) {
      Message.error('接口加载失败');
      console.error(err);
    }
  },
  //客户删除，修改
  async staffOperation({ commit }, { type, data }) {
    let result;
    try {
      if (type === 'delete') {
        result = await this.$axios.post(`${api.staffDelete}`, { data: { id: data } });
      } else {
        result = await this.$axios.post(`${api.staffEdit}`, { data: data });
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
