<template lang="html">
  <div id="client">
    <!-- 表格 begin -->
    <div class="base-form">
      <div class="form-inline">
        <div class="base-form-title" style="width:100%;">
          <a class="base-margin-left-20">客户合同列表</a>
          <div class="button-table"></div>
        </div>
      </div>
      <div class="base-padding-20 base-bg-fff">
        <div class="row">
          <div class="col-lg-2 mb25 ml2Mix plr0 lh44">合同编号:</div>
          <div class="col-lg-3 mb25 pll0">
            <b-form-input v-model="select_pact_no" placeholder="输入合同编号" style="width:200px,margin-left:50px"></b-form-input>
          </div>
          <div class="col-lg-2 mb25 ml13Mix plr0 lh44">客户:</div>
          <div class="col-lg-3 mb25 pll0">
            <el-select class="marginBot" style="height:40px !important" v-model="select_cus_id" filterable placeholder="请选择客户">
              <el-option v-for="(client, index) in clientList" :key="index" :label="client.name" :value="client.id"></el-option>
            </el-select>
          </div>
          <div class="col-lg-2 mb25">
            <b-button variant="primary" style="font-size:14px !important; color:#fff !important; padding: 6px 12px !important;" @click="search('vague')"
              ><i class="base-margin-right-5 fa fa-search"></i>点击查询</b-button
            >
          </div>
        </div>

        <div class="base-align-right" style="margin-bottom:20px;">
          <b-button @click="addAlert()" variant="primary" style="font-size:14px !important; color:#efe !important; padding: 6px 12px !important;"
            >新建合同</b-button
          >
          <!-- 导入表格 -->
          <entrance @research="search"></entrance>
        </div>
        <div style="margin:10px 0;">
          <!-- 导出表格 -->
          <exportExcel :exportTitle="th" :db_nameList="filterVal" dataName="list" fileName="合同表"></exportExcel>
        </div>
        <table class="table table-bordered table-striped ">
          <tbody v-if="list.length > 0">
            <tr>
              <th>客户</th>
              <th>合同编号</th>
              <!-- <th>税率</th> -->
              <th>甲方</th>
              <th>乙方</th>
              <th>合同周期</th>
              <th>结算方式</th>
              <th>结算周期</th>
              <th>操作</th>
            </tr>
            <tr v-for="(item, index) in list" :key="index">
              <td>{{ { data: clientList, searchItem: 'id', value: item.cus_id, label: 'name' } | getName }}</td>
              <td>{{ item.pact_no }}</td>
              <!-- <td>{{ item.cess }}</td> -->
              <td>{{ item.jf }}</td>
              <td>{{ item.yf }}</td>
              <td>{{ item.cycle }}</td>
              <td>{{ item.js_type }}</td>
              <td>{{ item.js_cycle }}</td>
              <td>
                <b-button variant="primary" style="color:white; margin-right:5px;" @click="openAlert('update', index)">修&nbsp;&nbsp;改</b-button>
                <b-button
                  style="color:white; margin-right:5px;"
                  @click="$router.push({ path: `/contract_project`, query: { id: item.id, pact_no: item.pact_no || `` } })"
                >
                  查看项目
                </b-button>
                <b-button variant="danger" style="color:white;" @click="openDeleteAlert(item.id)">删&nbsp;&nbsp;除</b-button>
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
      </div>
    </div>
    <!--添加-->
    <el-dialog title="添加合同" :visible.sync="addDialog" width="70%">
      <div class="d-block">
        <div class="row">
          <div class="col-lg-12 marginBot4">
            <table class="table table-bordered table-striped ">
              <tbody>
                <tr>
                  <td>选择客户</td>
                  <!-- <td>税率</td> -->
                </tr>
                <tr>
                  <td>
                    <el-select class="marginBot" style="height:40px !important" v-model="form.cus_id" filterable placeholder="请选择客户">
                      <el-option v-for="(client, index) in clientList" :key="index" :label="client.name" :value="client.id"></el-option>
                    </el-select>
                  </td>
                  <!-- <td>
                    <el-tooltip class="item" effect="dark" content="请填写1.X,如:1/1.04" placement="top">
                      <b-form-input v-model="form.cess"></b-form-input>
                    </el-tooltip>
                  </td> -->
                </tr>
                <tr>
                  <td>合同编号</td>
                  <td>合同周期</td>
                </tr>
                <tr>
                  <td><b-form-input v-model="form.pact_no"></b-form-input></td>
                  <td><b-form-input v-model="form.cycle"></b-form-input></td>
                </tr>
                <tr>
                  <td>甲方</td>
                  <td>乙方</td>
                </tr>
                <tr>
                  <td><b-form-input v-model="form.jf"></b-form-input></td>
                  <td><b-form-input v-model="form.yf"></b-form-input></td>
                </tr>
                <tr>
                  <td>结算方式</td>
                  <td>结算周期</td>
                </tr>
                <tr>
                  <td><b-form-input v-model="form.js_type"></b-form-input></td>
                  <td><b-form-input v-model="form.js_cycle"></b-form-input></td>
                </tr>
              </tbody>
            </table>
            <b-button
              variant="secondary"
              style="font-size:16px !important; margin-top:35px; padding:6px 80px !important;margin-bottom:30px !important;margin-right:0 !important;"
              @click="form = {}"
            >
              重&nbsp;&nbsp;置</b-button
            >
            <b-button
              style="font-size:16px !important; margin-top:35px; float:right; padding:6px 80px !important;margin-bottom:30px !important;margin-right:0 !important;"
              variant="primary"
              @click="toValidate('add')"
            >
              保&nbsp;&nbsp;存</b-button
            >
          </div>
        </div>
      </div>
    </el-dialog>
    <!--删除-->
    <b-modal id="deleteAlert" title="确认删除" ref="deleteAlert" hide-footer no-close-on-esc no-close-on-backdrop hide-header-close>
      <div class="d-block text-center">
        <b-alert variant="danger" show>删除合同可能会影响您的管理,确认删除吗?</b-alert>
      </div>
      <b-button
        variant="danger"
        style="font-size:16px !important; margin-top:35px; padding:6px 80px !important;margin-bottom:30px !important;margin-right:0 !important;"
        @click="toDelete()"
      >
        删&nbsp;&nbsp;除</b-button
      >
      <b-button
        variant="primary"
        style="font-size:16px !important; margin-top:35px; float:right; padding:6px 80px !important;margin-bottom:30px !important;margin-right:0 !important;"
        @click="$refs.deleteAlert.hide(), (deleteItem = '')"
      >
        返&nbsp;&nbsp;回</b-button
      ></b-modal
    >

    <!-- 修改 -->
    <el-dialog title="修改合同" :visible.sync="updateDialog" width="70%">
      <div class="d-block">
        <div class="row">
          <div class="col-lg-12 marginBot4">
            <table class="table table-bordered table-striped ">
              <tbody>
                <tr>
                  <td>选择客户</td>
                  <!-- <td>税率</!-->
                  -->
                </tr>
                <tr>
                  <td>
                    <el-select class="marginBot" style="height:40px !important" v-model="updateForm.cus_id" filterable placeholder="请选择客户">
                      <el-option v-for="(client, index) in clientList" :key="index" :label="client.name" :value="client.id"></el-option>
                    </el-select>
                  </td>
                  <!-- <td>
                    <el-tooltip class="item" effect="dark" content="请填写1.X,如:1/1.04" placement="top">
                      <b-form-input v-model="updateForm.cess"></b-form-input>
                    </el-tooltip>
                  </td> -->
                </tr>
                <tr>
                  <td>合同编号</td>
                  <td>合同周期</td>
                </tr>
                <tr>
                  <td><b-form-input v-model="updateForm.pact_no"></b-form-input></td>
                  <td><b-form-input v-model="updateForm.cycle"></b-form-input></td>
                </tr>
                <tr>
                  <td>甲方</td>
                  <td>乙方</td>
                </tr>
                <tr>
                  <td><b-form-input v-model="updateForm.jf"></b-form-input></td>
                  <td><b-form-input v-model="updateForm.yf"></b-form-input></td>
                </tr>
                <tr>
                  <td>结算方式</td>
                  <td>结算周期</td>
                </tr>
                <tr>
                  <td><b-form-input v-model="updateForm.js_type"></b-form-input></td>
                  <td><b-form-input v-model="updateForm.js_cycle"></b-form-input></td>
                </tr>
              </tbody>
            </table>
            <b-button
              variant="secondary"
              @click="closeAlert('update')"
              class="resetButton"
              style="font-size:16px !important; margin-top:35px; padding:6px 80px !important;margin-bottom:30px !important;margin-right:0 !important;"
            >
              返&nbsp;&nbsp;回</b-button
            >
            <b-button
              variant="primary"
              @click="toValidate('update')"
              class="resetButton"
              style="font-size:16px !important; margin-top:35px; float:right; padding:6px 80px !important;margin-bottom:30px !important;margin-right:0 !important;"
            >
              保&nbsp;&nbsp;存</b-button
            >
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Validator from 'async-validator';
import entrance from '@/components/entrance.vue';
import exportExcel from '@/components/exportExcel.vue';

import _ from 'lodash';
export default {
  name: 'client',
  metaInfo: {
    title: '客户-合同管理',
  },
  components: {
    entrance,
    exportExcel,
  },
  data() {
    return {
      list: [],
      create_date_today: new Date().getYear() + 1900 + '-' + new Date().getMonth() + 1 + '-' + new Date().getDate(),
      form: {},
      deleteItem: '',
      updateForm: {},
      currentPage: 1,
      totalRow: 0,
      select_cus_id: '',
      select_pact_no: '',
      contractValidator: new Validator({
        cus_id: { required: true, message: '请选择此合同的客户' },
        pact_no: { type: 'string', required: true, message: '请填写合同编号' },
        jf: { type: 'string', required: true, message: '请填写甲方' },
        yf: { type: 'string', required: true, message: '请填写乙方' },
        cycle: { type: 'string', required: true, message: '请填写合同周期' },
        js_type: { type: 'string', required: true, message: '请填写结算方式' },
        js_cycle: { type: 'string', required: true, message: '请填写结算周期' },
      }),
      th: ['合同编号', '甲方', '乙方', '合同周期', '结算方式', '结算周期'],
      filterVal: ['pact_no', 'jf', 'yf', 'cycle', 'js_type', 'js_cycle'],
      countNum: 0,
      addDialog: false,
      updateDialog: false,
      radio: '1',
      deliveryList: [{ id: '0', name: '零担' }, { id: '1', name: '整车' }],
      calculationList: [{ id: '0', name: '体积' }, { id: '1', name: '重量' }],
    };
  },
  computed: {
    ...mapState({
      limit: state => state.publics.limit,
      clientList: state => state.self.clientList,
      contractList: state => state.self.contractList,
    }),
  },
  async created() {
    this.search();
    await this.getClientList({ skip: 0, limit: '10000', type: 0 });
  },
  methods: {
    ...mapActions(['getClientList', 'getContractList', 'contractOperation']),
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
      let totalRow = await this.getContractList({ skip: skip, limit: this.limit, pact_no: this.select_pact_no, cus_id: this.select_cus_id, type: `0` });
      this.$set(this, 'list', this.contractList);
      this.$set(this, 'totalRow', totalRow);
    },
    //修改
    async update() {
      this.updateForm.is_lf = this.radio;
      await this.contractOperation({ type: 'contractEdit', data: this.updateForm });
      this.updateForm = {};
      this.updateDialog = false;
      this.search();
    },
    //删除
    async toDelete() {
      await this.contractOperation({ type: 'contractDelete', data: this.deleteItem });
      this.search();
      this.deleteItem = '';
      this.$refs.deleteAlert.hide();
    },
    //打开添加窗口
    addAlert() {
      this.form = {};
      this.addDialog = true;
    },
    //添加
    async add() {
      this.form.is_lf = this.radio;
      await this.contractOperation({ type: 'contractSave', data: this.form });
      this.form = {};
      this.addDialog = false;
      this.search();
    },
    //打印
    doPrint() {
      console.log(this.biaotoushow);
      let subOutputRankPrint = document.getElementById('print');
      let newContent = subOutputRankPrint.innerHTML;
      let oldContent = document.body.innerHTML;
      document.body.innerHTML = newContent;
      window.print();
      window.location.reload();
      document.body.innerHTML = oldContent;
      return false;
    },
    //打开删除提示框
    openDeleteAlert(id) {
      this.$refs.deleteAlert.show();
      this.deleteItem = id;
    },
    openAlert(type, id) {
      if (type === 'update') {
        this.updateDialog = true;
        this.updateForm = JSON.parse(JSON.stringify(this.list[id]));
        this.radio = this.updateForm.is_lf;
      } else if (type === 'delete') {
        this.$refs.deleteAlert.show();
        this.operateId = id;
      }
    },
    closeAlert(type) {
      if (type === 'update') {
        this.updateDialog = false;
      } else if (type === 'delete') {
        this.$refs.deleteAlert.hide();
      }
      this.operateId = '';
      this.updateForm = {};
    },
    //验证,因为添加和修改的验证内容都是一样的,所以用一个方法
    toValidate(type) {
      if (type === 'add') {
        this.contractValidator.validate(this.form, (errors, fields) => {
          if (errors) {
            return this.handleErrors(errors, fields);
          }
          return this.add();
        });
      } else {
        this.contractValidator.validate(this.updateForm, (errors, fields) => {
          if (errors) {
            return this.handleErrors(errors, fields);
          }
          return this.update();
        });
      }
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

<style>
.marginBot4 {
  margin-bottom: 4px;
}
.marginBot {
  margin-bottom: 15px;
}
body {
  background-color: #ecedf0 !important;
}
.btn-primary {
  background-color: #5bc0de !important;
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
  cursor: pointer;
  border-color: #46b8da;
}

.base-margin-2 {
  margin: 2px 0;
}
/* .btn-xs,
.btn-group-xs > .btn {
  padding: 3px 8px;
  font-size: 12px;
  line-height: 1.5;
  border-radius: 5px;
}
.btn-info {
  color: #fff;
  background-color: #5bc0de;
  border-color: #46b8da;
} */
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
.pagination {
  display: inline-block;
  padding-left: 0;
  margin: 0 0;
  border-radius: 4px;
}
.pagination > li {
  display: inline;
}
.pagination-sm > li:first-child > a,
.pagination-sm > li:first-child > span {
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
}
.pagination > li:first-child > a,
.pagination > li:first-child > span {
  margin-left: 0;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}
.pagination-sm > li > a,
.pagination-sm > li > span {
  padding: 5px 10px;
  font-size: 16px;
  line-height: 1.5;
}
.pagination > li > a,
.pagination > li > span {
  position: relative;
  float: left;
  padding: 6px 12px;
  margin-left: -1px;
  line-height: 1.42857143;
  color: #337ab7;
  text-decoration: none;
  background-color: #fff;
  border: 1px solid #ddd;
}
.pagination-sm > li > a,
.pagination-sm > li > span {
  padding: 5px 10px;
  font-size: 16px;
  line-height: 1.5;
}
.pagination > li > a,
.pagination > li > span {
  position: relative;
  float: left;
  padding: 6px 12px;
  margin-left: -1px;
  line-height: 1.42857143;
  color: #337ab7;
  text-decoration: none;
  background-color: #fff;
  border: 1px solid #ddd;
}
.pagination > li > a:hover {
  color: #666;
  background: #ddd;
}
.base-header {
  min-width: 1024px;
  height: 60px;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.base-header-left {
  float: left;
  width: 240px;
  height: 60px;
  background-color: #1c2b36;
  border-bottom: 1px #161e25 solid;
  background-image: url(/img/logo.8640fb78.png);
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

.cssInput {
  border: none !important;
  box-shadow: none;
}
.table th,
.table td {
  padding: 0.5rem !important;
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
.el-input__inner {
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
}
.el-pagination.is-background .btn-next,
.el-pagination.is-background .btn-prev,
.el-pagination.is-background .el-pager li {
  padding: 0 10px !important;
  margin: 0 3px !important;
}
.el-pagination {
  margin-top: 20px !important;
  text-align: right !important;
  padding-right: 0 !important;
}
.el-pagination.is-background .btn-next {
  margin-right: 0 !important;
}
</style>
<style scoped>
@import '../../../../assets/style/Font-Awesome-master/css/font-awesome.css';
@import '../../../../assets/style/layout/base-Layout-bootstrap.css';
@import '../../../../assets/style/base-style-bootstrap.css';
</style>
