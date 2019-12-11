<template lang="html">
  <div id="sideMenu" style="height: 100vh; display: block; background: #1c2b36;overflow-y: scroll !important;" class="rowBar">
    <div class="base-main-left" id="menuBox" style="text-align: left;">
      <el-col :span="24" style="margin-bottom: 70px;">
        <span class="title">操作面板</span>
        <el-menu class="el-menu-vertical-demo" background-color="#1c2b36" text-color="#7ba0bb" active-text-color="#ffd04b" :unique-opened="true">
          <el-submenu v-for="(item, index) in menu" :key="index" :index="`${index}`">
            <template slot="title">
              <i class="fa-stack fa fa-cogs"></i>
              <span>{{ item.name }}</span>
            </template>
            <a v-for="(menu_item, menu_index) in item.menu" :key="menu_index" @click="turnTo(menu_item.uri)">
              <el-menu-item :index="`${index}-${menu_index}`">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ menu_item.name }}</el-menu-item>
            </a>
          </el-submenu>
        </el-menu>
      </el-col>
      <div class="base-footer">
        智慧物流管理平台 <br />
        Compyright © 2019-2020 <br />
        当前版本：1.0
      </div>
    </div>
  </div>
</template>

<script>
import { SYSTEM, PERSONNEL, CAR, BUSINESS, SETTLEMENT, SEARCH } from '@/util/role_menu.js';
import { mapState } from 'vuex';
export default {
  name: 'sideMenu',
  components: {},
  data() {
    return {
      menu: [],
    };
  },
  computed: {
    ...mapState({
      userRoleList: state => state.userRoleList,
    }),
  },
  created() {
    this.menuList();
  },
  methods: {
    turnTo(uri) {
      window.location.href = uri;
    },
    menuList() {
      this.menu.push(SYSTEM);
      this.menu.push(PERSONNEL);
      this.menu.push(CAR);
      this.menu.push(BUSINESS);
      this.menu.push(SETTLEMENT);
      this.menu.push(SEARCH);
    },
    openMenuList(index) {
      if (!this.$refs.collapse[index].show) {
        this.$refs.collapse.forEach(item => {
          item.show = false;
        });
        this.$refs.collapse[index].show = true;
      } else {
        this.$refs.collapse[index].show = false;
      }
    },
  },
};
</script>

<style lang="css" scoped>
.el-menu {
    border-right: solid 1px rgb(28, 43, 54);
    list-style: none;
    position: relative;
    margin: 0;
    padding-left: 0;
    background-color: rgb(28, 43, 54);
    margin-bottom: 80px;
}
a {
    color: #7ba0bb !important;
}
.base-main-left {
  float: left;
  height: 100%;
  width: 240px;
  background-color: #1c2b36;
}
.base-footer {
  font-size: 14px;
  padding: 15px 0;
  color: #46687f;
  background-color: #1c2b36;
  width: 240px;
  height: 80px;
  line-height: 16px;
  text-align: center;
  position: fixed;
  bottom: 0;
  letter-spacing: 1px;
  z-index: 999;
}

a:hover{
  text-decoration: none !important;
}
.mainmenu {
  margin-bottom: 0 !important;
}
.tit {
  color:#7ba0bb;
  display: block;
  line-height: 50px;
  font-size: 14px;
  padding-left: 40px;
  border-bottom: 1px solid #161e25;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.card-body{
  padding:0 !important;
}
.list-group-item{
    line-height: 20px !important;
    height: 40px !important;
    padding-top: 11px !important;
    margin-left: 0px !important;
    background-color: #161e25 !important;
    border-left: solid 6px #161e25 !important;
    color: #7ba0bb !important;
}
.list-group-item:hover{
  border-left: solid 6px #325671 !important;
	color:#fff !important;
}
.rowBar::-webkit-scrollbar{
  display: none;
}
.el-submenu__title{
  width: 240px;
}
.el-submenu .el-menu-item{
  width: 240px;
}
</style>

<style scoped>
@import '../assets/style/Font-Awesome-master/css/font-awesome.css';
@import '../assets/style/layout/base-Layout-bootstrap.css';
@import '../assets/style/base-style-bootstrap.css';
</style>
