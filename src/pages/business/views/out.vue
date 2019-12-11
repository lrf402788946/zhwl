<template lang="html">
  <div id="out">
    <!-- 表格 begin -->
    <div class="base-form">
      <div class="form-inline">
        <div class="base-form-title" style="width:100%;">
          <a class="base-margin-left-20">支出单列表</a>
          <div class="button-table"></div>
        </div>
      </div>
      <div class="base-padding-20 base-bg-fff">
        <table>
          <tr>
            <td>支出单查询</td>
          </tr>
          <tr>
            <td style="padding-right: 10px;"><b-form-input v-model="select_order_no" placeholder="输入订单号"></b-form-input></td>
          </tr>
          <tr>
            <td>
              <b-button
                variant="primary"
                style="font-size: 14px !important; color: rgb(255, 255, 255) !important; width: 60% !important; padding: 5px 10px !important; margin-top:28px; margin-right: 0px !important;"
                @click="search('vague')"
                >点击查询</b-button
              >
            </td>
          </tr>
        </table>

        <table class="table table-bordered table-striped ">
          <tbody v-if="list.length > 0">
            <tr>
              <th>流水号</th>
              <th>订单号</th>
              <th>客户</th>
              <th>长途运费金额</th>
              <th>操作</th>
            </tr>
            <tr v-for="(item, index) in list" :key="index">
              <td>{{ item.serial_num }}</td>
              <td>{{ item.order_no }}</td>
              <td>{{ item.c_name }}</td>
              <td>{{ item.out_price }}</td>
              <td>
                <b-button variant="primary" style="color:white;" @click="openUpdateAlert(index)">详&nbsp;&nbsp;情</b-button>
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
        ></el-pagination>

        <el-dialog :visible.sync="dialog" title="修改支出单" :fullscreen="true" :close-on-click-modal="false">
          <div class="d-block text-center">
            <table class="table table-bordered table-striped ">
              <tbody>
                <tr>
                  <th style="width:10%">流水号</th>
                  <th style="width:15%">订单号</th>
                </tr>
                <tr>
                  <td>{{ form.serial_num }}</td>
                  <td>{{ form.order_no }}</td>
                </tr>
              </tbody>
            </table>
            <table class="table table-bordered table-striped ">
              <tbody>
                <tr>
                  <th style="width:10%">税前应付金额</th>
                  <th style="width:15%">税后应付金额</th>
                  <th style="width:15%">税前实付金额</th>
                  <th style="width:15%">税后实付金额</th>
                </tr>
                <tr>
                  <td>{{ allMoney.sq_ys ? allMoney.sq_ys : '0' }} 元</td>
                  <td>{{ allMoney.sh_ys ? allMoney.sh_ys : '0' }} 元</td>
                  <td>{{ allMoney.sq_ss ? allMoney.sq_ss : '0' }} 元</td>
                  <td>{{ allMoney.sh_ss ? allMoney.sh_ss : '0' }} 元</td>
                </tr>
              </tbody>
            </table>
          </div>

          <table class="table table-bordered table-striped ">
            <tbody>
              <tr>
                <th>支出项</th>
                <th>供应商</th>
                <th>合同</th>
                <th>税率</th>
                <th>税前应付金额</th>
                <th>税后应付金额</th>
                <th>税前实付金额</th>
                <th>税后实付金额</th>
                <th>备注</th>
              </tr>
              <tr v-for="(item, index) in subForm" :key="index">
                <td>
                  <el-select
                    class="marginBot"
                    style="height:40px !important"
                    v-model="item.cost_id"
                    :disabled="is_update"
                    filterable
                    placeholder="请选择支出项"
                  >
                    <el-option v-for="(cost, index) in costList" :key="index" :label="cost.cost_name" :value="cost.id"></el-option>
                  </el-select>
                </td>
                <td>
                  <el-select
                    :disabled="is_update"
                    class="marginBot"
                    style="height:40px !important"
                    v-model="item.c_id"
                    filterable
                    placeholder="请选择供应商"
                    @change="getContract(index)"
                  >
                    <el-option v-for="(client, index) in newClientList" :key="index" :label="client.name" :value="client.id"></el-option>
                  </el-select>
                </td>
                <td>
                  <el-select
                    class="marginBot"
                    style="height:40px !important"
                    v-model="item.pact_id"
                    filterable
                    :disabled="is_update"
                    placeholder="请选择合同"
                    @change="changeList(index)"
                  >
                    <el-option v-for="(contract, index) in item.contractList" :key="index" :label="contract.pact_no" :value="contract.id"></el-option>
                  </el-select>
                </td>
                <td>
                  <el-select
                    class="marginBot"
                    style="height:40px !important"
                    v-model="item.rate"
                    filterable
                    :disabled="is_update"
                    placeholder="请选择税率"
                    @change="changeMoney(index, 'rate')"
                  >
                    <el-option v-for="(item, index) in rateList" :key="index" :value="item" :label="item"></el-option>
                  </el-select>
                </td>
                <td>
                  <b-form-input v-model="item.sq_ys" type="number" @change="changeMoney(index)" :disabled="is_update"></b-form-input>
                </td>
                <td>
                  <b-form-input v-model="item.sh_ys" type="number" @change="computedAllMoney()" :disabled="true"></b-form-input>
                </td>
                <td>
                  <b-form-input v-model="item.sq_ss" type="number" @change="changeMoney(index, 'shouldBefore')" :disabled="is_update"></b-form-input>
                </td>
                <td>
                  <b-form-input v-model="item.sh_ss" type="number" @change="computedAllMoney()" :disabled="is_update"></b-form-input>
                </td>
                <td>
                  <b-form-input v-model="item.remark" :disabled="is_update"></b-form-input>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="row">
            <div class="col-lg-4">
              <b-button
                variant="primary"
                v-if="is_update && form.status < 2"
                @click="is_update = false"
                class="resetButton"
                style="font-size:16px !important; margin:10px 5% 30px 5% !important; background-color: #17a2b8 !important;  width:70% !important; padding:6px 80px !important;"
                >修&nbsp;&nbsp;改</b-button
              >
              <b-button
                variant="primary"
                v-if="!is_update"
                @click="() => subForm.push({ rate: 1, sq_ys: 0, sq_ss: 0, sh_ss: 0, sh_ys: 0 })"
                class="resetButton"
                style="font-size:16px !important; margin:10px 5% 30px 5% !important; background-color: #17a2b8 !important;  width:70% !important; padding:6px 80px !important;"
                >添&nbsp;&nbsp;加</b-button
              >
            </div>
            <div class="col-lg-4">
              <b-button
                v-if="!is_update"
                variant="primary"
                @click="toValidate('update')"
                class="resetButton"
                style="font-size:16px !important; margin:10px 5% 30px 5% !important; background-color: #17a2b8 !important;  width:70% !important; padding:6px 80px !important;"
                >保&nbsp;&nbsp;存</b-button
              >
            </div>
            <div class="col-lg-4">
              <b-button
                variant="secondary"
                @click="closeAlert()"
                class="resetButton"
                style="font-size:16px !important; margin:10px 5% 30px 5% !important; background-color: #ccc !important;  width:70% !important; padding:6px 80px !important;"
                >返&nbsp;&nbsp;回</b-button
              >
            </div>
          </div>
        </el-dialog>
        <b-modal id="Edit" ref="Edit" size="xl" hide-footer no-close-on-esc no-close-on-backdrop hide-header-close> </b-modal>

        <b-modal id="deleteAlert" title="确认删除" ref="deleteAlert" hide-footer no-close-on-esc no-close-on-backdrop hide-header-close>
          <div class="d-block text-center">
            <b-alert variant="danger" show>确定删除该支出单?</b-alert>
          </div>
          <b-button
            variant="danger"
            style="font-size:16px !important; margin-top:25px; padding:6px 80px !important;margin-bottom:30px !important;margin-right:0 !important;"
            @click="toDelete()"
          >
            删&nbsp;&nbsp;除
          </b-button>
          <b-button
            variant="primary"
            style="font-size:16px !important; margin-top:25px; float:right; padding:6px 80px !important;margin-bottom:30px !important;margin-right:0 !important;"
            @click="$refs.deleteAlert.hide(), (deleteItem = '')"
          >
            返&nbsp;&nbsp;回
          </b-button>
        </b-modal>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Validator from 'async-validator';
export default {
  name: 'out',
  metaInfo: {
    title: '支出单管理',
  },
  components: {},
  data() {
    return {
      list: [{ what_no: 'what_no-1', order_no: 'order_no-1', slip_no: 'slip_no-1', c_id: 21, dly_way_id: 3, out_price: '1000' }],
      form: {},
      costList: [],
      subForm: [],
      allMoney: {},
      currentPage: 1,
      countNum: 0,
      totalRow: 0,
      is_update: true,
      deleteItem: '',
      select_order_no: '',
      roleValidator: new Validator({
        // car_id: [{ required: true, message: '请选择供应商' }],
        // driver_id: { required: true, message: '请选择司机' },
        // dly_way_id: { required: true, message: '请选择线路' },
        // cost_id: { required: true, message: '请选择支出项' },
        // out_price: { required: true, message: '请填写支出金额' },
      }),
      dialog: false,
      rateList: [1, 1.03, 1.06, 1.09, 1.1, 1.13],
    };
  },
  computed: {
    ...mapState({
      limit: state => state.publics.limit,
      driverList: state => state.personnel.driverList,
      dlyWayList: state => state.self.dlyWayList,
      carList: state => state.car.carList,
      clientList: state => state.personnel.clientList,
      contractList: state => state.personnel.contractList,
      orderList: state => state.self.orderList,
    }),
    newClientList() {
      let arr = JSON.parse(JSON.stringify(this.clientList));
      arr.unshift({ name: '自运', id: null });
      return arr;
    },
  },
  async created() {
    await this.search();
    await Promise.all([
      this.getdly_wayList({ skip: 0, limit: 10000 }),
      this.getDriverList({ skip: 0, limit: 10000 }),
      this.getCarList({ skip: 0, limit: 10000 }),
      this.getClientList({ skip: 0, limit: 10000, type: 1 }),
    ]);
    let { data } = await this.getCostList({ skip: 0, limit: 10000 });
    data = data.filter(item => item.cost_type !== '0');
    this.$set(this, 'costList', data);
  },
  methods: {
    ...mapActions([
      'getOutList',
      'getDriverList',
      'getdly_wayList',
      'getCarList',
      'getCostList',
      'outOperation',
      'getClientList',
      'getContractList',
      'getOrderList',
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
      let totalRow = await this.getOrderList({
        skip: skip,
        limit: this.limit,
        order_no: this.select_order_no,
        c_id: '',
        start_time: '',
        end_time: '',
      });
      this.$set(this, 'totalRow', totalRow);
      if (totalRow === 0) {
        this.$set(this, 'list', {});
      } else {
        this.$set(this, 'list', this.orderList);
      }
    },
    //查询合同
    async getContract(index) {
      await this.getContractList({ skip: 0, limit: 10000, pact_no: '', cus_id: this.subForm[index].c_id });
      this.$set(this.subForm[index], `contractList`, this.contractList);
    },
    //选择合同
    async changeList(index) {
      let contract = this.subForm[index].contractList.filter(item => item.id === this.subForm[index].pact_id)[0];
      this.$set(this.subForm[index], `rate`, contract.cess);
    },
    //修改金额计算
    async changeMoney(index, type) {
      let rate = this.subForm[index].rate ? this.subForm[index].rate * 1 : ((this.subForm[index].rate = 1), this.subForm[index].rate * 1);
      //判断是否是修改实付,修改实付不需要修改应付部分
      if (typeof type !== 'string') {
        //将税前应付*税率,赋给税后应付
        this.$set(this.subForm[index], 'sh_ys', this.round(rate * 1 * this.subForm[index].sq_ys));
        //将税前应付赋给税前实付
        this.$set(this.subForm[index], 'sq_ss', this.round(this.subForm[index].sq_ys));
        //将税前实付*税率,赋给税后实付
        this.$set(this.subForm[index], 'sh_ss', this.round(rate * 1 * this.subForm[index].sq_ss));
      } else if (type === 'shouldBefore') {
        //将税前实付*税率,赋给税后实付
        this.$set(this.subForm[index], 'sh_ss', this.round(rate * 1 * this.subForm[index].sq_ss));
      } else if (type === 'shouldAfter') {
        //修改税后实付,除法需要四舍五入
        let newMoney = (this.subForm[index].sh_ss * 1) / (rate * 1);
        this.$set(this.subForm[index], 'sq_ss', this.round(newMoney));
      } else if (type === 'rate') {
        //将税前应付*税率,赋给税后应付
        this.$set(this.subForm[index], 'sh_ys', this.round(rate * 1 * this.subForm[index].sq_ys));
        //将税前实付*税率,赋给税后实付
        this.$set(this.subForm[index], 'sh_ss', this.round(rate * 1 * this.subForm[index].sq_ss));
      }
      this.computedAllMoney();
    },
    //四舍五入
    round(newMoney) {
      newMoney = parseFloat(newMoney);
      newMoney = Math.round(newMoney * 100) / 100;
      return newMoney;
    },
    //总价计算
    computedAllMoney() {
      let allSq_ss = parseFloat(
        this.subForm.reduce((prev, cur) => {
          return prev * 1 + (cur.sq_ss ? cur.sq_ss * 1 : 0);
        }, 0)
      );
      let allSh_ss = parseFloat(
        this.subForm.reduce((prev, cur) => {
          return prev * 1 + (cur.sh_ss ? cur.sh_ss * 1 : 0);
        }, 0)
      );
      let allSq_ys = parseFloat(
        this.subForm.reduce((prev, cur) => {
          return prev * 1 + (cur.sq_ys ? cur.sq_ys * 1 : 0);
        }, 0)
      );
      let allSh_ys = parseFloat(
        this.subForm.reduce((prev, cur) => {
          return prev * 1 + (cur.sh_ys ? cur.sh_ys * 1 : 0);
        }, 0)
      );
      let result = { sq_ss: allSq_ss, sh_ss: allSh_ss, sq_ys: allSq_ys, sh_ys: allSh_ys };
      this.$set(this, `allMoney`, result);
    },
    //验证,因为添加和修改的验证内容都是一样的,所以用一个方法
    async toValidate(type) {
      this.roleValidator.validate(this.form, (errors, fields) => {
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
    //打开删除提示框
    openDeleteAlert(id) {
      this.$refs.deleteAlert.show();
      this.deleteItem = id;
    },
    //删除
    async toDelete() {
      await this.outOperation({ type: 'outDelete', data: this.deleteItem });
      this.search();
      this.deleteItem = '';
      this.$refs.deleteAlert.hide();
    },
    //打开修改提示框
    async openUpdateAlert(index) {
      // this.$refs.Edit.show();
      this.dialog = true;
      this.form = {};
      this.subForm = [];
      this.allMoney = {};
      this.form = JSON.parse(JSON.stringify(this.list[index]));
      //使用接口请求这个订单所有的支出,赋值,判断权限是否允许更改
      //模拟假数据一条
      let { totalRow, data } = await this.getOutList({
        skip: 0,
        limit: 10000,
        main_id: this.form.id,
        order_no: this.form.order_no,
      });
      if (totalRow > 0) {
        this.subForm = data;
        for (let i = 0; i < this.subForm.length; i++) {
          this.getContract(i);
        }
        this.computedAllMoney();
      }
      //  else {
      //   this.subForm.push({ rate: 1, sq_ys: 0, sq_ss: 0, sh_ss: 0, sh_ys: 0 });
      // }
    },
    //修改
    async update() {
      let newList = JSON.parse(JSON.stringify(this.subForm));
      let newSubForm = newList.map(item => {
        delete item.contractList;
        delete item.status;
        item.order_no = this.form.order_no;
        return item;
      });
      await this.outOperation({ type: 'outEdit', data: newSubForm, main_id: this.form.id });
      this.form = {};
      this.$refs.Edit.hide();
      this.search();
    },
    //关闭弹框
    closeAlert() {
      this.dialog = false;
      this.is_update = true;
      this.operateId = '';
      this.form = {};
      this.subForm = [];
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
