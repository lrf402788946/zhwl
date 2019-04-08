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
      <!-- 展示界面 -->
      <div class="base-padding-20 base-bg-fff">
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
                  @click="openIncomeAlert(index, item.id)"
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

    <!--拆分弹框-->
    <b-modal id="addAlert" title="拆分订单" ref="addAlert" size="xl" hide-footer>
      <div class="d-block text-center">
        <div class="row">
          <h4>原订单</h4>
          <table class="table table-bordered table-striped ">
            <tbody>
              <tr>
                <td style="width:15%">订单号</td>
                <td style="width:10%">货物名称</td>
                <td style="width:10%">线路</td>
                <td style="width:10%">数量</td>
                <td style="width:10%">体积</td>
                <td style="width:10%">重量</td>
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
                <td style="width:20%">拆分业务号</td>
                <td>发货日期</td>
                <td>数量</td>
                <td>体积</td>
                <td>重量</td>
                <td>操作</td>
              </tr>
              <tr v-for="(item, index) in subForm" :key="index">
                <td v-if="false"><b-form-input v-model="item.goods_name" :disabled="true"></b-form-input></td>
                <td v-if="false"><b-form-input v-model="item.content" :disabled="true"></b-form-input></td>
                <td><b-form-input v-model="item.slip_no"></b-form-input></td>
                <td>
                  <el-date-picker v-model="item.send_time" size="large" type="date" placeholder="选择发货日期"></el-date-picker>
                </td>
                <td>
                  <el-input-number @change="changeNum()" :min="0" :max="goods_num" size="small" v-model="item.goods_num"></el-input-number>
                </td>
                <td>
                  <el-input-number @change="changeNum()" :min="0" :max="goods_volume" size="small" v-model="item.goods_volume"></el-input-number>
                </td>
                <td>
                  <el-input-number @change="changeNum()" :min="0" :max="goods_weight" size="small" v-model="item.goods_weight"></el-input-number>
                </td>
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
              <td>费用：</td>
              <td>收入金额：</td>
              <td>备注：</td>
              <td>操作</td>
            </tr>
            <tr v-for="(item, index) in incomeForm" :key="index">
              <td>
                <el-select
                  @change="chooseFreight(item.cost_id, index)"
                  class="marginBot"
                  style="height:26px !important"
                  v-model="item.cost_id"
                  filterable
                  placeholder="输入费用名"
                >
                  <el-option v-for="(item1, index) in costList" :key="index" :label="item1.cost_name" :value="item1.id"></el-option>
                </el-select>
              </td>
              <td><b-form-input v-model="item.in_price" placeholder="输入金额"></b-form-input></td>
              <td><b-form-input v-model="item.remark" placeholder="备注"></b-form-input></td>
              <td>
                <b-button
                  style="margin-top: 5%; margin-left: 8px !important; margin-right: 6px !important; padding: 5px 8px !important; font-size: 13px !important;"
                  @click="deleteIncomeForm(index)"
                  class="resetButton"
                  variant="danger"
                  >删&nbsp;&nbsp;除</b-button
                >
              </td>
            </tr>
          </table>
        </div>
      </div>
      <b-button
        variant="primary"
        @click="addIncomeForm()"
        class="resetButton"
        style="font-size:16px !important; margin:10px 2% 20px 5% !important; background-color: #17a2b8 !important;  width:25% !important; padding:6px 0px !important;"
        >添&nbsp;&nbsp;加</b-button
      >
      <b-button
        variant="primary"
        @click="income()"
        class="resetButton"
        style="font-size:16px !important; margin:10px 2% 20px 5% !important; background-color: #17a2b8 !important;  width:25% !important; padding:6px 0px !important;"
        >保&nbsp;&nbsp;存</b-button
      >
      <b-button
        variant="secondary"
        @click="closeIncomeAlert()"
        class="resetButton"
        style="font-size:16px !important; margin:10px 2% 20px 5% !important; background-color: #cccccc !important;  width:25% !important; padding:6px 0px !important;"
        >取&nbsp;&nbsp;消</b-button
      >
    </b-modal>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Validator from 'async-validator';
import _ from 'lodash';
import { constants } from 'fs';
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
      incomeForm: [],
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
      incomeFormContent: {},
      goods_num: 0,
      goods_volume: 0,
      goods_weight: 0,
      addOrRevise: 0, //0添加，1修改（收入方法区分）
      freight: '',
      isShow: false,
      deleteList: [],
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
      'orderIncome',
      'updateIncome',
    ]),
    //拆分
    addOrderSublist() {
      let newArray = JSON.parse(JSON.stringify(this.orderList));
      newArray.goods_num = 0;
      newArray.goods_volume = 0;
      newArray.goods_weight = 0;
      this.subForm.splice(this.subForm.length, 0, newArray);
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
          let num_sum = 0;
          let volume_sum = 0;
          let weight_sum = 0;
          for (let index = 0; index < this.subForm.length; index++) {
            num_sum += this.subForm[index].goods_num;
            volume_sum += this.subForm[index].goods_volume;
            weight_sum += this.subForm[index].goods_weight;
          }
          if ((this.goods_num < num_sum) | (this.goods_volume < volume_sum) | (this.goods_weight < weight_sum)) {
            return this.$message.error('请重新核对数量！！！');
          }
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
          delete this.subForm[index].order_no;
          delete this.subForm[index].id;
          delete this.subForm[index].wayname;
          delete this.subForm[index].dly_way_id;
        }
        this.subForm.splice(0, 0, this.orderList);
        delete this.subForm[0].order_no;
        // delete this.subForm[0].id;
        delete this.subForm[0].wayname;
        delete this.subForm[0].dly_way_id;
        // console.log(this.subForm)
        await this.orderSubSplit({ form: this.form, subForm: this.subForm });
        this.$refs.addAlert.hide();
        this.subForm = [];
        this.search();
      } catch (error) {
        console.error('error in line 269');
      }
    },
    changeNum() {
      let sum1 = 0;
      let sum2 = 0;
      let sum3 = 0;
      for (let index = 0; index < this.subForm.length; index++) {
        sum1 += this.subForm[index].goods_num;
        sum2 += this.subForm[index].goods_volume;
        sum3 += this.subForm[index].goods_weight;
      }
      this.orderList.goods_num = this.goods_num - sum1;
      this.orderList.goods_volume = this.goods_volume - sum2;
      this.orderList.goods_weight = this.goods_weight - sum3;
    },
    //添加收费项
    addIncomeForm() {
      this.isShow = false;
      this.send_time = '';
      this.incomeForm.push(JSON.parse(JSON.stringify(this.incomeFormContent)));
    },
    //删除收费项
    async deleteIncomeForm(i) {
      if (this.incomeForm[i].id === undefined) {
        this.incomeForm.splice(i, 1);
      } else {
        this.deleteList.push(this.incomeForm[i].id);
        this.incomeForm.splice(i, 1);
      }
    },
    //打开拆分的弹框
    async openAlert(index) {
      this.subForm = [];
      await this.transportOrderSubList({
        skip: 0,
        limit: 100000000,
      });
      this.$set(this, 'orderList', this.orderSubList[index]);
      this.goods_num = this.orderList.goods_num;
      this.goods_volume = this.orderList.goods_volume;
      this.goods_weight = this.orderList.goods_weight;
      this.$refs.addAlert.show();
    },
    //打开收入的弹框
    async openIncomeAlert(index, slip_id) {
      let result = await this.$axios.get(`/zhwl/in/in_list?skip=0&limit=1000&slip_id=${slip_id}&order_no=`);
      let result1 = await this.$axios.get(`/zhwl/clientpact/client_pact_list?skip=0&limit=100000&cus_id=this.orderSubList[index].cus_id`);
      if (result.rescode === '0') {
        this.$set(this, 'incomeForm', result.inList);
        this.addOrRevise = 1;
      } else {
        this.incomeForm = [{}];
        this.addOrRevise = 0;
        if (result1.totalRow === 1) {
          this.freight = result1.clientPactList[0].price * this.orderSubList[index].goods_num;
        } else {
          this.freight = 0;
        }
      }
      this.slipId = slip_id;
      this.$refs.incomeAlert.show();
    },
    chooseFreight(cost_id, index) {
      if (cost_id == 5) {
        this.incomeForm[index].in_price = this.freight;
      }
    },
    //获取cost费用名称字段
    async getCostList() {
      let result = await this.$axios.get(`/zhwl/cost/cost_list?skip=0&limit=1000000&cost_type=0`);
      if (result.rescode === '0') {
        this.$set(this, 'costList', result.clientPactList);
        for (let index = 0; index < result.totalRow; index++) {
          if (this.costList[index].cost_type === '1') {
            this.costList.splice(index, 1);
          }
        }
      }
    },
    //添加收入
    async income() {
      let result = '';
      for (let index = 0; index < this.deleteList.length; index++) {
        await this.$axios.get(`/zhwl/in/in_delete?id=${this.deleteList[index]}`);
      }
      if (this.addOrRevise === 1) {
        //修改方法
        result = await this.updateIncome({ slipId: this.slipId, data: this.incomeForm });
        this.slipId = '';
        this.closeIncomeAlert();
      } else {
        //保存方法
        result = await this.orderIncome({ slipId: this.slipId, data: this.incomeForm });
        this.slipId = '';
        this.closeIncomeAlert();
      }
    },
    //关闭添加收入弹框
    closeIncomeAlert() {
      this.$refs.incomeAlert.hide();
      this.incomeForm = [];
      this.isShow = false;
      this.deleteList = [];
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
      this.search();
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
