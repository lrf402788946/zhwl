<template lang="html">
  <div id="customerStatement">
    <div class="base-form">
      <div class="form-inline">
        <div class="base-form-title" style="width:100%;">
          <a class="base-margin-left-20">客户结算单</a>
          <div class="button-table"></div>
        </div>
      </div>
      <div class="base-padding-20 base-bg-fff">
        <div class="row" style="margin-bottom: 15px !important;">
          <div class="col-lg-3 marginBot4">
            <p class="marginBot4">请选择客户:</p>
            <el-select class="marginBot" style="height:40px !important" v-model="select_client_id" filterable placeholder="请选择客户">
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
            <th>提货日期</th>
            <th>发货日期</th>
            <th>要求到达日期</th>
            <th>客户名</th>
            <th>项目</th>
            <th>提货单号</th>
            <th>起始地</th>
            <th>目的地</th>
            <th>操作</th>
          </tr>
          <tr v-for="(item, index) in list" :key="index">
            <td>{{ item.sign_time }}</td>
            <td>{{ item.send_time }}</td>
            <td>{{ item.reach_time_hp }}</td>
            <td>{{ item.c_name }}</td>
            <td>{{ item.item_name }}</td>
            <td>{{ item.transport_no }}</td>
            <td>{{ item.send_address }}</td>
            <td>{{ item.take_address }}</td>
            <td><b-button variant="danger" @click="openAlert(index)">详&nbsp;&nbsp;情</b-button></td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td style="text-align:center;">没有数据</td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- 详情 -->
    <el-dialog width="80%" title="客户结算单" :visible.sync="dialogUpdate" :fullscreen="false">
      <div class="d-block">
        <div class="row">
          <table class="table table-bordered table-striped ">
            <tbody>
              <tr>
                <td>提货日期：</td>
                <td>发货日期：</td>
                <td>要求到达日期：</td>
                <td>客户名：</td>
                <td>项目：</td>
                <td>提货单号：</td>
              </tr>
              <tr>
                <td>{{ xiangXiList.sign_time }}</td>
                <td>{{ xiangXiList.send_time }}</td>
                <td>{{ xiangXiList.reach_time_hp }}</td>
                <td>{{ xiangXiList.c_name }}</td>
                <td>{{ xiangXiList.item_name }}</td>
                <td>{{ xiangXiList.transport_no }}</td>
              </tr>
              <tr>
                <td>起始地：</td>
                <td>目的地：</td>
                <td>运输方式：</td>
                <td>货物名称：</td>
                <td>数量：</td>
                <td>重量/吨：</td>
              </tr>
              <tr>
                <td>{{ xiangXiList.send_address }}</td>
                <td>{{ xiangXiList.take_address }}</td>
                <td>{{ xiangXiList.send_type === '0' ? '零担' : '整车' }}</td>
                <td>{{ xiangXiList.goods_name }}</td>
                <td>{{ xiangXiList.goods_num }}</td>
                <td>{{ xiangXiList.goods_weight }}</td>
              </tr>
              <tr>
                <td>体积/m³：</td>
                <td>运输内容：</td>
                <td>按重量/体积计费：</td>
                <td>单价(不含税)：</td>
                <td>长途运费(不含税)：</td>
                <td>提送货费单价(不含税)：</td>
              </tr>
              <tr>
                <td>{{ xiangXiList.goods_volume }}</td>
                <td>{{ xiangXiList.content }}</td>
                <td>{{ xiangXiList.count_type === '0' ? '体积' : '重量' }}</td>
                <td>{{ xiangXiList.price }}</td>
                <td>{{ xiangXiList.yf_price }}</td>
                <td>{{ xiangXiList.ts_price }}</td>
              </tr>
              <tr>
                <td>提送货费(不含税)：</td>
                <td>运费税前合计：</td>
                <td>税金(10%)：</td>
                <td>应收运费(含税)：</td>
              </tr>
              <tr>
                <td>{{ xiangXiList.ts_prices }}</td>
                <td>{{ xiangXiList.sq_ss }}</td>
                <td>{{ xiangXiList.rate }}</td>
                <td>{{ xiangXiList.sh_ss }}</td>
              </tr>
            </tbody>
          </table>
          <table class="table table-bordered table-striped ">
            <tbody>
              <tr>
                <td>发货人：</td>
                <td>运费(含税)：</td>
                <td>付款日期：</td>
                <td>保险费：</td>
                <td>结算月份：</td>
                <td>付款月份：</td>
              </tr>
              <tr v-for="(item, index) in xiangXiList1" :key="index">
                <td v-if="item.type === '0'">{{ item.car_no }}</td>
                <td v-if="item.type != '0'">{{ item.name }}</td>
                <td>{{ item.sh_ss }}</td>
                <td>{{ item.js_time }}</td>
                <td></td>
                <td>{{ item.js_time }}</td>
                <td>{{ item.js_time }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-4">
          <b-button
            variant="secondary"
            @click="closeAlert()"
            class="resetButton"
            style="font-size:16px !important; margin-top:25px; padding:6px 80px !important;margin-bottom:30px !important;margin-right:0 !important;"
            >返&nbsp;&nbsp;回</b-button
          >
        </div>
      </div>
    </el-dialog>
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
    title: '客户结算单',
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
    //获取客户名
    async searchClient() {
      let result = await this.$axios.get(`/zhwl/client/client_list?skip=0&limit=99999&type=0`);
      this.$set(this, 'clientList', result.clientList);
    },
    //查询按钮
    async searchButton() {
      let result = await this.$axios.get(
        `/zhwl/count/client_count?skip=0&limit=99999&c_id=${this.select_client_id}&item_name=${this.select_xm_name}&order_no=${this.select_order_no}`
      );
      this.$set(this, 'list', result.dataList);
      this.select_client_id = '';
      this.select_xm_name = '';
      this.select_order_no = '';
    },
    async openAlert(index) {
      this.xiangXiList = JSON.parse(JSON.stringify(this.list[index]));
      let result = await this.$axios.get(`/zhwl/count/out_list?transport_sub_id=${this.xiangXiList.transport_sub_id}`);
      this.$set(this, 'xiangXiList1', result.outList);
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
