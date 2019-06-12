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
        <div class="base-align-right" style="margin-bottom: 20px;">
          <a
            class="btn btn-info base-margin-bottom"
            style="font-size:14px !important; color:#fff !important; padding: 6px 12px !important;"
            data-toggle="tooltip"
            title=""
            role="button"
            @click="openAlert()"
          >
            <!-- v-b-modal="'addAlert'"-->
            <i class="base-margin-right-5 fa fa-plus-square"></i>发车
          </a>
        </div>
        <table class="table table-bordered table-striped ">
          <tbody v-if="orderSubList.length > 0">
            <tr>
              <th style="width: 8%;">选择货物</th>
              <th>订单号</th>
              <th>拆分单号</th>
              <th>货物</th>
              <th>数量</th>
              <th>重量</th>
              <th>体积</th>
              <th>要求发货日期</th>
              <th>操作</th>
            </tr>
            <tr v-for="(item, index) in orderSubList" :key="index">
              <td style="width: 8%; text-align:center;">
                <b-form-checkbox-group id="order_loading_list" name="order_loading_list" v-model="order_loading_list">
                  <b-form-checkbox :value="item.id"></b-form-checkbox>
                </b-form-checkbox-group>
              </td>
              <td>{{ item.order_no }}</td>
              <td>{{ item.slip_no }}</td>
              <td>{{ item.goods_name }}</td>
              <td>{{ item.goods_num }}</td>
              <td>{{ item.goods_weight }}</td>
              <td>{{ item.goods_volume }}</td>
              <td><el-date-picker v-model="item.send_time_hp" :disabled="true" size="large" type="date"></el-date-picker></td>
              <td>
                <b-button
                  class="btn btn-info base-margin-bottom"
                  @click="openSplitAlert(index)"
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

    <!--添加弹框-->
    <b-modal id="addAlert" title="发车" ref="addAlert" size="xl" hide-footer no-close-on-backdrop no-close-on-esc no-enforce-focus>
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
          <div class="col-lg-4 mb25">
            <div class="lh44">操作人：</div>
            <b-form-input v-model="form.op" :disabled="true"></b-form-input>
          </div>
          <div class="col-lg-4 mb25">
            <div class="lh44">线路：</div>
            <b-form-select v-model="form.dly_way_id" @change="subDlyWay()">
              <option value="" disabled>请选择线路</option>
              <option v-for="(item, index) in dlyWayList" :key="index" :label="item.name" :value="item.id"></option>
            </b-form-select>
          </div>
          <div class="col-lg-8 mb25">
            <div class="lh44">运输内容：</div>
            <b-form-input v-model="form.content"></b-form-input>
          </div>
          <!--支出信息-->
          <div class="col-lg-3 mb25">
            <div class="lh44">供应商方式</div>
            <el-select
              class="marginBot"
              style="height:40px !important"
              v-model="out.type"
              filterable
              placeholder="请选择供应商方式"
              @change="changeList('type')"
            >
              <el-option :value="0" label="自运"></el-option>
              <el-option :value="1" label="他运"></el-option>
            </el-select>
          </div>
          <div class="col-lg-3 mb25">
            <div class="lh44">供应商</div>
            <el-select
              class="marginBot"
              style="height:40px !important"
              v-model="out.c_id"
              filterable
              :disabled="out.type === 0"
              placeholder="请选择供应商"
              @change="changeList('client')"
            >
              <el-option v-for="(client, index) in clientList" :key="index" :label="client.name" :value="client.id"></el-option>
            </el-select>
          </div>
          <div class="col-lg-3 mb25">
            <div class="lh44">合同</div>
            <el-select
              class="marginBot"
              style="height:40px !important"
              v-model="out.pact_id"
              filterable
              :placeholder="out.type === 0 ? '无需选择合同' : '请选择合同'"
              :disabled="out.type === 0"
              @change="changeList('contract')"
            >
              <el-option v-for="(contract, index) in contractList" :key="index" :label="contract.pact_no" :value="contract.id"></el-option>
            </el-select>
          </div>
          <div class="col-lg-3 mb25">
            <div class="lh44">税率</div>
            <el-select class="marginBot" style="height:40px !important" v-model="out.rate" filterable placeholder="请选择税率" @change="changeMoney()">
              <el-option v-for="(item, index) in rateList" :key="index" :value="item" :label="item"></el-option>
            </el-select>
            <!-- <b-form-input v-model="out.rate" type="number" :disabled="true"></b-form-input> -->
          </div>
          <div class="col-lg-4 mb25">
            <div class="lh44">车号</div>
            <el-select
              class="marginBot"
              style="height:40px !important"
              v-model="out.car_id"
              filterable
              :placeholder="out.type !== 0 ? '无需选择车辆' : '请选择车辆'"
              :disabled="out.type !== 0"
            >
              <el-option v-for="(car, index) in carList" :key="index" :label="car.car_no" :value="car.id"></el-option>
            </el-select>
          </div>
          <div class="col-lg-4 mb25">
            <div class="lh44">司机</div>
            <el-select
              class="marginBot"
              style="height:40px !important"
              v-model="out.driver_id"
              filterable
              :placeholder="out.type !== 0 ? '无需选择司机' : '请选择司机'"
              :disabled="out.type !== 0"
            >
              <el-option v-for="(driver, index) in driverList" :key="index" :label="driver.name" :value="driver.id"></el-option>
            </el-select>
          </div>
          <div class="col-lg-4 mb25">
            <div class="lh44">支出项</div>
            <el-select class="marginBot" style="height:40px !important" v-model="out.cost_id" filterable placeholder="请选择支出项">
              <el-option v-for="(cost, index) in costList" :key="index" :label="cost.cost_name" :value="cost.id"></el-option>
            </el-select>
          </div>
          <div class="col-lg-3 mb25">
            <div class="lh44">税前应付金额</div>
            {{ out.sq_ys ? out.sq_ys : 0 }}
            <!-- <b-form-input v-model="out.sq_ys" type="number" @change="changeMoney(index)"></b-form-input> -->
          </div>
          <div class="col-lg-3 mb25">
            <div class="lh44">税前实付金额</div>
            {{ out.sq_ss ? out.sq_ss : 0 }}
            <!-- <b-form-input v-model="out.sq_ss" type="number" :disabled="true" @change="changeMoney(index, 'shouldBefore')"></b-form-input> -->
          </div>
          <div class="col-lg-3 mb25">
            <div class="lh44">税后应付金额</div>
            {{ out.sh_ys ? out.sh_ys : 0 }}
            <!-- <b-form-input v-model="out.sh_ys" type="number" :disabled="true"></b-form-input> -->
          </div>
          <div class="col-lg-3 mb25">
            <div class="lh44">税后实付金额</div>
            {{ out.sh_ss ? out.sh_ss : 0 }}
            <!-- <b-form-input v-model="out.sh_ss" type="number" :disabled="out.type === 0" @change="changeMoney(index, 'shouldAfter')"></b-form-input> -->
          </div>
          <div class="col-lg-12 mb25">
            <div class="lh44">备注</div>
            <b-form-input v-model="out.remark"></b-form-input>
          </div>
          <br />
          <div class="col-lg-12 mb25">
            <el-tabs v-model="tabs" type="card" :stretch="true" closable @tab-remove="clearSubForm">
              <el-tab-pane v-for="(item, index) in subForm" :key="index" :label="`货物${index + 1}`" :name="`${index}`">
                <table class="table table-btransported table-striped">
                  <tbody>
                    <tr>
                      <td>订单号</td>
                      <td>拆分单号</td>
                      <td>货物名称</td>
                      <td>件数</td>
                      <td>数量</td>
                      <td>重量</td>
                      <td>体积</td>
                      <td>运输金额</td>
                      <!-- <td>线路</td> -->
                    </tr>
                    <tr>
                      <td>{{ item.order_no }}</td>
                      <td>{{ item.slip_no }}</td>
                      <td>{{ item.goods_name }}</td>
                      <td>{{ item.item_num }}</td>
                      <td>{{ item.goods_num }}</td>
                      <td>{{ item.goods_weight }}</td>
                      <td>{{ item.goods_volume }}</td>
                      <td><el-input v-model="item.price" type="number" @input="changeMoney('item')"></el-input></td>
                      <!-- <td>
                        <el-select v-model="item.dly_way_id" placeholder="请选择线路">
                          <el-option v-for="(item, index) in dlyWayList" :key="index" :label="item.name" :value="item.id"> </el-option>
                        </el-select>
                      </td> -->
                    </tr>
                  </tbody>
                </table>
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
        >发&nbsp;&nbsp;车</b-button
      >
      <b-button
        variant="secondary"
        @click="reset()"
        class="resetButton"
        style="font-size:16px !important; margin-top:25px; margin-bottom:30px !important; width:30% !important; margin-right: 0 !important; padding:6px 80px !important;"
        >重&nbsp;&nbsp;置</b-button
      >
    </b-modal>
    <!--拆分弹框-->
    <b-modal id="addSplitAlert" title="拆分货物" ref="addSplitAlert" size="xl" hide-footer>
      <div class="d-block text-center">
        <div class="row">
          <h4>原货物情况</h4>
          <table class="table table-bordered table-striped ">
            <tbody>
              <tr>
                <td style="width:15%">订单号</td>
                <td style="width:15%">拆分单号</td>
                <td style="width:10%">货物名称</td>
                <td style="width:10%">数量</td>
                <td style="width:10%">体积</td>
                <td style="width:10%">重量</td>
              </tr>
              <tr>
                <td>{{ orderList.order_no }}</td>
                <td>{{ orderList.slip_no }}</td>
                <td>{{ orderList.goods_name }}</td>
                <td>{{ orderList.goods_num }}</td>
                <td>{{ orderList.goods_volume }}</td>
                <td>{{ orderList.goods_weight }}</td>
              </tr>
            </tbody>
          </table>
          <h4>拆分后</h4>
          <b-button variant="danger" style="color:white; margin-left: 85% !important;" @click="addOrderSublist()">拆&nbsp;分&nbsp;货&nbsp;物</b-button>
          <table class="table table-bordered table-striped ">
            <tbody>
              <tr>
                <td style="width:20%">拆分单号</td>
                <td>数量</td>
                <td>体积</td>
                <td>重量</td>
                <td>操作</td>
              </tr>
              <tr v-for="(item, index) in splitForm" :key="index">
                <td v-if="false"><b-form-input v-model="item.goods_name" :disabled="true"></b-form-input></td>
                <td v-if="false"><b-form-input v-model="item.content" :disabled="true"></b-form-input></td>
                <td><b-form-input v-model="item.slip_no"></b-form-input></td>
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
                    @click="clearSplitForm(index)"
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
        @click="addSplitForm()"
        class="resetButton"
        style="font-size:16px !important; margin:25px 5% 30px 5% !important; background-color: #17a2b8 !important;  width:30% !important; padding:6px 80px !important;"
        >保&nbsp;&nbsp;存</b-button
      >
      <b-button
        variant="secondary"
        @click="closeSpliAlert()"
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
import { throws } from 'assert';
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
      costForm: [],
      costList: [],
      newDlyList: [],
      out: {},
      is_update: true,
      operateId: '',
      currentPage: 1,
      totalRow: 0,
      form: {},
      statusList: [{ text: '装车', value: '1' }, { text: '到达', value: '2' }, { text: '支付完成', value: '4' }, { text: '收款完成', value: '5' }],
      mainValidator: new Validator({
        op: [{ required: true, message: '请填写操作人' }],
        send_time: [{ required: true, message: '请选择发货日期' }],
        dly_way_id: [{ required: true, message: '请选择线路' }],
      }),
      th: ['订单号', '订单人', '订单日期', '备注'],
      filterVal: ['order_no', 'user_name', 'in_date', 'remark'],
      skip: 0,
      order_loading_list: [],
      tabs: '0',
      rateList: [1, 1.03, 1.06, 1.1, 1.13],
      orderList: {},
      splitForm: [],
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
      contractList: state => state.personnel.contractList,
      clientList: state => state.personnel.clientList,
    }),
  },
  async created() {
    await this.getCarList({ skip: 0, limit: 10000 });
    await this.getdly_wayList({ skip: 0, limit: 10000 });
    await this.getDriverList({ skip: 0, limit: 10000 });
    await this.getClientList({ skip: 0, limit: 10000, type: 1 });
    let { data } = await this.getCostList({ skip: 0, limit: 10000 });
    data = data.filter(item => {
      if (item.cost_name === '长途运费') {
        this.$set(this.out, `cost_id`, item.id);
        return item;
      }
    });
    this.$set(this, 'costList', data);
    this.search();
    this.newDlyList = this.dlyWayList.map(item => {
      let newObject = {
        id: item.id,
        name: item.name,
        content: item.start_province + '-' + item.start_city + '-' + item.start_site + '至' + item.end_province + '-' + item.end_city + '-' + item.end_site,
      };
      return newObject;
    });
    this.$set(this.form, `op`, this.userInfo.login_id);
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
      'getCostList',
      'getContractList',
      'getClientList',
      'orderSubSplit',
    ]),
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
      this.mainValidator.validate(this.form, (errors, fields) => {
        if (errors) {
          return this.handleErrors(errors, fields);
        }
        return this.add();
      });
    },
    //运输子表匹配主表
    subDlyWay() {
      let id = this.form.dly_way_id;
      //更改子运输单的线路
      // this.subForm.forEach((item, index) => {
      //   this.$set(this.subForm[index], `dly_way_id`, id);
      // });
      let object = this.newDlyList.filter(item => item.id === id)[0];
      this.$set(this.form, 'content', object.content);
    },
    //添加
    async add() {
      //运输主表整理
      let transportMain = JSON.parse(JSON.stringify(this.form));
      transportMain.c_id = this.out.c_id;
      this.out.car_id ? (transportMain.car_id = this.out.car_id) : '';
      delete transportMain.dly_way_id;
      //运输子表整理
      let transportSub = [];
      this.subForm.map(item => {
        let object = {};
        object.order_no = item.order_no;
        object.order_sub_id = item.id;
        object.goods_name = item.goods_name;
        object.price = item.price;
        transportSub.push(object);
      });
      //支出表整理
      let outForm = [];
      this.subForm.map(item => {
        let object = {};
        object.main_id = item.main_id;
        object.order_no = item.order_no;
        this.out.car_id ? (object.car_id = this.out.car_id) : '';
        this.out.driver_id ? (object.driver_id = this.out.driver_id) : '';
        object.cost_id = this.out.cost_id;
        object.sq_ys = item.price;
        object.sq_ss = item.price;
        object.sh_ys = item.price * 1 * (this.out.rate * 1);
        object.sh_ss = item.price * 1 * (this.out.rate * 1);
        object.rate = this.out.rate;
        this.out.pact_id ? (object.pact_id = this.out.pact_id) : '';
        object.c_id = this.out.c_id;
        object.type = `${this.out.type}`;
        outForm.push(object);
      });
      console.log(transportMain);
      console.log(transportSub);
      console.log(outForm);
      await this.transportSave({ form: transportMain, subForm: transportSub, outForm: outForm });
      this.$refs.addAlert.hide();
      this.form = {};
      this.subForm = [];
      this.out = { rate: 1 };
      this.order_loading_list = [];
      this.search();
    },
    //打开与关闭修改和删除的弹框
    async openAlert() {
      if (this.order_loading_list <= 0) {
        this.$message.error('请选择要装车的货物');
        return false;
      }
      let newList = this.order_loading_list.map(item => `${item}`);
      let result = await this.transporSelectOrder({ ids: newList });
      let transportOrderSubList = result.orderSubList.map(item => {
        return item;
      });
      this.toGetTransportNo();
      transportOrderSubList.map(item => {
        item['tabs'] = '0';
        item.price = 0;
        return item;
      });
      this.$set(this, 'subForm', transportOrderSubList);
      this.form['dly_way_id'] = '';
      this.out.rate = 1;
      this.$refs.addAlert.show();
    },
    //获得运输单号
    async toGetTransportNo() {
      let result = await this.getTransportNo();
      this.$set(this.form, 'transport_no', result);
    },
    //是否选择供应商
    async changeList(type) {
      switch (type) {
        //选择供应商方式后的变化=>加载供应商
        case 'type':
          this.out.c_id = this.out.type === 0 ? 1 : '';
          if (this.out.type === 0) this.$set(this.out, `pact_id`, '');
          break;
        //选择供应商后的变化=>查合同
        case 'client':
          await this.getContractList({ skip: 0, limit: 10000, pact_no: '', cus_id: this.out.c_id });
          break;
        //选择合同后的变化=>改税率
        case 'contract':
          this.$set(this.out, 'rate', this.contractList.filter(item => item.id === this.out.pact_id)[0].cess * 1);
          this.changeMoney();
          break;
        default:
          break;
      }
    },
    //计算价钱
    changeMoney(type) {
      //判断供应商是不是自己
      if (this.out.type === 0) {
        console.log('in');
        if (type === 'item') {
          let price = parseFloat(
            this.subForm.reduce((prev, cur) => {
              return prev * 1 + (cur.price ? cur.price * 1 : 0);
            }, 0)
          );
          this.$set(this.out, 'sq_ys', price);
        }
        this.$set(this.out, 'sq_ss', this.out.sq_ys);
        this.$set(this.out, 'sh_ys', this.out.sq_ys);
        this.$set(this.out, 'sh_ss', this.out.sq_ys);
        return;
      }
      //获取税率
      let rate = this.out.rate ? this.out.rate * 1 : ((this.out.rate = 1), this.out.rate * 1);
      //判断是否是修改实付,修改实付不需要修改应付部分
      if (typeof type !== 'string') {
        //将税前应付*税率,赋给税后应付
        this.$set(this.out, 'sh_ys', rate * 1 * this.out.sq_ys);
        //将税前应付赋给税前实付
        this.$set(this.out, 'sq_ss', this.out.sq_ys);
        //将税前实付*税率,赋给税后实付
        this.$set(this.out, 'sh_ss', rate * 1 * this.out.sq_ss);
      } else if (type === 'shouldBefore') {
        //将税前实付*税率,赋给税后实付
        this.$set(this.out, 'sh_ss', rate * 1 * this.out.sq_ss);
      } else if (type === 'shouldAfter') {
        //修改税后实付,除法需要四舍五入
        let newMoney = (this.out.sh_ss * 1) / (rate * 1);
        newMoney = parseFloat(newMoney);
        newMoney = Math.round(newMoney * 100) / 100;
        this.$set(this.out, 'sq_ss', newMoney);
      } else if (type === 'rate') {
        //将税前应付*税率,赋给税后应付
        this.$set(this.out, 'sh_ys', rate * 1 * this.out.sq_ys);
        //将税前实付*税率,赋给税后实付
        this.$set(this.out, 'sh_ss', rate * 1 * this.out.sq_ss);
      } else if (type === 'item') {
        //修改每个货物的运费,然后加和赋给实付
        let price = parseFloat(
          this.subForm.reduce((prev, cur) => {
            return prev * 1 + (cur.price ? cur.price * 1 : 0);
          }, 0)
        );
        this.$set(this.out, 'sq_ys', price * rate);
        this.changeMoney();
      }
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
      this.tabs = this.subForm.length - 1 === i ? (i !== 0 ? `${i - 1}` : `${i}`) : this.tabs;
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
    //打开拆分的弹框
    async openSplitAlert(index) {
      this.splitForm = [];
      await this.transportOrderSubList({
        skip: 0,
        limit: 100000000,
      });
      this.$set(this, 'orderList', this.orderSubList[index]);
      this.goods_num = this.orderList.goods_num * 1;
      this.goods_volume = this.orderList.goods_volume * 1;
      this.goods_weight = this.orderList.goods_weight * 1;
      this.$refs.addSplitAlert.show();
    },
    //删除拆分表单中内容
    clearSplitForm(i) {
      this.splitForm.splice(i, 1);
    },
    //拆分
    async addOrderSublist() {
      let result = await this.$axios.get(`/zhwl/order/slip_no?id=${this.orderList.id}&order_no=${this.orderList.order_no}`);
      let slip_no = JSON.parse(JSON.stringify(result.slip_no));
      let newArray = JSON.parse(JSON.stringify(this.orderList));
      newArray.goods_num = 0;
      newArray.goods_volume = 0;
      newArray.goods_weight = 0;
      newArray.slip_no = slip_no;
      this.splitForm.splice(this.splitForm.length, 0, newArray);
    },
    //保存拆分的项
    async addSplitForm() {
      let num_sum = 0;
      let volume_sum = 0;
      let weight_sum = 0;
      for (let index = 0; index < this.splitForm.length; index++) {
        num_sum += this.splitForm[index].goods_num;
        volume_sum += this.splitForm[index].goods_volume;
        weight_sum += this.splitForm[index].goods_weight;
      }
      if ((this.goods_num < num_sum) | (this.goods_volume < volume_sum) | (this.goods_weight < weight_sum)) {
        return this.$message.error('请重新核对数量！！！');
      }
      try {
        for (let index = 0; index < this.splitForm.length; index++) {
          delete this.splitForm[index].order_no;
          delete this.splitForm[index].id;
          delete this.splitForm[index].wayname;
          delete this.splitForm[index].dly_way_id;
          delete this.splitForm[index].cus_id;
          delete this.splitForm[index].send_time_hp;
        }
        let subFormCopy = JSON.parse(JSON.stringify(this.splitForm));
        subFormCopy.splice(0, 0, this.orderList);
        delete subFormCopy[0].order_no;
        delete subFormCopy[0].wayname;
        delete subFormCopy[0].dly_way_id;
        delete subFormCopy[0].cus_id;
        delete subFormCopy[0].send_time_hp;
        await this.orderSubSplit({ form: this.form, subForm: subFormCopy });
        this.$refs.addSplitAlert.hide();
        this.splitForm = [];
        this.search();
      } catch (error) {
        console.error('error in line 269');
      }
    },
    //关闭拆分
    closeSpliAlert() {
      this.$refs.addSplitAlert.hide();
      this.search();
      this.orderList = {};
      this.splitForm = [];
      // this.orderList.user_name = this.userInfo.user_name;
      // this.orderList.login_id = this.userInfo.login_id;
    },
    changeNum() {
      let sum1 = 0;
      let sum2 = 0;
      let sum3 = 0;
      for (let index = 0; index < this.splitForm.length; index++) {
        sum1 += this.splitForm[index].goods_num;
        sum2 += this.splitForm[index].goods_volume;
        sum3 += this.splitForm[index].goods_weight;
      }
      this.orderList.goods_num = this.goods_num - sum1;
      this.orderList.goods_volume = this.goods_volume - sum2;
      this.orderList.goods_weight = this.goods_weight - sum3;
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
