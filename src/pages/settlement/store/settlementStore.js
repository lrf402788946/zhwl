import Vue from 'vue';
import Vuex from 'vuex';
import _ from 'lodash';
import { Message } from 'element-ui';
import * as types from './mutation-types';

Vue.use(Vuex);

const api = {
  //客户
  clientList: '/zhwl/client/client_list',
  //查询供应商费用信息
  gysCostList: '/zhwl/count/gys_count', //query:id
  //获取选取供应商的结算信息
  gysList: '/zhwl/count/gys_statement', //query:ids
  //供应商打印结算
  gysEdit: '/zhwl/count/gys_edit', //params:{data:{subForm:ids}}
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
  /**
   * 查询供应商的费用列表
   * @param c_id 供应商id
   */
  async getGysCostList({ commit }, { c_id }) {
    try {
      let result = await this.$axios.get(`${api.gysCostList}?skip=0&limit=10000&c_id=${c_id}`);
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
};
//阿拉伯数字转换为简写汉字
function Arabia_To_SimplifiedChinese(Num) {
  let i;
  for (i = Num.length - 1; i >= 0; i--) {
    Num = Num.replace(',', ''); //替换Num中的“,”
    Num = Num.replace(' ', ''); //替换Num中的空格
  }
  if (isNaN(Num)) {
    //验证输入的字符是否为数字
    //alert("请检查小写金额是否正确");
    return;
  }
  //字符处理完毕后开始转换，采用前后两部分分别转换
  let part = String(Num).split('.');
  let newchar = '';
  //小数点前进行转化
  for (i = part[0].length - 1; i >= 0; i--) {
    if (part[0].length > 10) {
      //alert("位数过大，无法计算");
      return '';
    } //若数量超过拾亿单位，提示
    let tmpnewchar = '';
    let perchar = part[0].charAt(i);
    switch (perchar) {
      case '0':
        tmpnewchar = '零' + tmpnewchar;
        break;
      case '1':
        tmpnewchar = '一' + tmpnewchar;
        break;
      case '2':
        tmpnewchar = '二' + tmpnewchar;
        break;
      case '3':
        tmpnewchar = '三' + tmpnewchar;
        break;
      case '4':
        tmpnewchar = '四' + tmpnewchar;
        break;
      case '5':
        tmpnewchar = '五' + tmpnewchar;
        break;
      case '6':
        tmpnewchar = '六' + tmpnewchar;
        break;
      case '7':
        tmpnewchar = '七' + tmpnewchar;
        break;
      case '8':
        tmpnewchar = '八' + tmpnewchar;
        break;
      case '9':
        tmpnewchar = '九' + tmpnewchar;
        break;
    }
    switch (part[0].length - i - 1) {
      case 0:
        // eslint-disable-next-line no-self-assign
        tmpnewchar = tmpnewchar;
        break;
      case 1:
        if (perchar != 0) tmpnewchar = tmpnewchar + '十';
        break;
      case 2:
        if (perchar != 0) tmpnewchar = tmpnewchar + '百';
        break;
      case 3:
        if (perchar != 0) tmpnewchar = tmpnewchar + '千';
        break;
      case 4:
        tmpnewchar = tmpnewchar + '万';
        break;
      case 5:
        if (perchar != 0) tmpnewchar = tmpnewchar + '十';
        break;
      case 6:
        if (perchar != 0) tmpnewchar = tmpnewchar + '百';
        break;
      case 7:
        if (perchar != 0) tmpnewchar = tmpnewchar + '千';
        break;
      case 8:
        tmpnewchar = tmpnewchar + '亿';
        break;
      case 9:
        tmpnewchar = tmpnewchar + '十';
        break;
    }
    newchar = tmpnewchar + newchar;
  }
  //替换所有无用汉字，直到没有此类无用的数字为止
  while (newchar.search('零零') != -1 || newchar.search('零亿') != -1 || newchar.search('亿万') != -1 || newchar.search('零万') != -1) {
    newchar = newchar.replace('零亿', '亿');
    newchar = newchar.replace('亿万', '亿');
    newchar = newchar.replace('零万', '万');
    newchar = newchar.replace('零零', '零');
  }
  //替换以“一十”开头的，为“十”
  if (newchar.indexOf('一十') == 0) {
    newchar = newchar.substr(1);
  }
  //替换以“零”结尾的，为“”
  if (newchar.lastIndexOf('零') == newchar.length - 1) {
    newchar = newchar.substr(0, newchar.length - 1);
  }
  return newchar;
}
