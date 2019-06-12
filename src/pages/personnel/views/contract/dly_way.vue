<template lang="html">
  <div id="role">
    <!-- 表格 begin -->
    <div class="base-form">
      <div class="form-inline">
        <div class="base-form-title" style="width:100%;">
          <a class="base-margin-left-20">项目: {{ itemName }}</a>
          <div class="button-table"></div>
        </div>
      </div>
      <div class="base-padding-20 base-bg-fff">
        <el-row>
          <el-col :span="21">&nbsp;</el-col>
          <el-col :span="3">
            <b-button
              @click="$router.go(-1)"
              variant="primary"
              style="font-size:14px !important; color:#efe !important; padding: 6px 12px !important;margin-bottom:2px !important;"
            >
              返回
            </b-button>
          </el-col>
        </el-row>
        <el-row style="margin-bottom:2%;">
          <el-col :span="18">
            <el-row>
              <el-col :span="6" class="searchInput">路线名称查询</el-col>
              <el-col :span="6" class="searchInput">起始地城市查询</el-col>
              <el-col :span="6" class="searchInput">目的地城市查询</el-col>
            </el-row>
            <el-row>
              <el-col :span="6" class="searchInput"><b-form-input v-model="searchInfo.name" placeholder="输入路线名称"></b-form-input></el-col>
              <el-col :span="6" class="searchInput"><b-form-input v-model="searchInfo.start_city" placeholder="输入起始地城市"></b-form-input></el-col>
              <el-col :span="6" class="searchInput"><b-form-input v-model="searchInfo.end_city" placeholder="输入目的地城市"></b-form-input></el-col>
            </el-row>
          </el-col>
          <el-col :span="6">
            <b-button
              variant="primary"
              style="font-size: 14px !important; color: rgb(255, 255, 255) !important; width: 60% !important; padding: 5px 10px !important; margin-top:28px; margin-right: 0px !important;"
              @click="search('vague')"
              >点击查询</b-button
            >
          </el-col>
        </el-row>
        <div class="base-align-right" style="margin-bottom:20px;">
          <a
            class="btn btn-info base-margin-bottom"
            data-toggle="tooltip"
            style="font-size:14px !important; color:#fff !important; padding: 6px 12px !important;"
            title=""
            role="button"
            @click="openAlert('add')"
          >
            <i class="base-margin-right-5 fa fa-plus-square"></i>添加路线
          </a>
        </div>
        <table class="table table-bordered table-striped ">
          <tbody v-if="list.length > 0">
            <tr>
              <th>路线名称</th>
              <th>起始地省份</th>
              <th>起始地城市</th>
              <th>起始站点</th>
              <th>目的地省份</th>
              <th>目的地城市</th>
              <th>目的站点</th>
              <th>操作</th>
            </tr>
            <tr v-for="(item, index) in list" :key="index">
              <td>{{ item.name }}</td>
              <td>{{ item.start_province }}</td>
              <td>{{ item.start_city }}</td>
              <td>{{ item.start_site }}</td>
              <td>{{ item.end_province }}</td>
              <td>{{ item.end_city }}</td>
              <td>{{ item.end_site }}</td>
              <td>
                <b-button variant="primary" style="color:white;" @click="openAlert('update', index)">修&nbsp;&nbsp;改</b-button>
                <b-button style="color:white; margin-right:5px;" @click="$router.push({ path: '/way', query: { id: item.id, name: item.name } })">
                  添加方式
                </b-button>
                <b-button variant="danger" @click="openAlert('delete', item.id)">删&nbsp;&nbsp;除</b-button>
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

        <el-dialog :title="dialogTitle" :visible.sync="dialog" width="70%">
          <p class="marginBot5">所属项目: {{ itemName }}</p>
          <p class="marginBot5">路线名称</p>
          <b-form-input v-model="form.name" class="marginBot20" placeholder="请填写路线名称"></b-form-input>
          <p class="marginBot5">起始地省份</p>
          <b-form-select v-model="form.start_province" class="marginBot20">
            <option :value="undefined" disabled>请选择起始地省份</option>
            <option v-for="(item, index) in startProvinceList" :key="index" :value="item.city_name">{{ item.city_name }}</option>
          </b-form-select>
          <p class="marginBot5">起始地城市</p>
          <b-form-select v-model="form.start_city" class="marginBot20" id="startCityTip">
            <option label="----------------------" :value="undefined" disabled></option>
            <option v-for="(item, index) in startCityList" :key="index" :value="item.city_name">{{ item.city_name }}</option>
          </b-form-select>
          <p class="marginBot5">起始站点</p>
          <b-form-input v-model="form.start_site" class="marginBot20" placeholder="请填写起始站点"></b-form-input>
          <p class="marginBot5">目的地省份</p>
          <b-form-select v-model="form.end_province" class="marginBot20">
            <option :value="undefined" disabled>请选择目的地省份</option>
            <option v-for="(item, index) in endProvinceList" :key="index" :value="item.city_name">{{ item.city_name }}</option>
          </b-form-select>
          <p class="marginBot5">目的地城市</p>
          <b-form-select v-model="form.end_city" class="marginBot20" id="endCityTip">
            <option label="----------------------" :value="undefined" disabled></option>
            <option v-for="(item, index) in endCityList" :key="index" :value="item.city_name">{{ item.city_name }}</option>
          </b-form-select>
          <p class="marginBot5">目的站点</p>
          <b-form-input v-model="form.end_site" class="marginBot20" placeholder="请填写目的站点"></b-form-input>
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
            @click="toValidate()"
          >
            保&nbsp;&nbsp;存</b-button
          >
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Validator from 'async-validator';
export default {
  name: 'dly_way',
  metaInfo: {
    title: '合同-线路管理',
  },
  components: {},
  data() {
    return {
      list: [],
      form: {},
      searchInfo: {},
      startProvinceList: [],
      endProvinceList: [],
      startCityList: [],
      endCityList: [],
      currentPage: 1,
      countNum: 0,
      totalRow: 0,
      deleteItem: '',
      select_name: '',
      select_order_no: '',
      select_start_city: '',
      select_end_city: '',
      mainValidator: new Validator({
        name: { required: true, message: '请填写路线名称' },
        start_province: { required: true, message: '请填写起始地省份' },
        start_city: { required: true, message: '请填写起始地城市' },
        start_site: { required: true, message: '请填写起始站点' },
        end_province: { required: true, message: '请填写目的地省份' },
        end_city: { required: true, message: '请填写目的地城市' },
        end_site: { required: true, message: '请填写目的站点' },
      }),
      itemName: this.$route.query.name || '',
      dialog: false,
      operateId: '',
      dialogTitle: '',
    };
  },
  computed: {
    ...mapState({
      limit: state => state.publics.limit,
      dlyWayList: state => state.self.dlyWayList,
    }),
  },
  watch: {
    'form.start_province': {
      async handler(newValue) {
        let id = this.startProvinceList.filter(item => item.city_name === newValue)[0].id;
        let { data } = await this.getRegion({ pid: id });
        this.$set(this, 'startCityList', data);
      },
    },
    'form.end_province': {
      async handler(newValue) {
        let id = this.endProvinceList.filter(item => item.city_name === newValue)[0].id;
        let { data } = await this.getRegion({ pid: id });
        this.$set(this, 'endCityList', data);
      },
    },
  },
  async created() {
    await this.search();
    let { data } = await this.getRegion({ pid: 1 });
    console.log(data);
    this.$set(this, 'startProvinceList', data);
    this.$set(this, 'endProvinceList', data);
  },
  methods: {
    ...mapActions(['getRegion', 'item_getDlyList', 'item_dlyOperation']),
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
      let { result, data } = await this.item_getDlyList({ skip: skip, limit: this.limit, item_id: this.$route.query.id, ...this.searchInfo });
      if (result) {
        this.$set(this, 'list', data.dlyWayList);
        this.$set(this, 'totalRow', data.totalRow);
      } else {
        this.$set(this, 'list', []);
        this.$set(this, 'totalRow', 0);
      }
    },
    //验证,因为添加和修改的验证内容都是一样的,所以用一个方法
    async toValidate() {
      this.form[`item_id`] = this.$route.query.id;
      this.mainValidator.validate(this.form, (errors, fields) => {
        if (errors) {
          return this.handleErrors(errors, fields);
        }
        return this.operation();
      });
    },
    async operation() {
      let has_id = Object.keys(this.form).filter(item => item === 'id').length;
      let type;
      has_id > 0 ? (type = 'dlywayEdit') : (type = 'dlywaySave');
      let result = await this.item_dlyOperation({ data: this.form, type: type });
      this.search();
      this.dialog = false;
    },
    async openAlert(type, item) {
      if (type === 'update') {
        this.dialog = true;
        this.dialogTitle = '修改线路';
        this.form = JSON.parse(JSON.stringify(this.list[item]));
      } else if (type === 'add') {
        this.dialog = true;
        this.dialogTitle = '添加线路';
        this.form = {};
      } else if (type === 'delete') {
        this.operateId = item;
        await this.$confirm('确认要删除该项目吗?', `删除提示`, {
          type: 'warning',
        })
          .then(async () => {
            //确认删除
            await this.item_dlyOperation({ data: { id: this.operateId }, type: 'dlywayDelete' });
            this.search();
          })
          .catch(() => {
            //不删除
          });
        return;
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

<style lang="css" scoped>
.searchInput{
  margin-right:2%;
}
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
