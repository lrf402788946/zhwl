<template lang="html">
  <div id="contract_project">
    <div class="base-form">
      <div class="form-inline">
        <div class="base-form-title" style="width:100%;">
          <a class="base-margin-left-20">线路: {{ itemName }}</a>
          <div class="button-table"></div>
        </div>
      </div>
      <div class="base-padding-20 base-bg-fff">
        <el-row>
          <el-col :span="21">&nbsp;</el-col>
          <el-col :span="3" style="margin-bottom:1%;">
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
              ><i class="base-margin-right-5 fa fa-plus-square"></i>新建方式</b-button
            >
          </div>
        </el-row>
        <table class="table table-bordered table-striped " style="">
          <tbody v-if="list.length > 0">
            <tr>
              <th>方式名称</th>
              <th>价格</th>
              <th>税率</th>
              <th>是否量份收费</th>
              <th>发货方式</th>
              <th>计算方式</th>
              <th>操作时间</th>
              <th>操作</th>
            </tr>
            <tr v-for="(item, index) in list" :key="index">
              <td>{{ item.type_name }}</td>
              <td>{{ item.price }}</td>
              <td>{{ item.cess }}</td>
              <td>{{ item.is_lf === `0` ? '是' : '否' }}</td>
              <td>{{ item.is_lf === `0` ? '' : item.send_type === `0` ? '零担' : '整车' }}</td>
              <td>{{ item.is_lf === `0` ? '' : item.count_type === `0` ? '按体积' : '按重量' }}</td>
              <td>{{ item.create_time }}</td>
              <td>
                <b-button variant="primary" style="color:white; margin-right:5px;" @click="openAlert('update', index)">修&nbsp;&nbsp;改</b-button>
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
    <el-dialog :title="dialogTitle" :visible.sync="dialog">
      <el-row style="font-size: 15px;font-weight: 700;">
        <el-col :span="24">
          <el-row style="margin-bottom:1%;">
            <el-col :span="4">线路名称:</el-col>
            <el-col>{{ itemName }}</el-col>
          </el-row>
          <el-row style="margin-bottom:1%;">
            <el-col :span="4">方式名称:</el-col>
            <el-col><b-form-input v-model="form.type_name"></b-form-input></el-col>
          </el-row>
          <el-row style="margin-bottom:1%;">
            <el-col :span="4">价格:</el-col>
            <el-col><b-form-input v-model="form.price"></b-form-input></el-col>
          </el-row>
          <el-row style="margin-bottom:1%;">
            <el-col :span="4">税率:</el-col>
            <el-col>
              <el-tooltip class="item" effect="dark" content="请填写1.X,如:1/1.04" placement="top">
                <b-form-input v-model="form.cess"></b-form-input>
              </el-tooltip>
            </el-col>
          </el-row>
          <el-row style="margin-bottom:1%;">
            <el-col :span="4">是否量份收费:</el-col>
            <el-col>
              <el-radio v-model="form.is_lf" :label="`0`" border>是</el-radio>
              <el-radio v-model="form.is_lf" :label="`1`" border>否</el-radio>
            </el-col>
          </el-row>
          <el-row style="margin-bottom:1%;" v-if="form.is_lf === `1`">
            <el-col :span="4">发货方式:</el-col>
            <el-col>
              <el-radio v-model="form.send_type" :label="`0`" border>零担</el-radio>
              <el-radio v-model="form.send_type" :label="`1`" border>整车</el-radio>
            </el-col>
          </el-row>
          <el-row style="margin-bottom:1%;" v-if="form.is_lf === `1` && form.send_type === `0`">
            <el-col :span="4">计算方式:</el-col>
            <el-col>
              <el-radio v-model="form.count_type" :label="`0`" border>体积</el-radio>
              <el-radio v-model="form.count_type" :label="`1`" border>重量</el-radio>
            </el-col>
          </el-row>
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
      itemName: this.$route.query.name || '',
      dialog: false,
      dialogTitle: '',
      operateId: '',
      currentPage: 1,
      totalRow: 0,
      list: [{ id: 1, item_name: 'test' }],
      form: {},
      pageValidator: new Validator({
        type_name: { required: true, message: '请填写方式名称' },
        price: { required: true, message: '请填写价格' },
        is_lf: { required: true, message: '请选择是否为量份收费' },
        dly_way_id: { required: true, message: '此处为系统bug,若出现请联系' },
      }),
      subValidator: new Validator({
        send_type: { required: true, message: '请填写发货方式' },
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
    ...mapActions(['getWayList', 'wayOperation']),
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
      let { result, data } = await this.getWayList({ skip: skip, limit: this.limit, dly_way_id: this.$route.query.id });
      if (result) {
        this.$set(this, 'list', data.dataList);
        this.$set(this, 'totalRow', data.totalRow);
      } else {
        this.$set(this, 'list', []);
        this.$set(this, 'totalRow', 0);
      }
    },
    toValidate() {
      this.form[`dly_way_id`] = this.$route.query.id;
      this.pageValidator.validate(this.form, (errors, fields) => {
        if (errors) {
          return this.handleErrors(errors, fields);
        }
        if (this.form.is_lf === `1`) {
          this.subValidator.validate(this.form, (errors, fields) => {
            if (errors) {
              return this.handleErrors(errors, fields);
            }
            return this.operation();
          });
        } else {
          return this.operation();
        }
      });
    },
    async operation() {
      let has_id = Object.keys(this.form).filter(item => item === 'id').length;
      let type;
      has_id > 0 ? (type = 'wayEdit') : (type = 'waySave');
      let result = await this.wayOperation({ data: this.form, type: type });
      this.search();
      this.dialog = false;
    },
    async openAlert(type, item) {
      if (type === 'update') {
        this.dialog = true;
        this.dialogTitle = '修改方式';
        this.form = JSON.parse(JSON.stringify(this.list[item]));
      } else if (type === 'add') {
        this.dialog = true;
        this.dialogTitle = '添加方式';
        this.form = {};
      } else if (type === 'delete') {
        this.operateId = item;
        await this.$confirm('确认要删除该项目吗?', `删除提示`, {
          type: 'warning',
        })
          .then(async () => {
            //确认删除
            await this.wayOperation({ data: { id: this.operateId }, type: 'wayDelete' });
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
