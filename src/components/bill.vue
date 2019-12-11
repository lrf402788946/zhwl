<template lang="html">
  <div id="bill">
    <el-button size="medium" v-if="!routerName.includes('already')" @click="openAlert()" type="primary">生成单据</el-button>
    <el-button type="primary" @click="openAlert()" v-else>详&nbsp;&nbsp;情</el-button>
    <el-dialog :visible.sync="dialog" title="结算单" width="60%" close-on-click-modal close-on-press-escape center>
      <div style="padding: 0;margin: 0;list-style-type: none;text-decoration: none;margin: 30px 11%;" ref="print" id="printDiv">
        <div style="padding: 0;margin: 0;list-style-type: none;text-decoration: none;padding-left: 34%;font-weight: bold;font-size: 17px;">
          请款审批单
        </div>
        <div
          style="padding: 0;margin: 0;list-style-type: none;text-decoration: none;padding-left: 33%;margin-top: 20px;margin-bottom: 20px;font-size: 14px;"
          v-html="getDate()"
        >
          {{ getDate() }}
        </div>
        <div
          style="padding: 0;margin: 0;list-style-type: none;text-decoration: none;margin-bottom: 8px;border: 1px solid #999; height:40px;line-height: 40px;width: 600px;"
        >
          <div style="padding: 0;margin: 0;list-style-type: none;text-decoration: none;width: 33%;float: left;border-right: 1px solid #999;">
            <p style="padding: 0;margin: 0;list-style-type: none;text-decoration: none;width: 39%;float: left;border-right: 1px solid #999;text-align: center;">
              申请人
            </p>
            <p style="padding: 0;margin: 0;list-style-type: none;text-decoration: none;width: 60%;float: left;text-align: center;">{{ userInfo.user_name }}</p>
          </div>
          <div style="padding: 0;margin: 0;list-style-type: none;text-decoration: none;width: 33%;float: left;border-right: 1px solid #999;">
            <p style="padding: 0;margin: 0;list-style-type: none;text-decoration: none;width: 39%;float: left;border-right: 1px solid #999;text-align: center;">
              部门经理
            </p>
            <p style="padding: 0;margin: 0;list-style-type: none;text-decoration: none;width: 60%;float: left;text-align: center;"></p>
          </div>
          <div style="padding: 0;margin: 0;list-style-type: none;text-decoration: none;width: 33%;float: left;border-right: 0px solid #999;">
            <p style="padding: 0;margin: 0;list-style-type: none;text-decoration: none;width: 39%;float: left;border-right: 1px solid #999;text-align: center;">
              财务经理
            </p>
            <p style="padding: 0;margin: 0;list-style-type: none;text-decoration: none;width: 60%;float: left;text-align: center;"></p>
          </div>
        </div>
        <div
          style="padding: 0;margin: 0;list-style-type: none;text-decoration: none;margin-bottom: 8px;border: 1px solid #999; height:40px;line-height: 40px;width: 600px;"
        >
          <p
            style="padding: 0;margin: 0;list-style-type: none;text-decoration: none;width:13%;float: left;text-align: center;border-right: 1px solid #999;height:40px;line-height: 40px;"
          >
            总经理
          </p>
          <p
            style="padding: 0;margin: 0;list-style-type: none;text-decoration: none;width: 77%;float: left;height:40px;padding-left: 2%;line-height: 40px;"
          ></p>
        </div>
        <div
          style="padding: 0;margin: 0;list-style-type: none;text-decoration: none;margin-bottom: 8px;border: 1px solid #999;height:40px;line-height: 40px;width: 600px;margin-bottom: 0 !important;border-bottom: none !important;"
        >
          <p
            style="padding: 0;margin: 0;list-style-type: none;text-decoration: none;width:33%;float: left;text-align: center;border-right: 1px solid #999;height:40px;line-height: 40px;"
          >
            款项 支付单位
          </p>
          <p style="padding: 0;margin: 0;list-style-type: none;text-decoration: none;width: 64%;float: left;height:40px;padding-left: 2%;line-height: 40px;">
            {{ billInfo.pay_unit }}
          </p>
        </div>
        <div
          style="padding: 0;margin: 0;list-style-type: none;text-decoration: none;margin-bottom: 8px;border: 1px solid #999;height:40px;line-height: 40px;width: 600px;"
        >
          <p
            style="padding: 0;margin: 0;list-style-type: none;text-decoration: none;width:33%;float: left;text-align: center;border-right: 1px solid #999;height:40px;line-height: 40px;"
          >
            薪金类型
          </p>
          <div style="padding: 0;margin: 0;list-style-type: none;text-decoration: none;width: 64%;float: left;height:40px;padding-left: 2%;line-height: 40px;">
            <div
              style="padding: 0;margin: 0;list-style-type: none;text-decoration: none;width: 49%;float: left;border-right: 1px solid #999;"
              @click="payType('0')"
            >
              <div style="padding: 0;margin: 0;list-style-type: none;text-decoration: none;float: left;padding-left: 70px;">
                {{ billInfo.pay_type === '0' ? '√' : '' }}现金
              </div>
            </div>
            <div
              style="padding: 0;margin: 0;list-style-type: none;text-decoration: none;width: 49%;float: left;border-right: 1px solid #999;border-right: none !important;"
              @click="payType('1')"
            >
              <div style="padding: 0;margin: 0;list-style-type: none;text-decoration: none;float: left;padding-left: 70px;">
                {{ billInfo.pay_type === '1' ? '√' : '' }}银行汇款
              </div>
            </div>
          </div>
        </div>
        <div
          style="padding: 0;margin: 0;list-style-type: none;text-decoration: none;margin-bottom: 8px;border: 1px solid #999;height:40px;line-height: 40px;width: 600px;margin-bottom: 0 !important;border-bottom: none !important;"
        >
          <div style="padding: 0;margin: 0;list-style-type: none;text-decoration: none;width: 13%;float: left;border-right: 1px solid #999;text-align: center;">
            序号
          </div>
          <div style="padding: 0;margin: 0;list-style-type: none;text-decoration: none;width: 66%;float: left;border-right: 1px solid #999;text-align: center;">
            用途
          </div>
          <div style="padding: 0;margin: 0;list-style-type: none;text-decoration: none;width: 13%;float: left;text-align: center;margin-left:20px;">
            金额(税后)
          </div>
        </div>
        <div
          style="padding: 0;margin: 0;list-style-type: none;text-decoration: none;margin-bottom: 8px;border: 1px solid #999;height:40px;line-height: 40px;width: 600px;margin-bottom: 0 !important;border-bottom: none !important;"
          v-for="(item, index) in billList"
          :key="index"
        >
          <div style="padding: 0;margin: 0;list-style-type: none;text-decoration: none;width: 13%;float: left;border-right: 1px solid #999;text-align: center;">
            {{ index + 1 }}
          </div>
          <div style="padding: 0;margin: 0;list-style-type: none;text-decoration: none;width: 66%;float: left;border-right: 1px solid #999;text-align: center;">
            {{ item.cost_name }}
          </div>
          <div style="padding: 0;margin: 0;list-style-type: none;text-decoration: none;width: 13%;float: left;text-align: center;">{{ item.sh_ss }}.00</div>
        </div>
        <div
          style="padding: 0;margin: 0;list-style-type: none;text-decoration: none;margin-bottom: 8px;border: 1px solid #999;height:40px;line-height: 40px;width: 600px;margin-bottom: 0 !important;border-bottom: none !important;"
        >
          <p
            style="padding: 0;margin: 0;list-style-type: none;text-decoration: none;width:33%;float: left;text-align: center;border-right: 1px solid #999;height:40px;line-height: 40px;"
          >
            合计（小写）
          </p>
          <div style="padding: 0;margin: 0;list-style-type: none;text-decoration: none;width: 64%;float: left;height:40px;padding-left: 2%;line-height: 40px;">
            ￥：<span style="padding: 0;margin: 0;list-style-type: none;text-decoration: none;padding: 0 5px;">{{ billInfo.count_price }}.00元</span>
          </div>
        </div>
        <div
          style="padding: 0;margin: 0;list-style-type: none;text-decoration: none;margin-bottom: 8px;border: 1px solid #999; height:40px;line-height: 40px;width: 600px;"
        >
          <p
            style="padding: 0;margin: 0;list-style-type: none;text-decoration: none;width:33%;float: left;text-align: center;border-right: 1px solid #999;height:40px;line-height: 40px;"
          >
            付款金额（大写）
          </p>
          <div style="padding: 0;margin: 0;list-style-type: none;text-decoration: none;width: 64%;float: left;height:40px;padding-left: 2%;line-height: 40px;">
            ￥：{{ billInfo.count_price_up }}元整
          </div>
        </div>
        <div
          style="padding: 0;margin: 0;list-style-type: none;text-decoration: none;margin-bottom: 8px;border: 1px solid #999;height:40px;line-height: 40px;width: 600px;margin-bottom: 0 !important;border-bottom: none !important;"
        >
          <p
            style="padding: 0;margin: 0;list-style-type: none;text-decoration: none;width:33%;float: left;text-align: center;border-right: 1px solid #999;height:40px;line-height: 40px;"
          >
            收款单位（全称）
          </p>
          <div style="padding: 0;margin: 0;list-style-type: none;text-decoration: none;width: 64%;float: left;height:40px;padding-left: 2%;line-height: 40px;">
            {{ client.c_name }}
          </div>
        </div>
        <div
          style="padding: 0;margin: 0;list-style-type: none;text-decoration: none;margin-bottom: 8px;border: 1px solid #999;height:40px;line-height: 40px;width: 600px;margin-bottom: 0 !important;border-bottom: none !important;"
        >
          <p
            style="padding: 0;margin: 0;list-style-type: none;text-decoration: none;width:33%;float: left;text-align: center;border-right: 1px solid #999;height:40px;line-height: 40px;"
          >
            开户行
          </p>
          <div style="padding: 0;margin: 0;list-style-type: none;text-decoration: none;width: 64%;float: left;height:40px;padding-left: 2%;line-height: 40px;">
            {{ client.c_bank }}
          </div>
        </div>
        <div
          style="padding: 0;margin: 0;list-style-type: none;text-decoration: none;margin-bottom: 8px;border: 1px solid #999; height:40px;line-height: 40px;width: 600px;"
        >
          <p
            style="padding: 0;margin: 0;list-style-type: none;text-decoration: none;width:33%;float: left;text-align: center;border-right: 1px solid #999;height:40px;line-height: 40px;"
          >
            账号
          </p>
          <div style="padding: 0;margin: 0;list-style-type: none;text-decoration: none;width: 64%;float: left;height:40px;padding-left: 2%;line-height: 40px;">
            {{ client.c_account }}
          </div>
        </div>
        <div
          style="padding: 0;margin: 0;list-style-type: none;text-decoration: none;margin-bottom: 8px;border: 1px solid #999;height: 250px;width: 600px;margin-bottom: 0 !important;border-bottom: none !important;"
        >
          <span style="padding: 0;margin: 0;list-style-type: none;text-decoration: none; padding:8px 10px;">粘贴处（可付背面）</span>
        </div>
        <div
          style="padding: 0;margin: 0;list-style-type: none;text-decoration: none;margin-bottom: 8px;border: 1px solid #999; height:40px;line-height: 40px;width: 600px;"
        >
          <p
            style="padding: 0;margin: 0;list-style-type: none;text-decoration: none;width:33%;float: left;text-align: center;border-right: 1px solid #999;height:40px;line-height: 40px;"
          >
            附原始账单张数
          </p>
          <div
            style="padding: 0;margin: 0;list-style-type: none;text-decoration: none;width: 64%;float: left;height:40px;padding-left: 2%;line-height: 40px;"
          ></div>
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
import { getLodop } from '../util/LodopFuncs';
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
        let client = {};
        client.c_id = result.bill.c_id;
        client.c_name = result.bill.c_name;
        client.c_bank = result.bill.c_bank;
        client.c_account = result.bill.c_account;
        this.$set(this, `client`, client);
      } else {
        let { result, ids } = await this.gysGysSelectList({ ids: loading_list });
        let allMoney = result.countPrice;
        let billInfo = {};
        let idsStr = '';
        ids.map(item => {
          idsStr = idsStr === '' ? `${item},` : `${idsStr}${item},`;
        });
        billInfo.out_id = idsStr;
        billInfo.count_price = allMoney;
        billInfo.count_price_up = this.Arabia_To_SimplifiedChinese(allMoney);
        billInfo.pay_unit = '长春市傲维运输有限公司';
        this.$set(this, `billList`, result.outList);
        this.$set(this, `billInfo`, billInfo);
        let client = {};
        client.c_id = result.client.id;
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
      //this.$print(this.$refs.print);
      let LODOP = getLodop();
      LODOP.PRINT_INIT('订货单');
      LODOP.SET_PRINT_STYLE('FontSize', 18);
      LODOP.SET_PRINT_STYLE('Bold', 1);

      LODOP.ADD_PRINT_HTM(30, 55, 800, 1000, document.getElementById('printDiv').innerHTML);
      //        LODOP.PRINT();
      LODOP.PREVIEW();
      if (!this.routerName.includes('already')) {
        let form = JSON.parse(JSON.stringify(this.billInfo));
        form.login_id = this.userInfo.login_id;
        form.user_name = this.userInfo.user_name;
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
