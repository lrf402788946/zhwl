<template lang="html">
  <div id="role">
    <!-- 表格 begin -->
    <div class="base-form">
      <div class="form-inline">
        <div class="base-form-title" style="width:100%;">
          <a class="base-margin-left-20">角色列表</a>
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
            <i class="base-margin-right-5 fa fa-plus-square"></i>添加角色
          </a>
        </div>
        <table class="table table-bordered table-striped ">
          <tbody v-if="list.length > 0">
            <tr>
              <th>角色代码</th>
              <th>角色名称</th>
              <th>操作</th>
            </tr>
            <tr v-for="(item, index) in list" :key="index">
              <td>{{ item.role_code }}</td>
              <td>{{ item.role_name }}</td>
              <td>
                <b-button variant="primary" style="color:white;" @click="openUpdateAlert(index)">修&nbsp;&nbsp;改</b-button>
                <b-button style="color:white;" @click="toUserRole(item)">角色权限</b-button>
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
        <b-modal id="toAdd" title="添加角色" ref="toAdd" hide-footer>
          <p class="marginBot5">角色代码</p>
          <b-form-input v-model="form.role_code" class="marginBot8"></b-form-input>
          <p class="marginBot5">角色名称</p>
          <b-form-input v-model="form.role_name" class="marginBot20"></b-form-input>
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
        <el-dialog :title="urTitle" :visible.sync="dialog" width="60%">
          <role-menu :data="menuList" :role="users" @save="toSetMenu" @cancel="dialog = false"></role-menu>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import roleMenu from '@/components/role-menu.vue';
import { mapActions, mapState } from 'vuex';
import Validator from 'async-validator';
export default {
  name: 'role',
  metaInfo: {
    title: '角色管理',
  },
  components: {
    roleMenu,
  },
  data() {
    return {
      list: [],
      form: {
        p_id: 0,
      },
      deleteItem: '',
      roleValidator: new Validator({
        role_code: [{ type: 'string', required: true, message: '请填写角色代码' }],
        role_name: { type: 'string', required: true, message: '请填写角色名称' },
      }),
      urTitle: '',
      dialog: false,
      menuList: [],
      users: [],
      users_id: '',
    };
  },
  computed: {
    ...mapState({
      limit: state => state.publics.limit,
      roleList: state => state.self.roleList,
    }),
  },
  async created() {
    await this.search();
  },
  methods: {
    ...mapActions(['getRoleList', 'roleOperation', 'getMenu', 'getRoleMenu', 'setMenu']),
    async search() {
      //查询方法
      await this.getRoleList({ type: 'list' });
      this.$set(this, 'list', this.roleList);
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
      await this.roleOperation({ type: 'roleSave', data: this.form });
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
      await this.roleOperation({ type: 'roleDelete', data: this.deleteItem });
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
      await this.roleOperation({ type: 'roleEdit', data: this.form });
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
    //角色权限
    async toUserRole(item) {
      this.urTitle = `${item.role_name}管理`;
      this.$set(this, `users_id`, item.id);
      this.dialog = true;
      let result = await this.getMenu();
      if (result.rescode === '0') {
        let arr = result.dataList.map(item => {
          let object = {};
          object.key = item.id;
          object.label = item.name;
          return object;
        });
        this.$set(this, `menuList`, arr);
      }
      this.toGetRoleMenu(item.id);
    },
    async toGetRoleMenu(id) {
      let result = await this.getRoleMenu(id);
      if (result.rescode === '0') {
        let arr = result.dataList.map(item => item.menu_id);
        this.$set(this, `users`, arr);
      }
    },
    //赋值角色菜单
    async toSetMenu(data) {
      let result = await this.setMenu({ id: this.users_id, menu_id: data });
      if (result.rescode === '0') this.$message.success('操作成功');
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
