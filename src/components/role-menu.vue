<template>
  <div id="role-menu">
    <el-row>
      <el-col :span="24">
        <el-transfer v-model="roleList" :data="data" :titles="['所有菜单权限', '已有菜单权限']" :button-texts="['移除', '添加']"></el-transfer>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center" align="middle">
      <el-col :span="3">
        <el-button type="info" @click="$emit('cancel')">返回</el-button>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" @click="save()">保存</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'role-menu',
  props: {
    data: { type: Array, default: () => [] },
    role: { type: Array, default: () => [] },
  },
  components: {},
  data: () => ({
    roleList: [],
  }),
  watch: {
    role: {
      handler(val) {
        this.$set(this, `roleList`, val);
      },
      immediate: true,
    },
  },
  created() {},
  computed: {},
  methods: {
    save() {
      this.$emit('save', this.roleList);
    },
  },
};
</script>

<style lang="less" scoped></style>
