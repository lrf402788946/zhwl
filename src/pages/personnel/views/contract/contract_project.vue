<template lang="html">
  <div id="contract_project">
    <div class="base-form">
      <div class="form-inline">
        <div class="base-form-title" style="width:100%;">
          <a class="base-margin-left-20">合同: {{ pact_no }}</a>
          <div class="button-table"></div>
        </div>
      </div>
      <div class="base-padding-20 base-bg-fff">
        <el-row>
          <el-col :span="21">&nbsp;</el-col>
          <el-col :span="3" style="margin-bottom:2%;">
            <b-button
              @click="$router.go(-1)"
              variant="primary"
              style="font-size:14px !important; color:#efe !important; padding: 6px 12px !important;margin-bottom:2px !important;"
            >
              返回
            </b-button>
          </el-col>
          <div class="base-align-right" style="margin-bottom:20px;">
            <b-button @click="openAlert('add')" variant="primary" style="font-size:14px !important; color:#efe !important; padding: 6px 12px !important;"
              ><i class="base-margin-right-5 fa fa-plus-square"></i>新建项目</b-button
            >
          </div>
        </el-row>
        <table class="table table-bordered table-striped " style="">
          <tbody v-if="list.length > 0">
            <tr>
              <th>项目名称</th>
              <th>税率</th>
              <th>操作</th>
            </tr>
            <tr v-for="(item, index) in list" :key="index">
              <td>{{ item.item_name }}</td>
              <td>{{ item.cess }}</td>
              <td>
                <b-button variant="primary" style="color:white; margin-right:5px;" @click="openAlert('update', index)">修&nbsp;&nbsp;改</b-button>
                <b-button style="color:white; margin-right:5px;" @click="$router.push({ path: '/dly_way', query: { id: item.id, name: item.item_name } })">
                  添加线路
                </b-button>
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
          prev-text="上一页"
          next-text="下一页"
          :current-page="currentPage"
          @current-change="toSearch"
          :total="totalRow"
        ></el-pagination>
      </div>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialog" width="70%">
      <el-row>
        <el-col :span="24">
          <table class="table table-bordered table-striped ">
            <tbody>
              <tr>
                <th>项目名称</th>
                <th>税率</th>
              </tr>
              <tr>
                <td><b-form-input v-model="form.item_name"></b-form-input></td>
                <td>
                  <el-tooltip class="item" effect="dark" content="请填写1.X,如:1/1.04" placement="top">
                    <b-form-input v-model="form.cess"></b-form-input>
                  </el-tooltip>
                </td>
              </tr>
            </tbody>
          </table>
        </el-col>
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
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Validator from 'async-validator';
export default {
  name: 'contract_project',
  metaInfo: {
    title: '客户-合同-项目管理',
  },
  components: {},
  data() {
    return {
      pact_no: this.$route.query.pact_no || '',
      dialog: false,
      dialogTitle: '',
      operateId: '',
      currentPage: 1,
      totalRow: 0,
      list: [{ id: 1, item_name: 'test' }],
      form: {},
      pageValidator: new Validator({
        item_name: { required: true, message: '请填写项目名称' },
        cess: { required: true, message: '请填写税率' },
        pact_id: { required: true, message: '此处为系统bug,若出现请联系' },
      }),
    };
  },
  computed: {
    ...mapState({
      limit: state => state.publics.limit,
    }),
  },
  created() {
    this.search();
  },
  methods: {
    ...mapActions(['itemOperation', 'getItemList']),
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
      let { result, data } = await this.getItemList({ skip: skip, limit: this.limit, pact_id: this.$route.query.id });
      if (result) {
        this.$set(this, 'list', data.dataList);
        this.$set(this, 'totalRow', data.totalRow);
      } else {
        this.$set(this, 'list', []);
        this.$set(this, 'totalRow', 0);
      }
    },
    toValidate() {
      this.form[`pact_id`] = this.$route.query.id;
      this.pageValidator.validate(this.form, (errors, fields) => {
        if (errors) {
          return this.handleErrors(errors, fields);
        }
        return this.operation();
      });
    },
    async operation() {
      let has_id = Object.keys(this.form).filter(item => item === 'id').length;
      let type;
      has_id > 0 ? (type = 'itemEdit') : (type = 'itemSave');
      let result = await this.itemOperation({ data: this.form, type: type });
      this.search();
      this.dialog = false;
    },
    async openAlert(type, item) {
      if (type === 'update') {
        this.dialog = true;
        this.dialogTitle = '修改项目';
        this.form = JSON.parse(JSON.stringify(this.list[item]));
      } else if (type === 'add') {
        this.dialog = true;
        this.dialogTitle = '添加项目';
        this.form = {};
      } else if (type === 'delete') {
        this.operateId = item;
        await this.$confirm('确认要删除该项目吗?', `删除提示`, {
          type: 'warning',
        })
          .then(async () => {
            //确认删除
            await this.itemOperation({ data: { id: this.operateId }, type: 'itemDelete' });
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

<style>
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
.table th,
.table td {
  padding: 0.5rem !important;
}
.base-padding-20 {
  padding: 20px;
}
.base-bg-fff {
  background-color: #fff;
}
</style>
<style scoped>
@import '../../../../assets/style/Font-Awesome-master/css/font-awesome.css';
@import '../../../../assets/style/layout/base-Layout-bootstrap.css';
@import '../../../../assets/style/base-style-bootstrap.css';
</style>
