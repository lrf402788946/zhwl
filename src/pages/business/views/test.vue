<template lang="html">
  <div id="test">
    <div style="">
      <div style="font-size:20px;font-weight:700;">
        运输单
      </div>
      <div style="text-align:center;">
        <table style="width: -webkit-fill-available;">
          <tbody>
            <tr>
              <th colspan="2">运输单号</th>
              <th colspan="2">发货日期</th>
            </tr>
            <tr>
              <td colspan="2">{{ form.transport_no || 'none' }}</td>
              <td colspan="2">{{ form.send_time || 'none' }}</td>
            </tr>
            <tr>
              <th colspan="4">运输线路内容</th>
            </tr>
            <tr>
              <td colspan="4">{{ form.content || 'none' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'test',
  components: {},
  data() {
    return {
      form: {},
    };
  },
  computed: {},
  methods: {},
};
</script>

<style lang="css" scoped></style>
