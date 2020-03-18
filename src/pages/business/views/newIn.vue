<template lang="html">
  <div id="newIn">
    <div class="base-form">
      <div class="form-inline">
        <div class="base-form-title" style="width:100%;">
          <a class="base-margin-left-20">收入管理</a>
          <div class="button-table"></div>
        </div>
      </div>
      <!-- 展示界面 -->
      <div class="base-padding-20 base-bg-fff">
        <div>
          <div class="row" style="margin-bottom: 15px !important;">
            <div class="col-lg-3 marginBot4">
              <p class="marginBot4">订单单号查询:</p>
              <b-form-input v-model="searchInfo.order_no" placeholder="输入订单单号"></b-form-input>
            </div>
            <div class="col-lg-3 marginBot4">
              <p class="marginBot4">订单人查询:</p>
              <el-select class="marginBot" style="height:40px !important" v-model="searchInfo.c_id" filterable placeholder="输入订单人">
                <el-option value="" label="全部客户">全部客户</el-option>
                <el-option v-for="(item, index) in clientList" :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </div>
            <div class="col-lg-4 marginBot4">
              <p class="marginBot4">订单日期查询:</p>
              <el-date-picker
                style="width:100%; height: 34px !important; line-height: 34px !important;"
                v-model="searchInfo.date"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </div>
            <div class="col-lg-2 marginBot4">
              <b-button
                variant="primary"
                style="font-size: 14px !important; color: rgb(255, 255, 255) !important; width: 60% !important; padding: 5px 10px !important; margin-top:28px; margin-right: 0px !important;"
                @click="search('vague')"
                >点击查询</b-button
              >
            </div>
          </div>
        </div>
        <table class="table table-bordered table-striped ">
          <tbody v-if="orderList.length > 0">
            <tr>
              <th>订单号</th>
              <th>客户</th>
              <th>要求发货日期</th>
              <th>状态</th>
              <th width="30%">操作</th>
            </tr>
            <tr v-for="(item, index) in orderList" :key="index">
              <td>{{ item.order_no }}</td>
              <td>{{ item.c_name }}</td>
              <td>{{ item.send_time_hp }}</td>
              <td>{{ item.status | getStatus }}</td>
              <td>
                <b-button
                  v-if="item.is_in != 0"
                  @click="openAlert(item, 'edit')"
                  style="margin-left:4% !important; font-size:14px !important; color:#efe !important; background-color:#6b0 !important; padding: 6px 12px !important;"
                  >修改收入</b-button
                >
                <b-button
                  v-if="item.is_in === 0"
                  @click="openAlert(item, 'add')"
                  style="margin-left:4% !important; font-size:14px !important; color:#efe !important; background-color:#f80 !important; padding: 6px 12px !important;"
                  >添加收入</b-button
                >
                <b-button
                  variant="primary"
                  @click="openAlert(item.id, 'to')"
                  style="margin-left:4% !important; font-size:14px !important; color:#efe !important; padding: 6px 21px !important;"
                  >指派负责人</b-button
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
      <el-dialog :title="dialogTitle" :visible.sync="dialog" @close="closeDialog()" width="90%">
        <div class="d-block text-center">
          <table class="table table-bordered table-striped ">
            <tr>
              <td style="width:10%">税前应收运费:{{ dialogAmount.sq_ys || 0 }}</td>
              <td style="width:10%">税后应收运费:{{ dialogAmount.sh_ys || 0 }}</td>
              <td style="width:10%">税前实收运费:{{ dialogAmount.sq_ss || 0 }}</td>
              <td style="width:10%">税后实收运费:{{ dialogAmount.sh_ss || 0 }}</td>
            </tr>
          </table>

          <!--第一行,与合同有关-->
          <table class="table table-bordered table-striped ">
            <tbody>
              <tr>
                <th style="width:10%">客户</th>
                <!-- <th style="width:15%">运输线路</th> -->
                <th style="width:15%">合同</th>
                <th style="width:15%">项目</th>
                <th style="width:20%">项目线路</th>
                <th style="width:20%">线路方式</th>
              </tr>
              <tr>
                <td>{{ orderInfo.c_name }}</td>
                <td>
                  <el-select
                    v-if="contractList.length > 0"
                    class="marginBot"
                    style="height:40px !important"
                    v-model="form.pact_id"
                    filterable
                    placeholder="请选择合同"
                    @change="dialogRequest(form.pact_id, 'searchItem')"
                  >
                    <el-option v-for="(item, index) in contractList" :key="index" :label="item.pact_no" :value="item.id"></el-option>
                  </el-select>
                  <template v-else>{{ form.pact_no }}</template>
                </td>
                <td>
                  <el-select
                    class="marginBot"
                    style="height:40px !important"
                    v-model="form.item_id"
                    filterable
                    placeholder="请选择项目"
                    @change="dialogRequest(form.item_id, 'searchDlyway')"
                  >
                    <el-option v-for="(item, index) in itemList" :key="index" :label="item.item_name" :value="item.id"></el-option>
                  </el-select>
                </td>
                <td>
                  <el-select
                    class="marginBot"
                    style="height:40px !important"
                    v-model="form.dly_way_id"
                    filterable
                    placeholder="请选择线路"
                    @change="dialogRequest(form.dly_way_id, 'searchWay')"
                  >
                    <el-option v-for="(item, index) in itemDlyWayList" :key="index" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                </td>
                <td>
                  <el-select
                    class="marginBot"
                    style="height:40px !important"
                    v-model="form.type_id"
                    filterable
                    placeholder="请选择线路方式"
                    @change="dialogRequest(form.type_id, 'way')"
                  >
                    <el-option v-for="(item, index) in wayList" :key="index" :label="item.type_name" :value="item.id"></el-option>
                  </el-select>
                </td>
              </tr>
            </tbody>
          </table>
          <!--第二行,与合同的钱有关-->
          <table class="table table-bordered table-striped ">
            <tbody>
              <tr>
                <th style="width:10%">税率</th>
                <th style="width:10%">单价</th>
                <th style="width:10%">数量</th>
                <th style="width:10%">税前应收运费</th>
                <th style="width:10%">税后应收运费</th>
                <th style="width:10%">税前实收运费</th>
                <th style="width:10%">税后实收运费</th>
              </tr>
              <tr>
                <td style="width:10%">{{ form.rate || 0 }}</td>
                <td style="width:10%">{{ form.price || 0 }}</td>
                <td style="width:10%">{{ form.num || 0 }}</td>
                <td style="width:10%">{{ form.sq_ys || 0 }}</td>
                <td style="width:10%">{{ form.sh_ys || 0 }}</td>
                <td style="width:10%">{{ form.sq_ss || 0 }}</td>
                <td style="width:10%">{{ form.sh_ss || 0 }}</td>
              </tr>
            </tbody>
          </table>
          <!--第三行,其他费用-->
          <table class="table table-bordered table-striped ">
            <tbody>
              <tr>
                <th style="width:10%">收入项</th>
                <th style="width:10%">税率</th>
                <th style="width:10%">税前应收金额</th>
                <th style="width:10%">税后应收金额</th>
                <th style="width:10%">税前实收金额</th>
                <th style="width:10%">税后实收金额</th>
                <th style="width:10%">备注</th>
                <th style="width:5%">操作</th>
              </tr>
              <tr v-for="(item, index) in subForm" :key="index">
                <td style="width:10%;">
                  <el-select class="marginBot" style="height:40px !important;padding-top:5px;" v-model="item.cost_id" filterable placeholder="请选择收入项">
                    <el-option v-for="(cost, index) in costList" :key="index" :label="cost.cost_name" :value="cost.id"></el-option>
                  </el-select>
                </td>
                <td style="width:10%">
                  <el-select v-model="item.rate" @change="subFormMoney(index)" class="marginBot" style="height:40px !important;padding-top:5px;" filterable>
                    <el-option v-for="(item, index) in taxRateList" :key="index" :label="item.name" :value="item.value"></el-option>
                  </el-select>
                </td>
                <td style="width:10%">
                  <b-form-input v-model="item.sq_ys" placeholder="税前应收金额" @change="subFormMoney(index)"></b-form-input>
                </td>
                <td style="width:10%">
                  <b-form-input v-model="item.sh_ys" placeholder="税后应收金额" :disabled="true"></b-form-input>
                </td>
                <td style="width:10%">
                  <b-form-input v-model="item.sq_ss" placeholder="税前实收金额" @change="totalMoney()"></b-form-input>
                </td>
                <td style="width:10%">
                  <b-form-input v-model="item.sh_ss" placeholder="税后实收金额" @change="totalMoney()"></b-form-input>
                </td>
                <td style="width:10%">
                  <el-input type="textarea" placeholder="备注" v-model="item.remark" :autosize="{ minRows: 1, maxRows: 2 }"></el-input>
                </td>
                <td style="width:5%">
                  <b-button
                    style="margin-top: 5%; margin-left: 8px !important; margin-right: 6px !important; padding: 5px 8px !important; font-size: 13px !important;"
                    @click="cleanLine(index)"
                    class="resetButton"
                    variant="danger"
                    >删&nbsp;&nbsp;除
                  </b-button>
                </td>
              </tr>
            </tbody>
          </table>
          <!--按钮区-->
          <b-button
            v-if="orderInfo.login_id == user.login_id"
            variant="primary"
            @click="
              () => {
                subForm.push({ rate: `1` });
              }
            "
            class="resetButton"
            style="font-size:16px !important; margin:10px 2% 20px 5% !important; background-color: #17a2b8 !important;  width:25% !important; padding:6px 0px !important;"
            >添加收入项
          </b-button>
          <b-button
            v-if="orderInfo.login_id == user.login_id"
            variant="primary"
            @click="toOperation()"
            class="resetButton"
            style="font-size:16px !important; margin:10px 2% 20px 5% !important; background-color: #17a2b8 !important;  width:25% !important; padding:6px 0px !important;"
            >保&nbsp;&nbsp;存
          </b-button>
          <b-button
            variant="secondary"
            @click="closeDialog()"
            class="resetButton"
            style="font-size:16px !important; margin:10px 2% 20px 5% !important; background-color: #cccccc !important;  width:25% !important; padding:6px 0px !important;"
            >取&nbsp;&nbsp;消
          </b-button>
        </div>
      </el-dialog>

      <el-dialog title="指派负责人" :visible.sync="assignDialog" width="35%">
        <div>
          <p>请选择负责人</p>
          <el-select v-model="chargeForm.charge_login" class="marginBot" style="height:40px !important" filterable>
            <el-option v-for="(item, index) in userList" :key="index" :label="item.user_name" :value="item.login_id"></el-option>
          </el-select>
        </div>
        <b-button
          variant="secondary"
          @click="assignDialog = false"
          class="resetButton"
          style="font-size:16px !important; margin-top:35px; padding:6px 80px !important;margin-bottom:30px !important;margin-right:0 !important;"
        >
          返&nbsp;&nbsp;回</b-button
        >
        <b-button
          variant="primary"
          @click="saveAssign()"
          class="resetButton"
          style="font-size:16px !important; margin-top:35px; float:right; padding:6px 80px !important;margin-bottom:30px !important;margin-right:0 !important;"
        >
          保&nbsp;&nbsp;存</b-button
        >
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Validator from 'async-validator';
import _ from 'lodash';
export default {
  name: 'newIn',
  metaInfo: {
    title: '收入管理',
  },
  components: {},
  data() {
    return {
      searchInfo: {
        date: [],
      },
      currentPage: 1,
      totalRow: 0,
      form: {},
      subForm: [],
      orderInfo: {},
      dialog: false,
      assignDialog: false,
      dialogTitle: '',
      itemList: [],
      itemDlyWayList: [],
      wayList: [],
      costList: [],
      taxRateList: [
        { value: '1', name: '1' },
        { value: '1.03', name: '1.03' },
        { value: '1.06', name: '1.06' },
        { value: '1.09', name: '1.09' },
        { value: '1.1', name: '1.1' },
        { value: '1.13', name: '1.13' },
      ],
      dialogAmount: {},
      operateId: '',
      rules: new Validator({
        pact_id: [{ required: true, message: '请选择合同' }],
        item_id: [{ required: true, message: '请选择项目' }],
        dly_way_id: [{ required: true, message: '请选择线路' }],
        type_id: [{ required: true, message: '请选择线路方式' }],
      }),
      chargeForm: {},
    };
  },
  computed: {
    ...mapState({
      limit: state => state.publics.limit,
      orderList: state => state.self.orderList,
      userList: state => state.system.userList,
      clientList: state => state.personnel.clientList,
      contractList: state => state.personnel.contractList,
      dlyWayList: state => state.self.dlyWayList,
      user: state => state.publics.userInfo,
    }),
  },
  async created() {
    this.search();
    await this.getClientList({ skip: 0, limit: '10000', type: `0` });
    await this.getdly_wayList({ skip: 0, limit: '10000' });
    let { data = [] } = await this.getCostList({ skip: 0, limit: `10000` });
    data = data.filter(item => `${item.cost_type}` === '0');
    this.$set(this, `costList`, data);
    await this.getUserList({ skip: 0, limit: 10000 });
  },
  methods: {
    ...mapActions([
      'getClientList',
      'getOrderList',
      'getInList',
      'getdly_wayList',
      'getContractList',
      'getItemList',
      'item_getDlyList',
      'getWayList',
      'getCostList',
      'toInCome',
      'getUserList',
      'orderCharge',
    ]),
    async openAlert(item, type) {
      this.form = {};
      this.subForm = [];
      if (type === 'add') {
        this.dialogRequest(item);
        this.dialogTitle = '添加收入';
        this.dialog = true;
        this.form.main_id = item.id;
        this.form.order_no = item.order_no;
      } else if (type === 'edit') {
        this.dialogRequest(item);
        this.searchDetail(item.order_no);
        this.dialogTitle = '修改收入';
        this.dialog = true;
        //in edit
      } else {
        this.chargeForm.order_id = item;
        //打开指派弹框
        this.assignDialog = true;
      }
    },
    // 关闭弹窗
    async closeDialog() {
      this.form = {};
      this.subForm = [];
      this.dialog = false;
    },
    async dialogRequest(item, type, need) {
      let info = { skip: 0, limit: 10000 };
      if (type === 'searchItem') {
        let selected = this.contractList.filter(items => items.id === item);
        if (selected.length > 0) {
          this.form.rate = selected[0].cess;
          this.$set(this.form, `rate`, selected[0].cess);
        }
        let { result, data } = await this.getItemList({ ...info, pact_id: item });
        if (result) {
          this.$set(this, `itemList`, data.dataList);
        }
        if (!need) this.formReset(3);
      } else if (type === 'searchDlyway') {
        this.form.xm_name = this.itemList.filter(items => items.id === item)[0].item_name;
        let { result, data } = await this.item_getDlyList({ ...info, item_id: item });
        if (result) {
          this.$set(this, `itemDlyWayList`, data.dlyWayList);
        }
        if (!need) this.formReset(2);
      } else if (type === 'searchWay') {
        let { result, data } = await this.getWayList({ ...info, dly_way_id: item });
        if (result) {
          let list = data.dataList.map(item => {
            if (`${item.is_lf}` === '0') item.type_name = '量份收费';
            else if (`${item.send_type}` !== '0') item.type_name = `整车-${item.price}`;
            else item.type_name = `零担-${`${item.count_type}` === '0' ? '按体积' : '按重量'}-${item.price}`;
            return item;
          });
          this.$set(this, `wayList`, list);
        }
        if (!need) this.formReset(1);
      } else if (type === 'way') {
        let selected = this.wayList.filter(items => items.id === item);
        if (selected.length > 0) {
          let way = JSON.parse(JSON.stringify(selected[0]));
          this.$set(this.form, `price`, way.price);
          this.form.is_lf = way.is_lf;
          if (`${way.is_lf}` === '0') this.form.num = this.orderInfo.item_nums;
          else if (`${way.send_type}` === `1`) this.form.num = 1;
          else if (`${way.count_type}` === '0') this.form.num = this.orderInfo.goods_volumes;
          else this.form.num = this.orderInfo.goods_weights;
          this.formMoney();
        }
      } else {
        this.orderInfo = JSON.parse(JSON.stringify(item));
        await this.getContractList({ ...info, cus_id: this.orderInfo.c_id });
      }
    },
    formMoney() {
      if (this.form.rate && this.form.price && this.form.num) {
        let rate = this.form.rate * 1;
        let price = this.form.price * 1;
        let num = this.form.num * 1;
        let sq_ys = this.round(price * num);
        let sq_ss = this.round(sq_ys);
        let sh_ys = this.round(sq_ys * rate);
        let sh_ss = this.round(sh_ys);
        this.$set(this.form, `sq_ys`, sq_ys);
        this.$set(this.form, `sq_ss`, sq_ss);
        this.$set(this.form, `sh_ys`, sh_ys);
        this.$set(this.form, `sh_ss`, sh_ss);
        this.totalMoney();
      }
    },
    subFormMoney(index) {
      let selfLine = this.subForm[index];
      if (selfLine.rate && selfLine.sq_ys) {
        let rate = selfLine.rate * 1;
        let sq_ys = selfLine.sq_ys * 1;
        let sq_ss = this.round(sq_ys);
        let sh_ys = this.round(sq_ys * rate);
        let sh_ss = this.round(sh_ys);
        this.$set(this.subForm[index], `sq_ys`, sq_ys);
        this.$set(this.subForm[index], `sq_ss`, sq_ss);
        this.$set(this.subForm[index], `sh_ys`, sh_ys);
        this.$set(this.subForm[index], `sh_ss`, sh_ss);
        this.totalMoney();
      }
    },
    totalMoney() {
      let sq_ys = 0,
        sh_ys = 0,
        sq_ss = 0,
        sh_ss = 0;
      //合同form中的钱先加一起
      (sq_ys += this.form.sq_ys || 0 * 1), (sh_ys += this.form.sh_ys || 0 * 1), (sq_ss += this.form.sq_ss || 0 * 1), (sh_ss += this.form.sh_ss || 0 * 1);
      //subForm中的再加一起
      sq_ys = parseFloat(
        this.subForm.reduce((prev, cur) => {
          return prev * 1 + (cur.sq_ys ? cur.sq_ys * 1 : 0);
        }, sq_ys)
      );
      sh_ys = parseFloat(
        this.subForm.reduce((prev, cur) => {
          return prev * 1 + (cur.sh_ys ? cur.sh_ys * 1 : 0);
        }, sh_ys)
      );
      sq_ss = parseFloat(
        this.subForm.reduce((prev, cur) => {
          return prev * 1 + (cur.sq_ss ? cur.sq_ss * 1 : 0);
        }, sq_ss)
      );
      sh_ss = parseFloat(
        this.subForm.reduce((prev, cur) => {
          return prev * 1 + (cur.sh_ss ? cur.sh_ss * 1 : 0);
        }, sh_ss)
      );
      let amount = { sq_ys: sq_ys, sq_ss: sq_ss, sh_ys: sh_ys, sh_ss: sh_ss };
      this.$set(this, `dialogAmount`, amount);
    },
    round(newMoney) {
      newMoney = parseFloat(newMoney);
      newMoney = Math.round(newMoney * 100) / 100;
      return newMoney;
    },
    formReset(type) {
      if (type >= 1) {
        this.$set(this.form, `type_id`);
        delete this.form.type_id;
      }
      if (type >= 2) {
        this.$set(this.form, `dly_way_id`);
        delete this.form.dly_way_id;
      }
      if (type >= 3) {
        this.$set(this.form, `item_id`);
        delete this.form.item_id;
      }
      this.$set(this.form, `price`);
      this.$set(this.form, `sq_ys`);
      this.$set(this.form, `sh_ys`);
      this.$set(this.form, `sq_ss`);
      this.$set(this.form, `sh_ss`);
      delete this.form.price;
      delete this.form.sq_ys;
      delete this.form.sh_ys;
      delete this.form.sq_ss;
      delete this.form.sh_ss;
    },
    toOperation() {
      this.rules.validate(this.form, (errors, fields) => {
        if (errors) {
          return this.handleErrors(errors, fields);
        }
        this.operation();
      });
    },
    async operation() {
      //修改时,需要将合同收入的id也给form
      let has_id = Object.keys(this.form).filter(item => item === 'id').length;
      let type;
      has_id > 0 ? (type = 'updateIncome') : (type = 'orderIncome');
      let main_id = this.form.main_id;
      let newForm = JSON.parse(JSON.stringify(this.form));
      delete newForm.pact_no;
      delete newForm.main_id;
      newForm.cost_id = 1;
      let sf = this.subForm.map(i => {
        console.log(i);
        delete i.pact_no;
        return i;
      });
      let data = [...sf, { ...newForm }];
      let result = await this.toInCome({ data: data, main_id: main_id, type: type });
      this.dialog = false;
      this.form = {};
      this.subForm = [];
      this.search();
    },
    async saveAssign() {
      await this.orderCharge({ form: this.chargeForm });
      this.assignDialog = false;
    },
    //验证错误
    handleErrors(errors, fields) {
      this.$message.error(errors[0].message);
      this.errors = errors.reduce((p, c) => {
        // eslint-disable-next-line no-param-reassign
        p[c.field] = 'error';
        return p;
      }, {});
      // eslint-disable-next-line no-console
      console.debug(errors, fields);
    },
    cleanLine(index) {
      this.subForm.splice(index, 1);
    },
    async searchDetail(order_no) {
      let { data } = await this.getInList({ skip: 0, limit: 1000, order_no: order_no });
      // if (data !== null) {
      let toForm = data.filter(item => item.cost_id === 1)[0];
      delete toForm.status;
      this.form = JSON.parse(JSON.stringify(toForm));
      await this.dialogRequest(toForm.pact_id, 'searchItem', 'not');
      await this.dialogRequest(toForm.item_id, 'searchDlyway', 'not');
      await this.dialogRequest(toForm.dly_way_id, 'searchWay', 'not');
      await this.dialogRequest(toForm.type_id, 'way');
      let toSubForm = data.filter(item => {
        if (item.cost_id) return item;
      });
      toSubForm = toSubForm.map(item => {
        delete item.status;
        return item;
      });
      toSubForm = toSubForm.filter(fil => !fil.pact_id);
      this.$set(this, `subForm`, toSubForm);
      this.totalMoney();
      // }
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
      let totalRow = await this.getOrderList({
        skip: skip,
        limit: this.limit,
        order_no: this.searchInfo.order_no || '',
        c_id: this.searchInfo.c_id || '',
        start_time: this.searchInfo.date.length > 0 ? this.searchInfo.date[0] : '',
        end_time: this.searchInfo.date.length > 0 ? this.searchInfo.date[1] : '',
      });
      this.$set(this, 'totalRow', totalRow);
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
          text = '发车';
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
