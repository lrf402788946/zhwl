/* eslint-disable vue/no-parsing-error */
<template lang="html">
  <div id="car_loading">
    <!-- 表格 begin -->
    <div class="base-form">
      <div class="form-inline">
        <div class="base-form-title" style="width:100%;">
          <a class="base-margin-left-20">装车</a>
          <div class="button-table"></div>
        </div>
      </div>
      <div class="base-padding-20 base-bg-fff">
        <div>
          <div class="row" style="margin-bottom: 15px !important;">
            <div class="col-lg-3 marginBot4">
              <!-- <p class="marginBot4">订单单号查询:</p>
              <b-form-input v-model="select_order_no" placeholder="输入订单单号"></b-form-input> -->
            </div>
            <div class="col-lg-3 marginBot4">
              <!-- <p class="marginBot4">订单人查询:</p>
              <el-select class="marginBot" style="height:40px !important" v-model="select_c_id" filterable placeholder="输入订单人">
                <el-option value="" label="全部客户">全部客户</el-option>
                <el-option v-for="(item, index) in clientList" :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select> -->
            </div>
            <div class="col-lg-4 marginBot4">
              <!-- <p class="marginBot4">订单日期查询:</p>
              <el-date-picker
                style="width:100%; height: 34px !important; line-height: 34px !important;"
                v-model="select_in_date"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker> -->
            </div>
            <div class="col-lg-2 marginBot4">
              <!-- <b-button
                variant="primary"
                style="font-size: 14px !important; color: rgb(255, 255, 255) !important; width: 60% !important; padding: 5px 10px !important; margin-top:28px; margin-right: 0px !important;"
                @click="search('vague')"
                >点击查询</b-button
              > -->
            </div>
          </div>
        </div>

        <div class="base-align-right" style="margin-bottom: 20px;">
          <a
            class="btn btn-info base-margin-bottom"
            style="font-size:14px !important; color:#fff !important; padding: 6px 12px !important;"
            data-toggle="tooltip"
            title=""
            role="button"
            @click="openAlert('add')"
          >
            <!-- v-b-modal="'addAlert'"-->
            <i class="base-margin-right-5 fa fa-plus-square"></i>发车
          </a>
        </div>
        <table class="table table-bordered table-striped ">
          <tbody v-if="orderSubList.length > 0">
            <tr>
              <th>选择货物</th>
              <th>订单号</th>
              <th>货物</th>
              <th>运输路线</th>
              <th>数量</th>
              <th>重量</th>
              <!-- <th>操作</th> -->
            </tr>
            <tr v-for="(item, index) in orderSubList" :key="index">
              <td>
                <b-form-checkbox-group id="order_loading_list" name="order_loading_list" v-model="order_loading_list">
                  <b-form-checkbox :value="item.id"></b-form-checkbox>
                </b-form-checkbox-group>
              </td>
              <td>{{ item.order_no }}</td>
              <td>{{ item.goods_name }}</td>
              <td>{{ item.content }}</td>
              <td>{{ item.goods_num }}</td>
              <td>{{ item.goods_weight }}</td>
              <!-- <td><b-button variant="danger" style="color:white;" @click="addOrderSublist(index)">拆&nbsp;&nbsp;分</b-button></td> -->
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td style="text-align:center;">没有查询到数据</td>
            </tr>
          </tbody>
        </table>
        <el-pagination
          layout="total, prev, pager, next"
          :background="true"
          :page-size="15"
          prev-text="上一页"
          next-text="下一页"
          :current-page="currentPage"
          @current-change="toSearch"
          :total="totalRow"
        >
        </el-pagination>
      </div>
    </div>

    <!--添加弹框-->
    <b-modal id="addAlert" title="发车" ref="addAlert" size="xl" hide-footer>
      <div class="d-block text-center">
        <div class="row">
          <div class="col-lg-4 mb25">
            <div class="lh44">运输单号：</div>
            <b-form-input v-model="form.transport_no" :disabled="true"></b-form-input>
          </div>
          <div class="col-lg-4 mb25">
            <div class="lh44">发货日期：</div>
            <el-date-picker style="width: 100%;" v-model="form.send_time" placeholder="发货日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd" type="date">
            </el-date-picker>
          </div>
          <br />
          <div class="col-lg-12 mb25">
            <el-tabs v-model="tabs" type="card" :stretch="true">
              <el-tab-pane label="所装货物" name="1">
                <table class="table table-bordered table-striped ">
                  <tbody>
                    <tr>
                      <td>订单号</td>
                      <td>货物名称</td>
                      <!-- <td>线路</td> -->
                      <td>运输金额</td>
                      <td>操作</td>
                    </tr>
                    <tr v-for="(item, index) in subForm" :key="index">
                      <td><b-form-input v-model="item.order_no" :disabled="true"></b-form-input></td>
                      <td><b-form-input v-model="item.goods_name" :disabled="true"></b-form-input></td>
                      <!-- <td><b-form-input v-model="item.content" :disabled="true"></b-form-input></td> -->
                      <td><b-form-input v-model="item.price" :disabled="true"></b-form-input></td>
                      <td>
                        <b-button
                          variant="danger"
                          :disabled="false"
                          @click="clearSubForm(index)"
                          class="resetButton"
                          style="margin-top: 23px; margin-left: 8px !important; margin-right: 6px !important; padding: 5px 8px !important; font-size: 13px !important;"
                          >删&nbsp;&nbsp;除</b-button
                        >
                      </td>
                    </tr>
                  </tbody>
                </table>
              </el-tab-pane>
              <el-tab-pane label="支出单" name="2">
                <div class="col-lg-1 mb25">
                  <el-button size="mini" type="primary" icon="el-icon-plus" circle @click="() => costList.push({})"></el-button>
                </div>
                <div style="padding: 0px 20px;" v-for="(item, index) in costList" :key="index">
                  <div class="row">
                    <div class="col-lg-3 mb25">
                      <div class="lh44">供应商</div>
                      <el-select class="marginBot" style="height:40px !important" v-model="item.car_id" filterable placeholder="请选择供应商">
                        <el-option v-for="(car, index) in carList" :key="index" :label="car.car_onwer" :value="car.id"></el-option>
                      </el-select>
                    </div>
                    <div class="col-lg-3 mb25">
                      <div class="lh44">支出项</div>
                      <el-select class="marginBot" style="height:40px !important" v-model="item.car_id" filterable placeholder="请选择支出项">
                        <el-option v-for="(car, index) in carList" :key="index" :label="car.car_onwer" :value="car.id"></el-option>
                      </el-select>
                    </div>
                    <div class="col-lg-2 mb25">
                      <div class="lh44">支出金额</div>
                      <b-form-input v-model="item.out_price" :disabled="true"></b-form-input>
                    </div>
                    <div class="col-lg-3 mb25">
                      <div class="lh44">备注</div>
                      <b-form-input v-model="item.remark" :disabled="true"></b-form-input>
                    </div>
                    <div class="col-lg-1 mb25">
                      <el-button
                        style="position: relative;top: 30px;"
                        size="mini"
                        type="danger"
                        icon="el-icon-minus"
                        circle
                        @click="index => costList.splice(index, 1)"
                      ></el-button>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
      <b-button
        variant="primary"
        @click="toValidate('add')"
        class="resetButton"
        style="font-size:16px !important; margin:25px 5% 30px 5% !important; background-color: #17a2b8 !important;  width:30% !important; padding:6px 80px !important;"
        >保&nbsp;&nbsp;存</b-button
      >
      <b-button
        variant="secondary"
        @click="reset()"
        class="resetButton"
        style="font-size:16px !important; margin-top:25px; margin-bottom:30px !important; width:30% !important; margin-right: 0 !important; padding:6px 80px !important;"
        >重&nbsp;&nbsp;置</b-button
      >
    </b-modal>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Validator from 'async-validator';
import _ from 'lodash';
//import exportExcel from '@/components/exportExcel.vue';
export default {
  name: 'car_loading',
  metaInfo: {
    title: '装车管理',
  },
  data() {
    return {
      list: [],
      subForm: [],
      costList: [],
      is_update: true,
      operateId: '',
      currentPage: 1,
      totalRow: 0,
      form: {},
      updateForm: {},
      mainValidator: new Validator({
        car_no: [{ required: true, message: '请填写操作人' }],
        car_onwer: [{ required: true, message: '请选择客户' }],
        send_time: [{ required: true, message: '请选择发货日期' }],
      }),
      th: ['订单号', '订单人', '订单日期', '备注'],
      filterVal: ['order_no', 'user_name', 'in_date', 'remark'],
      select_order_no: '',
      select_c_id: '',
      select_in_date: [],
      skip: 0,
      order_loading_list: [],
      tabs: '1',
    };
  },
  computed: {
    ...mapState({
      limit: state => state.publics.limit,
      userInfo: state => state.publics.userInfo,
      orderSubList: state => state.self.orderSubList,
      dlyWayList: state => state.self.dlyWayList,
      carList: state => state.car.carList,
      driverList: state => state.personnel.driverList,
    }),
  },
  async created() {
    await this.getCarList({ skip: 0, limit: 10000 });
    await this.getdly_wayList({ skip: 0, limit: 10000 });
    await this.getDriverList({ skip: 0, limit: 10000 });
    this.search();
  },
  methods: {
    ...mapActions(['transportOrderSubList', 'getDriverList', 'getCarList', 'transporSelectOrder', 'transportSave', 'getdly_wayList', 'getTransportNo']),
    //分页
    toSearch(currentPage) {
      this.currentPage = currentPage;
      this.search();
    },
    //查询
    async search(type) {
      if (type === 'vague') {
        this.currentPage = 1;
      }
      let skip = (this.currentPage - 1) * this.limit;
      let totalRow = await this.transportOrderSubList({
        skip: skip,
        limit: this.limit,
      });
      this.$set(this, 'totalRow', totalRow);
    },
    //验证
    toValidate(type) {
      this.mainValidator.validate(type === 'add' ? this.form : this.updateForm, (errors, fields) => {
        if (errors) {
          return this.handleErrors(errors, fields);
        }
        if (type === 'add') {
          return this.add();
        } else {
          return this.update();
        }
      });
    },
    //添加
    async add() {
      for (let index = 0; index < this.subForm.length; index++) {
        this.subForm[index].status = '1';
      }
      await this.transportSave({ form: this.form, subForm: this.subForm });
      this.$refs.addAlert.hide();
      this.form = {};
      this.subForm = [];
      this.search();
    },
    //打开与关闭修改和删除的弹框
    async openAlert(type, id) {
      if (this.order_loading_list <= 0) {
        this.$message.error('请选择要装车的货物');
        return false;
      }
      let newList = this.order_loading_list.map(item => `${item}`);
      let result = await this.transporSelectOrder({ ids: newList });
      let transportOrderSubList = result.orderSubList.map(item => {
        let newObject = { order_no: item.order_no, order_sub_id: item.id, goods_name: item.goods_name, content: item.content, price: item.price, status: '0' };
        return newObject;
      });
      this.$set(this, 'subForm', transportOrderSubList);
      this.$refs.addAlert.show();
    },
    //获得运输单号
    async toGetTransportNo() {
      let result = await this.getTransportNo({ car_no: this.form.car_no });
      this.$set(this.form, 'transport_no', result);
    },
    //关闭弹框
    closeAlert(type) {
      if (type === 'update') {
        this.$refs.updateAlert.hide();
      } else if (type === 'delete') {
        this.$refs.deleteAlert.hide();
      }
      this.is_update = true;
      this.operateId = '';
      this.reset();
    },
    //验证错误
    handleErrors(errors, fields) {
      this.$message.error(errors[0].message);
      this.errors = errors.reduce((p, c) => {
        p[c.field] = 'error';
        return p;
      }, {});
      console.debug(errors, fields);
    },
    //删除表单中内容
    clearSubForm(i) {
      this.subForm.splice(i, 1);
    },
    transportType() {
      if (this.form.tt === '0' || this.form.tt === '1') {
        return this.form.tt;
      } else {
        return '2';
      }
    },
    reset() {
      this.form = {};
      this.subForm = [];
      this.form.user_name = this.userInfo.user_name;
      this.form.login_id = this.userInfo.login_id;
    },
    //导出
    exportExcel() {
      var tableStr = `
                      <caption><b>订单单</b></caption>
                      <tr style="text-align:center;">
                        <th>订单号</th>
                        <th>操作人</th>
                        <th>客户</th>
                        <th>订单日期</th>
                        <th>操作时间</th>
                        <th>状态</th>
                        <th>备注</th>
                      </tr>
                      <tr style="text-align: center;">
                          <td>${this.updateForm.order_num}&nbsp;</td>
                          <td>${this.updateForm.user_name}</td>
                          <td>${this.getName(this.updateForm.cus_id)}</td>
                          <td>${this.updateForm.in_date}</td>
                          <td>${this.updateForm.create_time}</td>
                          <td>${this.updateForm.status == '0' ? '未出库' : '已经出库'}</td>
                          <td>${this.updateForm.remark}</td>
                      </tr>
                      <tr></tr>
                      <tr style="text-align:center;">
                        <th>型号</th>
                        <th>数量</th>
                      </tr>`;
      for (let item of this.orderSubList) {
        tableStr += ` <tr style="text-align: center;">
                        <td>${item.code}</td>
                        <td>${item.num}</td>
                      </tr>`;
      }
      //Worksheet名
      var worksheet = 'Sheet1';
      var uri = 'data:application/vnd.ms-excel;base64,';
      // 真正要导出（下载）的HTML模板
      var exportTemplate = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" 
                      xmlns="http://www.w3.org/TR/REC-html40">
                          <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
                              <x:Name>${worksheet}</x:Name>
                                  <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
                              </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
                          </head>
                          <body>
                              <table border="1" cellspacing="0" cellpadding="0" syle="table-layout: fixed;word-wrap: break-word; word-break: break-all;">${tableStr}</table>
                          </body>
                      </html>`;
      //下载模板
      window.location.href = uri + this.base64(exportTemplate);
    },
    //输出base64编码
    base64(s) {
      return window.btoa(unescape(encodeURIComponent(s)));
    },
  },
  filters: {
    getStatus(data) {
      let text = '';
      switch (data) {
        case 0:
          text = '待发';
          break;
        case 1:
          text = '装车';
          break;
        case 2:
          text = '到达';
          break;
        case 3:
          text = '支付完成';
          break;
        case 4:
          text = '收款完成';
          break;
        default:
          text = '当前状态错误';
          break;
      }
      return text;
    },
  },
};
</script>

<style scoped>
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
  vertical-align: inherit;
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
.btn-primary1 {
  background-color: #5bc0de;
  color: white;
  width: 400px;
  height: 280px;
  cursor: hand;
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
.lh44 {
  text-align: left;
  line-height: 35px;
}
.mb25 {
  margin-bottom: 10px;
}
.mb20 {
  margin-bottom: 20px;
}
</style>
<style scoped>
@import '../../../assets/style/Font-Awesome-master/css/font-awesome.css';
@import '../../../assets/style/layout/base-Layout-bootstrap.css';
@import '../../../assets/style/base-style-bootstrap.css';
</style>
