<template lang="html">
  <div id="role">
    <!-- 表格 begin -->
    <div class="base-form">
      <div class="form-inline">
        <div class="base-form-title" style="width:100%;">
          <a class="base-margin-left-20">货物列表</a>
          <div class="button-table"></div>
        </div>
      </div>
      <div class="base-padding-20 base-bg-fff">
        <table>
          <tr>
            <td>货物名称查询</td>
          </tr>
          <tr>
            <td><b-form-input v-model="select_name" placeholder="输入货物名称"></b-form-input></td>
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
            <i class="base-margin-right-5 fa fa-plus-square"></i>添加货物
          </a>
        </div>
        <table class="table table-bordered table-striped ">
          <tbody v-if="list.length > 0">
            <tr>
              <th>货物名称</th>
              <th>数量</th>
              <th>重量</th>
              <th>体积</th>
              <th>操作</th>
            </tr>
            <tr v-for="(item, index) in list" :key="index">
              <td>{{ item.goods_name }}</td>
              <td>{{ item.num }}</td>
              <td>{{ item.weight }}</td>
              <td>{{ item.volume }}</td>
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
        <b-modal id="toAdd" title="添加货物" ref="toAdd" hide-footer>
          <p class="marginBot5">货物名称</p>
          <b-form-input v-model="form.goods_name" class="marginBot20" placeholder="请填写货物名称"></b-form-input>
          <p class="marginBot5">数量</p>
          <b-form-input v-model="form.num" class="marginBot20" placeholder="请填写货物数量"></b-form-input>
          <p class="marginBot5">重量</p>
          <b-form-input v-model="form.weight" class="marginBot20" placeholder="请填写货物重量"></b-form-input>
          <p class="marginBot5">体积</p>
          <b-form-input v-model="form.volume" class="marginBot20" placeholder="请填写货物体积"></b-form-input>
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

        <b-modal id="Edit" title="修改货物" ref="Edit" hide-footer no-close-on-esc no-close-on-backdrop hide-header-close>
          <p class="marginBot5">货物名称</p>
          <b-form-input v-model="form.goods_name" class="marginBot20" placeholder="请填写货物名称"></b-form-input>
          <p class="marginBot5">数量</p>
          <b-form-input v-model="form.num" class="marginBot20" placeholder="请填写货物数量"></b-form-input>
          <p class="marginBot5">重量</p>
          <b-form-input v-model="form.weight" class="marginBot20" placeholder="请填写货物重量"></b-form-input>
          <p class="marginBot5">体积</p>
          <b-form-input v-model="form.volume" class="marginBot20" placeholder="请填写货物体积"></b-form-input>
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
            <b-alert variant="danger" show>确定删除该货物?</b-alert>
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
  name: 'goods',
  metaInfo: {
    title: '货物管理',
  },
  components: {},
  data() {
    return {
      list: [],
      form: {
        goods_name: '',
        num: '',
        weight: '',
        volume: '',
      },
      is_title_search: false, //是否是模糊查询： true：是模糊查询； false： 不是模糊查询
      currentPage: 1,
      countNum: 0,
      totalRow: 0,
      deleteItem: '',
      select_name: '',
      select_order_no: '',
      roleValidator: new Validator({
        goods_name: [{ required: true, message: '请选择货物名称' }],
        num: { required: true, message: '请填写货物数量' },
        weight: { required: true, message: '请填写货物重量' },
        volume: { required: true, message: '请填写货物体积' },
      }),
    };
  },
  computed: {
    ...mapState({
      skip: state => state.self.skip,
      limit: state => state.publics.limit,
      goodsList: state => state.self.goodsList,
    }),
  },
  created() {
    this.search();
  },
  methods: {
    ...mapActions(['getGoodslist', 'goodsOperation', 'addGoodslist', 'getGoodslistlike']),
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
      let totalRow = await this.getGoodslist({ skip: skip, limit: this.limit });
      this.$set(this, 'list', this.goodsList);
      this.$set(this, 'totalRow', totalRow);
    },
    //模糊查询的方法
    async titlesearch() {
      if (!this.is_title_search) {
        this.is_title_search = true;
        return;
      }
      if (this.select_name === null) this.select_name = '';
      let skip = (this.currentPage - 1) * this.limit;
      let totalRow = await this.getGoodslistlike({
        skip: skip,
        limit: this.limit,
        select_name: this.select_name,
      });
      this.$set(this, 'list', this.goodsList);
      this.$set(this, 'totalRow', totalRow);
    },
    //模糊查询按钮
    async searchButton() {
      this.currentPage = 1;
      if (this.select_name === null) this.select_name = '';
      if (!this.is_title_search) {
        this.is_title_search = true;
        return;
      }
      let skip = 0;
      let totalRow = await this.getGoodslistlike({
        skip: skip,
        limit: this.limit,
        select_name: this.select_name,
      });
      this.$set(this, 'list', this.goodsList);
      this.$set(this, 'totalRow', totalRow);
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
      await this.addGoodslist({ type: 'goodsSave', data: this.form });
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
      await this.goodsOperation({ type: 'goodsDelete', data: this.deleteItem });
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
      await this.goodsOperation({ type: 'goodsEdit', data: this.form });
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
