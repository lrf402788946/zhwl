<template lang="html">
  <div id="in">
    <!-- 表格 begin -->
    <div class="base-form">
      <div class="form-inline">
        <div class="base-form-title" style="width:100%;">
          <a class="base-margin-left-20">收入单列表</a>
          <div class="button-table"></div>
        </div>
      </div>
      <div class="base-padding-20 base-bg-fff">
        <table>
          <tr>
            <td>单号查询</td>
            <td>拆分单号查询</td>
          </tr>
          <tr>
            <td><b-form-input v-model="select_order_no" placeholder="输入单号"></b-form-input></td>
            <td><b-form-input v-model="select_slip_no" placeholder="输入拆分单号"></b-form-input></td>
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
              <th>单号</th>
              <th>拆分单号</th>
              <th>合同</th>
              <th>项目名称</th>
              <th>单价</th>
              <th>收入名称</th>
              <th>量份收费</th>
              <th>发货方式</th>
              <th>计算方式</th>
              <!-- <th>税率</th>
              <th>税前应收</th>
              <th>税后应收</th>
              <th>税前实收</th>
              <th>税后实收</th> -->
              <th>操作</th>
            </tr>
            <tr v-for="(item, index) in list" :key="index">
              <td>{{ item.order_no }}</td>
              <td>{{ item.slip_no }}</td>
              <td>{{ item.pact_no }}</td>
              <td>{{ item.xm_name }}</td>
              <td>{{ item.price }}</td>
              <td>{{ { data: costList, searchItem: 'id', value: item.cost_id, label: 'cost_name' } | getName }}</td>
              <td>{{ item.is_lf === '1' ? '否' : '是' }}</td>
              <td>{{ item.send_type === '1' ? '整车' : '零担' }}</td>
              <td>{{ item.count_type === '1' ? '重量' : '体积' }}</td>
              <!-- <td>{{ item.rate }}</td>
              <td>{{ item.sq_ys }}</td>
              <td>{{ item.sh_ys }}</td>
              <td>{{ item.sq_ss }}</td>
              <td>{{ item.sh_ss }}</td> -->
              <td>
                <b-button variant="danger" @click="openDetailsAlert(item.id, item.status)">详&nbsp;&nbsp;情</b-button>
                <front v-if="item.status === 2">已签收的订单无法更改</front>
                <b-button v-if="item.status != 2" variant="primary" style="color:white;" @click="openUpdateAlert(item.id, item.status, item.slip_id)"
                  >修&nbsp;&nbsp;改</b-button
                >
                <b-button v-if="item.status != 2" variant="danger" @click="openDeleteAlert(item.id)">删&nbsp;&nbsp;除</b-button>
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
        <!-- 详情 -->
        <el-dialog width="60%" title="订单详情" :visible.sync="dialogUpdate" :fullscreen="false">
          <div class="d-block text-center">
            <div class="row">
              <div class="col-lg-3 mb25">
                <div class="lh44">单号：{{ inList.order_no }}</div>
              </div>
              <div class="col-lg-3 mb25">
                <div class="lh44">拆分单号：{{ inList.slip_no }}</div>
              </div>
              <div class="col-lg-3 mb25">
                <div class="lh44">合同：{{ inList.pact_no }}</div>
              </div>
              <div class="col-lg-3 mb25">
                <div class="lh44">项目名称：{{ inList.xm_name }}</div>
              </div>
              <div class="col-lg-3 mb25">
                <div class="lh44">收入名称：{{ inList.cost_name }}</div>
              </div>
              <div class="col-lg-3 mb25">
                <div class="lh44">发货方式：{{ inList.send_type === 1 ? '整车' : '零担' }}</div>
              </div>
              <div class="col-lg-3 mb25">
                <div class="lh44">计算方式：{{ inList.count_type === 1 ? '重量' : '体积' }}</div>
              </div>
              <div class="col-lg-3 mb25">
                <div class="lh44">税率：{{ inList.rate }}</div>
              </div>
              <div class="col-lg-3 mb25">
                <div class="lh44">件数：{{ inList.num }}</div>
              </div>
              <div class="col-lg-3 mb25">
                <div class="lh44">单价：{{ inList.price }}</div>
              </div>
              <div class="col-lg-3 mb25">
                <div class="lh44">税前应收金额：{{ inList.sq_ys }}</div>
              </div>
              <div class="col-lg-3 mb25">
                <div class="lh44">税后应收金额：{{ inList.sh_ys }}</div>
              </div>
              <div class="col-lg-3 mb25">
                <div class="lh44">税前实收金额：{{ inList.sq_ss }}</div>
              </div>
              <div class="col-lg-3 mb25">
                <div class="lh44">税后实收金额：{{ inList.sh_ss }}</div>
              </div>
              <div class="col-lg-3 mb25">
                <div class="lh44">状态：{{ showStatus === 2 ? '已送达' : '未送达' }}</div>
              </div>
              <div class="col-lg-3 mb25">
                <div class="lh44">创建日期：</div>
                <el-date-picker
                  style="width: 100%;"
                  :disabled="true"
                  v-model="inList.create_time"
                  placeholder="要求发货日期"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  type="date"
                >
                </el-date-picker>
              </div>
              <div class="col-lg-3 mb25">
                <div class="lh44">备注：{{ inList.remark }}</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-4">
              <b-button
                variant="secondary"
                @click="closeDetailsAlert()"
                class="resetButton"
                style="font-size:16px !important; margin-top:25px; padding:6px 80px !important;margin-bottom:30px !important;margin-right:0 !important;"
                >返&nbsp;&nbsp;回</b-button
              >
            </div>
          </div>
        </el-dialog>

        <!-- 修改收入单 -->
        <b-modal id="Edit" title="修改收入单" size="lg" ref="Edit" hide-footer no-close-on-esc no-close-on-backdrop hide-header-close>
          <div class="d-block text-center">
            <div class="row">
              <div class="col-lg-3 mb25">
                <div class="lh44">收入名称</div>
                <el-select :disabled="true" class="marginBot" style="height:40px !important" v-model="form.cost_id" filterable placeholder="请选择支出项">
                  <el-option v-for="(cost, index) in costList" :key="index" :label="cost.cost_name" :value="cost.id"></el-option>
                </el-select>
              </div>
              <div class="col-lg-3 mb25">
                <div class="lh44">计算方式</div>
                <el-select v-model="form.count_type" class="marginBot" style="height:40px !important" filterable placeholder="请选择计算方式">
                  <el-option v-for="item in calculationList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </div>
              <div class="col-lg-3 mb25">
                <div class="lh44">税率</div>
                <b-form-input :disabled="true" v-model="form.rate"></b-form-input>
              </div>
              <div class="col-lg-3 mb25">
                <div class="lh44">税前应收</div>
                <b-form-input :disabled="true" v-model="form.sq_ys"></b-form-input>
              </div>
              <div class="col-lg-3 mb25">
                <div class="lh44">税后应收</div>
                <b-form-input :disabled="true" v-model="form.sh_ys"></b-form-input>
              </div>
              <div class="col-lg-3 mb25">
                <div class="lh44">税前实收</div>
                <b-form-input v-model="form.sq_ss"></b-form-input>
              </div>
              <div class="col-lg-3 mb25">
                <div class="lh44">税后实收</div>
                <b-form-input v-model="form.sh_ss"></b-form-input>
              </div>
              <div class="col-lg-3 mb25">
                <div class="lh44">备注</div>
                <b-form-input v-model="form.remark"></b-form-input>
              </div>
            </div>
          </div>
          <b-button
            variant="secondary"
            @click="closeAlert()"
            style="font-size:16px !important; margin-top:25px; padding:6px 80px !important;margin-bottom:30px !important;margin-right:0 !important;"
          >
            返&nbsp;&nbsp;回
          </b-button>
          <b-button
            variant="primary"
            @click="toValidate('update')"
            style="font-size:16px !important; margin-top:25px; float:right; padding:6px 80px !important;margin-bottom:30px !important;margin-right:0 !important;"
          >
            修&nbsp;&nbsp;改
          </b-button>
        </b-modal>

        <b-modal id="deleteAlert" title="确认删除" ref="deleteAlert" hide-footer no-close-on-esc no-close-on-backdrop hide-header-close>
          <div class="d-block text-center">
            <b-alert variant="danger" show>确定删除该收入单?</b-alert>
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
  name: 'in',
  metaInfo: {
    title: '收入单管理',
  },
  components: {},
  data() {
    return {
      list: [],
      form: {},
      costList: [],
      currentPage: 1,
      countNum: 0,
      totalRow: 0,
      deleteItem: '',
      select_order_no: '',
      select_slip_no: '',
      roleValidator: new Validator({
        // car_id: [{ required: true, message: '请选择供应商' }],
      }),
      slipId: '',
      inList: {},
      dialogUpdate: false,
      showStatus: -1,
      deliveryList: [{ id: '0', name: '整车' }, { id: '1', name: '零担' }],
      calculationList: [{ id: '0', name: '体积' }, { id: '1', name: '重量' }],
    };
  },
  computed: {
    ...mapState({
      limit: state => state.publics.limit,
      driverList: state => state.personnel.driverList,
      dlyWayList: state => state.self.dlyWayList,
      carList: state => state.car.carList,
    }),
  },
  async created() {
    await this.search();
    await Promise.all([
      this.getdly_wayList({ skip: 0, limit: 10000 }),
      this.getDriverList({ skip: 0, limit: 10000 }),
      this.getCarList({ skip: 0, limit: 10000 }),
    ]);
    let { data } = await this.getCostList({ skip: 0, limit: 10000 });
    (data = data.filter(item => item.cost_type !== '1')), this.$set(this, 'costList', data);
  },
  methods: {
    ...mapActions(['getInList', 'getDriverList', 'getdly_wayList', 'getCarList', 'getCostList', 'inOperation', 'updateIncome']),
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
      let { totalRow, data } = await this.getInList({ skip: skip, limit: this.limit, order_no: this.select_order_no, slip_no: this.select_slip_no });
      this.$set(this, 'totalRow', totalRow);
      if (totalRow == 0) {
        this.$set(this, 'list', {});
      } else {
        this.$set(this, 'list', data);
      }
    },
    //关闭详情
    closeDetailsAlert() {
      this.dialogUpdate = false;
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
      await this.$axios.get(`/api/in/in_delete?id=${this.deleteItem}`);
      this.search();
      this.deleteItem = '';
      this.$refs.deleteAlert.hide();
    },
    //打开详情
    async openDetailsAlert(id, status) {
      let result = await this.$axios.get(`/api/in/in_info?id=${id}`);
      this.$set(this, 'inList', result.inInfo);
      this.showStatus = status;
      this.dialogUpdate = true;
    },
    //打开修改提示框
    async openUpdateAlert(id, status, slip_id) {
      let result = await this.$axios.get(`/api/in/in_info?id=${id}`);
      this.$set(this, 'inList', result.inInfo);
      this.showStatus = status;
      this.$refs.Edit.show();
      this.form = JSON.parse(JSON.stringify(result.inInfo));
      this.slipId = slip_id;
    },
    //修改
    async update() {
      let form1 = [];
      delete this.form.create_time;
      delete this.form.order_no;
      delete this.form.slip_id;
      delete this.form.status;
      delete this.form.cost_name;
      delete this.form.pact_id;
      delete this.form.pact_no;
      form1[0] = this.form;
      await this.updateIncome({ slipId: this.slipId, data: form1 });
      this.form = {};
      this.slipId = '';
      this.$refs.Edit.hide();
      this.search();
    },
    //关闭弹框
    closeAlert() {
      this.$refs.Edit.hide();
      this.operateId = '';
      this.form = {};
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
