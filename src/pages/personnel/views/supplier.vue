<template lang="html">
  <div id="supplier">
    <!-- 表格 begin -->
    <div class="base-form">
      <div class="form-inline">
        <div class="base-form-title" style="width:100%;">
          <a class="base-margin-left-20">供应商列表</a>
          <div class="button-table"></div>
        </div>
      </div>
      <div class="base-padding-20 base-bg-fff">
        <table>
          <tr>
            <td>供应商姓名查询:</td>
          </tr>
          <tr>
            <td>
              <b-form-input v-model="select_client_name" placeholder="输入供应商姓名" style="width:200px,margin-left:50px"></b-form-input>
            </td>
            <td style="padding-left:60px">
              <b-button
                variant="primary"
                style="font-size: 12px !important; color: rgb(255, 255, 255) !important; width: 100% !important; padding: 6px 15px !important; margin-right: 0px !important;"
                @click="searchButton()"
                >点&nbsp;&nbsp;击&nbsp;&nbsp;查&nbsp;&nbsp;询</b-button
              >
            </td>
          </tr>
        </table>

        <div class="base-align-right" style="margin-bottom:20px;">
          <a
            class="btn btn-info base-margin-bottom"
            data-toggle="tooltip"
            style="font-size:14px !important; color:#fff !important; padding: 6px 12px !important;"
            title=""
            role="button"
            v-b-modal="'toAdd'"
          >
            <i class="base-margin-right-5 fa fa-plus-square" style=" color:#fff !important;"></i>添加供应商
          </a>
          <!-- 导入表格 -->
          <entrance @research="search"></entrance>
        </div>
        <div style="margin:10px 0;">
          <!-- 导出表格 -->
          <exportExcel :exportTitle="th" :db_nameList="filterVal" dataName="list" fileName="供应商表"></exportExcel>
        </div>
        <table class="table table-bordered table-striped ">
          <tbody v-if="list.length > 0">
            <tr>
              <th>供应商名称</th>
              <th>供应商地址</th>
              <th>法人</th>
              <th>开户行</th>
              <th>银行账号</th>
              <th>税号</th>
              <th>操作</th>
            </tr>
            <tr v-for="(item, index) in list" :key="index">
              <td>{{ item.name }}</td>
              <td>{{ item.address }}</td>
              <td>{{ item.legal_person }}</td>
              <td>{{ item.bank }}</td>
              <td>{{ item.card_account }}</td>
              <td>{{ item.taxes_no }}</td>
              <td>
                <b-button variant="primary" style="color:white; margin-right:5px;" @click="openAlert('update', index)">修&nbsp;&nbsp;改</b-button>
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
    <b-modal id="toAdd" title="添加供应商" ref="toAdd" hide-footer>
      <div style="margin-bottom: 7px;">所属人:</div>
      <el-select class="marginBot" style="height:40px !important" v-model="form.login_id" filterable placeholder="请选择所属员工">
        <el-option v-for="(user, index) in userList" :key="index" :label="user.user_name" :value="user.login_id"></el-option>
      </el-select>
      <div style="margin-bottom: 7px;">供应商名称:</div>
      <b-form-input v-model="form.name"></b-form-input>
      <div style="margin-bottom: 7px;">地址:</div>
      <b-form-input v-model="form.address"></b-form-input>
      <div style="margin-bottom: 7px;">法人:</div>
      <b-form-input v-model="form.legal_person"></b-form-input>
      <div style="margin-bottom: 7px;">联系电话:</div>
      <b-form-input v-model="form.tel"></b-form-input>
      <div style="margin-bottom: 7px;">开户行:</div>
      <b-form-input v-model="form.bank"></b-form-input>
      <div style="margin-bottom: 7px;">银行账号:</div>
      <b-form-input v-model="form.card_account"></b-form-input>
      <div style="margin-bottom: 7px;">税号:</div>
      <b-form-input v-model="form.taxes_no"></b-form-input>
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
      ></b-modal
    >

    <b-modal id="deleteAlert" title="确认删除" ref="deleteAlert" hide-footer no-close-on-esc no-close-on-backdrop hide-header-close>
      <div class="d-block text-center">
        <b-alert variant="danger" show>删除供应商可能会影响您的管理,确认删除吗?</b-alert>
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
    <b-modal id="updateAlert" title="修改供应商" ref="updateAlert" hide-footer no-close-on-esc no-close-on-backdrop hide-header-close>
      <div class="d-block">
        <div class="row">
          <div class="col-lg-12 marginBot4">
            <p class="marginBot4">所属人</p>
            <el-select class="marginBot" style="height:40px !important" v-model="updateForm.login_id" filterable placeholder="请选择所属员工">
              <el-option v-for="(user, index) in userList" :key="index" :label="user.user_name" :value="user.login_id"></el-option>
            </el-select>
          </div>
          <div class="col-lg-12 marginBot4">
            <p class="marginBot4">供应商名称</p>
            <b-form-input v-model="updateForm.name"></b-form-input>
          </div>
          <div class="col-lg-12 marginBot4">
            <p class="marginBot4">地址</p>
            <b-form-input v-model="updateForm.address"></b-form-input>
          </div>
          <div class="col-lg-12 marginBot4">
            <p class="marginBot4">法人</p>
            <b-form-input v-model="updateForm.legal_person"></b-form-input>
          </div>
          <div class="col-lg-12 marginBot4">
            <p class="marginBot4">联系电话</p>
            <b-form-input v-model="updateForm.tel"></b-form-input>
          </div>
          <div class="col-lg-12 marginBot4">
            <p class="marginBot4">开户行</p>
            <b-form-input v-model="updateForm.bank"></b-form-input>
          </div>
          <div class="col-lg-12 marginBot4">
            <p class="marginBot4">银行账号</p>
            <b-form-input v-model="updateForm.card_account"></b-form-input>
          </div>
          <div class="col-lg-12 marginBot4">
            <p class="marginBot4">税号</p>
            <b-form-input v-model="updateForm.taxes_no"></b-form-input>
          </div>
          <div class="col-lg-12 marginBot4">
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
      </div></b-modal
    >
    <!-- klklklkl -->
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Validator from 'async-validator';
import entrance from '@/components/entrance.vue';
import exportExcel from '@/components/exportExcel.vue';

import _ from 'lodash';
export default {
  name: 'supplier',
  metaInfo: {
    title: '供应商管理',
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
      value1: '',
      select_client_name: '',
      lzValidator: new Validator({
        name: { type: 'string', required: true, message: '请填写供应商名称' },
        address: { type: 'string', required: true, message: '请填写地址' },
        legal_person: { type: 'string', required: true, message: '请填写法人' },
        bank: { type: 'string', required: true, message: '请填写开户行' },
        card_account: { type: 'string', required: true, message: '请填写银行账号' },
        taxes_no: { type: 'string', required: true, message: '请填写税号' },
      }),
      th: ['供应商名称', '地址', '法人', '开户行', '银行账号', '税号'],
      filterVal: ['name', 'address', 'legal_person', 'bank', 'card_account', 'taxes_no'],
      is_title_search: false, //是否是模糊查询： true：是模糊查询； false： 不是模糊查询
      countNum: 0,
    };
  },
  computed: {
    ...mapState({
      limit: state => state.publics.limit,
      clientList: state => state.self.clientList,
      userList: state => state.system.userList,
    }),
  },
  async created() {
    this.search();
    await this.getUserList({ skip: 0, limit: 10000 });
  },
  watch: {
    is_title_search: {
      handler(nV, oV) {
        this.$set(this, 'currentPage', 1);
        if (nV) {
          this.titlesearch();
        } else {
          this.search();
        }
      },
    },
  },
  methods: {
    ...mapActions(['getClientList', 'getClientListLike', 'addClientlist', 'clientOperation', 'getUserList']),
    //分页
    toSearch(currentPage) {
      this.currentPage = currentPage;
      if (this.is_title_search) {
        this.titlesearch();
      } else {
        this.search();
      }
    },
    //查询
    async search() {
      if (this.is_title_search) {
        this.is_title_search = false;
        return;
      }
      let skip = (this.currentPage - 1) * this.limit;
      let totalRow = await this.getClientList({ skip: skip, limit: this.limit, type: '1' });
      this.$set(this, 'list', this.clientList);
      this.$set(this, 'totalRow', totalRow);
    },
    //模糊查询的方法
    async titlesearch() {
      if (!this.is_title_search) {
        this.is_title_search = true;
        return;
      }
      let skip = (this.currentPage - 1) * this.limit;
      let totalRow = await this.getClientListLike({
        skip: skip,
        limit: this.limit,
        type: '1',
        select_client_name: this.select_client_name,
      });
      this.$set(this, 'list', this.clientList);
      this.$set(this, 'totalRow', totalRow);
    },
    //模糊查询按钮
    async searchButton() {
      this.currentPage = 1;
      if (!this.is_title_search) {
        this.is_title_search = true;
        return;
      }
      let skip = 0;
      let totalRow = await this.getClientListLike({
        skip: skip,
        limit: this.limit,
        type: '1',
        select_client_name: this.select_client_name,
      });
      this.$set(this, 'list', this.clientList);
      this.$set(this, 'totalRow', totalRow);
    },
    //修改
    async update() {
      this.updateForm.type = '1';
      await this.clientOperation({ type: 'update', data: this.updateForm });
      this.updateForm = {};
      this.$refs.updateAlert.hide();
      this.search();
    },
    //删除
    async toDelete() {
      await this.clientOperation({ type: 'delete', data: this.deleteItem });
      this.search();
      this.deleteItem = '';
      this.$refs.deleteAlert.hide();
    },
    //添加
    async add() {
      this.form.type = '1';
      await this.addClientlist({ data: this.form });
      this.form = {};
      this.$refs.toAdd.hide();
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
        this.$refs.updateAlert.show();
        this.updateForm = JSON.parse(JSON.stringify(this.list[id]));
      } else if (type === 'delete') {
        this.$refs.deleteAlert.show();
        this.operateId = id;
      }
    },
    closeAlert(type) {
      if (type === 'update') {
        this.$refs.updateAlert.hide();
      } else if (type === 'delete') {
        this.$refs.deleteAlert.hide();
      }
      this.operateId = '';
      this.updateForm = {};
    },
    //验证,因为添加和修改的验证内容都是一样的,所以用一个方法
    toValidate(type) {
      if (type === 'add') {
        this.lzValidator.validate(this.form, (errors, fields) => {
          if (errors) {
            return this.handleErrors(errors, fields);
          }
          return this.add();
        });
      } else {
        this.lzValidator.validate(this.updateForm, (errors, fields) => {
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
@import '../../../assets/style/Font-Awesome-master/css/font-awesome.css';
@import '../../../assets/style/layout/base-Layout-bootstrap.css';
@import '../../../assets/style/base-style-bootstrap.css';
</style>
