<template lang="html">
  <div id="customerStatement">
    <div class="base-form">
      <div class="form-inline">
        <div class="base-form-title" style="width:100%;">
          <a class="base-margin-left-20">供应商结算单</a>
          <div class="button-table"></div>
        </div>
      </div>
      <div class="base-padding-20 base-bg-fff">
        <div class="row" style="margin-bottom: 15px !important;">
          <div class="col-lg-3 marginBot4">
            <p class="marginBot4">请选择供应商:</p>
            <el-select class="marginBot" style="height:40px !important" v-model="select_client_id" filterable placeholder="请选择供应商">
              <!-- <el-option label="全部" value=""></el-option> -->
              <el-option v-for="item in clientList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </div>
          <div class="col-lg-3 mb25">
            <p class="marginBot4">请输入项目名:</p>
            <el-input v-model="select_xm_name" placeholder="请输入项目"></el-input>
          </div>
          <div class="col-lg-3 mb25">
            <p class="marginBot4">请输入订单号:</p>
            <el-input v-model="select_order_no" placeholder="请输入订单号"></el-input>
          </div>
        </div>
        <div><el-button size="medium" @click="searchButton()" type="primary">查&nbsp;&nbsp;询</el-button></div>
      </div>
      <table class="table table-bordered table-striped ">
        <tbody v-if="list.length > 0">
          <tr>
            <th>发货日期</th>
            <th>提货单号</th>
            <th>货物</th>
            <th>线路</th>
            <th>单价(不含税)</th>
            <th>运费合计(不含税)</th>
            <th>税金(10%)</th>
            <th>应收运费</th>
          </tr>
          <tr v-for="(item, index) in list" :key="index">
            <td>{{ item.create_time }}</td>
            <td>{{ item.transport_no }}</td>
            <td>{{ item.goods_name }}</td>
            <td>{{ item.dly_name }}</td>
            <td>{{ item.price }}</td>
            <td>{{ item.sh_ys }}</td>
            <td>{{ item.rate }}</td>
            <td>{{ item.sh_ss }}</td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td style="text-align:center;">没有数据</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import Validator from 'async-validator';
import entrance from '@/components/entrance.vue';
import exportExcel from '@/components/exportExcel.vue';

import _ from 'lodash';
export default {
  name: 'customerStatement',
  metaInfo: {
    title: '供应商结算单',
  },
  components: {},
  data() {
    return {
      clientList: [],
      select_client_id: '',
      select_xm_name: '',
      select_order_no: '',
      list: [],
      xiangXiList: {},
      xiangXiList1: [],
      dialogUpdate: false,
      wayname: '',
    };
  },
  created() {
    this.searchClient();
  },
  methods: {
    //获取供应商名
    async searchClient() {
      let result = await this.$axios.get(`/zhwl/client/client_list?skip=0&limit=99999&type=1`);
      this.$set(this, 'clientList', result.clientList);
    },
    //查询按钮
    async searchButton() {
      let result = await this.$axios.get(
        // `/zhwl/count/gys_count?skip=0&limit=99999&c_id=${this.select_client_id}&item_name=${this.select_xm_name}&order_no=${this.select_order_no}`
        `/zhwl/count/gys_count?skip=0&limit=99999&c_id=${this.select_client_id}`
      );
      this.$set(this, 'list', result.dataList);
      this.select_client_id = '';
      this.select_xm_name = '';
      this.select_order_no = '';
    },
    async openAlert(index) {
      this.xiangXiList = JSON.parse(JSON.stringify(this.list[index]));
      this.dialogUpdate = true;
    },
    closeAlert() {
      this.dialogUpdate = false;
    },
  },
};
</script>

<style lang="css" scoped>
.marginBot4 {
  margin-bottom: 4px;
}
.marginBot {
  margin-bottom: 15px;
}
.resetButton {
  color: #fff;
  margin-right: 20px;
}
.table th,
.table td {
  padding: 0.5rem;
}
.btn {
  margin-left: 0 !important;
  padding: 2px 5px !important;
  margin-bottom: 0 !important;
  margin-right: 10px !important;
  font-size: 12px !important;
  font-weight: normal !important;
  line-height: 1.42857143 !important;
  text-align: center !important;
  white-space: nowrap !important;
  vertical-align: middle !important;
  width: auto !important;
  border: 1px solid transparent !important;
  border-radius: 3px !important;
  height: auto !important;
}
.btn-primary {
  background-color: #5bc0de;
}
.breadcrumb {
  padding: 14px 18px;
  margin-bottom: 25px;
  list-style: none;
  background-color: #f5f5f5;
}
.breadcrumb > li {
  font-size: 16px;
  color: #999;
  display: inline-block;
}
.breadcrumb > li a {
  font-size: 16px;
  color: #999;
  display: inline-block;
}
.base-form-title {
  font-weight: bold;
  display: block;
  line-height: 40px;
  font-size: 16px;
  color: #46687f;
  letter-spacing: 1px;
  text-align: left;
  background-color: #5bc0de;
}
.base-margin-left-20 {
  margin-left: 20px;
}
.base-form-title a {
  color: #fff !important;
  text-decoration: none;
}
.base-padding-20 {
  padding: 20px;
}
.base-bg-fff {
  background-color: #fff;
}
.row {
  margin-right: -15px;
  margin-left: -15px;
}
.base-margin-right-40 {
  margin-right: 40px;
}
.form-group {
  margin-bottom: 15px;
}
.form-control {
  display: block;
  width: 100%;
  height: 44px;
  padding: 6px 15px;
  font-size: 16px;
  line-height: 1.42857143;
  color: #555;
  background-color: #fff;
  background-image: none;
  border: 1px solid #ccc;
  border-radius: 4px;
  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
  -webkit-transition: border-color ease-in-out 0.15s, -webkit-box-shadow ease-in-out 0.15s;
  -o-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
  transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
}
input,
textarea,
select,
button {
  text-rendering: auto;
  color: initial;
  letter-spacing: normal;
  word-spacing: normal;
  text-transform: none;
  text-indent: 0px;
  text-shadow: none;
  display: inline-block;
  text-align: start;
  margin: 0em;
  font: 400 13.3333px Arial;
}
.btn-info {
  color: #fff;
  background-color: #5bc0de;
  border-color: #46b8da;
}
.base-margin-2 {
  margin: 2px 0;
}
.btn-xs,
.btn-group-xs > .btn {
  padding: 3px 8px;
  font-size: 14px;
  line-height: 1.5;
  border-radius: 5px;
}
.btn-info {
  color: #fff;
  background-color: #5bc0de;
  border-color: #46b8da;
}
.base-margin-right-5 {
  margin-right: 5px;
}
.base-margin-bottom {
  margin-bottom: 20px;
}
.table-bordered {
  border: 1px solid #ddd;
}
.table {
  font-size: 14px;
  width: 100%;
  max-width: 100%;
  margin-bottom: 20px;
}
table {
  background-color: transparent;
}
table {
  border-spacing: 0;
  border-collapse: collapse;
}
.base-header {
  min-width: 1024px;
  height: 75px;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.base-header-left {
  float: left;
  width: 240px;
  height: 60px;
  border-bottom: 1px #161e25 solid;
  color: #a6a6a6;
  cursor: pointer;
  background-size: 100%;
}
ul,
li {
  margin: 0px;
  padding: 0px;
}
li {
  list-style: none;
}
.modal.show .modal-dialog {
  -webkit-transform: none;
  transform: none;
  max-width: 700px !important;
}
@media (min-width: 576px) {
  .modal-dialog {
    max-width: 700px !important;
    margin: 1.75rem auto;
  }
}
.mb25 {
  margin-bottom: 10px;
}
.btn-primary:hover {
  background-color: #17a2b8 !important;
}
</style>

<style scoped>
@import '../../../assets/style/Font-Awesome-master/css/font-awesome.css';
@import '../../../assets/style/layout/base-Layout-bootstrap.css';
@import '../../../assets/style/base-style-bootstrap.css';
</style>
