<template lang="html">
  <div id="password">
    <div class="base-form">
      <div class="form-inline">
        <div class="base-form-title" style="width:100%;">
          <a class="base-margin-left-20">修改密码</a>
          <div class="button-table"></div>
        </div>
      </div>
      <div class="base-padding-20 base-bg-fff" style="padding-top: 50px;">
        <div class="d-block text-center">
          <div class="row">
            <div class="col-lg-4" style="text-align: end; line-height: 35px;">原密码</div>
            <div class="col-lg-3" style="margin-bottom:30px;">
              <b-form-input type="password" v-model="form.password" placeholder="请输入原密码"></b-form-input>
            </div>
            <div class="col-lg-5"></div>
            <div class="col-lg-4" style="text-align: end; line-height: 35px;">新密码</div>
            <div class="col-lg-3" style="margin-bottom:30px;">
              <b-form-input type="password" v-model="form.passwordNew" placeholder="请输入新密码"></b-form-input>
            </div>
            <div class="col-lg-5"></div>
            <div class="col-lg-4" style="text-align: end; line-height: 35px;">确认密码</div>
            <div class="col-lg-3" style="margin-bottom:30px;">
              <b-form-input type="password" v-model="comfirm" placeholder="请确认密码"></b-form-input>
            </div>
            <div class="col-lg-5"></div>
            <div class="col-lg-4"></div>
            <div class="col-lg-3" style="margin-bottom:50px;">
              <b-button variant="secondary" @click="(form = {}), (comfirm = '')" class="chongBtn" style="float:left;">重&nbsp;&nbsp;置</b-button>
              <b-button variant="primary" @click="toSave()" class="chongBtn" style="float:right;">保&nbsp;&nbsp;存</b-button>
            </div>
            <div class="col-lg-5"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
export default {
  name: 'password',
  components: {},
  data() {
    return {
      form: {},
      comfirm: '',
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.publics.userInfo,
    }),
  },
  methods: {
    ...mapActions(['updatePassword']),
    async toSave() {
      if (this.comfirm === this.form.passwordNew) {
        this.form['login_id'] = this.userInfo.login_id;
        let result = await this.updatePassword({ form: this.form });
        if (result) {
          this.$router.push({ path: '/' });
        }
      } else {
        this.$message.error('输入密码不一致');
      }
    },
  },
};
</script>

<style lang="css" scoped></style>
