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
  async getClientList({ commit }, payload) {
    const { skip, limit } = payload;
    try {
      let result = await this.$axios.get(`${api.clientList}?skip=${skip}&limit=${limit}`);
      if (result.rescode === '0') {
        commit(types.CLIENT_LIST, result.clientList);
        return result.totalRow;
      } else {
        commit(types.CLIENT_LIST, []);
        return result.totalRow;
      }
    } catch (err) {
      Message.error('接口加载失败');
      console.error(err);
    }
  },
  //模糊查询客户列表方法
  async getClientListLike({ commit }, payload) {
    const { skip, limit, select_client_name } = payload;
    try {
      let result = await this.$axios.get(`${api.clientList}?skip=${skip}&limit=${limit}&name=${select_client_name}`);
      if (result.rescode === '0') {
        commit(types.CLIENT_LIST, result.clientList);
        return result.totalRow;
      } else {
        commit(types.CLIENT_LIST, []);
        return result.totalRow;
      }
    } catch (err) {
      Message.error('接口加载失败');
      console.error(err);
    }
  },
  //添加客户
  async addClientlist({ commit }, { data }) {
    try {
      let result = await this.$axios.post(`${api.clientSave}`, {
        data: data,
      });
      if (result.rescode === '0') {
        commit(types.CLIENT_LIST, result.clientList);
        return result.totalRow;
      }
    } catch (err) {
      Message.error('接口加载失败');
      console.error(err);
    }
  },
  //客户删除，修改
  async clientOperation({ commit }, { type, data }) {
    let result;
    try {
      if (type === 'delete') {
        result = await this.$axios.post(`${api.clientDelete}`, {
          data: { id: data },
        });
      } else {
        result = await this.$axios.post(`${api.clientEdit}`, {
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
  //查询部门列表
  async getDeptList({ commit }, payload) {
    const { skip, limit } = payload;
    try {
      let result = await this.$axios.get(`${api.deptList}?skip=${skip}&limit=${limit}`);
      if (result.rescode === '0') {
        commit(types.DEPT_LIST, result.deptList);
        return result.totalRow;
      } else {
        commit(types.DEPT_LIST, []);
        return result.totalRow;
      }
    } catch (err) {
      Message.error('接口加载失败');
      console.error(err);
    }
  },
  //模糊查询部门列表方法
  async getDeptListLike({ commit }, payload) {
    const { skip, limit, select_dept_name } = payload;
    try {
      let result = await this.$axios.get(`${api.deptList}?skip=${skip}&limit=${limit}&dept_name=${select_dept_name}`);
      if (result.rescode === '0') {
        commit(types.DEPT_LIST, result.deptList);
        return result.totalRow;
      } else {
        commit(types.DEPT_LIST, []);
        return result.totalRow;
      }
    } catch (err) {
      Message.error('接口加载失败');
      console.error(err);
    }
  },
  //添加部门
  async addDeptlist({ commit }, { data }) {
    try {
      let result = await this.$axios.post(`${api.deptSave}`, {
        data: data,
      });
      if (result.rescode === '0') {
        commit(types.DEPT_LIST, result.deptList);
        return result.totalRow;
      }
    } catch (err) {
      Message.error('接口加载失败');
      console.error(err);
    }
  },
  //部门删除，修改
  async deptOperation({ commit }, { type, data }) {
    let result;
    try {
      if (type === 'delete') {
        result = await this.$axios.post(`${api.deptDelete}`, {
          data: { id: data },
        });
      } else {
        result = await this.$axios.post(`${api.deptEdit}`, {
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
  //查询驾驶员列表
  async getDriverList({ commit }, payload) {
    const { skip, limit } = payload;
    try {
      let result = await this.$axios.get(`${api.driverList}?skip=${skip}&limit=${limit}`);
      if (result.rescode === '0') {
        commit(types.DRIVER_LIST, result.driverList);
        return result.totalRow;
      } else {
        commit(types.DRIVER_LIST, []);
        return result.totalRow;
      }
    } catch (err) {
      Message.error('接口加载失败');
      console.error(err);
    }
  },
  //模糊查询驾驶员列表方法
  async getDriverListLike({ commit }, payload) {
    const { skip, limit, select_driver_name, select_driver_id_card } = payload;
    try {
      let result = await this.$axios.get(`${api.driverList}?skip=${skip}&limit=${limit}&name=${select_driver_name}&id_card=${select_driver_id_card}`);
      if (result.rescode === '0') {
        commit(types.DRIVER_LIST, result.driverList);
        return result.totalRow;
      } else {
        commit(types.DRIVER_LIST, []);
        return result.totalRow;
      }
    } catch (err) {
      Message.error('接口加载失败');
      console.error(err);
    }
  },
  //添加驾驶员
  async addDriverlist({ commit }, { data }) {
    try {
      let result = await this.$axios.post(`${api.driverSave}`, {
        data: data,
      });
      if (result.rescode === '0') {
        commit(types.DRIVER_LIST, result.driverList);
        return result.totalRow;
      }
    } catch (err) {
      Message.error('接口加载失败');
      console.error(err);
    }
  },
  //驾驶员删除，修改
  async driverOperation({ commit }, { type, data }) {
    let result;
    try {
      if (type === 'delete') {
        result = await this.$axios.post(`${api.driverDelete}`, {
          data: { id: data },
        });
      } else {
        result = await this.$axios.post(`${api.driverEdit}`, {
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
  //查询岗位列表
  async getPostList({ commit }, payload) {
    const { skip, limit } = payload;
    try {
      let result = await this.$axios.get(`${api.postList}?skip=${skip}&limit=${limit}`);
      if (result.rescode === '0') {
        commit(types.POST_LIST, result.postList);
        return result.totalRow;
      } else {
        commit(types.POST_LIST, []);
        return result.totalRow;
      }
    } catch (err) {
      Message.error('接口加载失败');
      console.error(err);
    }
  },
  //模糊查询岗位列表方法
  async getPostListLike({ commit }, payload) {
    const { skip, limit, select_post_name } = payload;
    try {
      let result = await this.$axios.get(`${api.postList}?skip=${skip}&limit=${limit}&name=${select_post_name}`);
      if (result.rescode === '0') {
        commit(types.POST_LIST, result.postList);
        return result.totalRow;
      } else {
        commit(types.POST_LIST, []);
        return result.totalRow;
      }
    } catch (err) {
      Message.error('接口加载失败');
      console.error(err);
    }
  },
  //添加岗位
  async addPostlist({ commit }, { data }) {
    try {
      let result = await this.$axios.post(`${api.postSave}`, {
        data: data,
      });
      if (result.rescode === '0') {
        commit(types.POST_LIST, result.postList);
        return result.totalRow;
      }
    } catch (err) {
      Message.error('接口加载失败');
      console.error(err);
    }
  },
  //岗位删除，修改
  async postOperation({ commit }, { type, data }) {
    let result;
    try {
      if (type === 'delete') {
        result = await this.$axios.post(`${api.postDelete}`, {
          data: { id: data },
        });
      } else {
        result = await this.$axios.post(`${api.postEdit}`, {
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
  //查询员工列表
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
  //模糊查询员工列表方法
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
  //添加员工
  async addStafflist({ commit }, { data }) {
    try {
      let result = await this.$axios.post(`${api.staffSave}`, {
        data: data,
      });
      if (result.rescode === '0') {
        commit(types.STAFF_LIST, result.staffList);
        return result.totalRow;
      }
    } catch (err) {
      Message.error('接口加载失败');
      console.error(err);
    }
  },
  //员工删除，修改
  async staffOperation({ commit }, { type, data }) {
    let result;
    try {
      if (type === 'delete') {
        result = await this.$axios.post(`${api.staffDelete}`, {
          data: { id: data },
        });
      } else {
        result = await this.$axios.post(`${api.staffEdit}`, {
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
