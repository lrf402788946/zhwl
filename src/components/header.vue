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
              <li><a href="index.html">首 &nbsp;&nbsp; 页</a></li>
              <!-- <li><a @click="test()">test</a></li> -->
            </ul>
          </div>
          <div class="col-lg-2" style="padding-top: 1%;"><el-button type="primary" size="mini" @click="toDownload()">点击下载打印组件</el-button></div>
          <div class="col-lg-3"></div>
          <div class="col-lg-1 newHeaderDiv">
            <badge :info="info" :total="total" v-if="!loading"></badge>
          </div>
          <div class="col-lg-3 newHeaderDiv">
            <el-dropdown v-if="loginOrNot()">
              <span class="el-dropdown-link" style="margin: 50px;">{{ getName() }}<span class="button-down fa fa-caret-down"></span></span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <a href="/system.html#/password"><i class="fa fa-lock base-margin-right-5"></i>修改密码</a>
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
import badge from '@/components/badge.vue';
import { mapActions, mapState } from 'vuex';
import _ from 'lodash';
var Stomp = require('@stomp/stompjs');
export default {
  name: 'Header',
  components: {
    badge,
  },
  data() {
    return {
      avatar: require('@/assets/img/8082.jpg'),
      total: 0,
      Ws: '',
      Client: '',
      mqObj: { username: 'wy', pwd: '1' },
      loading: true,
      info: '',
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
  async created() {
    // this.isLogin();
    await this.toGetMsg();
  },
  methods: {
    ...mapActions(['login', 'logout', 'getMsg']),
    //下载打印插件
    async toDownload() {
      window.location.href = 'http://192.168.31.230:80/api/upload/clodop_setup.zip';
    },
    toLogout() {
      // sessionStorage.removeItem('userInfo');
      this.logout();
      window.location.href = '/login.html';
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
    async toGetMsg() {
      let result = await this.getMsg();
      let total = 0;
      if (`${result.rescode}` === '0') {
        if (_.get(result, `dataList`)) total = result.dataList.length;
      }
      let msg;
      if (total > 0) msg = `有 ${total} 提醒信息需要查看`;
      else msg = `无提醒信息`;
      this.$set(this, `info`, msg);
      this.$set(this, `total`, total);
      this.$set(this, `loading`, false);
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
