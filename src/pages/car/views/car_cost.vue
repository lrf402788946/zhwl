<template lang="html">
  <div id="car_cost">
    <div class="base-form">
      <div class="form-inline">
        <div class="base-form-title" style="width:100%;">
          <a class="base-margin-left-20">单车核算</a>
          <div class="button-table"></div>
        </div>
      </div>
      <div class="base-padding-20 base-bg-fff">
        <div>
          <div class="row" style="margin-bottom: 15px !important;">
            <div class="col-lg-3 marginBot4">
              <p class="marginBot4">查询车号:</p>
              <el-select class="marginBot" style="height:40px !important" v-model="select_car_no" filterable placeholder="请选择要查询的车号">
                <el-option value="" label="所有车辆"></el-option>
                <el-option v-for="(car, index) in carList" :key="index" :label="car.car_no" :value="car.car_no"></el-option>
              </el-select>
            </div>
            <div class="col-lg-4 marginBot4">
              <p class="marginBot4">日期范围查询:</p>
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
        <div class="base-align-right" style="margin-bottom: 20px;"></div>
        <table class="table table-btransported table-striped ">
          <!-- <tbody v-if="carCostList.length > 0"> -->
          <tr>
            <th>车号</th>
            <th>总收入</th>
            <th>总支出</th>
            <th>合计</th>
          </tr>
          <tr v-for="(item, index) in carCostList" :key="index">
            <td>{{ item.car_no }}</td>
            <td>{{ item.inPrice ? item.inPrice : 0 }}</td>
            <td>{{ item.outPrice ? item.outPrice : 0 }}</td>
            <td>{{ item.inPrice * 1 - item.outPrice * 1 }}</td>
          </tr>
          <!-- </tbody>
          <tbody v-else>
            <tr>
              <td style="text-align:center;">没有查询到数据</td>
            </tr>
          </tbody> -->
        </table>

        <b-modal id="pack" title="合并车辆支出" ref="pack" size="xl" hide-footer no-close-on-backdrop no-close-on-esc no-enforce-focus>
          <div class="d-block text-center">
            <div class="row">
              <div class="col-lg-4 mb25">
                <div class="lh44">操作人：</div>
                <b-form-input v-model="form.login_id"></b-form-input>
              </div>
              <div class="col-lg-4 mb25">
                <div class="lh44">操作日期</div>
                <el-date-picker
                  style="width: 100%;"
                  v-model="form.create_time"
                  placeholder="操作日期"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  type="date"
                >
                </el-date-picker>
              </div>
              <div class="col-lg-12 mb25">
                <div class="lh44">运输单号：</div>
                <b-form-input v-model="form.transport_nos" :disabled="true"></b-form-input>
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
                      <el-select style="height:40px !important" v-model="item.cost_id" filterable placeholder="请选择支出项">
                        <el-option v-for="(cost, index) in costList" :key="index" :label="cost.cost_name" :value="cost.id"></el-option>
                      </el-select>
                    </td>
                    <td>
                      <b-form-input v-model="item.price" type="number"></b-form-input>
                    </td>
                    <td>
                      <el-date-picker
                        style="width:100%; height: 34px !important; line-height: 34px !important;"
                        v-model="item.create_time"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"
                        type="date"
                        placeholder="请选择操作时间"
                      >
                      </el-date-picker>
                    </td>
                    <td>
                      <b-form-input v-model="item.login_id"></b-form-input>
                    </td>
                    <td>
                      <b-form-input v-model="item.remark"></b-form-input>
                    </td>
                    <td>
                      <el-button type="danger" icon="el-icon-delete" circle @click="clearSubForm(index)"></el-button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <b-button
            variant="primary"
            @click="addSubForm()"
            class="resetButton"
            style="font-size:16px !important; margin-top:25px; width:30% !important; padding:6px 80px !important;margin-bottom:30px !important;margin-right:0 !important;"
            >添加商品</b-button
          >
          <b-button
            variant="primary"
            @click="add()"
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

        <!-- <el-pagination
          layout="total, prev, pager, next"
          :background="true"
          :page-size="15"
          prev-text="上一页"
          next-text="下一页"
          :current-page="currentPage"
          @current-change="toSearch"
          :total="totalRow"
        >
        </el-pagination> -->
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import _ from 'lodash';
export default {
  name: 'car_cost',
  components: {},
  data() {
    return {
      carCostList: [{ id: 1, transport_no: '11' }, { id: 2, transport_no: '22' }, { id: 3, transport_no: '33' }],
      form: {},
      subForm: [],
      select_car_no: '',
      costList: [],
      select_in_date: [],
    };
  },
  computed: {
    ...mapState({
      carList: state => state.self.carList,
    }),
  },
  async created() {
    await this.getCarList({ skip: 0, limit: 10000 });
    let { data } = await this.getCostList({ skip: 0, limit: 10000 });
    (data = data.filter(item => item.cost_type !== '0')), this.$set(this, 'costList', data);
  },
  methods: {
    ...mapActions(['getCarList', 'getCostList', 'getCarCostList']),
    async search() {
      if (this.select_in_date.length <= 0) {
        this.$message.error('请选择查询时间');
        return false;
      }
      let { totalRow, data } = await this.getCarCostList({
        car_no: this.select_car_no,
        start_time: this.select_in_date.length > 0 ? this.select_in_date[0] : '',
        end_time: this.select_in_date.length > 0 ? this.select_in_date[1] : '',
      });
      this.$set(this, `carCostList`, data);
    },
    async add() {
      let newForm = JSON.parse(JSON.stringify(this.form));
      newForm['car_no'] = this.select_car_no;
      await this.tripOperation({ form: newForm, subForm: this.subForm, type: 'tripSave' });
      this.reset();
      this.search();
      this.$refs.pack.hide();
    },
    //打开与关闭修改和删除的弹框
    async openAlert(type, id) {
      if (this.loading_list.length <= 0) {
        this.$message.error('请选择要合并的运输单');
        return false;
      }
      let transport_ids;
      let transport_nos;
      this.loading_list.map(item => {
        transport_ids = transport_ids === undefined ? `${item.id}` : `${transport_ids},${item.id}`;
        transport_nos = transport_nos === undefined ? `${item.transport_no}` : `${transport_nos},${item.transport_no}`;
      });
      this.$set(this.form, `transport_ids`, transport_ids);
      this.$set(this.form, `transport_nos`, transport_nos);
      this.subForm.length > 0 ? '' : this.addSubForm();
      this.$refs.pack.show();
    },
    addSubForm() {
      this.subForm.push({});
    },
    //删除表单中内容
    clearSubForm(i) {
      this.subForm.splice(i, 1);
    },
    reset() {
      this.form = {};
      this.subForm = [{}];
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
