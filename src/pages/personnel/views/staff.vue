<template lang="html">
  <div id="staff">
    <!-- 表格 begin -->
    <div class="base-form">
      <div class="form-inline">
        <div class="base-form-title" style="width:100%;">
          <a class="base-margin-left-20">员工列表</a>
          <div class="button-table"></div>
        </div>
      </div>
      <div class="base-padding-20 base-bg-fff">
        <table>
          <tr>
            <td>员工姓名查询:</td>
            <td>员工工号查询:</td>
          </tr>
          <tr>
            <td>
              <b-form-input v-model="select_staff_name" placeholder="输入员工姓名" style="width:200px,margin-left:50px"></b-form-input>
            </td>
            <td>
              <b-form-input v-model="select_staff_job_num" placeholder="输入员工工号" style="width:200px,margin-left:50px"></b-form-input>
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
            <i class="base-margin-right-5 fa fa-plus-square" style=" color:#fff !important;"></i>添加员工
          </a>
          <!-- 导入表格 -->
          <entrance @research="search"></entrance>
        </div>
        <div style="margin:10px 0;">
          <!-- 导出表格 -->
          <exportExcel :exportTitle="th" :db_nameList="filterVal" dataName="list" fileName="员工表"></exportExcel>
        </div>
        <table class="table table-bordered table-striped ">
          <tbody v-if="list.length > 0">
            <tr>
              <th>工号</th>
              <th>员工姓名</th>
              <th>性别</th>
              <th>电话</th>
              <th>家庭住址</th>
              <th>出生日期</th>
              <th>身份证号</th>
              <th>部门</th>
              <th>岗位</th>
              <th>在职状态:0 在职;1 离职;2 退休</th>
              <th>操作</th>
            </tr>
            <tr v-for="(item, index) in list" :key="index">
              <td>{{ item.job_num }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.gender === 1 ? '男' : '女' }}</td>
              <td>{{ item.phone_no }}</td>
              <td>{{ item.home_address }}</td>
              <td>{{ item.birthday }}</td>
              <td>{{ item.id_number }}</td>
              <td>{{ { data: deptList, searchItem: 'value', value: item.dept_id, label: 'text' } | getName }}</td>
              <td>{{ { data: postList, searchItem: 'value', value: item.post_id, label: 'text' } | getName }}</td>
              <td>{{ item.status === 0 ? '在职' : item.status === 1 ? '离职' : '退休' }}</td>
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
    <b-modal id="toAdd" title="添加员工" ref="toAdd" hide-footer>
      <div style="margin-bottom: 7px;">工号:</div>
      <b-form-input v-model="form.job_num"></b-form-input>
      <div style="margin-bottom: 7px;">姓名:</div>
      <b-form-input v-model="form.name"></b-form-input>
      <div style="margin-bottom: 7px;">性别:</div>
      <b-form-select v-model="form.gender" :options="gender" class="marginBot" />
      <div style="margin-bottom: 7px;">电话:</div>
      <b-form-input v-model="form.phone_no"></b-form-input>
      <div style="margin-bottom: 7px;">家庭住址:</div>
      <b-form-input v-model="form.home_address"></b-form-input>
      <div style="margin-bottom: 7px;">出生日期:</div>
      <el-date-picker
        style="width:100%;"
        v-model="form.birthday"
        type="date"
        placeholder="出生日期"
        value-format="yyyy-MM-dd"
        format="yyyy-MM-dd"
      ></el-date-picker>
      <div style="margin-bottom: 7px;">身份证号:</div>
      <b-form-input v-model="form.id_number"></b-form-input>
      <div style="margin-bottom: 7px;">部门 id:</div>
      <b-form-select v-model="form.dept_id" :options="deptList" class="marginBot" />
      <div style="margin-bottom: 7px;">岗位 id:</div>
      <b-form-select v-model="form.post_id" placeholder="岗位" :options="postList" class="marginBot" />
      <div style="margin-bottom: 7px;">在职状态:0 在职;1 离职;2 退休:</div>
      <b-form-select v-model="form.status" :options="status" class="marginBot" />
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
        <b-alert variant="danger" show>删除员工可能会影响您的管理,确认删除吗?</b-alert>
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
    <b-modal id="updateAlert" title="修改员工" ref="updateAlert" hide-footer no-close-on-esc no-close-on-backdrop hide-header-close>
      <div class="d-block">
        <div class="row">
          <div class="col-lg-12 marginBot4">
            <p class="marginBot4">工号</p>
            <b-form-input v-model="updateForm.job_num"></b-form-input>
          </div>
          <div class="col-lg-12 marginBot4">
            <p class="marginBot4">姓名</p>
            <b-form-input v-model="updateForm.name"></b-form-input>
          </div>
          <div class="col-lg-12 marginBot4">
            <p class="marginBot4">性别</p>
            <b-form-select v-model="updateForm.gender" :options="gender" class="marginBot" />
          </div>
          <div class="col-lg-12 marginBot4">
            <p class="marginBot4">电话</p>
            <b-form-input v-model="updateForm.phone_no"></b-form-input>
          </div>
          <div class="col-lg-12 marginBot4">
            <p class="marginBot4">家庭住址</p>
            <b-form-input v-model="updateForm.home_address"></b-form-input>
          </div>
          <div class="col-lg-12 marginBot4">
            <p class="marginBot4">出生日期</p>
            <el-date-picker
              style="width:100%;"
              v-model="updateForm.birthday"
              type="date"
              placeholder="出生日期"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
            ></el-date-picker>
          </div>
          <div class="col-lg-12 marginBot4">
            <p class="marginBot4">身份证号</p>
            <b-form-input v-model="updateForm.id_number"></b-form-input>
          </div>
          <div class="col-lg-12 marginBot4">
            <p class="marginBot4">部门 id</p>
            <b-form-select v-model="updateForm.dept_id" :options="deptList" class="marginBot" />
          </div>
          <div class="col-lg-12 marginBot4">
            <p class="marginBot4">岗位 id</p>
            <b-form-select v-model="updateForm.post_id" placeholder="岗位" :options="postList" class="marginBot" />
          </div>
          <div class="col-lg-12 marginBot4">
            <p class="marginBot4">在职状态:0 在职;1 离职;2 退休</p>
            <b-form-select v-model="updateForm.status" :options="status" class="marginBot" />
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
  name: 'staff',
  metaInfo: {
    title: '员工管理',
  },
  components: {
    entrance,
    exportExcel,
  },
  data() {
    return {
      deptList: [],
      postList: [],
      list: [],
      form: {},
      deleteItem: '',
      updateForm: {},
      gender: [{ text: '请选择性别', value: null, disabled: true }, { text: '男', value: 1 }, { text: '女', value: 0 }],
      status: [{ text: '工作状态', value: null, disabled: true }, { text: '在职', value: 0 }, { text: '离职', value: 1 }, { text: '退休', value: 2 }],
      currentPage: 1,
      totalRow: 0,
      value1: '',
      select_staff_name: '',
      select_staff_job_num: '',
      lzValidator: new Validator({
        // type: { type: 'string', required: true, message: '请填写型号' },
        // num: { required: true, message: '请填写数量' },
        // create_date: { type: 'string', required: true, message: '请选择创建日期' },
      }),
      th: ['员工名称', '地址', '法人', '手机/固话(0431-8xxxxxxx)', '传真', '税号', '银行卡号', '银行账号'],
      filterVal: ['name', 'address', 'legal_person', 'tel', 'fex', 'taxes_no', 'card_no', 'card_account'],
      is_title_search: false, //是否是模糊查询： true：是模糊查询； false： 不是模糊查询
      countNum: 0,
    };
  },
  computed: {
    ...mapState({
      skip: state => state.self.skip,
      limit: state => state.publics.limit,
      staffList: state => state.self.staffList,
    }),
  },
  created() {
    this.search();
    this.getOtherList();
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
    ...mapActions(['getStaffList','getStaffListLike', 'addStafflist', 'staffOperation']),
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
      let totalRow = await this.getStaffList({ skip: skip, limit: this.limit });
      this.$set(this, 'list', this.staffList);
      this.$set(this, 'totalRow', totalRow);
    },
    //模糊查询的方法
    async titlesearch() {
      if (!this.is_title_search) {
        this.is_title_search = true;
        return;
      }
      let skip = (this.currentPage - 1) * this.limit;
      let totalRow = await this.getStaffListLike({
        skip: skip,
        limit: this.limit,
        select_staff_name: this.select_staff_name,
        select_staff_job_num: this.select_staff_job_num,
      });
      this.$set(this, 'list', this.staffList);
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
      let totalRow = await this.getStaffListLike({
        skip: skip,
        limit: this.limit,
        select_staff_name: this.select_staff_name,
        select_staff_job_num: this.select_staff_job_num,
      });
      this.$set(this, 'list', this.staffList);
      this.$set(this, 'totalRow', totalRow);
    },
    //修改
    async update() {
      await this.staffOperation({type:'update',data: this.updateForm });
      this.updateForm = {};
      this.$refs.updateAlert.hide();
      this.search();
    },
    //删除
    async toDelete() {
      await this.staffOperation({ type: 'delete', data: this.deleteItem });
      this.search();
      this.deleteItem = '';
      this.$refs.deleteAlert.hide();
    },
    //添加
    async add() {
      await this.addStafflist({data: this.form });
      this.form = {};
      this.$refs.toAdd.hide();
      this.search();
    },
    //请求各表
    async getOtherList() {
      //请求部门表
      let result = await this.$axios.get('/zhwl/dept/dept_list?skip=0&limit=100');
      this.deptList = result.deptList.map(item => {
        let newObject = { text: item.dept_name, value: item.id };
        return newObject;
      });
      let defalut = { text: '请选择部门', value: null, disabled: true };
      this.deptList.unshift(defalut);
      //请求岗位表
      result = await this.$axios.get('/zhwl/post/post_list?skip=0&limit=100');
      this.postList = result.postList.map(item => {
        let newObject = { text: item.name, value: item.id };
        return newObject;
      });
      defalut = { text: '请选择岗位', value: null, disabled: true };
      this.postList.unshift(defalut);
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
