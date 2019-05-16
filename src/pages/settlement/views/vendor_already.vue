<template lang="html">
  <div id="customerStatement">
    <div class="base-form">
      <div class="form-inline">
        <div class="base-form-title" style="width:100%;">
          <a class="base-margin-left-20">供应商结算单</a>
          <div class="button-table"></div>
        </div>
      </div>
      <div class="base-padding-20 base-bg-fff">
        <div class="row" style="margin-bottom: 15px !important;">
          <div class="col-lg-3 marginBot4">
            <p class="marginBot4">请选择供应商:</p>
            <el-select class="marginBot" style="height:40px !important" v-model="select_client_id" filterable placeholder="请选择供应商">
              <!-- <el-option label="全部" value=""></el-option> -->
              <el-option v-for="item in clientList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </div>
          <!-- <div class="col-lg-3 mb25">
            <p class="marginBot4">请输入项目名:</p>
            <el-input v-model="select_xm_name" placeholder="请输入项目"></el-input>
          </div>
          <div class="col-lg-3 mb25">
            <p class="marginBot4">请输入订单号:</p>
            <el-input v-model="select_order_no" placeholder="请输入订单号"></el-input>
          </div> -->
        </div>
        <div>
          <el-button size="medium" @click="searchButton('vague')" type="primary">查&nbsp;&nbsp;询</el-button>
        </div>
      </div>
      <table class="table table-bordered table-striped ">
        <tbody v-if="list.length > 0">
          <tr>
            <th>供应商</th>
            <th>银行</th>
            <th>卡号</th>
            <th>支付单位</th>
            <th>实收合计</th>
            <th>支付类型</th>
            <th>操作</th>
          </tr>
          <tr v-for="(item, index) in list" :key="index">
            <td>{{ item.c_name }}</td>
            <td>{{ item.c_bank }}</td>
            <td>{{ item.c_account }}</td>
            <td>{{ item.pay_unit }}</td>
            <td>{{ item.count_price }}</td>
            <td>{{ item.pay_type === '0' ? '现金' : '银行汇款' }}</td>
            <td><bill :id="item.id"></bill></td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td style="text-align:center;">没有数据</td>
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
</template>
<script>
import Validator from 'async-validator';
import entrance from '@/components/entrance.vue';
import exportExcel from '@/components/exportExcel.vue';
import bill from '@/components/bill.vue';
import { mapActions, mapState, mapMutations } from 'vuex';
import _ from 'lodash';
export default {
  name: 'customerStatement',
  metaInfo: {
    title: '供应商结算单',
  },
  components: {
    bill,
  },
  data() {
    return {
      select_client_id: '',
      select_xm_name: '',
      select_order_no: '',
      list: [],
      xiangXiList: {},
      xiangXiList1: [],
      wayname: '',
      loading_list: [],
      currentPage: 1,
      totalRow: 0,
    };
  },
  async created() {
    await this.getContractList({ skip: 0, limit: 10000, cus_id: '', pact_no: '' });
    await this.getClientList({ skip: 0, limit: 10000, type: 1 });
  },
  computed: {
    ...mapState({
      contractList: state => state.personnel.contractList,
      clientList: state => state.personnel.clientList,
      limit: state => state.publics.limit,
    }),
  },
  methods: {
    ...mapActions(['getContractList', 'getClientList', 'gysCostList', 'gysAlreadylist']),
    toSearch(currentPage) {
      this.currentPage = currentPage;
      this.search();
    },
    //查询按钮
    async searchButton(type) {
      if (type === 'vague') {
        this.currentPage = 1;
      }
      let skip = (this.currentPage - 1) * this.limit;
      let result = await this.gysAlreadylist({ c_id: this.select_client_id, skip: 0, limit: this.limit });
      this.$set(this, 'list', result.dataList);
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
.mb25 {
  margin-bottom: 10px;
}
.btn-primary:hover {
  background-color: #17a2b8 !important;
}
</style>

<style scoped>
@import '../../../assets/style/Font-Awesome-master/css/font-awesome.css';
@import '../../../assets/style/layout/base-Layout-bootstrap.css';
@import '../../../assets/style/base-style-bootstrap.css';
</style>
