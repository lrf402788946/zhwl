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
              <th>计费方式</th>
              <th>起始地省份</th>
              <th>起始地城市</th>
              <th>目的地省份</th>
              <th>目的地城市</th>
              <th>运输内容</th>
              <th>按重量的运输价格</th>
              <th>按重量的运输标准</th>
              <th>提送货费单价</th>
              <th>提送货费计费标准</th>
              <th>运输时限</th>
              <th>操作</th>
            </tr>
            <tr v-for="(item, index) in list" :key="index">
              <td>{{ item.name }}</td>
              <td>
                <b-form-select v-modal="item.type" :options="gender" />
              </td>
              <td>{{ item.start_province }}</td>
              <td>{{ item.start_city }}</td>
              <td>{{ item.end_province }}</td>
              <td>{{ item.end_city }}</td>
              <td>{{ item.content }}</td>
              <td>{{ item.dwp }}</td>
              <td>{{ item.dwp_criterion }}</td>
              <td>{{ item.pgp }}</td>
              <td>{{ item.pgp_criterion }}</td>
              <td>{{ item.limit }}</td>
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
          <p class="marginBot5">计算方式</p>
          <b-form-select v-modal="form.type" :options="gender" placeholder="请选择计算方式" />
          <p class="marginBot5">起始地省份</p>
          <b-form-input v-model="form.start_province" class="marginBot20" placeholder="请填写起始地省份"></b-form-input>
          <p class="marginBot5">起始地城市</p>
          <b-form-input v-model="form.start_city" class="marginBot20" placeholder="起始地城市"></b-form-input>
          <p class="marginBot5">目的地省份</p>
          <b-form-input v-model="form.end_province" class="marginBot20" placeholder="请填写目的地省份"></b-form-input>
          <p class="marginBot5">目的地城市</p>
          <b-form-input v-model="form.end_city" class="marginBot20" placeholder="请填写目的地城市"></b-form-input>
          <p class="marginBot5">运输内容</p>
          <b-form-input v-model="form.content" class="marginBot20" placeholder="请填写运输内容"></b-form-input>
          <p class="marginBot5">按重量的运输价格</p>
          <b-form-input v-model="form.dwp" class="marginBot20" placeholder="请填写按重量的运输价格"></b-form-input>
          <p class="marginBot5">按重量的运输标准</p>
          <b-form-input v-model="form.dwp_criterion" class="marginBot20" placeholder="请填写按重量的运输标准"></b-form-input>
          <p class="marginBot5">提送货费单价</p>
          <b-form-input v-model="form.dwp_pgp" class="marginBot20" placeholder="请填写提送货费单价"></b-form-input>
          <p class="marginBot5">提送货费计费标准</p>
          <b-form-input v-model="form.dwp_pgp_criterion" class="marginBot20" placeholder="请填写提送货费计费标准"></b-form-input>
          <p class="marginBot5">运输时限</p>
          <b-form-input v-model="form.limit" class="marginBot20" placeholder="请填写运输时限"></b-form-input>

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

        <b-modal id="Edit" title="修改角色" ref="Edit" hide-footer no-close-on-esc no-close-on-backdrop hide-header-close>
          <p class="marginBot5">角色代码</p>
          <b-form-input v-model="form.role_code" class="marginBot8"></b-form-input>
          <p class="marginBot5">角色名称</p>
          <b-form-input v-model="form.role_name" class="marginBot20"></b-form-input>
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
            <b-alert variant="danger" show>确定删除该角色?</b-alert>
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
      gender: [{ text: '请选择计费方式', value: null, disabled: true }, { text: '重量计费', value: 0 }, { text: '体积计费', value: 1 }],
      form: {
        p_id: 0,
      },
      currentPage: 1,
      countNum: 0,
      totalRow: 0,
      deleteItem: '',
      roleValidator: new Validator({
        type: [{ type: 'string', required: true, message: '请选择计费方式' }],
        name: { type: 'string', required: true, message: '请填写路线名称' },
        start_province: { type: 'string', required: true, message: '请填写起始地省份' },
        start_city: { type: 'string', required: true, message: '请填写起始地城市' },
        end_province: { type: 'string', required: true, message: '请填写目的地省份' },
        end_city: { type: 'string', required: true, message: '请填写目的地城市' },
        content: { type: 'string', required: true, message: '请填写运输内容' },
        dwp: { type: 'string', required: true, message: '请填写按重量的运输价格' },
        dwp_criterion: { type: 'string', required: true, message: '请填写按重量的运输标准' },
        pgp: { type: 'string', required: true, message: '请填写提送货费单价' },
        pgp_criterion: { type: 'string', required: true, message: '请填写提送货费计费标准' },
        limit: { type: 'string', required: true, message: '请填写运输时间' },
      }),
    };
  },
  computed: {
    ...mapState({
      skip: state => state.self.skip,
      limit: state => state.publics.limit,
      dly_wayList: state => state.self.dly_wayList,
    }),
  },
  async created() {
    await this.search();
  },
  methods: {
    ...mapActions(['getdly_wayList', 'dlywayOperation']),
    async search() {
      //查询方法
      let skip = (this.currentPage - 1) * this.limit;
      await this.getdly_wayList({ skip: skip, limit: this.limit });
      this.$set(this, 'list', this.dly_way_List);
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
      let result =  await this.getdly_wayList();
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
    //添加
    async add() {
      await this.dlywayOperation({ type: 'dlywaySave', data: this.form });
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
      await this.dlywayOperation({ type: 'roleDelete', data: this.deleteItem });
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
      await this.dlywayOperation({ type: 'roleEdit', data: this.form });
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
