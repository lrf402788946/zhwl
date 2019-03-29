/* eslint-disable vue/no-parsing-error */
<template lang="html">
  <div id="split_cargo">
    <!-- 表格 begin -->
    <div class="base-form">
      <div class="form-inline">
        <div class="base-form-title" style="width:100%;">
          <a class="base-margin-left-20">拆分货物</a>
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
        <table class="table table-bordered table-striped ">
          <tbody v-if="orderSubList.length > 0">
            <tr>
              <th>订单号</th>
              <th>货物</th>
              <th>运输路线</th>
              <th>数量</th>
              <th>体积</th>
              <th>重量</th>
              <th>操作</th>
            </tr>
            <tr v-for="(item, index) in orderSubList" :key="index">
              <td>{{ item.order_no }}</td>
              <td>{{ item.goods_name }}</td>
              <td>{{ item.content }}</td>
              <td>{{ item.goods_num }}</td>
              <td>{{ item.goods_volume }}</td>
              <td>{{ item.goods_weight }}</td>
              <td>
                <a
                  class="btn btn-info base-margin-bottom"
                  style="font-size:14px !important; color:#fff !important; padding: 6px 12px !important;"
                  data-toggle="tooltip"
                  title=""
                  role="button"
                  @click="openAlert(index)"
                >
                  <i class="base-margin-right-5 fa"></i>拆分货物
                </a>
                <a
                  class="btn btn-info base-margin-bottom"
                  style="font-size:14px !important; color:#fff !important; padding: 6px 12px !important;"
                  data-toggle="tooltip"
                  title=""
                  role="button"
                  @click="openIncomeAlert(item.id)"
                >
                  <i class="base-margin-right-5 fa"></i>添加/修改收入
                </a>
              </td>
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
    <b-modal id="addAlert" title="拆分订单" ref="addAlert" size="xl" hide-footer>
      <div class="d-block text-center">
        <div class="row">
          <h4>原订单</h4>
          <table class="table table-bordered table-striped ">
            <tbody>
              <tr>
                <td>订单号</td>
                <td>货物名称</td>
                <td>线路</td>
                <td>数量</td>
                <td>体积</td>
                <td>重量</td>
              </tr>
              <tr>
                <td>{{ orderList.order_no }}</td>
                <td>{{ orderList.goods_name }}</td>
                <td>{{ orderList.content }}</td>
                <td>{{ orderList.goods_num }}</td>
                <td>{{ orderList.goods_volume }}</td>
                <td>{{ orderList.goods_weight }}</td>
              </tr>
            </tbody>
          </table>
          <h4>拆分后订单</h4>
          <b-button variant="danger" style="color:white;" @click="addOrderSublist()">拆&nbsp;分&nbsp;订&nbsp;单</b-button>
          <table class="table table-bordered table-striped ">
            <tbody>
              <tr>
                <td>订单号</td>
                <td>货物名称</td>
                <td>线路</td>
                <td>数量</td>
                <td>体积</td>
                <td>重量</td>
                <td>操作</td>
              </tr>
              <tr v-for="(item, index) in subForm" :key="index">
                <td><b-form-input v-model="item.order_no" :disabled="true"></b-form-input></td>
                <td><b-form-input v-model="item.goods_name" :disabled="true"></b-form-input></td>
                <td><b-form-input v-model="item.content" :disabled="true"></b-form-input></td>
                <td v-if="item.showDel"><el-input-number :min="0" size="medium" v-model="item.goods_num"></el-input-number></td>
                <td v-else-if="!item.showDel">{{ item.goods_num }}</td>
                <td v-if="item.showDel"><el-input-number :min="0" size="medium" v-model="item.goods_volume"></el-input-number></td>
                <td v-else-if="!item.showDel">{{ item.goods_volume }}</td>
                <td v-if="item.showDel"><el-input-number :min="0" size="medium" v-model="item.goods_weight"></el-input-number></td>
                <td v-else-if="!item.showDel">{{ item.goods_weight }}</td>
                <td>
                  <b-button
                    variant="danger"
                    v-if="item.showDel"
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
        @click="closeAlert('update')"
        class="resetButton"
        style="font-size:16px !important; margin:10px 5% 30px 5% !important; background-color: #ccc !important;  width:30% !important; padding:6px 80px !important;"
        >返&nbsp;&nbsp;回</b-button
      >
    </b-modal>
    <!--添加/修改收入弹框-->
    <b-modal id="incomeAlert" title="添加/修改收入" ref="incomeAlert" size="lg" hide-footer>
      <div class="d-block text-center">
        <div class="row">
          <table class="table table-bordered table-striped ">
            <tr>
              <td>费用ID：</td>
              <td>
                <el-select class="marginBot" style="height:40px !important" v-model="incomeList.cost_id" filterable placeholder="输入订单人">
                  <el-option v-for="(item, index) in costList" :key="index" :label="item.cost_name" :value="item.id"></el-option>
                </el-select>
              </td>
            </tr>
            <tr>
              <td>收入金额：</td>
              <td><b-form-input v-model="incomeList.in_price"></b-form-input></td>
            </tr>
            <tr>
              <td>备注：</td>
              <td><b-form-input v-model="incomeList.remark"></b-form-input></td>
            </tr>
          </table>
        </div>
      </div>
      <b-button
        variant="primary"
        @click="income()"
        class="resetButton"
        style="font-size:16px !important; margin:25px 5% 30px 5% !important; background-color: #17a2b8 !important;  width:30% !important; padding:6px 80px !important;"
        >保&nbsp;&nbsp;存</b-button
      >
      <b-button
        variant="secondary"
        @click="closeIncomeAlert()"
        class="resetButton"
        style="font-size:16px !important; margin:10px 5% 30px 5% !important; background-color: #ccc !important;  width:30% !important; padding:6px 80px !important;"
        >返&nbsp;&nbsp;回</b-button
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
      incomeList: {},
      slipId: '',
      is_update: true,
      operateId: '',
      currentPage: 1,
      totalRow: 0,
      form: {},
      updateForm: {},
      mainValidator: new Validator({
        // car_no: [{ required: true, message: '请填写操作人' }],
        // car_onwer: [{ required: true, message: '请选择客户' }],
        // send_time: [{ required: true, message: '请选择发货日期' }],
      }),
      select_order_no: '',
      select_c_id: '',
      select_in_date: [],
      skip: 0,
      orderList: {},
      costList: [],
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
    this.getCostList();
  },
  methods: {
    ...mapActions([
      'transportOrderSubList',
      'getDriverList',
      'getCarList',
      'transporSelectOrder',
      'transportSave',
      'getdly_wayList',
      'getTransportNo',
      'orderSubSplit',
    ]),
    //拆分
    addOrderSublist() {
      let newArray = {};
      newArray.order_no = this.orderList.order_no;
      newArray.goods_name = this.orderList.goods_name;
      newArray.content = this.orderList.content;
      newArray.goods_num = 0;
      newArray.goods_weight = 0;
      this.subForm.splice(this.subForm.length, 0, newArray);
      this.subForm[this.subForm.length - 1].showDel = true;
    },
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
      try {
        for (let index = 0; index < this.subForm.length; index++) {
          this.subForm[index].status = '1';
          if (index != 0) {
            this.subForm[index].order_no = '';
          }
        }
        await this.orderSubSplit({ form: this.form, subForm: this.subForm });
        this.$refs.addAlert.hide();
        this.subForm = [];
        this.search();
      } catch (error) {
        console.error('error in line 269');
      }
    },
    //打开添加的弹框
    async openAlert(index) {
      this.subForm = [];
      await this.transportOrderSubList({
        skip: 0,
        limit: 100000000,
      });
      this.$set(this, 'orderList', this.orderSubList[index]);
      this.$refs.addAlert.show();
    },
    //打开收入的弹框
    async openIncomeAlert(slip_id) {
      let result = await this.$axios.get(`/zhwl/zhwl_in/zhwl_in_list?slip_id=${slip_id}`);
      // if (result.rescode === '0') {
      //   this.$set(this, 'incomeList', result.zhwl_in_list);
      // }
      this.slipId = slip_id;
      this.$refs.incomeAlert.show();
    },
    //获取cost费用名称字段
    async getCostList() {
      let result = await this.$axios.get(`/zhwl/cost/cost_list?skip=0&limit=1000000`);
      if (result.rescode === '0') {
        this.$set(this, 'costList', result.clientPactList);
      }
    },
    //添加收入
    async income() {
      this.incomeList.slip_id = this.slipId;
      let result = await this.$axios.post('/zhwl/zhwl_in/zhwl_in_save', { data: this.incomeList });
      if (result.data.rescode === '0') {
        this.$message.success('修改' + result.data.msg);
        this.closeIncomeAlert();
        this.incomeList = {};
        this.search();
      } else {
        this.$message.error(result.data.msg);
      }
      this.slipId = '';
    },
    //关闭添加收入弹框
    closeIncomeAlert() {
      this.$refs.incomeAlert.hide();
      this.incomeList = {};
      this.search();
    },
    //获得运输单号
    async toGetTransportNo() {
      let result = await this.getTransportNo({ car_no: this.form.car_no });
      this.$set(this.form, 'transport_no', result);
    },
    //关闭弹框
    closeAlert(type) {
      if (type === 'update') {
        this.$refs.addAlert.hide();
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
    reset() {
      this.form = {};
      this.subForm = [];
      this.form.user_name = this.userInfo.user_name;
      this.form.login_id = this.userInfo.login_id;
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
