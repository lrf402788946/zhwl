<template lang="html">
  <div id="transport">
    <!-- 表格 begin -->
    <div class="base-form">
      <div class="form-inline">
        <div class="base-form-title" style="width:100%;">
          <a class="base-margin-left-20">签收管理</a>
          <div class="button-table"></div>
        </div>
      </div>
      <div class="base-padding-20 base-bg-fff">
        <div>
          <div class="row" style="margin-bottom: 15px !important;">
            <div class="col-lg-3 marginBot4">
              <p class="marginBot4">查询运输单号:</p>
              <b-form-input v-model="select_transport_no" placeholder="输入运输单号"></b-form-input>
            </div>
            <div class="col-lg-4 marginBot4">
              <p class="marginBot4">日期查询:</p>
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
          <!-- <tbody v-if="transportList.length > 0"> -->
          <tr>
            <th>运输单号</th>
            <th>发货时间</th>
            <th>运输内容</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
          <tr v-for="(item, index) in transportList" :key="index">
            <td>{{ item.transport_no }}</td>
            <td>{{ item.send_time }}</td>
            <td>{{ item.content }}</td>
            <td>{{ item.status | getStatus }}</td>
            <td>
              <b-button variant="primary" style="color:white; margin-right:5px;" @click="openAlert('update', index)">详&nbsp;&nbsp;情</b-button>
              <b-button variant="success" style="color:white; margin-right:5px;" @click="openAlert('sign', item.id)" v-if="item.status !== 2"
                >签&nbsp;&nbsp;收</b-button
              >
              <b-button v-if="!(item.status === 2)" variant="danger" style="color:white;" @click="openAlert('delete', item.id)">删&nbsp;&nbsp;除</b-button>
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
    <el-dialog :visible.sync="dialogDetail" title="运输详情" width="90%" close-on-click-modal close-on-press-escape center>
      <div class="d-block text-center">
        <div class="row">
          <div class="col-lg-4 mb25">
            <div class="lh44">运输单号：</div>
            <b-form-input v-model="updateForm.transport_no" :disabled="true" placeholder="车牌号"></b-form-input>
          </div>
          <div class="col-lg-4 mb25">
            <div class="lh44">发货日期：</div>
            <el-date-picker
              style="width: 100%;"
              :disabled="true"
              v-model="updateForm.send_time"
              placeholder="发货日期"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="date"
            >
            </el-date-picker>
          </div>
          <!-- <div class="col-lg-4 mb25">
            <div class="lh44">线路：</div>
            <b-form-input v-model="updateForm.content" :disabled="true" filterable placeholder="请输入运输线路" />
          </div> -->
          <br />
          <table class="table table-btransported table-striped ">
            <tbody>
              <tr>
                <td>订单号</td>
                <td>货物名称</td>
                <!-- <td>状态</td> -->
                <!-- <td>操作</td> -->
              </tr>
              <tr v-for="(item, index) in subForm" :key="index">
                <td>{{ item.order_no }}</td>
                <td>{{ item.goods_name }}</td>
                <!-- <td>{{ item.status === 1 ? '未到达' : '已到达' }}</td> -->
                <!-- <td>
                  <el-button v-if="item.status === 1" type="primary" icon="el-icon-edit" @click="openAlert('sign', item.id)">签收</el-button>
                  <p v-else>已签收</p>
                </td> -->
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <b-button
        v-if="is_update && updateForm.status === 1"
        variant="primary"
        @click="is_update = false"
        class="resetButton"
        style="font-size:16px !important; margin:10px 5% 30px 5% !important; background-color: #17a2b8 !important;  width:30% !important; padding:6px 80px !important;"
        >修&nbsp;&nbsp;改</b-button
      >
      <!-- <b-button
        variant="primary"
        @click="exportExcel()"
        class="resetButton"
        style="font-size:16px !important; margin:10px 5% 30px 5% !important; background-color: #17a2b8 !important;  width:30% !important; padding:6px 80px !important;"
        >导&nbsp;&nbsp;出</b-button
      > -->
      <b-button
        v-if="!is_update"
        variant="primary"
        @click="toValidate('update')"
        class="resetButton"
        style="font-size:16px !important; margin:10px 5% 30px 5% !important; background-color: #17a2b8 !important;  width:30% !important; padding:6px 80px !important;"
        >保&nbsp;&nbsp;存</b-button
      >
      <b-button
        variant="secondary"
        @click="closeAlert('update')"
        class="resetButton"
        style="font-size:16px !important; margin:10px 5% 30px 5% !important; background-color: #ccc !important;  width:30% !important; padding:6px 80px !important;"
        >返&nbsp;&nbsp;回</b-button
      >
    </el-dialog>
    <!--删除弹框-->
    <b-modal id="deleteAlert" title="确认删除" ref="deleteAlert" hide-footer no-close-on-esc no-close-on-backdrop hide-header-close>
      <div class="d-block text-center">
        <b-alert variant="danger" show>删除订单可能会有严重影响,确认删除吗?</b-alert>
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
        @click="closeAlert('delete')"
        >返&nbsp;&nbsp;回</b-button
      >
    </b-modal>

    <el-dialog title="签收" :visible.sync="dialogSign" width="50%" close-on-click-modal close-on-press-escape center>
      <div class="row">
        <div class="col-lg-12 mb25">
          <div class="lh44">签收人：</div>
          <b-form-input v-model="signForm.sign_name" placeholder="请填写签收人"></b-form-input>
        </div>
        <div class="col-lg-12 mb25">
          <div class="lh44">签收日期：</div>
          <el-date-picker
            style="width: 100%;"
            v-model="signForm.sign_time"
            placeholder="请选择签收日期"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            type="date"
          >
          </el-date-picker>
        </div>
      </div>
      <b-button
        variant="success"
        style="font-size:16px !important; margin-top:25px; padding:6px 80px !important;margin-bottom:30px !important;margin-right:0 !important;"
        @click="toValidate('sign')"
        >签&nbsp;&nbsp;收</b-button
      >
      <b-button
        variant="primary"
        style="font-size:16px !important; margin-top:25px; float:right; padding:6px 80px !important;margin-bottom:30px !important;margin-right:0 !important;"
        class="resetButton"
        @click="closeAlert('sign')"
        >返&nbsp;&nbsp;回</b-button
      >
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Validator from 'async-validator';
import _ from 'lodash';
//import exportExcel from '@/components/exportExcel.vue';
export default {
  name: 'transport',
  metaInfo: {
    title: '签收管理',
  },
  data() {
    return {
      list: [],
      subForm: [],
      signForm: {},
      is_update: true,
      operateId: '',
      currentPage: 1,
      totalRow: 0,
      form: {},
      updateForm: {},
      mainValidator: new Validator({
        // op: [{ required: true, message: '请填写操作人' }],
      }),
      signValidator: new Validator({
        sign_name: { required: true, message: '请填写签收人' },
        sign_time: { required: true, message: '请选择签收日期' },
      }),
      th: ['订单号', '订单人', '订单日期', '备注'],
      filterVal: ['transport_no', 'user_name', 'in_date', 'remark'],
      select_transport_no: '',
      select_car_no: '',
      select_driver_id: '',
      select_in_date: [],
      chooseStatus: [
        // { text: '待发', value: '0' },
        { text: '装车', value: '1' },
        { text: '到达', value: '2' },
        // { text: '支付完成', value: '3' },
        // { text: '收款完成', value: '4' },
      ],
      dialogDetail: false,
      dialogSign: false,
    };
  },
  watch: {},
  computed: {
    ...mapState({
      limit: state => state.publics.limit,
      userInfo: state => state.publics.userInfo,
      transportList: state => state.self.transportList,
      transportSubListVuex: state => state.self.transportSubList,
      dlyWayList: state => state.self.dlyWayList,
      driverList: state => state.personnel.driverList,
    }),
  },
  async created() {
    this.search();
    await this.getdly_wayList({ skip: 0, limit: 10000 });
    await this.getDriverList({ skip: 0, limit: 10000 });
    await this.getCarList({ skip: 0, limit: 10000 });
  },
  methods: {
    ...mapActions([
      'getTransportList',
      'getTransportSubList',
      'getTransportNo',
      'getdly_wayList',
      'transportSave',
      'transportEdit',
      'transportDelete',
      'getDriverList',
      'getCarList',
      'transporSelectOrder',
      'orderSign',
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
      let totalRow = await this.getTransportList({
        skip: skip,
        limit: this.limit,
        transport_no: this.select_transport_no,
        car_no: this.select_car_no,
        driver_id: this.select_driver_id,
        start_time: this.select_in_date === null ? '' : this.select_in_date.length > 0 ? this.select_in_date[0] : '',
        end_time: this.select_in_date === null ? '' : this.select_in_date.length > 0 ? this.select_in_date[1] : '',
      });
      this.$set(this, 'totalRow', totalRow);
    },
    //验证
    toValidate(type) {
      if (type === 'sign') {
        this.signValidator.validate(this.signForm, (errors, fields) => {
          if (errors) {
            return this.handleErrors(errors, fields);
          }
          return this.toSign();
        });
      }
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
        delete this.updateForm.drivername;
        await this.transportEdit({ form: this.updateForm, subForm: this.subForm });
        this.closeAlert('update');
        this.is_update = true;
        this.search();
      } catch (error) {
        console.error('error in line 504');
      }
    },
    //删除
    async toDelete() {
      try {
        await this.transportDelete({ id: this.operateId });
        this.closeAlert('delete');
        this.search();
      } catch (error) {
        console.error('error in line 517');
      }
    },
    //打开与关闭修改和删除的弹框
    async openAlert(type, id) {
      if (type === 'update') {
        // this.$refs.updateAlert.show();
        this.dialogDetail = true;
        this.updateForm = JSON.parse(JSON.stringify(this.transportList[id]));
        await this.getTransportSubList({ id: this.updateForm.id });
        this.$set(this, 'subForm', this.transportSubListVuex);
      } else if (type === 'delete') {
        this.$refs.deleteAlert.show();
        this.operateId = id;
      } else if (type === 'add') {
        this.form.login_id = this.userInfo.login_id;
        this.form.user_name = this.userInfo.user_name;
        this.addSubForm('open');
        this.$refs.addAlert.show();
      } else if (type === 'sign') {
        this.signForm['id'] = id;
        this.dialogSign = true;
      }
    },
    //关闭弹框
    closeAlert(type) {
      if (type === 'update') {
        this.dialogDetail = false;
      } else if (type === 'delete') {
        this.$refs.deleteAlert.hide();
      } else if (type === 'sign') {
        this.dialogSign = false;
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
    //添加字表数据
    addSubForm(type) {
      this.subForm.push({});
    },
    //签收
    async toSign() {
      await this.orderSign({ signForm: this.signForm });
      this.$set(this, 'subForm', this.transportSubListVuex);
      this.search();
      this.signForm = {};
      // this.dialogDetail = true;//现在一键签收,不需要开详情窗口
      this.dialogSign = false;
    },
    reset() {
      this.form.user_name = this.userInfo.user_name;
      this.form.login_id = this.userInfo.login_id;
    },
    //导出
    exportExcel() {
      var tableStr = `
                      <caption><b>订单单</b></caption>
                      <tr style="text-align:center;">
                        <th>订单号</th>
                        <th>操作人</th>
                        <th>客户</th>
                        <th>订单日期</th>
                        <th>操作时间</th>
                        <th>状态</th>
                        <th>备注</th>
                      </tr>
                      <tr style="text-align: center;">
                          <td>${this.updateForm.transport_num}&nbsp;</td>
                          <td>${this.updateForm.user_name}</td>
                          <td>${this.getName(this.updateForm.cus_id)}</td>
                          <td>${this.updateForm.in_date}</td>
                          <td>${this.updateForm.create_time}</td>
                          <td>${this.updateForm.status == '0' ? '未出库' : '已经出库'}</td>
                          <td>${this.updateForm.remark}</td>
                      </tr>
                      <tr></tr>
                      <tr style="text-align:center;">
                        <th>型号</th>
                        <th>数量</th>
                      </tr>`;
      for (let item of this.transportSubList) {
        tableStr += ` <tr style="text-align: center;">
                        <td>${item.code}</td>
                        <td>${item.num}</td>
                      </tr>`;
      }
      //Worksheet名
      var worksheet = 'Sheet1';
      var uri = 'data:application/vnd.ms-excel;base64,';
      // 真正要导出（下载）的HTML模板
      var exportTemplate = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" 
                      xmlns="http://www.w3.org/TR/REC-html40">
                          <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
                              <x:Name>${worksheet}</x:Name>
                                  <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
                              </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
                          </head>
                          <body>
                              <table btransport="1" cellspacing="0" cellpadding="0" syle="table-layout: fixed;word-wrap: break-word; word-break: break-all;">${tableStr}</table>
                          </body>
                      </html>`;
      //下载模板
      window.location.href = uri + this.base64(exportTemplate);
    },
    //输出base64编码
    base64(s) {
      return window.btoa(unescape(encodeURIComponent(s)));
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
