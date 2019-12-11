<template lang="html">
  <div id="user_role">
    <!-- 表格 begin -->
    <div class="base-form">
      <div class="form-inline">
        <div class="base-form-title" style="width:100%;">
          <a class="base-margin-left-20">权限分配</a>
          <div class="button-table"></div>
        </div>
      </div>
      <div class="base-padding-20 base-bg-fff">
        <div class="base-align-right"></div>
        <table class="table table-bordered table-striped ">
          <tbody v-if="userList.length > 0">
            <tr>
              <th>用户名</th>
              <th>权限</th>
            </tr>
            <tr v-for="(item, index) in userList" :key="index">
              <!--美化下input 可以看情况使用-->
              <td>{{ item.user_name }}</td>
              <td>
                <b-button variant="primary" style="color:white;" @click="openUpdateAlert(item.id)">查&nbsp;&nbsp;看</b-button>
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
          @current-change="toSearch"
          :total="totalRow"
        ></el-pagination>
        <b-modal
          class="userrole"
          id="updateAlert"
          size="lg"
          title="修改权限"
          ref="updateAlert"
          hide-footer
          no-close-on-esc
          no-close-on-backdrop
          hide-header-close
        >
          <el-transfer v-model="form.role_id" :data="roleList" :titles="['所有权限', '已有权限']" :button-texts="['移除', '添加']"></el-transfer>
          <div style="padding-left:100px">
            <b-button
              variant="secondary"
              style="font-size:16px !important; margin-top:35px; padding:6px 80px !important;margin-bottom:30px !important;margin-right:0 !important;"
              @click="closeAlert()"
              >返&nbsp;&nbsp;回</b-button
            >
            <b-button
              variant="primary"
              style="font-size:16px !important; margin-top:35px; margin-left:122px !important; padding:6px 79px !important;margin-bottom:30px !important;margin-right:0 !important;"
              @click="toSave()"
              >保&nbsp;&nbsp;存</b-button
            >
          </div>
        </b-modal>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';
export default {
  name: 'user_role',
  metaInfo: {
    title: '权限管理',
  },
  components: {},
  data() {
    return {
      list: [],
      form: {
        role_id: [],
      },
      operateId: '',
      totalRow: 0,
      currentPage: 1,
    };
  },
  computed: {
    ...mapState({
      limit: state => state.publics.limit,
      userList: state => state.self.userList,
      roleList: state => state.self.roleList,
      userRoleList: state => state.self.userRoleList,
    }),
  },
  async created() {
    await this.search();
  },
  methods: {
    ...mapActions(['getUserList', 'getRoleList', 'getUserRoleList', 'updateUserRoleList']),
    //分页
    toSearch(currentPage) {
      this.currentPage = currentPage;
      this.search();
    },
    async search() {
      //查询方法
      await this.getRoleList({ type: 'select' });
      let skip = (this.currentPage - 1) * this.limit;
      let totalRow = await this.getUserList({ skip: skip, limit: this.limit });
      this.$set(this, 'totalRow', totalRow);
    },
    //打开修改框
    async openUpdateAlert(id) {
      this.$refs.updateAlert.show();
      this.operateId = id;
      let result = await this.getUserRoleList({ id: id });
      this.$set(this.form, 'role_id', result);
    },
    //修改
    async toSave() {
      if (!this.form.role_id.length > 0) {
        this.$message.error('请最少添加一个身份权限');
        return false;
      }
      this.form['id'] = this.operateId;
      this.updateUserRoleList({ data: this.form });
      this.form = {};
      this.$refs.updateAlert.hide();
      this.search();
    },
    //关闭弹框
    closeAlert() {
      this.form = { role_id: [] };
      this.$refs.updateAlert.hide();
      this.is_update = true;
      this.operateId = '';
    },
  },
};
</script>

<style lang="css">
.el-transfer {
    font-size: 14px;
    padding-left: 50px;
}
</style>
