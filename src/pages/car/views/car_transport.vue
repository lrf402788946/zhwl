<template lang="html">
  <div id="car_transport">
    <!-- 表格 begin -->
    <div class="base-form">
      <div class="form-inline">
        <div class="base-form-title" style="width:100%;">
          <a class="base-margin-left-20">车辆支出管理</a>
          <div class="button-table"></div>
        </div>
      </div>
      <div class="base-padding-20 base-bg-fff">
        <div>
          <div class="row" style="margin-bottom: 15px !important;">
            <div class="col-lg-3 marginBot4">
              <p class="marginBot4">查询车号:</p>
              <el-select class="marginBot" style="height:40px !important" v-model="select_car_no" filterable placeholder="请选择要查询的车号">
                <el-option v-for="(car, index) in carList" :key="index" :label="car.car_no" :value="car.car_no"></el-option>
              </el-select>
            </div>
            <div class="col-lg-3 marginBot4">
              <p class="marginBot4">查询运输单号:</p>
              <b-form-input v-model="select_transport_no" placeholder="输入运输单号"></b-form-input>
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
        <div class="base-align-right" style="margin-bottom: 20px;">
          <a
            class="btn btn-info base-margin-bottom"
            style="font-size:14px !important; color:#fff !important; padding: 6px 12px !important;"
            data-toggle="tooltip"
            title=""
            role="button"
            @click="$router.push({ path: '/transport_pack' })"
          >
            <i class="base-margin-right-5 fa fa-plus-square"></i>添加车辆支出
          </a>
        </div>
        <div class="base-align-right" style="margin-bottom: 20px;"></div>
        <table class="table table-btransported table-striped ">
          <!-- <tbody v-if="tripList.length > 0"> -->
          <tr>
            <th>运输单号</th>
            <th>操作</th>
          </tr>
          <tr v-for="(item, index) in tripList" :key="index">
            <td>{{ item.transport_nos }}</td>
            <td>
              <b-button variant="primary" style="color:white; margin-right:5px;" @click="openAlert('update', item.id)">详&nbsp;&nbsp;情</b-button>
              <b-button variant="success" v-if="item.status !== '1'" style="color:white; margin-right:5px;" @click="openAlert('checkout', item.id)">
                结&nbsp;&nbsp;账
              </b-button>
              <!-- <b-button v-if="!(item.status === 2)" variant="danger" style="color:white;" @click="openAlert('delete', item.id)">删&nbsp;&nbsp;除</b-button> -->
            </td>
          </tr>
          <!-- </tbody>
          <tbody v-else>
            <tr>
              <td style="text-align:center;">没有查询到数据</td>
            </tr>
          </tbody> -->
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

    <!--详情-->
    <el-dialog :visible.sync="dialogDetail" title="运输详情" width="90%" :show-close="false" close-on-click-modal close-on-press-escape center>
      <div class="d-block text-center">
        <div class="row">
          <div class="col-lg-4 mb25">
            <div class="lh44">操作人：</div>
            <b-form-input v-model="updateForm.login_id" :disabled="true"></b-form-input>
          </div>
          <div class="col-lg-4 mb25">
            <div class="lh44">操作日期</div>
            <el-date-picker
              style="width: 100%;"
              v-model="updateForm.create_time"
              :disabled="true"
              placeholder="操作日期"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="date"
            >
            </el-date-picker>
          </div>
          <div class="col-lg-12 mb25">
            <div class="lh44">运输单号：</div>
            <b-form-input v-model="updateForm.transport_nos" :disabled="true"></b-form-input>
          </div>
          <table class="table table-btransported table-striped ">
            <tbody>
              <tr>
                <td>费用项目</td>
                <td>费用金额</td>
                <td>操作时间</td>
                <td>操作人</td>
                <td>备注</td>
                <td>操作</td>
              </tr>
              <tr v-for="(item, index) in subForm" :key="index">
                <td>
                  <el-select style="height:40px !important" :disabled="is_update" v-model="item.cost_id" filterable placeholder="请选择支出项">
                    <el-option v-for="(cost, index) in costList" :key="index" :label="cost.cost_name" :value="cost.id"></el-option>
                  </el-select>
                </td>
                <td>
                  <b-form-input v-model="item.price" type="number" :disabled="is_update"></b-form-input>
                </td>
                <td>
                  <el-date-picker
                    style="width:100%; height: 34px !important; line-height: 34px !important;"
                    v-model="item.create_time"
                    :disabled="item.id && is_update"
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                    type="date"
                    placeholder="请选择操作时间"
                  >
                  </el-date-picker>
                </td>
                <td>
                  <b-form-input v-model="item.login_id" :disabled="item.id"></b-form-input>
                </td>
                <td>
                  <b-form-input v-model="item.remark" :disabled="is_update"></b-form-input>
                </td>
                <td>
                  <el-button type="danger" icon="el-icon-delete" :disabled="is_update" circle @click="() => subForm.splice(index, 1)"></el-button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-4">
          <b-button
            variant="primary"
            v-if="is_update && updateForm.status !== '1'"
            @click="is_update = false"
            class="resetButton"
            style="font-size:16px !important; margin:10px 5% 30px 5% !important; background-color: #17a2b8 !important;  width:70% !important; padding:6px 80px !important;"
            >修&nbsp;&nbsp;改</b-button
          >
          <b-button
            variant="primary"
            v-if="!is_update"
            @click="() => subForm.push({})"
            class="resetButton"
            style="font-size:16px !important; margin:10px 5% 30px 5% !important; background-color: #17a2b8 !important;  width:70% !important; padding:6px 80px !important;"
            >添&nbsp;&nbsp;加</b-button
          >
        </div>
        <!-- <b-button
        variant="primary"
        @click="exportExcel()"
        class="resetButton"
        style="font-size:16px !important; margin:10px 5% 30px 5% !important; background-color: #17a2b8 !important;  width:30% !important; padding:6px 80px !important;"
        >导&nbsp;&nbsp;出</b-button
      > -->
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
            @click="closeAlert('update')"
            class="resetButton"
            style="font-size:16px !important; margin:10px 5% 30px 5% !important; background-color: #ccc !important;  width:70% !important; padding:6px 80px !important;"
            >返&nbsp;&nbsp;回</b-button
          >
        </div>
      </div>
    </el-dialog>
    <!--删除弹框-->
    <b-modal id="checkout" title="确认结算" ref="checkoutAlert" hide-footer no-close-on-esc no-close-on-backdrop hide-header-close>
      <div class="d-block text-center">
        <b-alert variant="danger" show>确认结算吗?</b-alert>
      </div>
      <b-button
        variant="success"
        style="font-size:16px !important; margin-top:25px; padding:6px 80px !important;margin-bottom:30px !important;margin-right:0 !important;"
        @click="toEnd()"
        >结&nbsp;&nbsp;算</b-button
      >
      <b-button
        variant="primary"
        style="font-size:16px !important; margin-top:25px; float:right; padding:6px 80px !important;margin-bottom:30px !important;margin-right:0 !important;"
        class="resetButton"
        @click="closeAlert('checkout')"
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
  name: 'car_transport',
  metaInfo: {
    title: '运输管理',
  },
  data() {
    return {
      updateForm: {},
      tripList: [],
      subForm: [],
      is_update: true,
      operateId: '',
      currentPage: 1,
      totalRow: 0,
      mainValidator: new Validator({
        // op: [{ required: true, message: '请填写操作人' }],
      }),
      select_transport_no: '',
      select_car_no: '',
      dialogDetail: false,
      costList: [],
    };
  },
  watch: {},
  computed: {
    ...mapState({
      limit: state => state.publics.limit,
      userInfo: state => state.publics.userInfo,
      carList: state => state.self.carList,
    }),
  },
  async created() {
    await this.getCarList({ skip: 0, limit: 10000 });
    let { data } = await this.getCostList({ skip: 0, limit: 10000 });
    (data = data.filter(item => item.cost_type !== '0')), this.$set(this, 'costList', data);
  },
  methods: {
    ...mapActions(['getTripList', 'getCarList', 'getCostList', 'tripOperation']),
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
      let { totalRow, data } = await this.getTripList({
        skip: skip,
        limit: this.limit,
        transport_no: this.select_transport_no,
        car_no: this.select_car_no,
      });
      this.$set(this, 'totalRow', totalRow);
      if (totalRow > 0) {
        this.$set(this, 'tripList', data);
      }
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
    //修改
    async update() {
      try {
        this.subForm.map(item => delete item.cost_name);
        await this.tripOperation({ type: 'tripEdit', id: this.updateForm.id, subForm: this.subForm });
        this.closeAlert('update');
        this.updateForm = [];
        this.subForm = [];
        this.is_update = true;
        this.search();
      } catch (error) {
        console.log(error);
      }
    },
    //结算
    async toEnd() {
      await this.tripOperation({ type: 'tripEnd', id: this.operateId });
      this.closeAlert('checkout');
      this.search();
    },
    //打开与关闭修改和删除的弹框
    async openAlert(type, id) {
      if (type === 'update') {
        this.dialogDetail = true;
        let result = await this.tripOperation({ id: id, type: 'tripInfo' });
        this.$set(this, 'updateForm', result.trip);
        this.$set(this, 'subForm', result.tripOutList);
      } else if (type === 'checkout') {
        this.$refs.checkoutAlert.show();
        this.operateId = id;
      }
    },
    //关闭弹框
    closeAlert(type) {
      if (type === 'update') {
        this.dialogDetail = false;
      } else if (type === 'checkout') {
        this.$refs.checkoutAlert.hide();
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
    reset() {
      this.subForm = [];
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
  btransport: 1px solid transparent !important;
  btransport-radius: 3px !important;
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
  btransport: 1px solid #ccc;
  btransport-radius: 4px;
  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
  -webkit-transition: btransport-color ease-in-out 0.15s, -webkit-box-shadow ease-in-out 0.15s;
  -o-transition: btransport-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
  transition: btransport-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
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
  btransport-color: #46b8da;
}
.base-margin-2 {
  margin: 2px 0;
}
.btn-xs,
.btn-group-xs > .btn {
  padding: 3px 8px;
  font-size: 14px;
  line-height: 1.5;
  btransport-radius: 5px;
}
.btn-info {
  color: #fff;
  background-color: #5bc0de;
  btransport-color: #46b8da;
}
.base-margin-right-5 {
  margin-right: 5px;
}
.base-margin-bottom {
  margin-bottom: 20px;
}
.table-btransported {
  btransport: 1px solid #ddd;
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
  btransport-spacing: 0;
  btransport-collapse: collapse;
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
  btransport-bottom: 1px #161e25 solid;
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
