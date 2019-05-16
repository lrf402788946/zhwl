<template lang="html">
  <div id="bill">
    <el-button size="medium" v-if="!routerName.includes('already')" @click="openAlert()" type="primary">生成单据</el-button>
    <el-button type="primary" @click="openAlert()" v-else>详&nbsp;&nbsp;情</el-button>
    <el-dialog :visible.sync="dialog" title="结算单" width="60%" close-on-click-modal close-on-press-escape center>
      <div class="contExt" ref="print">
        <div class="topExt">
          请款审批单
        </div>
        <div class="yearExt" v-html="getDate()">{{ getDate() }}</div>
        <div class="applicantExt">
          <div class="applicantTxt">
            <p class="applicant">申请人</p>
            <p class="applicantName">{{ userInfo.user_name }}</p>
          </div>
          <div class="applicantTxt">
            <p class="applicant">部门经理</p>
            <p class="applicantName"></p>
          </div>
          <div class="applicantTxt">
            <p class="applicant">财务经理</p>
            <p class="applicantName"></p>
          </div>
        </div>
        <div class="applicantExt">
          <p class="manager">总经理</p>
          <p class="managerTxt"></p>
        </div>
        <div class="applicantExt mar0">
          <p class="payment">款项 支付单位</p>
          <p class="paymentTxt"><input size="small" placeholder="请填写支付单位" :disabled="routerName.includes('already')" v-model="billInfo.pay_unit" /></p>
        </div>
        <div class="applicantExt ">
          <p class="payment">薪金类型</p>
          <div class="paymentTxt">
            <div class="pay" @click="payType('0')">
              <div class="payList" style="padding-left: 70px;">{{ billInfo.pay_type === '0' ? '√' : '' }}现金</div>
            </div>
            <div class="pay marNone" @click="payType('1')">
              <div class="payList" style="padding-left: 70px;">{{ billInfo.pay_type === '1' ? '√' : '' }}银行汇款</div>
            </div>
          </div>
        </div>
        <div class="applicantExt mar0">
          <div class="serial">序号</div>
          <div class="use">用途</div>
          <div class="money" style="margin-left:20px;">金额(税后)</div>
        </div>
        <div class="applicantExt mar0" v-for="(item, index) in billList" :key="index">
          <div class="serial">{{ index + 1 }}</div>
          <div class="use">{{ item.cost_name }}</div>
          <div class="money"><input v-model="item.sh_ss" :disabled="routerName.includes('already')" @change="getMoney()" style="margin-left: 30px;" /></div>
        </div>
        <div class="applicantExt mar0">
          <p class="payment">合计（小写）</p>
          <div class="paymentTxt">
            ￥：<span><input :disabled="routerName.includes('already')" v-model="billInfo.count_price" style="width:80%"/></span>
          </div>
        </div>
        <div class="applicantExt">
          <p class="payment">付款金额（大写）</p>
          <div class="paymentTxt">￥：<input :disabled="routerName.includes('already')" v-model="billInfo.count_price_up" style="width:80%" /></div>
        </div>
        <div class="applicantExt mar0">
          <p class="payment">收款单位（全称）</p>
          <div class="paymentTxt">{{ client.c_name }}</div>
        </div>
        <div class="applicantExt mar0">
          <p class="payment">开户行</p>
          <div class="paymentTxt">{{ client.c_bank }}</div>
        </div>
        <div class="applicantExt">
          <p class="payment">账号</p>
          <div class="paymentTxt">{{ client.c_account }}</div>
        </div>
        <div class="paste mar0">
          <span class="padd10">粘贴处（可付背面）</span>
        </div>
        <div class="applicantExt">
          <p class="payment">附原始账单张数</p>
          <div class="paymentTxt"></div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog = false">返回</el-button>
        <el-button type="primary" @click="toPrint()">打印</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
export default {
  name: 'bill',
  components: {},
  props: {
    id: { defalut: '' },
  },
  data() {
    return {
      dialog: false,
      billList: [],
      billInfo: {},
      info: {},
      client: {},
      routerName: this.$route.name,
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.publics.userInfo,
    }),
  },
  methods: {
    ...mapActions(['gysGysSelectList', 'gysEditAndPrint', 'gysBillInfo']),
    async openAlert() {
      let loading_list = this.$parent.loading_list;
      if (loading_list <= 0 && !this.routerName.includes('already')) {
        this.$message.error('请选择要生成单据的数据');
        return false;
      }
      if (this.routerName.includes('already')) {
        let result = await this.gysBillInfo({ id: this.id });
        let out_idList = result.bill.out_id.split(',');
        let out_itemList = result.bill.out_item.split(',');
        let out_priceList = result.bill.out_price.split(',');
        let billList = [];
        for (let index = 0; index < out_idList.length - 1; index++) {
          let object = {};
          object.cost_name = out_itemList[index];
          object.sh_ss = out_priceList[index];
          billList.push(object);
        }
        this.$set(this, `billList`, billList);
        this.$set(this, `billInfo`, result.bill);
      } else {
        let { result, ids } = await this.gysGysSelectList({ ids: loading_list });
        let allMoney = result.outList.reduce((prev, cur) => {
          return prev * 1 + cur.sh_ss * 1;
        }, 0);
        let billInfo = {};
        let idsStr = '';
        ids.map(item => {
          idsStr = idsStr === '' ? `${item},` : `${idsStr}${item},`;
        });
        billInfo.out_id = idsStr;
        billInfo.count_price = allMoney;
        billInfo.count_price_up = this.Arabia_To_SimplifiedChinese(allMoney);
        this.$set(this, `billList`, result.outList);
        this.$set(this, `billInfo`, billInfo);
        let client = {};
        client.c_id = result.id;
        client.c_name = result.client.name;
        client.c_bank = result.client.bank;
        client.c_account = result.client.card_account;
        this.$set(this, `client`, client);
      }

      this.dialog = true;
    },
    closeAlert() {
      this.dialog = false;
    },
    async toPrint() {
      this.$print(this.$refs.print);
      if (!this.routerName.includes('already')) {
        let form = JSON.parse(JSON.stringify(this.billInfo));
        form.login_id = this.userInfo.login_id;
        let out_item = '';
        let out_price = '';
        this.billList.map(item => {
          out_item = out_item === '' ? `${item.cost_name},` : `${out_item}${item.cost_name},`;
          out_price = out_price === '' ? `${item.sh_ss},` : `${out_price}${item.sh_ss},`;
        });
        form.out_item = out_item;
        form.out_price = out_price;
        form = Object.assign(form, this.client);
        await this.gysEditAndPrint({ form: form });
      }
    },
    payType(data) {
      this.$set(this.billInfo, `pay_type`, `${data}`);
    },
    getDate() {
      let date = new Date();
      return `<span>${date.getYear() + 1900}</span>年<span>${date.getMonth() + 1}</span>月<span>${date.getDate()}</span>日`;
    },
    getMoney() {
      let allMoney = this.billList.reduce((prev, cur) => {
        return prev * 1 + cur.sh_ss * 1;
      }, 0);
      this.$set(this.billInfo, `count_price`, allMoney);
      this.$set(this.billInfo, `count_price_up`, this.Arabia_To_SimplifiedChinese(allMoney));
    },
    //阿拉伯数字转换为简写汉字
    Arabia_To_SimplifiedChinese(Num) {
      let i;
      for (i = Num.length - 1; i >= 0; i--) {
        Num = Num.replace(',', ''); //替换Num中的“,”
        Num = Num.replace(' ', ''); //替换Num中的空格
      }
      if (isNaN(Num)) {
        //验证输入的字符是否为数字
        //alert("请检查小写金额是否正确");
        return;
      }
      //字符处理完毕后开始转换，采用前后两部分分别转换
      let part = String(Num).split('.');
      let newchar = '';
      //小数点前进行转化
      for (i = part[0].length - 1; i >= 0; i--) {
        if (part[0].length > 10) {
          //alert("位数过大，无法计算");
          return '';
        } //若数量超过拾亿单位，提示
        let tmpnewchar = '';
        let perchar = part[0].charAt(i);
        switch (perchar) {
          case '0':
            tmpnewchar = '零' + tmpnewchar;
            break;
          case '1':
            tmpnewchar = '一' + tmpnewchar;
            break;
          case '2':
            tmpnewchar = '二' + tmpnewchar;
            break;
          case '3':
            tmpnewchar = '三' + tmpnewchar;
            break;
          case '4':
            tmpnewchar = '四' + tmpnewchar;
            break;
          case '5':
            tmpnewchar = '五' + tmpnewchar;
            break;
          case '6':
            tmpnewchar = '六' + tmpnewchar;
            break;
          case '7':
            tmpnewchar = '七' + tmpnewchar;
            break;
          case '8':
            tmpnewchar = '八' + tmpnewchar;
            break;
          case '9':
            tmpnewchar = '九' + tmpnewchar;
            break;
        }
        switch (part[0].length - i - 1) {
          case 0:
            // eslint-disable-next-line no-self-assign
            tmpnewchar = tmpnewchar;
            break;
          case 1:
            if (perchar != 0) tmpnewchar = tmpnewchar + '十';
            break;
          case 2:
            if (perchar != 0) tmpnewchar = tmpnewchar + '百';
            break;
          case 3:
            if (perchar != 0) tmpnewchar = tmpnewchar + '千';
            break;
          case 4:
            tmpnewchar = tmpnewchar + '万';
            break;
          case 5:
            if (perchar != 0) tmpnewchar = tmpnewchar + '十';
            break;
          case 6:
            if (perchar != 0) tmpnewchar = tmpnewchar + '百';
            break;
          case 7:
            if (perchar != 0) tmpnewchar = tmpnewchar + '千';
            break;
          case 8:
            tmpnewchar = tmpnewchar + '亿';
            break;
          case 9:
            tmpnewchar = tmpnewchar + '十';
            break;
        }
        newchar = tmpnewchar + newchar;
      }
      //替换所有无用汉字，直到没有此类无用的数字为止
      while (newchar.search('零零') != -1 || newchar.search('零亿') != -1 || newchar.search('亿万') != -1 || newchar.search('零万') != -1) {
        newchar = newchar.replace('零亿', '亿');
        newchar = newchar.replace('亿万', '亿');
        newchar = newchar.replace('零万', '万');
        newchar = newchar.replace('零零', '零');
      }
      //替换以“一十”开头的，为“十”
      if (newchar.indexOf('一十') == 0) {
        newchar = newchar.substr(1);
      }
      //替换以“零”结尾的，为“”
      if (newchar.lastIndexOf('零') == newchar.length - 1) {
        newchar = newchar.substr(0, newchar.length - 1);
      }
      return newchar;
    },
  },
};
</script>

<style lang="css" scoped>
* {
    padding: 0;
    margin: 0;
    list-style-type: none;
    text-decoration: none;
  }
  input{
    width: 100%;
    border: 0;
    line-height: 30px;
  }
  .contExt{
      margin: 30px 11%;
  }
  .topExt{
      padding-left: 34%;
      font-weight: bold;
      font-size: 17px;
  }
  .yearExt{
      padding-left: 33%;
      margin-top: 20px;
      margin-bottom: 20px;
      font-size: 14px;
  }
  .yearExt span {
      padding: 0 5px;
  }
  .applicantExt {
      margin-bottom: 8px;
      border: 1px solid #999;
      height:40px;
      line-height: 40px;
      width: 600px;
  }
  .applicantTxt {
      width: 33%;
      float: left;
      border-right: 1px solid #999;
  }
  .applicant {
      width: 39%;
      float: left;
      border-right: 1px solid #999;
      text-align: center;
  }
  .applicantName {
      width: 60%;
      float: left;
      text-align: center;
  }
  .applicantExt .applicantTxt:nth-child(3){
      border-right: none !important;
  }
  .manager {
      width:13%;
      float: left;
      text-align: center;
      border-right: 1px solid #999;
      height:40px;
      line-height: 40px;
  }
  .managerTxt {
      width: 77%;
      float: left;
      height:40px;
      padding-left: 2%;
      line-height: 40px;
  }
  .payment {
      width:33%;
      float: left;
      text-align: center;
      border-right: 1px solid #999;
      height:40px;
      line-height: 40px;
  }
  .paymentTxt {
      width: 64%;
      float: left;
      height:40px;
      padding-left: 2%;
      line-height: 40px;
  }
  .mar0 {
      margin-bottom: 0 !important;
      border-bottom: none !important;
  }
  .pay {
      width: 49%;
      float: left;
      border-right: 1px solid #999;
  }
  .marNone {
      border-right: none !important;
  }
  .payList {
      float: left;
  }
  .payList span {
      padding: 0 5px;
  }
  .padd5 {
      padding-left: 13px;
  }
  .serial{
      width: 13%;
      float: left;
      border-right: 1px solid #999;
      text-align: center;
  }
  .use {
      width: 66%;
      float: left;
      border-right: 1px solid #999;
      text-align: center;
  }
  .money {
      width: 13%;
      float: left;
      text-align: center;
  }
  .paymentTxt span {
      padding: 0 5px;
  }
  .paste {
      margin-bottom: 8px;
      border: 1px solid #999;
      height: 250px;
      width: 600px;
  }
  .padd10{
      padding:8px 10px;
  }
</style>
