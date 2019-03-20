import Vue from 'vue';
import Vuex from 'vuex';
import _ from 'lodash';
import { Message } from 'element-ui';
import * as types from './mutation-types';

Vue.use(Vuex);

const api = {
  //用户
  userList: '/zhwl/user/user_list',
  userSave: '/zhwl/user/user_save',
  userEdit: '/zhwl/user/user_edit',
  userDelete: '/zhwl/user/user_delete',
  //角色
  roleList: '/zhwl/role/role_list?skip=0&limit=100',
  roleSave: '/zhwl/role/role_save',
  roleEdit: '/zhwl/role/role_edit',
  roleDelete: '/zhwl/role/role_delete',
  //权限分配
  userRole: '/zhwl/user/user_role',
  userRoleSelect: '/zhwl/user/user_role_sel', //query:id
};

export const state = () => ({
  userList: [],
  roleList: [],
  userRoleList: [],
});

export const mutations = {
  [types.USER_LIST](state, payload) {
    state.userList = payload;
  },
  [types.ROLE_LIST](state, payload) {
    state.roleList = payload;
  },
  [types.USER_ROLE_LIST](state, payload) {
    state.userRoleList = payload;
  },
};

export const actions = {
  //查询用户列表
  async getUserList({ commit }, payload) {
    const { skip, limit } = payload;
    try {
      let result = await this.$axios.get(`${api.userList}?skip=${skip}&limit=${limit}`);
      if (result.rescode === '0') {
        commit(types.USER_LIST, result.userList);
        return result.totalRow;
      } else {
        commit(types.USER_LIST, []);
        return 0;
      }
    } catch (err) {
      Message.error('接口加载失败');
      console.error(err);
      commit(types.USER_LIST, []);
    }
  },
  //用户操作
  async userOperation({ commit }, { type, data }) {
    let result;
    try {
      if (type === 'userDelete') {
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
  //权限管理
  async getRoleList({ commit }, { type }) {
    try {
      let result = await this.$axios.get(`${api.roleList}`);
      if (result.rescode === '0') {
        if (type === 'select') {
          let newList = [];
          newList = result.roleList.map(item => {
            let newObject = { label: item.role_name, key: item.id };
            return newObject;
          });
          commit(types.ROLE_LIST, newList);
        } else {
          commit(types.ROLE_LIST, result.roleList);
        }
      }
    } catch (err) {
      Message.error('接口加载失败');
      console.error(err);
      commit(types.ROLE_LIST, []);
    }
  },
  //角色操作
  async roleOperation({ commit }, { type, data }) {
    let result;
    try {
      if (type === 'roleDelete') {
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
  //获取角色权限
  async getUserRoleList({ commit }, { id }) {
    let result = await this.$axios.get(`${api.userRoleSelect}?id=${id}`);
    let newList = [];
    for (const item of result.userRoleList) {
      newList.push(item.role_id);
    }
    return newList;
    // commit(types.USER_ROLE_LIST, newList);
  },
  //修改角色权限
  async updateUserRoleList({ commit }, { data }) {
    try {
      let result = await this.$axios.post(`${api.userRole}`, {
        data: data,
      });
      if (result.rescode === '0') {
        Message.success('操作成功');
      } else {
        Message.error('操作失败');
      }
    } catch (error) {
      Message.error('操作失败');
      console.error(error);
    }
  },
};
