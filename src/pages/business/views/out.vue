<template lang="html">
  <div id="out">
    <!-- 表格 begin -->
    <div class="base-form">
      <div class="form-inline">
        <div class="base-form-title" style="width:100%;">
          <a class="base-margin-left-20">支出单列表</a>
          <div class="button-table"></div>
        </div>
      </div>
      <div class="base-padding-20 base-bg-fff">
        <table>
          <tr>
            <td>支出单查询</td>
          </tr>
          <tr>
            <td><b-form-input v-model="select_main_id" placeholder="输入运输单号"></b-form-input></td>
          </tr>
          <tr>
            <td>
              <b-button
                variant="primary"
                style="font-size: 14px !important; color: rgb(255, 255, 255) !important; width: 60% !important; padding: 5px 10px !important; margin-top:28px; margin-right: 0px !important;"
                @click="search('vague')"
                >点击查询</b-button
              >
            </td>
          </tr>
        </table>

        <table class="table table-bordered table-striped ">
          <tbody v-if="list.length > 0">
            <tr>
              <th>供应商</th>
              <th>司机</th>
              <th>线路</th>
              <th>支出金额</th>
              <th>操作</th>
            </tr>
            <tr v-for="(item, index) in list" :key="index">
              <td>{{ { data: carList, searchItem: 'id', value: item.car_id, label: 'car_onwer' } | getName }}</td>
              <td>{{ { data: driverList, searchItem: 'id', value: item.driver_id, label: 'name' } | getName }}</td>
              <td>{{ { data: dlyWayList, searchItem: 'id', value: item.dly_way_id, label: 'name' } | getName }}</td>
              <td>{{ item.out_price }}</td>
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
        <b-modal id="Edit" title="修改支出单" ref="Edit" hide-footer no-close-on-esc no-close-on-backdrop hide-header-close>
          <p class="marginBot5">供应商</p>
          <el-select class="marginBot" style="height:40px !important" v-model="form.car_id" filterable placeholder="请选择供应商">
            <el-option v-for="(car, index) in carList" :key="index" :label="car.car_onwer" :value="car.id"></el-option>
          </el-select>
          <p class="marginBot5">司机</p>
          <el-select class="marginBot" style="height:40px !important" v-model="form.driver_id" filterable placeholder="请选择司机">
            <el-option v-for="(driver, index) in driverList" :key="index" :label="driver.name" :value="driver.id"></el-option>
          </el-select>
          <p class="marginBot5">线路</p>
          <el-select class="marginBot" style="height:40px !important" v-model="form.dly_way_id" filterable placeholder="请选择线路">
            <el-option v-for="(way, index) in dlyWayList" :key="index" :label="way.name" :value="way.id"></el-option>
          </el-select>
          <p class="marginBot5">支出项</p>
          <el-select class="marginBot" style="height:40px !important" v-model="form.cost_id" filterable placeholder="请选择支出项">
            <el-option v-for="(cost, index) in costList" :key="index" :label="cost.cost_name" :value="cost.id"></el-option>
          </el-select>
          <p class="marginBot5">支出金额</p>
          <b-form-input v-model="form.out_price"></b-form-input>
          <p class="marginBot5">备注</p>
          <b-form-input v-model="form.remark"></b-form-input>
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
            <b-alert variant="danger" show>确定删除该支出单?</b-alert>
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
  name: 'out',
  metaInfo: {
    title: '支出单管理',
  },
  components: {},
  data() {
    return {
      list: [],
      form: {},
      costList: [],
      currentPage: 1,
      countNum: 0,
      totalRow: 0,
      deleteItem: '',
      select_main_id: '',
      roleValidator: new Validator({
        car_id: [{ required: true, message: '请选择供应商' }],
        driver_id: { required: true, message: '请选择司机' },
        dly_way_id: { required: true, message: '请选择线路' },
        cost_id: { required: true, message: '请选择支出项' },
        out_price: { required: true, message: '请填写支出金额' },
      }),
    };
  },
  computed: {
    ...mapState({
      limit: state => state.publics.limit,
      driverList: state => state.personnel.driverList,
      dlyWayList: state => state.self.dlyWayList,
      carList: state => state.car.carList,
    }),
  },
  async created() {
    console.log(3 ** 4);
    await this.search();
    await Promise.all([
      this.getdly_wayList({ skip: 0, limit: 10000 }),
      this.getDriverList({ skip: 0, limit: 10000 }),
      this.getCarList({ skip: 0, limit: 10000 }),
    ]);
    let { data } = await this.getCostList({ skip: 0, limit: 10000 });
    (data = data.filter(item => item.cost_type !== '0')), this.$set(this, 'costList', data);
  },
  methods: {
    ...mapActions(['getOutList', 'getDriverList', 'getdly_wayList', 'getCarList', 'getCostList', 'outOperation']),
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
      let { totalRow, data } = await this.getOutList({ skip: skip, limit: this.limit, main_id: this.select_main_id });
      this.$set(this, 'totalRow', totalRow);
      if (totalRow == 0) {
        this.$set(this, 'list', {});
      } else {
        this.$set(this, 'list', data);
      }
    },
    //验证,因为添加和修改的验证内容都是一样的,所以用一个方法
    async toValidate(type) {
      this.roleValidator.validate(this.form, (errors, fields) => {
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
    //打开删除提示框
    openDeleteAlert(id) {
      this.$refs.deleteAlert.show();
      this.deleteItem = id;
    },
    //删除
    async toDelete() {
      await this.outOperation({ type: 'outDelete', data: this.deleteItem });
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
      await this.outOperation({ type: 'outEdit', data: this.form });
      this.form = {};
      this.$refs.Edit.hide();
      this.search();
    },
    //关闭弹框
    closeAlert() {
      this.$refs.Edit.hide();
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
