<template>
  <div>
    <div>
      <el-card>
        <template #header>
          <el-row>
            <el-col :span="24" style="text-align:left">
              待办事项
            </el-col>
          </el-row>
        </template>
        <el-table :data="data" border stripe :show-header="false" height="500">
          <el-table-column>
            <template slot-scope="scoped">
              <el-row>
                <el-col :span="18">
                  {{ scoped.row.content }}
                </el-col>
                <el-col :span="6" style="text-align:right">
                  <el-button type="text" @click="toDeleteMsg(scoped.row)">[不再提示]</el-button>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
export default {
  data() {
    return {
      img: require('@/assets/img/blurred.jpg'),
      data: [],
    };
  },
  created() {
    // this.test();
    this.toGetMsg();
  },
  mounted() {},
  methods: {
    ...mapActions(['getMsg', 'editMsg', 'deleteMsg']),
    async toGetMsg() {
      let result = await this.getMsg();
      if (`${result.rescode}` === '0') this.$set(this, `data`, result.dataList);
    },
    async toDeleteMsg(item) {
      let result = await this.deleteMsg({ id: item.id });
      if (`${result.rescode}` === '0') {
        this.$message.success('操作成功');
        this.toGetMsg();
      }
    },
  },
};
</script>

<style scoped></style>
