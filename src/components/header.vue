<template lang="html">
  <div id="Header">
    <div class="base-header">
      <div class="base-header-left" id="menuHead">
        <img src="../assets/img/logo.png" alt="..." class="img-rounded" />
      </div>
      <div class="base-nav" id="base-nav">
        <div class="row">
          <div class="col-lg-3">
            <ul class="top-nav-ul">
              <li><a href="/system.html#/">首 &nbsp;&nbsp; 页</a></li>
            </ul>
          </div>
          <div class="col-lg-5"></div>
          <div class="col-lg-1 newHeaderDiv">
            <el-dropdown>
              <el-badge :value="infoList.length" v-if="infoList.length <= 0" class="item" type="primary">
                <el-button type="info" icon="el-icon-message" circle></el-button>
              </el-badge>
              <el-badge v-else :value="infoList.length" class="item">
                <el-button type="danger" icon="el-icon-message" circle></el-button>
              </el-badge>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="(item, index) in infoList" :key="index">{{ item.message }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="col-lg-3 newHeaderDiv">
            <el-dropdown v-if="loginOrNot()">
              <span class="el-dropdown-link" style="margin: 50px;">{{ getName() }}<span class="button-down fa fa-caret-down"></span></span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <a @click="$router.push({ name: 'update_pw' })"><i class="fa fa-lock base-margin-right-5"></i>修改密码</a>
                </el-dropdown-item>
                <el-dropdown-item>
                  <a @click="toLogout()"><i class="fa fa-sign-out base-margin-right-5"></i>安全退出</a>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown v-else>
              <span class="el-dropdown-link" style="margin: 50px;">{{ getName() }}<span class="button-down fa fa-caret-down"></span></span>
            </el-dropdown>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
export default {
  name: 'Header',
  components: {},
  data() {
    return {
      avatar: require('@/assets/img/8082.jpg'),
      infoList: [{ message: 'test Infomation 1' }, { message: 'test Infomation 2' }, { message: 'test Infomation 3' }],
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.publics.userInfo,
    }),
  },
  mounted() {
    $('#base-nav').width($(window).width() - 241);
    $(window).resize(function() {
      $('#base-nav').width($(window).width() - 241);
    });
  },
  created() {
    // this.isLogin();
  },
  methods: {
    ...mapActions(['login', 'logout']),
    toLogout() {
      // sessionStorage.removeItem('userInfo');
      this.logout();
      window.location.href = '/';
    },
    loginOrNot() {
      this.login();
      if (this.userInfo.user_name) {
        return true;
      } else {
        return false;
      }
    },
    getName() {
      if (this.userInfo.user_name) {
        return this.userInfo.user_name ? `欢迎${this.userInfo.user_name}` : '用户';
      } else {
        return '您未登录';
      }
    },
  },
};
</script>

<style lang="css" scoped>
.newHeaderDiv{
    display: block;
    list-style-type: disc;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 40px;
}
.base-nav ul.top-nav-ul li a {
    color: #4f5151 !important;
}
.base-nav ul.top-nav-ul li a:hover {
    color: #fff !important;
}
#base-user a.user-name {
    color: #4f5151 !important;
}
#base-user a.user-name:hover {
    color: #5bc0de !important;
}
#base-user div a {
    color: #4f5151 !important;
}
#base-user div a:hover {
    color: #fff !important;
}
</style>
