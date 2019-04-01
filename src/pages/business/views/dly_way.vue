<template lang="html">
  <div id="role">
    <!-- 表格 begin -->
    <div class="base-form">
      <div class="form-inline">
        <div class="base-form-title" style="width:100%;">
          <a class="base-margin-left-20">路线列表</a>
          <div class="button-table"></div>
        </div>
      </div>
      <div class="base-padding-20 base-bg-fff">
        <table>
          <tr>
            <td>路线名称查询</td>
            <td>起始地城市查询</td>
            <td>目的地城市查询</td>
          </tr>
          <tr>
            <td><b-form-input v-model="select_name" placeholder="输入路线名称"></b-form-input></td>
            <td><b-form-input v-model="select_start_city" placeholder="输入起始地城市"></b-form-input></td>
            <td><b-form-input v-model="select_end_city" placeholder="输入目的地城市"></b-form-input></td>
          </tr>
          <tr>
            <td>
              <b-button
                variant="primary"
                style="font-size: 14px !important; color: rgb(255, 255, 255) !important; width: 60% !important; padding: 5px 10px !important; margin-top:28px; margin-right: 0px !important;"
                @click="searchButton()"
                >点击查询</b-button
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
                <b-button variant="primary" style="color:white;" @click="openUpdateAlert(index)">修&nbsp;&nbsp;改</b-button>
                <b-button variant="danger" @click="openDeleteAlert(item.id)">删&nbsp;&nbsp;除</b-button>
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
        <b-modal id="toAdd" title="添加路线" ref="toAdd" hide-footer>
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
          <b-tooltip target="startCityTip" title="请选择起始地城市" placement="right"></b-tooltip>
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
          <b-tooltip target="endCityTip" title="请选择目的地城市" placement="right"></b-tooltip>
          <p class="marginBot5">目的站点</p>
          <b-form-input v-model="form.end_site" class="marginBot20" placeholder="请填写目的站点"></b-form-input>
          <b-button
            variant="secondary"
            @click="form = { p_id: 0 }"
            style="font-size:16px !important; margin-top:25px; padding:6px 80px !important;margin-bottom:30px !important;margin-right:0 !important;"
          >
            重&nbsp;&nbsp;置
          </b-button>
          <b-button
            variant="primary"
            @click="toValidate('add')"
            style="font-size:16px !important; margin-top:25px; float:right; padding:6px 80px !important;margin-bottom:30px !important;margin-right:0 !important;"
          >
            保&nbsp;&nbsp;存
          </b-button>
        </b-modal>

        <b-modal id="Edit" title="修改路线" ref="Edit" hide-footer no-close-on-esc no-close-on-backdrop hide-header-close>
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
          <b-tooltip target="startCityTip" title="请选择起始地城市" placement="right"></b-tooltip>
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
          <b-tooltip target="endCityTip" title="请选择目的地城市" placement="right"></b-tooltip>
          <p class="marginBot5">目的站点</p>
          <b-form-input v-model="form.end_site" class="marginBot20" placeholder="请填写目的站点"></b-form-input>
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
            <b-alert variant="danger" show>确定删除该路线?</b-alert>
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
  name: 'dly_way',
  metaInfo: {
    title: '角色管理',
  },
  components: {},
  data() {
    return {
      list: [],
      form: {},
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
    this.$set(this, 'startProvinceList', data);
    this.$set(this, 'endProvinceList', data);
  },
  methods: {
    ...mapActions(['getdly_wayList', 'dlywayOperation', 'adddly_wayList', 'getdly_wayListlike', 'getRegion']),
    async search() {
      //查询方法
      let skip = (this.currentPage - 1) * this.limit;
      await this.getdly_wayList({ skip: skip, limit: this.limit });
      console.log(this.dlyWayList);
      this.$set(this, 'list', this.dlyWayList);
    },
    toSearch(currentPage) {
      this.currentPage = currentPage;
      if (this.is_title_search) {
        this.titlesearch();
      } else {
        this.search();
      }
    },
    async titlesearch() {
      if (!this.is_title_search) {
        this.is_title_search = true;
        return;
      }
      let skip = (this.currentPage - 1) * this.limit;
      let result = await this.getdly_wayList();
      if (result.data.msg === '成功') {
        this.$set(this, 'list', result.data.List);
        this.$set(this, 'totalRow', result.data.totalRow);
        this.$set(this, 'countNum', result.data.countNum);
      }
      if (result.data.msg === '没有数据') {
        this.list = '';
        this.totalRow = 0;
        this.countNum = 0;
      }
    },
    //模糊查询按钮
    async searchButton() {
      this.currentPage = 1;
      if (this.select_name === null) this.select_name = '';
      if (this.select_start_city === null) this.select_start_city = '';
      if (this.select_end_city === null) this.select_end_city = '';
      let skip = (this.currentPage - 1) * this.limit;
      await this.getdly_wayListlike({
        skip: skip,
        limit: this.limit,
        select_name: this.select_name,
        select_start_city: this.select_start_city,
        select_end_city: this.select_end_city,
      });
      this.$set(this, 'list', this.dlyWayList);
    },
    //验证,因为添加和修改的验证内容都是一样的,所以用一个方法
    async toValidate(type) {
      this.mainValidator.validate(this.form, (errors, fields) => {
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
    //添加
    async add() {
      await this.adddly_wayList({ type: 'dlywaySave', data: this.form });
      this.form = {};
      this.$refs.toAdd.hide();
      this.search();
    },
    //打开删除提示框
    openDeleteAlert(id) {
      this.$refs.deleteAlert.show();
      this.deleteItem = id;
    },
    //删除
    async toDelete() {
      await this.dlywayOperation({ type: 'dlywayDelete', data: this.deleteItem });
      this.search();
      this.deleteItem = '';
      this.$refs.deleteAlert.hide();
    },
    //打开修改提示框
    openUpdateAlert(index) {
      this.$refs.Edit.show();
      this.form = JSON.parse(JSON.stringify(this.list[index]));
    },
    //修改
    async update() {
      await this.dlywayOperation({ type: 'dlywayEdit', data: this.form });
      this.form = {};
      this.$refs.Edit.hide();
      this.search();
    },
    //关闭弹框
    closeAlert() {
      this.$refs.Edit.hide();
      this.list = JSON.parse(JSON.stringify(this.origin));
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
.marginBot5{
  margin-bottom: 5px;
}
.marginBot8{
  margin-bottom: 8px;
}
.marginBot20{
  margin-bottom: 20px;
}
.resetButton{
  color:#fff;
  margin-right:20px;
}
.table th, .table td {
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
.table {
    font-size: 14px;
}
</style>
