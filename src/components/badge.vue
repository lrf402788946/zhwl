<template>
  <div id="badge">
    <el-tooltip effect="dark" :content="info" placement="bottom" ref="toop">
      <el-badge :value="total" class="item" :type="`${total > 0 ? 'danger' : 'primary'}`" ref="badge">
        <el-button
          :type="`${total > 0 ? 'danger' : 'info'}`"
          :icon="`${total > 0 ? 'el-icon-message' : 'el-icon-message'}`"
          circle
          @click="toIndex()"
        ></el-button>
        <!-- <el-button type="danger" icon="el-icon-message" circle @click="toIndex()" v-else></el-button> -->
      </el-badge>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: 'badge',
  props: {
    info: { type: String, required: true },
    total: { type: Number, default: 0, required: true },
  },
  components: {},
  data: () => ({}),
  created() {},
  mounted() {},
  computed: {},
  methods: {
    toIndex() {
      window.location.href = '/index.html#/';
    },
  },
};
</script>

<style lang="less" scoped></style>
