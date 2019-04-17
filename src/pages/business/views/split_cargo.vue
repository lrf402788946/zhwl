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
              <th>拆分单号</th>
              <th>货物</th>
              <th>数量</th>
              <th>体积</th>
              <th>重量</th>
              <th width="25%">操作</th>
            </tr>
            <tr v-for="(item, index) in orderSubList" :key="index">
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
                <b-button
                  v-if="item.is_in === '0'"
                  class="btn btn-info base-margin-bottom"
                  @click="openAlert(index)"
                  style="font-size:14px !important; color:#efe !important; padding: 6px 12px !important;margin-left: 42px !important;"
                  >拆分货物</b-button
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

    <!--拆分弹框-->
    <b-modal id="addAlert" title="拆分订单" ref="addAlert" size="xl" hide-footer>
      <div class="d-block text-center">
        <div class="row">
          <h4>原订单</h4>
          <table class="table table-bordered table-striped ">
            <tbody>
              <tr>
                <td style="width:15%">订单号</td>
                <td style="width:15%">拆分单号</td>
                <td style="width:10%">货物名称</td>
                <td style="width:10%">发货日期</td>
                <td style="width:10%">数量</td>
                <td style="width:10%">体积</td>
                <td style="width:10%">重量</td>
              </tr>
              <tr>
                <td>{{ orderList.order_no }}</td>
                <td>{{ orderList.slip_no }}</td>
                <td>{{ orderList.goods_name }}</td>
                <td><el-date-picker v-model="orderList.send_time" :disabled="true" size="large" type="date" placeholder="选择发货日期"></el-date-picker></td>
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
                <td style="width:20%">拆分单号</td>
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
    <b-modal id="incomeAlert" title="添加/修改收入" ref="incomeAlert" size="xl" hide-footer>
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

          <table class="table table-bordered table-striped ">
            <tbody>
              <tr>
                <td style="width:10%">合同</td>
                <td style="width:6.5%">税率</td>
                <td style="width:10%">项目名称</td>
                <td style="width:10%">发货方式</td>
                <td style="width:10%" v-if="zhuangtai === 0">计算方式</td>
                <td style="width:6.5%" v-if="zhuangtai === 0">数量</td>
                <td style="width:6.5%" v-if="zhuangtai === 0">单价</td>
                <td style="width:10%">税前应收运费</td>
                <td style="width:10%">税后应收运费</td>
                <td style="width:10%">税前实收运费</td>
                <td style="width:10%">税后实收运费</td>
                <td style="width:10%">备注</td>
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
                  <el-select v-model="yunfeiList.send_type" class="marginBot" style="height:40px !important" filterable>
                    <el-option v-for="(item, index) in deliveryList" :key="index" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                </td>
                <td v-if="yunfeiList.send_type !== 1">
                  <el-select v-model="yunfeiList.count_type" class="marginBot" style="height:40px !important" filterable>
                    <el-option v-for="(item, index) in calculationList" :key="index" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                </td>
                <td v-if="zhuangtai === 0">{{ yunfeiList.num }}</td>
                <td v-if="zhuangtai === 0">{{ yunfeiList.price }}</td>
                <td v-if="zhuangtai === 0">{{ yunfeiList.sq_ys }}</td>
                <td v-if="zhuangtai === 0">{{ yunfeiList.sh_ys }}</td>
                <td v-if="zhuangtai === 1"><b-form-input @change="feiyong(1)" v-model="yunfeiList.sq_ys"></b-form-input></td>
                <td v-if="zhuangtai === 1"><b-form-input @change="feiyong(2)" v-model="yunfeiList.sh_ys"></b-form-input></td>
                <td><b-form-input @change="getSumAll()" v-model="yunfeiList.sq_ss" placeholder="请输入费用"></b-form-input></td>
                <td><b-form-input @change="getSumAll()" v-model="yunfeiList.sh_ss" placeholder="请输入费用"></b-form-input></td>
                <td><b-form-input v-model="yunfeiList.remark" placeholder="备注"></b-form-input></td>
              </tr>
            </tbody>
          </table>
          <table class="table table-bordered table-striped ">
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
    title: '拆分管理',
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
      isShow: false,
      deleteList: [],
      clientPactList: [],
      yunfeiList: {},
      pact_no: '',
      deliveryList: [{ id: 0, name: '零担' }, { id: 1, name: '整车' }],
      calculationList: [{ id: 0, name: '体积' }, { id: 1, name: '重量' }],
      taxRateList: [{ id: 0, name: 1 }, { id: 1, name: 1.03 }, { id: 2, name: 1.06 }, { id: 3, name: 1.1 }, { id: 4, name: 1.13 }],
      zhuangtai: 0,
      beforeTaxSum: 0,
      afterTaxSum: 0,
      beforeTaxRealSum: 0,
      afterTaxRealSum: 0,
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
    zhuangTai(a) {
      this.zhuangtai = a;
      if (a === 1) {
        this.yunfeiList.sq_ys = null;
        this.yunfeiList.sh_ys = null;
        this.yunfeiList.sq_ss = null;
        this.yunfeiList.sh_ss = null;
      }
      if (a === 0) {
        this.getFreight(this.pact_no);
      }
    },
    //获取拆分单号
    async getSlipNo() {
      let result = await this.$axios.get(`/zhwl/order/slip_no?id=1&order_no=order0001`);
    },
    //拆分
    async addOrderSublist() {
      let result = await this.$axios.get(`/zhwl/order/slip_no?id=${this.orderList.id}&order_no=${this.orderList.order_no}`);
      this.slip_no = JSON.parse(JSON.stringify(result.slip_no));
      let newArray = JSON.parse(JSON.stringify(this.orderList));
      newArray.goods_num = 0;
      newArray.goods_volume = 0;
      newArray.goods_weight = 0;
      newArray.slip_no = this.slip_no;
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
        is_in: '',
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
          delete this.subForm[index].cus_id;
        }
        let subFormCopy = JSON.parse(JSON.stringify(this.subForm));
        subFormCopy.splice(0, 0, this.orderList);
        delete subFormCopy[0].order_no;
        delete subFormCopy[0].wayname;
        delete subFormCopy[0].dly_way_id;
        delete subFormCopy[0].cus_id;
        await this.orderSubSplit({ form: this.form, subForm: subFormCopy });
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
    deleteIncomeForm(i) {
      if (this.incomeForm[i].id === undefined) {
        this.incomeForm.splice(i, 1);
      } else {
        this.deleteList.push(this.incomeForm[i].id);
        this.incomeForm.splice(i, 1);
      }
      this.getSumAll();
    },
    //打开拆分的弹框
    async openAlert(index) {
      this.subForm = [];
      await this.transportOrderSubList({
        skip: 0,
        limit: 100000000,
        is_in: '',
      });
      this.$set(this, 'orderList', this.orderSubList[index]);
      this.goods_num = this.orderList.goods_num * 1;
      this.goods_volume = this.orderList.goods_volume * 1;
      this.goods_weight = this.orderList.goods_weight * 1;
      this.$refs.addAlert.show();
    },
    //打开收入的弹框
    async openIncomeAlert(index, slip_id) {
      this.yunfeiList.num = this.orderSubList[index].goods_num;
      let result = await this.$axios.get(`/zhwl/in/in_list?skip=0&limit=1000&slip_id=${slip_id}&order_no=&slip_no=`);
      let result1 = await this.$axios.get(`/zhwl/clientpact/client_pact_list?skip=0&limit=100000&cus_id=${this.orderSubList[index].cus_id}`);
      if (result.rescode === '0') {
        this.clientPactList = result1.clientPactList;
        this.pact_no = result1.clientPactList[0].pact_no;
        this.$set(this, 'incomeForm', result.inList);
        this.yunfeiList = this.incomeForm[0];
        this.yunfeiList.num = this.orderSubList[index].goods_num;
        this.incomeForm.splice(0, 1);
        this.addOrRevise = 1;
      } else {
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
        this.getSumAll();
      }
      this.slipId = slip_id;
      this.$refs.incomeAlert.show();
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
      this.yunfeiList.sh_ys = this.yunfeiList.price * this.yunfeiList.num * this.yunfeiList.rate;
      this.yunfeiList.sq_ss = JSON.parse(JSON.stringify(this.yunfeiList.sq_ys));
      this.yunfeiList.sh_ss = JSON.parse(JSON.stringify(this.yunfeiList.sh_ys));
      this.getSumAll();
    },
    //税前税后费用计算
    feiyong(a) {
      if (a === 1) {
        let money = this.yunfeiList.sq_ys * this.yunfeiList.rate;
        this.yunfeiList.sh_ys = JSON.parse(JSON.stringify(money));
        this.yunfeiList.sq_ss = JSON.parse(JSON.stringify(this.yunfeiList.sq_ys));
        this.yunfeiList.sh_ss = JSON.parse(JSON.stringify(this.yunfeiList.sh_ys));
      }
      if (a === 2) {
        let money = this.yunfeiList.sh_ys / this.yunfeiList.rate;
        this.yunfeiList.sq_ys = JSON.parse(JSON.stringify(money));
        this.yunfeiList.sq_ss = JSON.parse(JSON.stringify(this.yunfeiList.sq_ys));
        this.yunfeiList.sh_ss = JSON.parse(JSON.stringify(this.yunfeiList.sh_ys));
      }
      this.getSumAll();
    },
    //税前税后费用计算
    feiyongAuxiliary(a, index) {
      if (a === 1) {
        let money = this.incomeForm[index].sq_ys * this.taxRateList[this.incomeForm[index].rate].name;
        this.incomeForm[index].sh_ys = JSON.parse(JSON.stringify(money));
        this.incomeForm[index].sq_ss = JSON.parse(JSON.stringify(this.incomeForm[index].sq_ys));
        this.incomeForm[index].sh_ss = JSON.parse(JSON.stringify(this.incomeForm[index].sh_ys));
      }
      if (a === 2) {
        let money = this.incomeForm[index].sh_ys / this.taxRateList[this.incomeForm[index].rate].name;
        this.incomeForm[index].sq_ys = JSON.parse(JSON.stringify(money));
        this.incomeForm[index].sq_ss = JSON.parse(JSON.stringify(this.incomeForm[index].sq_ys));
        this.incomeForm[index].sh_ss = JSON.parse(JSON.stringify(this.incomeForm[index].sh_ys));
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
          this.beforeTaxSum += this.incomeForm[index].sq_ys;
          this.afterTaxSum += this.incomeForm[index].sh_ys;
          this.beforeTaxRealSum += this.incomeForm[index].sq_ss;
          this.afterTaxRealSum += this.incomeForm[index].sh_ss;
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
            this.incomeForm[index].slip_no = JSON.parse(JSON.stringify(this.yunfeiList.slip_no));
          }
        }
        delete this.yunfeiList.create_time;
        delete this.yunfeiList.order_no;
        delete this.yunfeiList.slip_id;
        delete this.yunfeiList.status;
        let incomeFormCopy = JSON.parse(JSON.stringify(this.incomeForm));
        incomeFormCopy.push(this.yunfeiList);
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
            this.incomeForm[index].slip_no = JSON.parse(JSON.stringify(this.yunfeiList.slip_no));
          }
        }
        delete this.yunfeiList.create_time;
        delete this.yunfeiList.order_no;
        delete this.yunfeiList.slip_id;
        delete this.yunfeiList.status;
        delete this.yunfeiList.id;
        let incomeFormCopy = JSON.parse(JSON.stringify(this.incomeForm));
        incomeFormCopy.push(this.yunfeiList);
        result = await this.orderIncome({ slipId: this.slipId, data: incomeFormCopy });
        this.slipId = '';
        this.closeIncomeAlert();
      }
    },
    //获取合同号
    getPact_no(id) {
      this.pact_id = id;
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
