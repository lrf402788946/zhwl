<template lang="html">
  <div id="exportExcel">
    <div style="width:80px; height:40px; line-height:40px;">
      <b-button
        variant="primary"
        @click="excel()"
        style="font-size:14px !important; color:#fff !important; width: 100% !important; padding: 6px 0 !important; margin-right:0 !important;"
      >
        导&nbsp;&nbsp;出</b-button
      >
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import needAllDataList from '@/util/exportExcelNeedAllData.js';
export default {
  name: 'exportExcel',
  props: {
    exportTitle: { type: Array, defalut: [] }, //数据库字段名称
    db_nameList: { type: Array, defalut: [] }, //数据库字段名称对应导出的中文
    dataName: { type: String, defalut: '' }, //获取父组件那个数据集作为数据源
    fileName: { type: String, default: `exportFileName${Date.parse(new Date())}` }, //文件名
    sheetName: { type: String, default: 'sheet1' }, //excel表格名,也用来判断如何取数据
    data: null,
  },
  components: {},
  data() {
    return {
      list: [],
      limit: 10000,
    };
  },
  computed: {},
  created() {
    // this.allData();
  },
  methods: {
    async search() {
      //查询方法
      let name1 = this.$route.name;
      let skip = 0;
      let result;
      if (name1 === 'gongxin') {
        result = await this.$axios.get(`/api/wages/wages_list?skip=${skip}&limit=${this.limit}&create_time=${this.$parent.$data.value1}`);
        this.$set(this, 'list', result.wagesList);
      } else if (name1 === 'material') {
        result = await this.$axios.get(`/api/cl/cl_list?skip=${skip}&limit=${this.limit}`);
        this.$set(this, 'list', result.cList);
      } else if (name1 === 'customer') {
        result = await this.$axios.get(`/api/customer/customer_list?skip=${skip}&limit=${this.limit}&name=${this.$parent.select_name}`);
        this.$set(this, 'list', result.customerList);
      } else {
        result = await this.$axios.get(`/api/${name1}/${name1}_list?skip=${skip}&limit=${this.limit}`);
        this.$set(this, 'list', _.get(result, name1 + 'List'));
      }
    },
    async excel() {
      let th = this.exportTitle;
      let filterVar = this.db_nameList;
      let routerName = this.$route.name;
      let originData;
      if (this.sheetName === '客户结算单') {
        originData = _.get(this.$parent.$parent, this.dataName);
      } else {
        if (this.data === null) originData = _.get(this.$parent, this.dataName);
        else originData = this.data;
      }
      if (originData.length > 0) {
        const data = originData.map(v => filterVar.map(k => v[k]));
        const [fileName, fileType, sheetName] = [this.fileName, 'xlsx', this.sheetName];
        this.$message('正在导出,请耐心等待');
        this.$toExcel({ th, data, fileName, fileType, sheetName });
        if (this.sheetName === '客户结算单') {
          this.$emit('edit');
        }
        this.$message.success('导出成功');
      } else {
        this.$message.error('无可导出的数据');
      }
    },
    newData(type) {
      if (type === 'staff') {
        let deptList = _.get(this.$parent, 'deptList');
        let postList = _.get(this.$parent, 'postList');
        let originData = _.get(this.$parent, this.dataName);
        let newData = originData.map(item => {
          let newObject = {
            job_num: item.job_num,
            name: item.name,
            gender: item.gender === 0 ? '女' : '男',
            phone_no: item.phone_no,
            birthday: item.birthday,
            home_address: item.home_address,
            id_number: item.birthday,
            dept_id: this.getName(deptList, item.dept_id),
            level: item.level,
            post_id: this.getName(postList, item.post_id),
            status: item.status === 0 ? '在职' : item.status === 1 ? '离职' : '退休',
            tq: item.tq === 0 ? '通勤' : '不通勤',
            in_time: item.in_time,
            remark: item.remark,
          };
          return newObject;
        });
        return newData;
      } else if (type === 'kind') {
        let workList = _.get(this.$parent, 'workList');
        let originData = _.get(this.$parent, this.dataName);
        let newData = originData.map(item => {
          let newObject = {
            work_id: this.getName(workList, item.work_id),
            code: item.code,
            name: item.name,
            jj_price: item.jj_price,
          };
          return newObject;
        });
        return newData;
      }
    },
    getName(data, value) {
      for (const item2 of data) {
        if (item2.value === value) {
          return item2.text;
        }
      }
    },
  },
};
</script>

<style lang="css">
.col-lg-1{
  float: left;
}
.btn-primary:hover{
  background-color:#17a2b8 !important;
}
</style>
