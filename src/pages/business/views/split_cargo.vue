/* eslint-disable vue/no-parsing-error */
<template lang="html">
  <div id="split_cargo">
    <!-- 表格 begin -->
    <div class="base-form">
      <div class="form-inline">
        <div class="base-form-title" style="width:100%;">
          <a class="base-margin-left-20">收入管理</a>
          <div class="button-table"></div>
        </div>
      </div>
      <!-- 展示界面 -->
      <div class="base-padding-20 base-bg-fff">
        <table class="table table-bordered table-striped ">
          <tbody v-if="orderSubList.length > 0">
            <tr>
              <th>客户</th>
              <th>线路</th>
              <th>订单号</th>
              <th>拆分单号</th>
              <th>货物</th>
              <th>数量</th>
              <th>体积</th>
              <th>重量</th>
              <th>操作</th>
            </tr>
            <tr v-for="(item, index) in orderSubList" :key="index">
              <td>{{ item.cus_id | getName(clientList) }}</td>
              <td>{{ item.wayname }}</td>
              <td>{{ item.order_no }}</td>
              <td>{{ item.slip_no }}</td>
              <td>{{ item.goods_name }}</td>
              <td>{{ item.goods_num }}</td>
              <td>{{ item.goods_volume }}</td>
              <td>{{ item.goods_weight }}</td>
              <td>
                <b-button
                  v-if="item.is_in === '1'"
                  @click="openIncomeAlert(index, item.id)"
                  style="font-size:14px !important; color:#efe !important; background-color:#6b0 !important; padding: 6px 12px !important;"
                  >添加/修改收入</b-button
                >
                <b-button
                  v-if="item.is_in === '0'"
                  @click="openIncomeAlert(index, item.id)"
                  style="font-size:14px !important; color:#efe !important; background-color:#ff8800 !important; padding: 6px 12px !important;"
                  >添加收入</b-button
                >
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

    <!--添加/修改收入弹框-->
    <!-- <b-modal id="incomeAlert" title="添加/修改收入" ref="incomeAlert" size="xl" hide-footer> -->
    <el-dialog title="添加/修改收入" :visible.sync="dialogVisible" width="80%">
      <div>
        是否按辆份收费？
        <el-radio v-model="radio" label="1">否</el-radio>
        <el-radio v-model="radio" label="0">是</el-radio>
      </div>
      <div class="d-block text-center">
        <div class="row">
          <table class="table table-bordered table-striped ">
            <tr>
              <td style="width:10%">税前应收运费:{{ beforeTaxSum }}</td>
              <td style="width:10%">税后应收运费:{{ afterTaxSum }}</td>
              <td style="width:10%">税前实收运费:{{ beforeTaxRealSum }}</td>
              <td style="width:10%">税后实收运费:{{ afterTaxRealSum }}</td>
            </tr>
          </table>

          <table v-if="radio === '0'" class="table table-bordered table-striped ">
            <tbody>
              <tr>
                <td style="width:10%">客户</td>
                <td style="width:10%">线路</td>
                <td style="width:10%">合同</td>
                <td style="width:10%">单价</td>
                <td style="width:10%">税率</td>
                <td style="width:10%">项目名称</td>
              </tr>
              <tr>
                <td style="width:10%">{{ name }}</td>
                <td style="width:10%">{{ wayname }}</td>
                <td style="width:10%">
                  <el-select @change="getFreight(pact_no)" class="marginBot" style="height:40px !important" v-model="pact_no" filterable placeholder="合同号">
                    <el-option v-for="item in clientPactList" :key="item.id" :label="item.pact_no" :value="item.pact_no"> </el-option>
                  </el-select>
                </td>
                <td style="width:10%">{{ yunfeiList.price }}</td>
                <td style="width:10%">{{ yunfeiList.rate }}</td>
                <td style="width:10%">{{ yunfeiList.xm_name }}</td>
              </tr>
              <tr>
                <td style="width:10%">数量</td>
                <td style="width:10%">税前应收运费</td>
                <td style="width:10%">税后应收运费</td>
                <td style="width:10%">税前实收运费</td>
                <td style="width:10%">税后实收运费</td>
                <td style="width:10%">备注</td>
              </tr>
              <tr>
                <td style="width:10%">{{ yunfeiList.num }}</td>
                <td style="width:10%">{{ yunfeiList.sq_ys }}</td>
                <td style="width:10%">{{ yunfeiList.sh_ys }}</td>
                <td style="width:10%"><b-form-input @change="getSumAll()" v-model="yunfeiList.sq_ss" placeholder="请输入费用"></b-form-input></td>
                <td style="width:10%"><b-form-input @change="getSumAll()" v-model="yunfeiList.sh_ss" placeholder="请输入费用"></b-form-input></td>
                <td style="width:10%"><b-form-input v-model="yunfeiList.remark" placeholder="备注"></b-form-input></td>
              </tr>
            </tbody>
          </table>

          <table v-if="radio === '1'" class="table table-bordered table-striped ">
            <tr>
              <td style="width:10%">客户:&nbsp;&nbsp;{{ name }}</td>
              <td style="width:10%">线路:&nbsp;&nbsp;{{ wayname }}</td>
              <td style="width:10%">单价:&nbsp;&nbsp;{{ yunfeiList.price }}</td>
              <td style="width:20%"><b-form-input v-model="yunfeiList.remark" placeholder="备注"></b-form-input></td>
            </tr>
          </table>

          <table v-if="radio === '1'" class="table table-bordered table-striped ">
            <tbody>
              <tr>
                <td style="width:10%">合同</td>
                <td style="width:6.5%">税率</td>
                <td style="width:10%">项目名称</td>
                <td style="width:10%">发货方式</td>
                <td style="width:10%" v-if="zhuangtai === '0'">计算方式</td>
                <td style="width:6.5%" v-if="zhuangtai === '0'">数量</td>
                <td style="width:6.5%" v-if="zhuangtai === '1'">数量</td>
                <td style="width:10%">税前应收运费</td>
                <td style="width:10%">税后应收运费</td>
                <td style="width:10%">税前实收运费</td>
                <td style="width:10%">税后实收运费</td>
              </tr>
              <tr>
                <td>
                  <el-select @change="getFreight(pact_no)" class="marginBot" style="height:40px !important" v-model="pact_no" filterable placeholder="合同号">
                    <el-option v-for="item in clientPactList" :key="item.id" :label="item.pact_no" :value="item.pact_no"> </el-option>
                  </el-select>
                </td>
                <td>{{ yunfeiList.rate }}</td>
                <td>{{ yunfeiList.xm_name }}</td>
                <td>
                  <el-select
                    @change="zhuangTai(yunfeiList.send_type)"
                    v-model="yunfeiList.send_type"
                    class="marginBot"
                    style="height:40px !important"
                    filterable
                  >
                    <el-option v-for="(item, index) in deliveryList" :key="index" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                </td>
                <td v-if="zhuangtai === '0'">
                  <el-select v-model="yunfeiList.count_type" class="marginBot" style="height:40px !important" filterable>
                    <el-option v-for="(item, index) in calculationList" :key="index" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                </td>
                <td v-if="zhuangtai === '0'">{{ yunfeiList.num }}</td>
                <td v-if="zhuangtai === '1'"><b-form-input @change="getFreight(pact_no)" v-model="yunfeiList.num"></b-form-input></td>
                <td v-if="zhuangtai === '0'">{{ yunfeiList.sq_ys }}</td>
                <td v-if="zhuangtai === '0'">{{ yunfeiList.sh_ys }}</td>
                <td v-if="zhuangtai === '1'"><b-form-input @change="feiyong(1)" v-model="yunfeiList.sq_ys"></b-form-input></td>
                <td v-if="zhuangtai === '1'"><b-form-input @change="feiyong(2)" v-model="yunfeiList.sh_ys"></b-form-input></td>
                <td><b-form-input @change="getSumAll()" v-model="yunfeiList.sq_ss" placeholder="请输入费用"></b-form-input></td>
                <td><b-form-input @change="getSumAll()" v-model="yunfeiList.sh_ss" placeholder="请输入费用"></b-form-input></td>
              </tr>
            </tbody>
          </table>
          <table class="table table-bordered table-striped ">
            <tbody>
              <tr>
                <td>费用：</td>
                <td>税率：</td>
                <td>税前金额：</td>
                <td>税后金额：</td>
                <td>税前实收金额：</td>
                <td>税后实收金额：</td>
                <td>备注：</td>
                <td>操作</td>
              </tr>
              <tr v-for="(item, index) in incomeForm" :key="index">
                <td>
                  <el-select class="marginBot" style="height:26px !important" v-model="item.cost_id" filterable placeholder="输入费用名">
                    <el-option v-for="(item1, index) in costList" :key="index" :label="item1.cost_name" :value="item1.id"></el-option>
                  </el-select>
                </td>
                <td>
                  <el-select v-model="item.rate" class="marginBot" style="height:40px !important" filterable>
                    <el-option v-for="(item, index) in taxRateList" :key="index" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                </td>
                <td><b-form-input @change="feiyongAuxiliary(1, index)" v-model="item.sq_ys" placeholder="税前金额"></b-form-input></td>
                <td><b-form-input @change="feiyongAuxiliary(2, index)" v-model="item.sh_ys" placeholder="税后金额"></b-form-input></td>
                <td><b-form-input @change="getSumAll()" v-model="item.sq_ss" placeholder="税前实收金额"></b-form-input></td>
                <td><b-form-input @change="getSumAll()" v-model="item.sh_ss" placeholder="税后实收金额"></b-form-input></td>
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
            </tbody>
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
    </el-dialog>
    <!-- </b-modal> -->
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
    title: '收入管理',
  },
  data() {
    return {
      incomeForm: [],
      slipId: '',
      currentPage: 1,
      totalRow: 0,
      form: {},
      skip: 0,
      costList: [],
      addOrRevise: 0, //0添加，1修改（收入方法区分）
      deleteList: [],
      clientPactList: [],
      yunfeiList: {},
      pact_no: '',
      deliveryList: [{ id: '0', name: '零担' }, { id: '1', name: '整车' }],
      calculationList: [{ id: '0', name: '体积' }, { id: '1', name: '重量' }],
      taxRateList: [{ id: '0', name: '1' }, { id: '1', name: '1.03' }, { id: '2', name: '1.06' }, { id: '3', name: '1.1' }, { id: '4', name: '1.13' }],
      zhuangtai: '0',
      beforeTaxSum: 0,
      afterTaxSum: 0,
      beforeTaxRealSum: 0,
      afterTaxRealSum: 0,
      name: '',
      wayname: '',
      clientList: [],
      num: 0,
      dialogVisible: false,
      radio: '1',
      clientName: '',
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
    this.yunfeiList.send_type = '0';
    this.getClientList();
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
    zhuangTai(a) {
      this.zhuangtai = a;
      if (a === '1') {
        this.num = this.yunfeiList.num;
        this.yunfeiList.num = 0;
        this.yunfeiList.sq_ys = null;
        this.yunfeiList.sh_ys = null;
        this.yunfeiList.sq_ss = null;
        this.yunfeiList.sh_ss = null;
      }
      if (a === '0') {
        this.yunfeiList.num = this.num;
        this.getFreight(this.pact_no);
      }
      this.getSumAll();
    },
    //获取客户
    async getClientList() {
      let result = await this.$axios.get(`/zhwl/client/client_list?skip=0&limit=99999&type=0`);
      this.clientList = JSON.parse(JSON.stringify(result.clientList));
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
        is_in: '',
      });
      this.$set(this, 'totalRow', totalRow);
    },
    //添加收费项
    addIncomeForm() {
      this.send_time = '';
      this.incomeForm.push(JSON.parse(JSON.stringify({})));
    },
    //删除收费项
    deleteIncomeForm(i) {
      if (this.incomeForm[i].id === undefined) {
        this.incomeForm.splice(i, 1);
      } else {
        this.deleteList.push(this.incomeForm[i].id);
        this.incomeForm.splice(i, 1);
      }
      this.getSumAll();
    },
    //打开收入的弹框
    async openIncomeAlert(index, slip_id) {
      for (let index1 = 0; index1 < this.clientList.length; index1++) {
        if (this.clientList[index1].id === this.orderSubList[index].cus_id) {
          this.name = this.clientList[index1].name;
        }
      }
      this.wayname = this.orderSubList[index].wayname;
      this.yunfeiList.num = this.orderSubList[index].goods_num;
      let result = await this.$axios.get(`/zhwl/in/in_list?skip=0&limit=1000&slip_id=${slip_id}&order_no=&slip_no=`);
      let result1 = await this.$axios.get(`/zhwl/clientpact/client_pact_list?skip=0&limit=100000&cus_id=${this.orderSubList[index].cus_id}`);
      if (result.rescode === '0') {
        this.radio = result.inList[0].is_lf;
        this.clientPactList = result1.clientPactList;
        this.pact_no = result1.clientPactList[0].pact_no;
        this.$set(this, 'incomeForm', result.inList);
        this.yunfeiList = this.incomeForm[0];
        this.yunfeiList.num = this.orderSubList[index].goods_num;
        this.incomeForm.splice(0, 1);
        this.addOrRevise = 1;
      } else {
        this.radio = '1';
        this.yunfeiList.rate = '';
        this.yunfeiList.price = '';
        this.yunfeiList.sq_ys = 0;
        this.yunfeiList.sh_ys = 0;
        this.yunfeiList.sq_ss = 0;
        this.yunfeiList.sh_ss = 0;
        this.yunfeiList.remark = '';
        this.pact_no = '';
        this.incomeForm = [{}];
        this.addOrRevise = 0;
        if (result1.totalRow != 0) {
          this.clientPactList = result1.clientPactList;
        } else {
          this.yunfeiList.y_price = 0;
        }
      }
      this.getSumAll();
      this.slipId = slip_id;
      // this.$refs.incomeAlert.show();
      this.dialogVisible = true;
      this.yunfeiList.slip_no = this.orderSubList[index].slip_no;
    },
    //计算运费
    getFreight(pact_no) {
      let price = 0;
      for (let index = 0; index < this.clientPactList.length; index++) {
        if (this.clientPactList[index].pact_no === pact_no) {
          this.yunfeiList.price = this.clientPactList[index].price;
          this.yunfeiList.rate = this.clientPactList[index].cess;
        }
      }
      this.yunfeiList.sq_ys = this.yunfeiList.price * this.yunfeiList.num;
      this.yunfeiList.sh_ys = (this.yunfeiList.price * 1 * (this.yunfeiList.num * 1) * (this.yunfeiList.rate * 100)) / 100;
      this.yunfeiList.sq_ss = JSON.parse(JSON.stringify(this.yunfeiList.sq_ys));
      this.yunfeiList.sh_ss = JSON.parse(JSON.stringify(this.yunfeiList.sh_ys));
      this.getSumAll();
    },
    //税前税后费用计算
    feiyong(a) {
      if (a === 1) {
        let money = this.incomeForm.sq_ys * this.taxRateList[this.incomeForm.rate].name;
        let a = JSON.parse(JSON.stringify(money));
        this.incomeForm.sh_ys = (a * 1).toFixed(2);
        let b = JSON.parse(JSON.stringify(this.incomeForm.sq_ys));
        this.incomeForm.sq_ss = (b * 1).toFixed(2);
        let c = JSON.parse(JSON.stringify(this.incomeForm.sh_ys));
        this.incomeForm.sh_ss = (c * 1).toFixed(2);
        let d = JSON.parse(JSON.stringify(this.incomeForm.sq_ys));
        this.incomeForm.sq_ys = (d * 1).toFixed(2);
      }
      if (a === 2) {
        let money = this.incomeForm.sh_ys / this.taxRateList[this.incomeForm.rate].name;
        let a = JSON.parse(JSON.stringify(money));
        this.incomeForm.sq_ys = (a * 1).toFixed(2);
        let b = JSON.parse(JSON.stringify(this.incomeForm.sq_ys));
        this.incomeForm.sq_ss = (b * 1).toFixed(2);
        let c = JSON.parse(JSON.stringify(this.incomeForm.sh_ys));
        this.incomeForm.sh_ss = (c * 1).toFixed(2);
        let d = JSON.parse(JSON.stringify(this.incomeForm.sh_ys));
        this.incomeForm.sh_ys = (d * 1).toFixed(2);
      }
      this.getSumAll();
    },
    //税前税后费用计算
    feiyongAuxiliary(a, index) {
      if (a === 1) {
        let money = this.incomeForm[index].sq_ys * this.taxRateList[this.incomeForm[index].rate].name;
        let a = JSON.parse(JSON.stringify(money));
        this.incomeForm[index].sh_ys = (a * 1).toFixed(2);
        let b = JSON.parse(JSON.stringify(this.incomeForm[index].sq_ys));
        this.incomeForm[index].sq_ss = (b * 1).toFixed(2);
        let c = JSON.parse(JSON.stringify(this.incomeForm[index].sh_ys));
        this.incomeForm[index].sh_ss = (c * 1).toFixed(2);
        let d = JSON.parse(JSON.stringify(this.incomeForm[index].sq_ys));
        this.incomeForm[index].sq_ys = (d * 1).toFixed(2);
      }
      if (a === 2) {
        let money = this.incomeForm[index].sh_ys / this.taxRateList[this.incomeForm[index].rate].name;
        let a = JSON.parse(JSON.stringify(money));
        this.incomeForm[index].sq_ys = (a * 1).toFixed(2);
        let b = JSON.parse(JSON.stringify(this.incomeForm[index].sq_ys));
        this.incomeForm[index].sq_ss = (b * 1).toFixed(2);
        let c = JSON.parse(JSON.stringify(this.incomeForm[index].sh_ys));
        this.incomeForm[index].sh_ss = (c * 1).toFixed(2);
        let d = JSON.parse(JSON.stringify(this.incomeForm[index].sh_ys));
        this.incomeForm[index].sh_ys = (d * 1).toFixed(2);
      }
      this.getSumAll();
    },
    //计算总费用
    getSumAll() {
      this.beforeTaxSum = 0;
      this.afterTaxSum = 0;
      this.beforeTaxRealSum = 0;
      this.afterTaxRealSum = 0;
      for (let index = 0; index < this.incomeForm.length; index++) {
        if (
          (this.incomeForm[index].sq_ys != null) &
          (this.incomeForm[index].sh_ys != null) &
          (this.incomeForm[index].sq_ss != null) &
          (this.incomeForm[index].sh_ss != null)
        ) {
          this.beforeTaxSum += this.incomeForm[index].sq_ys * 1;
          this.afterTaxSum += this.incomeForm[index].sh_ys * 1;
          this.beforeTaxRealSum += this.incomeForm[index].sq_ss * 1;
          this.afterTaxRealSum += this.incomeForm[index].sh_ss * 1;
        }
      }
      this.beforeTaxSum = this.beforeTaxSum * 1 + this.yunfeiList.sq_ys * 1;
      this.afterTaxSum = this.afterTaxSum * 1 + this.yunfeiList.sh_ys * 1;
      this.beforeTaxRealSum = this.beforeTaxRealSum * 1 + this.yunfeiList.sq_ss * 1;
      this.afterTaxRealSum = this.afterTaxRealSum * 1 + this.yunfeiList.sh_ss * 1;
    },
    //获取cost费用名称字段
    async getCostList() {
      let result = await this.$axios.get(`/zhwl/cost/cost_list?skip=0&limit=1000000`);
      if (result.rescode === '0') {
        // this.$set(this, 'yunfeiList', result.clientPactList[0]);
        let i = 0;
        for (let index = 0; index < result.totalRow; index++) {
          if (result.clientPactList[index].cost_type === '0') {
            this.costList[i] = result.clientPactList[index];
            i++;
          }
        }
      }
    },
    //添加收入
    async income() {
      let result = '';
      this.yunfeiList.pact_id = this.pact_id;
      this.yunfeiList.cost_id = 1;
      delete this.yunfeiList.pact_no;
      for (let index = 0; index < this.deleteList.length; index++) {
        await this.$axios.get(`/zhwl/in/in_delete?id=${this.deleteList[index]}`);
      }
      if (this.addOrRevise === 1) {
        //修改方法
        if (this.incomeForm[0].create_time != null) {
          for (let index = 0; index < this.incomeForm.length; index++) {
            delete this.incomeForm[index].create_time;
            delete this.incomeForm[index].order_no;
            delete this.incomeForm[index].slip_id;
            delete this.incomeForm[index].status;
          }
        }
        delete this.yunfeiList.create_time;
        delete this.yunfeiList.order_no;
        delete this.yunfeiList.slip_id;
        delete this.yunfeiList.status;
        let incomeFormCopy = JSON.parse(JSON.stringify(this.incomeForm));
        this.yunfeiList.is_lf = this.radio;
        incomeFormCopy.push(JSON.parse(JSON.stringify(this.yunfeiList)));
        result = await this.updateIncome({ slipId: this.slipId, data: incomeFormCopy });
        this.slipId = '';
        this.closeIncomeAlert();
      } else {
        //保存方法
        if (this.incomeForm[0].create_time != null) {
          for (let index = 0; index < this.incomeForm.length; index++) {
            delete this.incomeForm[index].create_time;
            delete this.incomeForm[index].order_no;
            delete this.incomeForm[index].slip_id;
            delete this.incomeForm[index].status;
          }
        }
        delete this.yunfeiList.create_time;
        delete this.yunfeiList.order_no;
        delete this.yunfeiList.slip_id;
        delete this.yunfeiList.status;
        delete this.yunfeiList.id;
        this.yunfeiList.is_lf = this.radio;
        let incomeFormCopy = JSON.parse(JSON.stringify(this.incomeForm));
        incomeFormCopy.push(JSON.parse(JSON.stringify(this.yunfeiList)));
        result = await this.orderIncome({ slipId: this.slipId, data: incomeFormCopy });
        this.slipId = '';
        this.closeIncomeAlert();
      }
      this.incomeForm = [];
      this.yunfeiList = {};
    },
    //获取合同号
    getPact_no(id) {
      this.pact_id = id;
    },
    //关闭添加收入弹框
    closeIncomeAlert() {
      // this.$refs.incomeAlert.hide();
      this.dialogVisible = false;
      this.incomeForm = [];
      this.deleteList = [];
      this.search();
    },
    //获得运输单号
    async toGetTransportNo() {
      let result = await this.getTransportNo({ car_no: this.form.car_no });
      this.$set(this.form, 'transport_no', result);
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
  },
  filters: {
    getName(cus_id, clientList) {
      let text = '';
      for (let index = 0; index < clientList.length; index++) {
        if (cus_id === clientList[index].id) {
          text = clientList[index].name;
          return text;
        }
      }
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
