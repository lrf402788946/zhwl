<template lang="html">
  <div id="user">
    <!-- 表格 begin -->
    <div class="base-form">
      <div class="form-inline">
        <div class="base-form-title" style="width:100%;">
          <a class="base-margin-left-20">车辆明细列表</a>
          <div class="button-table"></div>
        </div>
      </div>
      <div class="base-padding-20 base-bg-fff">
        <div class="row">
          <div class="col-lg-2 mb25 ml2Mix plr0 lh44">车牌号查询:</div>
          <div class="col-lg-3 mb25 pll0">
            <b-form-input v-model="select_car_no" placeholder="请输入车牌号" style="width:200px,margin-left:50px"></b-form-input>
          </div>
          <div class="col-lg-2 mb25">
            <b-button variant="primary" style="font-size:14px !important; color:#fff !important; padding: 6px 12px !important;" @click="searchButton()"
              ><i class="base-margin-right-5 fa fa-search"></i>点击查询</b-button
            >
          </div>
        </div>

        <div class="base-align-right" style="margin-bottom: 20px;">
          <a
            class="btn btn-info base-margin-bottom"
            style="font-size:14px !important; color:#fff !important; padding: 6px 12px !important;"
            data-toggle="tooltip"
            title=""
            role="button"
            v-b-modal="'addAlert'"
          >
            <i class="base-margin-right-5 fa fa-plus-square"></i>添加车辆明细
          </a>
        </div>

        <table class="table table-bordered table-striped ">
          <tbody v-if="list.length > 0">
            <tr>
              <th>单号</th>
              <th>车牌号</th>
              <th>支出/收入的钱</th>
              <th>操作</th>
            </tr>
            <tr v-for="(item, index) in list" :key="index">
              <td>{{ item.order_no }}</td>
              <td>{{ item.car_no }}</td>
              <td>{{ item.money }}</td>
              <td>
                <b-button variant="primary" style="color:white; margin-right:5px;" @click="openAlert('update', index)">详&nbsp;&nbsp;情</b-button>
                <b-button variant="danger" style="color:white;" @click="openAlert('delete', item.id)">删&nbsp;&nbsp;除</b-button>
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
          style="text-align: right;"
          prev-text="上一页"
          next-text="下一页"
          :current-page="currentPage"
          @current-change="toSearch"
          :total="totalRow"
        ></el-pagination>
      </div>
    </div>
    <!--添加弹框-->
    <b-modal id="addAlert" title="添加车辆明细" ref="addAlert" hide-footer no-close-on-backdrop>
      <div class="d-block text-center">
        <div class="row">
          <div class="col-lg-6">
            <b-form-input v-model="addForm.order_no" placeholder="单号" class="marginBot"></b-form-input>
          </div>
          <div class="col-lg-6">
            <b-form-input v-model="addForm.car_no" placeholder="车号" class="marginBot"></b-form-input>
          </div>
          <div class="col-lg-6">
            <b-form-input v-model="addForm.money" placeholder="金额" class="marginBot"></b-form-input>
          </div>
          <div class="col-lg-6">
            <b-form-input v-model="addForm.content" placeholder="内容" class="marginBot"></b-form-input>
          </div>
          <div class="col-lg-6">
            <el-date-picker style="width: 100%;" v-model="addForm.create_time" placeholder="日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd" type="date">
            </el-date-picker>
          </div>
        </div>
      </div>
      <b-button
        variant="secondary"
        @click="addForm = {}"
        class="resetButton"
        style="font-size:16px !important; margin-top:25px; padding:6px 80px !important;margin-bottom:30px !important;margin-right:0 !important;"
        >重&nbsp;&nbsp;置</b-button
      >
      <b-button
        variant="primary"
        @click="toValidate('add')"
        class="resetButton"
        style="font-size:16px !important; margin-top:25px; float:right; padding:6px 80px !important;margin-bottom:30px !important;margin-right:0 !important;"
        >保&nbsp;&nbsp;存</b-button
      ></b-modal
    >
    <!--修改弹框-->
    <b-modal id="updateAlert" title="修改信息" ref="updateAlert" hide-footer no-close-on-esc no-close-on-backdrop hide-header-close>
      <div class="d-block">
        <div class="row">
          <div class="col-lg-6 marginBot4">
            <p class="marginBot4">单号</p>
            <b-form-input v-model="updateForm.order_no" :disabled="is_update"></b-form-input>
          </div>
          <div class="col-lg-6 marginBot4">
            <p class="marginBot4">车号</p>
            <b-form-input v-model="updateForm.car_no" :disabled="is_update"></b-form-input>
          </div>
          <div class="col-lg-6 marginBot4">
            <p class="marginBot4">内容</p>
            <b-form-input v-model="updateForm.content" :disabled="is_update"></b-form-input>
          </div>
          <div class="col-lg-6 marginBot4">
            <p class="marginBot4">金额</p>
            <b-form-input v-model="updateForm.money" :disabled="is_update"></b-form-input>
          </div>
          <div class="col-lg-6 marginBot4">
            <p class="marginBot4">日期</p>
            <el-date-picker
              style="width: 100%;"
              v-model="updateForm.create_time"
              placeholder="日期"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="date"
              :disabled="is_update"
            >
            </el-date-picker>
          </div>
        </div>
      </div>
      <b-button
        variant="secondary"
        @click="closeAlert('update')"
        class="resetButton"
        style="font-size:16px !important; margin-top:25px;  padding:6px 80px !important;margin-bottom:30px !important;margin-right:0 !important;"
        >返&nbsp;&nbsp;回</b-button
      >
      <b-button
        v-if="is_update"
        variant="primary"
        @click="is_update = false"
        class="resetButton"
        style="font-size:16px !important; margin-top:25px; float:right; padding:6px 80px !important;margin-bottom:30px !important;margin-right:0 !important;"
        >修&nbsp;&nbsp;改</b-button
      >
      <b-button
        v-if="!is_update"
        variant="primary"
        @click="toValidate('update')"
        class="resetButton"
        style="font-size:16px !important; margin-top:25px; float:right; padding:6px 80px !important;margin-bottom:30px !important;margin-right:0 !important;"
        >保&nbsp;&nbsp;存</b-button
      >
    </b-modal>
    <!--删除弹框-->
    <b-modal id="deleteAlert" title="确认删除" ref="deleteAlert" hide-footer no-close-on-esc no-close-on-backdrop hide-header-close>
      <div class="d-block text-center">
        <b-alert variant="danger" show>删除此条车辆明细可能会影响您的管理,确认删除吗?</b-alert>
      </div>
      <b-button
        variant="danger"
        style="font-size:16px !important; margin-top:25px; padding:6px 80px !important;margin-bottom:30px !important;margin-right:0 !important;"
        @click="toDelete()"
        >删&nbsp;&nbsp;除</b-button
      >
      <b-button
        variant="primary"
        style="font-size:16px !important; margin-top:25px; float:right; padding:6px 80px !important;margin-bottom:30px !important;margin-right:0 !important;"
        class="resetButton"
        @click="closeAlert('delete'), $refs.deleteAlert.hide(), (deleteItem = '')"
        >返&nbsp;&nbsp;回</b-button
      >
    </b-modal>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Validator from 'async-validator';
export default {
  name: 'user',
  metaInfo: {
    title: '车辆明细列表',
  },
  components: {},
  data() {
    return {
      select_car_no: '',
      is_title_search: false, //是否是模糊查询： true：是模糊查询； false： 不是模糊查询
      skip: 0,
      countNum: 0,
      list: [],
      is_update: true,
      addForm: {},
      updateForm: {},
      operateId: {},
      currentPage: 1,
      totalRow: 0,
      addUserValidator: new Validator({
        order_no: [{ required: true, message: '请填写单号' }],
        car_no: [{ type: 'string', required: true, message: '请填写车号' }],
        content: [{ type: 'string', required: true, message: '请填写支出内容' }],
        money: [{ required: true, message: '请填写金额' }],
        create_time: [{ required: true, message: '请填选择日期' }],
      }),
      updateUserValidator: new Validator({
        order_no: [{ required: true, message: '请填写单号' }],
        car_no: [{ type: 'string', required: true, message: '请填写车号' }],
        content: [{ type: 'string', required: true, message: '请填写支出内容' }],
        money: [{ required: true, message: '请填写金额' }],
        create_time: [{ required: true, message: '请填选择日期' }],
      }),
    };
  },
  async created() {
    await this.search();
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
  computed: {
    ...mapState({
      limit: state => state.publics.limit,
      carDetailList: state => state.self.carDetailList,
    }),
  },
  methods: {
    ...mapActions(['getCarDetailList', 'carDetailOperation']),
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
      let totalRow = await this.getCarDetailList({ skip: skip, limit: this.limit });

      this.$set(this, 'list', this.carDetailList);
      this.$set(this, 'totalRow', totalRow);
    },
    //验证,因为添加和修改内容不一致,所以需要分2个验证器去分别验证
    toValidate(type) {
      if (type === 'add') {
        this.addUserValidator.validate(this.addForm, (errors, fields) => {
          if (errors) {
            return this.handleErrors(errors, fields);
          }
          return this.add();
        });
      } else {
        this.updateUserValidator.validate(this.updateForm, (errors, fields) => {
          if (errors) {
            return this.handleErrors(errors, fields);
          }
          return this.update();
        });
      }
    },
    //添加
    async add() {
      delete this.updateForm.car_onwer;
      await this.carDetailOperation({ type: 'carDetailSave', data: this.addForm });
      this.$refs.addAlert.hide();
      this.addForm = {};
      this.search();
    },
    //修改
    async update() {
      delete this.updateForm.car_onwer;
      await this.carDetailOperation({ type: 'carDetailEdit', data: this.updateForm });
      this.closeAlert('update');
      this.updateForm = {};
      this.is_update = true;
      this.search();
    },
    //删除
    async toDelete() {
      await this.carDetailOperation({ type: 'carDetailDelete', data: this.operateId });
      this.closeAlert('delete');
      this.search();
    },
    //打开与关闭修改和删除的弹框,现在关闭添加弹框自己点x
    openAlert(type, id) {
      if (type === 'update') {
        this.$refs.updateAlert.show();
        this.updateForm = JSON.parse(JSON.stringify(this.list[id]));
      } else if (type === 'delete') {
        this.$refs.deleteAlert.show();
        this.operateId = id;
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
      this.updateForm = {};
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
    //模糊查询按钮
    async searchButton() {
      this.currentPage = 1;
      if (!this.is_title_search) {
        this.is_title_search = true;
        return;
      }
      let skip = 0;
      let result = await this.$axios.get(`/api/car/car_daily_detail_list?skip=${skip}&limit=${this.limit}&car_no=${this.select_car_no}`);
      if (result.msg === '成功') {
        this.$set(this, 'list', result.carDetailList);
        this.$set(this, 'totalRow', result.totalRow);
      }
      if (result.msg === '没有数据') {
        this.list = '';
        this.totalRow = 0;
      }
    },
    //模糊查询的方法
    async titlesearch() {
      if (!this.is_title_search) {
        this.is_title_search = true;
        return;
      }
      let skip = (this.currentPage - 1) * this.limit;
      let result = await this.$axios.get(`/api/car/car_daily_detail_list?skip=${skip}&limit=${this.limit}&car_no=${this.select_car_no}`);
      if (result.msg === '成功') {
        this.$set(this, 'list', result.carDetailList);
        this.$set(this, 'totalRow', result.totalRow);
      }
      if (result.msg === '没有数据') {
        this.list = '';
        this.totalRow = 0;
      }
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
.lh44 {
  text-align: left;
  line-height: 35px;
}
.ml2Mix {
  max-width: 10% !important;
}
.ml13Mix {
  max-width: 13%;
}
.pll0 {
  padding-left: 0 !important;
}
.plr0 {
  padding-right: 0 !important;
}
.btn-primary,
.btn-info {
  background-color: #5bc0de !important;
}
.btn-primary:hover,
.btn-info:hover {
  cursor: pointer !important;
  background-color: #17a2b8 !important;
}
.el-pagination button,
.el-pagination span:not {
  padding: 0 8px !important;
}
</style>
<style scoped>
@import '../../../assets/style/Font-Awesome-master/css/font-awesome.css';
@import '../../../assets/style/layout/base-Layout-bootstrap.css';
@import '../../../assets/style/base-style-bootstrap.css';
</style>
