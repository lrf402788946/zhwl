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
  //合同
  contractList: '/zhwl/clientpact/client_pact_list',
  contractSave: '/zhwl/clientpact/client_pact_save',
  contractEdit: '/zhwl/clientpact/client_pact_edit',
  contractDelete: '/zhwl/clientpact/client_pact_delete',
  //项目
  itemList: '/zhwl/clientpactitem/client_pact_item_list',
  itemSave: '/zhwl/clientpactitem/client_pact_item_save',
  itemEdit: '/zhwl/clientpactitem/client_pact_item_edit',
  itemDelete: '/zhwl/clientpactitem/client_pact_item_delete',
  //路线
  dlywayList: '/zhwl/dlyway/dly_way_list',
  dlywaySave: '/zhwl/dlyway/dly_way_save',
  dlywayEdit: '/zhwl/dlyway/dly_way_edit',
  dlywayDelete: '/zhwl/dlyway/dly_way_delete',
  //方式
  wayList: '/zhwl/clientpactitemwaytype/client_pact_item_way_type_list',
  wayInfo: '/zhwl/clientpactitemwaytype/client_pact_item_way_type_info',
  waySave: '/zhwl/clientpactitemwaytype/client_pact_item_way_type_save',
  wayEdit: '/zhwl/clientpactitemwaytype/client_pact_item_way_type_edit',
  wayDelete: '/zhwl/clientpactitemwaytype/client_pact_item_way_type_delete',
};

export const state = () => ({
  clientList: [],
  deptList: [],
  driverList: [],
  postList: [],
  staffList: [],
  contractList: [],
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
  [types.CONTRACT_LIST](state, payload) {
    state.contractList = payload;
  },
};

export const actions = {
  //查询客户列表
  async getClientList({ commit }, payload) {
    const { skip, limit, type } = payload;
    try {
      let result = await this.$axios.get(`${api.clientList}?skip=${skip}&limit=${limit}&type=${type}`);
      if (result.rescode === '0') {
        commit(types.CLIENT_LIST, result.clientList);
        return result.totalRow;
      } else {
        commit(types.CLIENT_LIST, []);
        return result.totalRow;
      }
    } catch (err) {
      commit(types.CLIENT_LIST, []);
      Message.error('接口加载失败');
      console.error(err);
    }
  },
  //模糊查询客户列表方法
  async getClientListLike({ commit }, payload) {
    const { skip, limit, select_client_name, type } = payload;
    try {
      let result = await this.$axios.get(`${api.clientList}?skip=${skip}&limit=${limit}&type=${type}&name=${select_client_name}`);
      if (result.rescode === '0') {
        commit(types.CLIENT_LIST, result.clientList);
        return result.totalRow;
      } else {
        commit(types.CLIENT_LIST, []);
        return result.totalRow;
      }
    } catch (err) {
      commit(types.CLIENT_LIST, []);
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
      commit(types.CLIENT_LIST, []);
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
      commit(types.CLIENT_LIST, []);
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
      commit(types.CLIENT_LIST, []);
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
      commit(types.CLIENT_LIST, []);
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
      commit(types.CLIENT_LIST, []);
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
      commit(types.CLIENT_LIST, []);
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
      commit(types.CLIENT_LIST, []);
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
      commit(types.CLIENT_LIST, []);
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
        Message.success('操作成功');
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
  //查询合同列表
  async getContractList({ commit }, payload) {
    const { skip, limit, pact_no = '', cus_id = '', type = '' } = payload;
    try {
      let result = await this.$axios.get(`${api.contractList}?skip=${skip}&limit=${limit}&pact_no=${pact_no}&cus_id=${cus_id}&type=${type}`);
      if (result.rescode === '0') {
        result.totalRow > 0 ? commit(types.CONTRACT_LIST, result.clientPactList) : commit(types.CONTRACT_LIST, []);
        return result.totalRow;
      } else {
        commit(types.CONTRACT_LIST, []);
        return 0;
      }
    } catch (err) {
      Message.error('接口加载失败');
      console.error(err);
      commit(types.CONTRACT_LIST, []);
    }
  },
  //合同操作
  async contractOperation({ commit }, { type, data }) {
    let result;
    try {
      if (type === 'contractDelete') {
        result = await this.$axios.post(_.get(api, type), {
          data: { id: data },
        });
      } else {
        //edit
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
  //项目列表
  async getItemList({ commit }, { skip, limit, pact_id }) {
    try {
      let result = await this.$axios.get(`${api.itemList}?skip=${skip}&limit=${limit}&pact_id=${pact_id}`);
      if (result.rescode === '0') {
        return { result: true, data: result };
      } else {
        return { result: false };
      }
    } catch (err) {
      Message.error('接口加载失败');
      console.error(err);
    }
  },
  //项目操作
  async itemOperation({ commit }, { type, data }) {
    let result;
    try {
      result = await this.$axios.post(_.get(api, type), { data: data });
      if (result.rescode === '0') {
        Message.success('操作成功');
      } else {
        Message.error('操作失败');
        console.warn(`error in:${type}`);
      }
      return result;
    } catch (err) {
      Message.error('操作失败');
      console.error(err);
    }
  },
  //查询线路
  async item_getDlyList({ commit }, { skip, limit, item_id, name = '', start_city = '', end_city = '' }) {
    try {
      let result = await this.$axios.get(
        `${api.dlywayList}?skip=${skip}&limit=${limit}&item_id=${item_id}&name=${name}&start_city=${start_city}&end_city=${end_city}`
      );
      if (result.rescode === '0') {
        return { result: true, data: result };
      } else {
        return { result: false };
      }
    } catch (err) {
      Message.error('接口加载失败');
      console.error(err);
    }
  },
  //线路操作
  async item_dlyOperation({ commit }, { type, data }) {
    let result;
    try {
      result = await this.$axios.post(_.get(api, type), { data: data });
      if (result.rescode === '0') {
        Message.success('操作成功');
      } else {
        Message.error('操作失败');
        console.warn(`error in:${type}`);
      }
      return result;
    } catch (err) {
      Message.error('操作失败');
      console.error(err);
    }
  },
  //查询方式
  async getWayList({ commit }, { skip, limit, dly_way_id }) {
    try {
      let result = await this.$axios.get(`${api.wayList}?skip=${skip}&limit=${limit}&dly_way_id=${dly_way_id}`);
      if (result.rescode === '0') {
        return { result: true, data: result };
      } else {
        return { result: false };
      }
    } catch (err) {
      Message.error('接口加载失败');
      console.error(err);
    }
  },
  //方式操作
  async wayOperation({ commit }, { type, data }) {
    let result;
    try {
      result = await this.$axios.post(_.get(api, type), { data: data });
      if (result.rescode === '0') {
        Message.success('操作成功');
      } else {
        Message.error('操作失败');
        console.warn(`error in:${type}`);
      }
      return result;
    } catch (err) {
      Message.error('操作失败');
      console.error(err);
    }
  },
};
