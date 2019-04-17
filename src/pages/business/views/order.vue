<template lang="html">
  <div id="order">
    <!-- 表格 begin -->
    <div class="base-form">
      <div class="form-inline">
        <div class="base-form-title" style="width:100%;">
          <a class="base-margin-left-20">订单管理</a>
          <div class="button-table"></div>
        </div>
      </div>
      <div class="base-padding-20 base-bg-fff">
        <div>
          <div class="row" style="margin-bottom: 15px !important;">
            <div class="col-lg-3 marginBot4">
              <p class="marginBot4">订单单号查询:</p>
              <b-form-input v-model="select_order_no" placeholder="输入订单单号"></b-form-input>
            </div>
            <div class="col-lg-3 marginBot4">
              <p class="marginBot4">订单人查询:</p>
              <el-select class="marginBot" style="height:40px !important" v-model="select_c_id" filterable placeholder="输入订单人">
                <el-option value="" label="全部客户">全部客户</el-option>
                <el-option v-for="(item, index) in clientList" :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </div>
            <div class="col-lg-4 marginBot4">
              <p class="marginBot4">订单日期查询:</p>
              <el-date-picker
                style="width:100%; height: 34px !important; line-height: 34px !important;"
                v-model="select_in_date"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </div>
            <div class="col-lg-2 marginBot4">
              <b-button
                variant="primary"
                style="font-size: 14px !important; color: rgb(255, 255, 255) !important; width: 60% !important; padding: 5px 10px !important; margin-top:28px; margin-right: 0px !important;"
                @click="search('vague')"
                >点击查询</b-button
              >
            </div>
          </div>
        </div>

        <div class="base-align-right" style="margin-bottom: 20px;">
          <a
            class="btn btn-info base-margin-bottom"
            style="font-size:14px !important; color:#fff !important; padding: 6px 12px !important;"
            data-toggle="tooltip"
            title=""
            role="button"
            @click="openAlert('add')"
          >
            <i class="base-margin-right-5 fa fa-plus-square"></i>新建订单
          </a>
        </div>
        <table class="table table-bordered table-striped ">
          <tbody v-if="orderList.length > 0">
            <tr>
              <th>订单号</th>
              <th>客户</th>
              <th>要求发货日期</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
            <tr v-for="(item, index) in orderList" :key="index">
              <td>{{ item.order_no }}</td>
              <td>{{ getC_name(item.c_id) }}</td>
              <td>{{ item.send_time_hp }}</td>
              <td>{{ item.status | getStatus }}</td>
              <td>
                <b-button variant="primary" style="color:white; margin-right:5px;" @click="openAlert('update', index)">详&nbsp;&nbsp;情</b-button>
                <b-button variant="success" style="color:white;margin-right:5px;" v-if="item.status === 1" @click="openAlert('sign', item.id)"
                  >签&nbsp;&nbsp;收</b-button
                >
                <b-button variant="danger" style="color:white;" v-if="item.status < 2" @click="openAlert('delete', item.id)">删&nbsp;&nbsp;除</b-button>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td style="text-align:center;">没有查询到数据</td>
            </tr>
          </tbody>
        </table>
        <el-pagination
          layout="total, prev, pager, next"
          :background="true"
          :page-size="15"
          prev-text="上一页"
          next-text="下一页"
          :current-page="currentPage"
          @current-change="toSearch"
          :total="totalRow"
        >
        </el-pagination>
      </div>
    </div>

    <!--添加弹框-->
    <el-dialog title="新添订单" :visible.sync="dialogAdd" :fullscreen="true">
      <div class="d-block text-center">
        <div class="row">
          <!--line1-->
          <div class="col-lg-3 mb25">
            <div class="lh44">订单号：</div>
            <b-form-input v-model="form.order_no" placeholder="订单号"></b-form-input>
          </div>
          <div class="col-lg-3 mb25">
            <div class="lh44">操作人：</div>
            <b-form-input v-model="form.op" placeholder="操作人"></b-form-input>
          </div>
          <div class="col-lg-3 mb25">
            <div class="lh44">客户:</div>
            <el-select class="marginBot" style="height:40px !important" v-model="form.c_id" filterable placeholder="请选择客户">
              <el-option v-for="(item, index) in clientList" :key="index" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </div>
          <div class="col-lg-3 mb25">
            <div class="lh44">合同:</div>
            <el-select class="marginBot" style="height:40px !important" v-model="form.pact_id" filterable placeholder="请选择合同">
              <el-option v-for="(item, index) in contractList" :key="index" :value="item.id" :label="item.pact_no"></el-option>
            </el-select>
          </div>
          <div class="col-lg-3 mb25">
            <div class="lh44">要求发货日期：</div>
            <el-date-picker
              style="width: 100%;"
              v-model="form.send_time_hp"
              placeholder="要求发货日期"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="date"
            >
            </el-date-picker>
          </div>
          <div class="col-lg-3 mb25">
            <div class="lh44">发货日期：</div>
            <el-date-picker
              style="width: 100%;"
              v-model="form.send_time"
              placeholder="发货日期"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="date"
              :disabled="true"
            >
            </el-date-picker>
          </div>
          <div class="col-lg-3 mb25">
            <div class="lh44">要求到达日期：</div>
            <el-date-picker
              style="width: 100%;"
              v-model="form.reach_time_hp"
              placeholder="要求到达日期"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="date"
            >
            </el-date-picker>
          </div>
          <div class="col-lg-3 mb25">
            <div class="lh44">实际到达日期：</div>
            <el-date-picker
              style="width: 100%;"
              :disabled="true"
              v-model="form.sign_time"
              placeholder="实际到达日期"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="date"
            >
            </el-date-picker>
          </div>
          <div class="col-lg-4 mb25">
            <div class="lh44">发货方式:</div>
            <el-select class="marginBot" style="height:40px !important" v-model="form.send_type" filterable placeholder="请选择发货方式">
              <el-option :value="0" label="零担运输"></el-option>
              <el-option :value="1" label="整车运输"></el-option>
            </el-select>
          </div>
          <div class="col-lg-8 mb25"></div>
          <!--line2-->
          <div class="col-lg-4 mb25">
            <div class="lh44">发货地址：</div>
            <b-form-input v-model="form.send_address" placeholder="请填写发货地址"></b-form-input>
          </div>
          <div class="col-lg-4 mb25">
            <div class="lh44">发货人：</div>
            <b-form-input v-model="form.send_name" placeholder="请填写发货人"></b-form-input>
          </div>
          <div class="col-lg-4 mb25">
            <div class="lh44">发货人联系方式：</div>
            <b-form-input v-model="form.send_tel" placeholder="请填写发货人联系方式"></b-form-input>
          </div>
          <!--line3-->
          <div class="col-lg-4 mb25">
            <div class="lh44">收货地址：</div>
            <b-form-input v-model="form.take_address" placeholder="请填写收货地址"></b-form-input>
          </div>
          <div class="col-lg-4 mb25">
            <div class="lh44">收货人：</div>
            <b-form-input v-model="form.take_name" placeholder="请填写收货人"></b-form-input>
          </div>
          <div class="col-lg-4 mb25">
            <div class="lh44">收货人联系方式：</div>
            <b-form-input v-model="form.take_tel" placeholder="请填写收货人联系方式"></b-form-input>
          </div>
          <br />
        </div>
        <el-tabs v-model="tabs" type="card">
          <el-tab-pane v-for="(item, index) in subForm" :key="index" :label="`货物${index + 1}`" :name="`${index}`">
            <div class="row">
              <div class="col-lg-12 mb25" style="text-align: right;">
                <el-button type="danger" icon="el-icon-delete" circle @click="closeSubForm(index)"></el-button>
              </div>
              <div class="col-lg-3 mb25">
                <div class="lh44">产品名称:</div>
                <b-form-input v-model="item.goods_name" placeholder="请填写产品名称"></b-form-input>
              </div>
              <div class="col-lg-3 mb25">
                <div class="lh44">数量:</div>
                <b-form-input v-model="item.goods_num" type="number"></b-form-input>
              </div>
              <!--new-->
              <div class="col-lg-3 mb25">
                <div class="lh44">件数:</div>
                <b-form-input v-model="item.item_num" type="number"></b-form-input>
              </div>
              <div class="col-lg-3 mb25">
                <div class="lh44">发货件数:</div>
                <b-form-input v-model="item.sent_num" type="number" :disabled="true"></b-form-input>
              </div>
              <div class="col-lg-3 mb25">
                <div class="lh44">包装:</div>
                <b-form-input v-model="item.pack" placeholder="请填写包装信息"></b-form-input>
              </div>

              <div class="col-lg-3 mb25">
                <div class="lh44">重量:</div>
                <b-form-input v-model="item.goods_weight" type="number"></b-form-input>
              </div>
              <div class="col-lg-3 mb25">
                <div class="lh44">体积:</div>
                <b-form-input v-model="item.goods_volume" type="number"></b-form-input>
              </div>
              <div class="col-lg-3 mb25">
                <div class="lh44">线路:</div>
                <b-form-select v-model="item.dly_way_id" class="marginBot" style="height:40px !important">
                  <option :value="undefined" disabled>请选择线路</option>
                  <option v-for="(item, index) in dlyWayList" :key="index" :value="item.id">{{ item.name }}</option>
                </b-form-select>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <b-button
        variant="primary"
        @click="addSubForm()"
        class="resetButton"
        style="font-size:16px !important; margin-top:25px; width:30% !important; padding:6px 80px !important;margin-bottom:30px !important;margin-right:0 !important;"
        >添加商品</b-button
      >
      <b-button
        variant="primary"
        @click="toValidate('add')"
        class="resetButton"
        style="font-size:16px !important; margin:25px 5% 30px 5% !important; background-color: #17a2b8 !important;  width:30% !important; padding:6px 80px !important;"
        >保&nbsp;&nbsp;存</b-button
      >
      <b-button
        variant="secondary"
        @click="reset()"
        class="resetButton"
        style="font-size:16px !important; margin-top:25px; margin-bottom:30px !important; width:30% !important; margin-right: 0 !important; padding:6px 80px !important;"
        >重&nbsp;&nbsp;置</b-button
      >
    </el-dialog>

    <!--详情-->
    <el-dialog title="订单详情" :visible.sync="dialogUpdate" :fullscreen="true">
      <div class="d-block text-center">
        <div class="row">
          <!--line1-->
          <div class="col-lg-3 mb25">
            <div class="lh44">订单号：</div>
            <b-form-input :disabled="true" v-model="updateForm.order_no" placeholder="订单号"></b-form-input>
          </div>
          <div class="col-lg-3 mb25">
            <div class="lh44">操作人：</div>
            <b-form-input v-model="updateForm.op" :disabled="true" placeholder="操作人"></b-form-input>
          </div>
          <div class="col-lg-3 mb25">
            <div class="lh44">客户:</div>
            <el-select class="marginBot" style="height:40px !important" :disabled="is_update" v-model="updateForm.c_id" filterable placeholder="请选择客户">
              <el-option v-for="(item, index) in clientList" :key="index" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </div>
          <div class="col-lg-3 mb25">
            <div class="lh44">合同:</div>
            <el-select class="marginBot" style="height:40px !important" :disabled="is_update" v-model="updateForm.pact_id" filterable placeholder="请选择合同">
              <el-option v-for="(item, index) in contractList" :key="index" :value="item.id" :label="item.pact_no"></el-option>
            </el-select>
          </div>
          <div class="col-lg-3 mb25">
            <div class="lh44">要求发货日期：</div>
            <el-date-picker
              style="width: 100%;"
              :disabled="is_update"
              v-model="updateForm.send_time_hp"
              placeholder="要求发货日期"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="date"
            >
            </el-date-picker>
          </div>
          <div class="col-lg-3 mb25">
            <div class="lh44">发货日期：</div>
            <el-date-picker
              style="width: 100%;"
              :disabled="is_update"
              v-model="updateForm.send_time"
              placeholder="发货日期"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="date"
            >
            </el-date-picker>
          </div>
          <div class="col-lg-3 mb25">
            <div class="lh44">要求到达日期：</div>
            <el-date-picker
              :disabled="is_update"
              v-model="updateForm.reach_time_hp"
              placeholder="要求到达日期"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="date"
            >
            </el-date-picker>
          </div>
          <div class="col-lg-3 mb25">
            <div class="lh44">实际到达日期：</div>
            <el-date-picker
              style="width: 100%;"
              :disabled="is_update"
              v-model="updateForm.sign_time"
              placeholder="实际到达日期"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="date"
            >
            </el-date-picker>
          </div>
          <div class="col-lg-4 mb25">
            <div class="lh44">发货方式:</div>
            <el-select
              class="marginBot"
              style="height:40px !important"
              v-model="updateForm.send_type"
              :disabled="is_update"
              filterable
              placeholder="请选择发货方式"
            >
              <el-option :value="0" label="零担运输"></el-option>
              <el-option :value="1" label="整车运输"></el-option>
            </el-select>
          </div>
          <div class="col-lg-8 mb25"></div>
          <!--line2-->
          <div class="col-lg-4 mb25">
            <div class="lh44">发货地址：</div>
            <b-form-input v-model="updateForm.send_address" :disabled="is_update" placeholder="请填写发货地址"></b-form-input>
          </div>
          <div class="col-lg-4 mb25">
            <div class="lh44">发货人：</div>
            <b-form-input v-model="updateForm.send_name" :disabled="is_update" placeholder="请填写发货人"></b-form-input>
          </div>
          <div class="col-lg-4 mb25">
            <div class="lh44">发货人联系方式：</div>
            <b-form-input v-model="updateForm.send_tel" :disabled="is_update" placeholder="请填写发货人联系方式"></b-form-input>
          </div>
          <!--line3-->
          <div class="col-lg-4 mb25">
            <div class="lh44">收货地址：</div>
            <b-form-input v-model="updateForm.take_address" :disabled="is_update" placeholder="请填写收货地址"></b-form-input>
          </div>
          <div class="col-lg-4 mb25">
            <div class="lh44">收货人：</div>
            <b-form-input v-model="updateForm.take_name" :disabled="is_update" placeholder="请填写收货人"></b-form-input>
          </div>
          <div class="col-lg-4 mb25">
            <div class="lh44">收货人联系方式：</div>
            <b-form-input v-model="updateForm.take_tel" :disabled="is_update" placeholder="请填写收货人联系方式"></b-form-input>
          </div>
          <div class="col-lg-4 mb25">
            <div class="lh44">签收人：</div>
            <b-form-input v-model="updateForm.sign_name" :disabled="true" placeholder="请填写签收人"></b-form-input>
          </div>
          <br />
          <el-tabs v-model="tabs" type="card">
            <el-tab-pane v-for="(item, index) in subForm" :key="index" :label="`货物${index + 1}`" :name="`${index}`">
              <div class="row">
                <div class="col-lg-12 mb25" style="text-align: right;">
                  <el-button type="danger" icon="el-icon-delete" circle @click="closeSubForm(index)" v-if="is_update && updateForm.status < 2"></el-button>
                </div>
                <div class="col-lg-3 mb25">
                  <div class="lh44">数量:</div>
                  <b-form-input v-model="item.goods_num" :disabled="is_update" type="number"></b-form-input>
                </div>
                <!--new-->
                <div class="col-lg-3 mb25">
                  <div class="lh44">件数:</div>
                  <b-form-input v-model="item.goods_num" :disabled="is_update" type="number"></b-form-input>
                </div>
                <div class="col-lg-3 mb25">
                  <div class="lh44">发货件数:</div>
                  <b-form-input v-model="item.sent_num" :disabled="is_update" type="number"></b-form-input>
                </div>
                <div class="col-lg-3 mb25">
                  <div class="lh44">包装:</div>
                  <b-form-input v-model="item.pack" :disabled="is_update"></b-form-input>
                </div>

                <div class="col-lg-3 mb25">
                  <div class="lh44">重量:</div>
                  <b-form-input v-model="item.goods_weight" :disabled="is_update" type="number"></b-form-input>
                </div>
                <div class="col-lg-3 mb25">
                  <div class="lh44">体积:</div>
                  <b-form-input v-model="item.goods_volume" :disabled="is_update" type="number"></b-form-input>
                </div>
                <div class="col-lg-3 mb25">
                  <div class="lh44">产品名称:</div>
                  <b-form-input v-model="item.goods_name" :disabled="is_update" placeholder="请填写产品名称"></b-form-input>
                </div>
                <div class="col-lg-3 mb25">
                  <div class="lh44">线路:</div>
                  <b-form-select v-model="item.dly_way_id" :disabled="is_update" class="marginBot" style="height:40px !important">
                    <option :value="undefined" disabled>请选择线路</option>
                    <option v-for="(item, index) in dlyWayList" :key="index" :value="item.id">{{ item.name }}</option>
                  </b-form-select>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-4">
          <b-button
            variant="primary"
            v-if="updateForm.status < 2"
            :disabled="is_update"
            @click="addSubForm()"
            class="resetButton"
            style="font-size:16px !important; margin:10px 5% 30px 5% !important; background-color: #17a2b8 !important;  width:70% !important; padding:6px 80px !important;"
            >添&nbsp;&nbsp;加</b-button
          >
        </div>
        <div class="col-lg-4">
          <b-button
            variant="primary"
            v-if="is_update && updateForm.status < 2"
            @click="is_update = false"
            class="resetButton"
            style="font-size:16px !important; margin:10px 5% 30px 5% !important; background-color: #17a2b8 !important;  width:70% !important; padding:6px 80px !important;"
            >修&nbsp;&nbsp;改</b-button
          >
        </div>
        <!-- <b-button
        variant="primary"
        @click="exportExcel()"
        class="resetButton"
        style="font-size:16px !important; margin:10px 5% 30px 5% !important; background-color: #17a2b8 !important;  width:30% !important; padding:6px 80px !important;"
        >导&nbsp;&nbsp;出</b-button
      > -->
        <div class="col-lg-4" v-if="!is_update">
          <b-button
            v-if="!is_update"
            variant="primary"
            @click="toValidate('update')"
            class="resetButton"
            style="font-size:16px !important; margin:10px 5% 30px 5% !important; background-color: #17a2b8 !important;  width:70% !important; padding:6px 80px !important;"
            >保&nbsp;&nbsp;存</b-button
          >
        </div>
        <div class="col-lg-4">
          <b-button
            variant="secondary"
            @click="closeAlert('update')"
            class="resetButton"
            style="font-size:16px !important; margin:10px 5% 30px 5% !important; background-color: #ccc !important;  width:70% !important; padding:6px 80px !important;"
            >返&nbsp;&nbsp;回</b-button
          >
        </div>
      </div>
    </el-dialog>
    <!--删除弹框-->
    <b-modal id="deleteAlert" title="确认删除" ref="deleteAlert" hide-footer no-close-on-esc no-close-on-backdrop hide-header-close>
      <div class="d-block text-center">
        <b-alert variant="danger" show>删除订单可能会有严重影响,确认删除吗?</b-alert>
      </div>
      <b-button
        variant="danger"
        style="font-size:16px !important; margin-top:25px; padding:6px 80px !important;margin-bottom:30px !important;margin-right:0 !important;"
        @click="toDelete()"
        >删&nbsp;&nbsp;除</b-button
      >
      <b-button
        variant="primary"
        style="font-size:16px !important; margin-top:25px; float:right; padding:6px 80px !important;margin-bottom:30px !important;margin-right:0 !important;"
        class="resetButton"
        @click="closeAlert('delete')"
        >返&nbsp;&nbsp;回</b-button
      >
    </b-modal>

    <!--签收-->
    <el-dialog title="订单签收" :visible.sync="dialogSign" :close-on-click-modal="false">
      <div class="col-lg-12 mb25">
        <div class="lh44">签收人:</div>
        <b-form-input v-model="signForm.sign_name" placeholder="请填写签收人"></b-form-input>
      </div>
      <div class="col-lg-12 mb25">
        <div class="lh44">到达日期：</div>
        <el-date-picker style="width: 100%;" v-model="signForm.sign_time" placeholder="到达日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd" type="date">
        </el-date-picker>
      </div>
      <b-button
        variant="primary"
        @click="toValidate('add')"
        class="resetButton"
        style="font-size:16px !important; margin:25px 5% 30px 5% !important; background-color: #17a2b8 !important;  width:30% !important; padding:6px 80px !important;"
        >保&nbsp;&nbsp;存</b-button
      >
      <b-button
        variant="secondary"
        @click="reset()"
        class="resetButton"
        style="font-size:16px !important; margin: 25px 0 30px 15% !important;width:30% !important; margin-right: 0 !important; padding:6px 80px !important;"
        >重&nbsp;&nbsp;置</b-button
      >
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Validator from 'async-validator';
import _ from 'lodash';
//import exportExcel from '@/components/exportExcel.vue';
export default {
  name: 'order',
  metaInfo: {
    title: '订单管理',
  },
  data() {
    return {
      list: [],
      subForm: [],
      signForm: {},
      is_update: true,
      operateId: '',
      currentPage: 1,
      totalRow: 0,
      form: {},
      updateForm: {},
      mainValidator: new Validator({
        op: [{ required: true, message: '请填写操作人' }],
        send_time_hp: [{ required: true, message: '请选择要求发货日期' }],
        reach_time_hp: [{ required: true, message: '请选择要求到达日期' }],
        send_address: [{ required: true, message: '请选择发货地址' }],
      }),
      th: ['订单号', '订单人', '订单日期', '备注'],
      filterVal: ['order_no', 'user_name', 'in_date', 'remark'],
      select_order_no: '',
      select_c_id: '',
      select_in_date: [],
      chooseStatus: [
        { text: '待发', value: '0' },
        { text: '装车运输', value: '1' },
        { text: '到达', value: '2' },
        // { text: '支付完成', value: '3' },
        // { text: '收款完成', value: '4' },
      ],
      dialogAdd: false,
      dialogUpdate: false,
      dialogSign: false,
      tabs: '0',
      signValidator: new Validator({
        sign_name: [{ required: true, message: '请填写操作人' }],
        sign_time: [{ required: true, message: '请选择物流方式' }],
      }),
    };
  },
  watch: {
    async 'form.c_id'(newValue) {
      if (newValue !== undefined) {
        let c_name = this.clientList.filter(item => item.id === newValue)[0].name;
        this.form.c_name = c_name;
        await this.getContractList({ skip: 0, limit: 10000, pact_no: '', cus_id: newValue });
        console.log(this.form.pact_id);
        this.form.pact_id === undefined
          ? ''
          : this.contractList.filter(item => item.id === this.form.pact_id).length > 0
          ? ''
          : this.$set(this.form, 'pact_id', '');
      }
    },
    async 'updateForm.c_id'(newValue) {
      if (newValue !== undefined) {
        let c_name = this.clientList.filter(item => item.id === newValue)[0].name;
        this.updateForm.c_name = c_name;
        await this.getContractList({ skip: 0, limit: 10000, pact_no: '', cus_id: newValue });
        this.updateForm.pact_id === undefined
          ? ''
          : this.contractList.filter(item => item.id === this.updateForm.pact_id).length > 0
          ? ''
          : this.$set(this.updateForm, 'pact_id', '');
      }
    },
    is_update(newValue) {
      if (this.updateForm.status <= 2) return false;
      else return true;
    },
  },
  computed: {
    ...mapState({
      limit: state => state.publics.limit,
      userInfo: state => state.publics.userInfo,
      orderList: state => state.self.orderList,
      orderSubListVuex: state => state.self.orderSubList,
      dlyWayList: state => state.self.dlyWayList,
      clientList: state => state.personnel.clientList,
      contractList: state => state.personnel.contractList,
    }),
  },
  async created() {
    this.search();
    await this.getClientList({ skip: 0, limit: 10000 });
    await this.getdly_wayList({ skip: 0, limit: 10000 });
  },
  methods: {
    ...mapActions([
      'getOrderList',
      'getOrderSubList',
      'getContractList',
      'getOrderNo',
      'getClientList',
      'getdly_wayList',
      'orderSave',
      'orderEdit',
      'orderDelete',
    ]),
    //分页
    toSearch(currentPage) {
      this.currentPage = currentPage;
      this.search();
    },
    //查询
    async search(type) {
      if (type === 'vague') {
        this.currentPage = 1;
      }
      let skip = (this.currentPage - 1) * this.limit;
      let totalRow = await this.getOrderList({
        skip: skip,
        limit: this.limit,
        order_no: this.select_order_no,
        c_id: this.select_c_id,
        start_time: this.select_in_date.length > 0 ? this.select_in_date[0] : '',
        end_time: this.select_in_date.length > 0 ? this.select_in_date[1] : '',
      });
      this.$set(this, 'totalRow', totalRow);
    },
    //获取订单号
    async getOrderNum() {
      if (!this.$refs.updateAlert.is_show) {
        let result = await this.getOrderNo();
        this.$set(this.form, 'order_no', result);
      }
    },
    //获取
    getContent(id, index) {
      let content = this.dlyWayList.filter(item => item.id === id)[0].content;
      this.subForm[index]['content'] = content;
    },
    //显示名字
    getC_name(id) {
      try {
        if (this.clientList.length > 0) {
          return this.clientList.filter(item => item.id === id)[0].name;
        }
      } catch {
        return;
      }
    },
    //验证
    toValidate(type) {
      this.mainValidator.validate(type === 'add' ? this.form : this.updateForm, (errors, fields) => {
        if (errors) {
          return this.handleErrors(errors, fields);
        }
        if (type === 'add') {
          return this.add();
        } else {
          return this.update();
        }
      });
    },
    //添加
    async add() {
      try {
        this.form.status = 0;
        await this.orderSave({ form: this.form, subForm: this.subForm });
        this.dialogAdd = false;
        this.form = {};
        this.subForm = [];
        this.search();
      } catch (error) {
        console.error('error in add');
      }
    },
    //修改
    async update() {
      try {
        await this.orderEdit({ form: this.updateForm, subForm: this.subForm });
        this.closeAlert('update');
        this.updateForm = [];
        this.subForm = [];
        this.is_update = true;
        this.search();
      } catch (error) {
        console.error('error in line 504');
      }
    },
    //删除
    async toDelete() {
      try {
        await this.orderDelete({ id: this.operateId });
        this.closeAlert('delete');
        this.search();
      } catch (error) {
        console.error('error in line 517');
      }
    },
    //打开与关闭修改和删除的弹框
    async openAlert(type, id) {
      this.subForm = [];
      if (type === 'update') {
        this.updateForm = JSON.parse(JSON.stringify(this.orderList[id]));
        await this.getOrderSubList({ id: this.updateForm.id });
        this.$set(this, 'subForm', this.orderSubListVuex);
        this.dialogUpdate = true;
      } else if (type === 'delete') {
        this.$refs.deleteAlert.show();
        this.operateId = id;
      } else if (type === 'add') {
        this.form.login_id = this.userInfo.login_id;
        this.form.user_name = this.userInfo.user_name;
        this.addSubForm();
        // this.getOrderNum();
        this.dialogAdd = true;
      } else if (type === 'sign') {
        this.dialogSign = true;
        this.operateId = id;
      }
      this.tabs = `0`;
    },
    //关闭弹框
    closeAlert(type) {
      if (type === 'update') {
        this.dialogUpdate = false;
      } else if (type === 'delete') {
        this.$refs.deleteAlert.hide();
      }
      this.is_update = true;
      this.operateId = '';
      this.reset();
    },
    //验证错误
    handleErrors(errors, fields) {
      this.$message.error(errors[0].message);
      this.errors = errors.reduce((p, c) => {
        p[c.field] = 'error';
        return p;
      }, {});
      console.debug(errors, fields);
    },
    //删除表单中内容
    closeSubForm(i) {
      this.tabs = this.subForm.length - 1 === i ? (i !== 0 ? `${i - 1}` : `${i}`) : this.tabs;
      this.subForm.splice(i, 1);
    },
    //添加字表数据
    addSubForm(type) {
      this.subForm.push({
        goods_num: 0,
        sent_num: 0,
        goods_weight: 0,
        goods_volume: 0,
        item_num: 0,
      });
    },
    reset() {
      this.form = {};
      this.subForm = [];
      this.form.user_name = this.userInfo.user_name;
      this.form.login_id = this.userInfo.login_id;
    },
    //导出
    exportExcel() {
      var tableStr = `
                      <caption><b>订单单</b></caption>
                      <tr style="text-align:center;">
                        <th>订单号</th>
                        <th>操作人</th>
                        <th>客户</th>
                        <th>订单日期</th>
                        <th>操作时间</th>
                        <th>状态</th>
                        <th>备注</th>
                      </tr>
                      <tr style="text-align: center;">
                          <td>${this.updateForm.order_num}&nbsp;</td>
                          <td>${this.updateForm.user_name}</td>
                          <td>${this.getName(this.updateForm.cus_id)}</td>
                          <td>${this.updateForm.in_date}</td>
                          <td>${this.updateForm.create_time}</td>
                          <td>${this.updateForm.status == '0' ? '未出库' : '已经出库'}</td>
                          <td>${this.updateForm.remark}</td>
                      </tr>
                      <tr></tr>
                      <tr style="text-align:center;">
                        <th>型号</th>
                        <th>数量</th>
                      </tr>`;
      for (let item of this.orderSubList) {
        tableStr += ` <tr style="text-align: center;">
                        <td>${item.code}</td>
                        <td>${item.num}</td>
                      </tr>`;
      }
      //Worksheet名
      var worksheet = 'Sheet1';
      var uri = 'data:application/vnd.ms-excel;base64,';
      // 真正要导出（下载）的HTML模板
      var exportTemplate = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" 
                      xmlns="http://www.w3.org/TR/REC-html40">
                          <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
                              <x:Name>${worksheet}</x:Name>
                                  <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
                              </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
                          </head>
                          <body>
                              <table border="1" cellspacing="0" cellpadding="0" syle="table-layout: fixed;word-wrap: break-word; word-break: break-all;">${tableStr}</table>
                          </body>
                      </html>`;
      //下载模板
      window.location.href = uri + this.base64(exportTemplate);
    },
    //输出base64编码
    base64(s) {
      return window.btoa(unescape(encodeURIComponent(s)));
    },
  },
  filters: {
    getStatus(data) {
      let text = '';
      switch (data) {
        case 0:
          text = '待发';
          break;
        case 1:
          text = '发车';
          break;
        case 2:
          text = '到达';
          break;
        case 3:
          text = '支付完成';
          break;
        case 4:
          text = '收款完成';
          break;
        default:
          text = '当前状态错误';
          break;
      }
      return text;
    },
  },
};
</script>

<style scoped>
.marginBot4 {
  margin-bottom: 4px;
}
.marginBot {
  margin-bottom: 15px;
}
.resetButton {
  color: #fff;
  margin-right: 20px;
}
.table th,
.table td {
  padding: 0.5rem;
  vertical-align: inherit;
}
.btn {
  margin-left: 0 !important;
  padding: 2px 5px !important;
  margin-bottom: 0 !important;
  margin-right: 10px !important;
  font-size: 12px !important;
  font-weight: normal !important;
  line-height: 1.42857143 !important;
  text-align: center !important;
  white-space: nowrap !important;
  vertical-align: middle !important;
  width: auto !important;
  border: 1px solid transparent !important;
  border-radius: 3px !important;
  height: auto !important;
}
.btn-primary {
  background-color: #5bc0de;
}
.btn-primary1 {
  background-color: #5bc0de;
  color: white;
  width: 400px;
  height: 280px;
  cursor: hand;
}
.breadcrumb {
  padding: 14px 18px;
  margin-bottom: 25px;
  list-style: none;
  background-color: #f5f5f5;
}
.breadcrumb > li {
  font-size: 16px;
  color: #999;
  display: inline-block;
}
.breadcrumb > li a {
  font-size: 16px;
  color: #999;
  display: inline-block;
}
.base-form-title {
  font-weight: bold;
  display: block;
  line-height: 40px;
  font-size: 16px;
  color: #46687f;
  letter-spacing: 1px;
  text-align: left;
  background-color: #5bc0de;
}
.base-margin-left-20 {
  margin-left: 20px;
}
.base-form-title a {
  color: #fff !important;
  text-decoration: none;
}
.base-padding-20 {
  padding: 20px;
}
.base-bg-fff {
  background-color: #fff;
}
.row {
  margin-right: -15px;
  margin-left: -15px;
}
.base-margin-right-40 {
  margin-right: 40px;
}
.form-group {
  margin-bottom: 15px;
}
.form-control {
  display: block;
  width: 100%;
  height: 44px;
  padding: 6px 15px;
  font-size: 16px;
  line-height: 1.42857143;
  color: #555;
  background-color: #fff;
  background-image: none;
  border: 1px solid #ccc;
  border-radius: 4px;
  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
  -webkit-transition: border-color ease-in-out 0.15s, -webkit-box-shadow ease-in-out 0.15s;
  -o-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
  transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
}
input,
textarea,
select,
button {
  text-rendering: auto;
  color: initial;
  letter-spacing: normal;
  word-spacing: normal;
  text-transform: none;
  text-indent: 0px;
  text-shadow: none;
  display: inline-block;
  text-align: start;
  margin: 0em;
  font: 400 13.3333px Arial;
}
.btn-info {
  color: #fff;
  background-color: #5bc0de;
  border-color: #46b8da;
}
.base-margin-2 {
  margin: 2px 0;
}
.btn-xs,
.btn-group-xs > .btn {
  padding: 3px 8px;
  font-size: 14px;
  line-height: 1.5;
  border-radius: 5px;
}
.btn-info {
  color: #fff;
  background-color: #5bc0de;
  border-color: #46b8da;
}
.base-margin-right-5 {
  margin-right: 5px;
}
.base-margin-bottom {
  margin-bottom: 20px;
}
.table-bordered {
  border: 1px solid #ddd;
}
.table {
  font-size: 14px;
  width: 100%;
  max-width: 100%;
  margin-bottom: 20px;
}
table {
  background-color: transparent;
}
table {
  border-spacing: 0;
  border-collapse: collapse;
}
.base-header {
  min-width: 1024px;
  height: 75px;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.base-header-left {
  float: left;
  width: 240px;
  height: 60px;
  border-bottom: 1px #161e25 solid;
  color: #a6a6a6;
  cursor: pointer;
  background-size: 100%;
}
ul,
li {
  margin: 0px;
  padding: 0px;
}
li {
  list-style: none;
}
.modal.show .modal-dialog {
  -webkit-transform: none;
  transform: none;
  max-width: 700px !important;
}
@media (min-width: 576px) {
  .modal-dialog {
    max-width: 700px !important;
    margin: 1.75rem auto;
  }
}
.lh44 {
  text-align: left;
  line-height: 35px;
}
.mb25 {
  margin-bottom: 10px;
}
.mb20 {
  margin-bottom: 20px;
}
</style>
<style scoped>
@import '../../../assets/style/Font-Awesome-master/css/font-awesome.css';
@import '../../../assets/style/layout/base-Layout-bootstrap.css';
@import '../../../assets/style/base-style-bootstrap.css';
</style>
