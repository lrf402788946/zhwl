<template lang="html">
  <div id="car">
    <!-- 表格 begin -->
    <div class="base-form">
      <div class="form-inline">
        <div class="base-form-title" style="width:100%;">
          <a class="base-margin-left-20" style="color: #fff !important;">车辆列表</a>
          <div class="button-table"></div>
        </div>
      </div>
      <div class="base-padding-20 base-bg-fff">
        <div class="row">
          <div class="col-lg-2 mb25 ml2Mix plr0 lh44">车牌号查询:</div>
          <div class="col-lg-3 mb25 pll0">
            <b-form-input v-model="select_car_nu" placeholder="请输入车牌号" style="width:200px,margin-left:50px"></b-form-input>
          </div>
          <div class="col-lg-2 mb25 ml13Mix plr0 lh44">车辆所有人查询:</div>
          <div class="col-lg-3 mb25 pll0">
            <b-form-input v-model="select_car_onwer" placeholder="请输入车辆所有人" style="width:200px,margin-left:50px"></b-form-input>
          </div>
          <div class="col-lg-2 mb25">
            <b-button variant="primary" style="font-size:14px !important; color:#fff !important; padding: 6px 12px !important;" @click="searchButton()"
              ><i class="base-margin-right-5 fa fa-search"></i>点击查询</b-button
            >
          </div>
        </div>

        <div class="base-align-right" style="margin-bottom:20px;">
          <a
            class="btn btn-info base-margin-bottom"
            data-toggle="tooltip"
            style="font-size:14px !important; color:#fff !important; padding: 6px 12px !important;"
            title=""
            role="button"
            v-b-modal="'toAdd'"
          >
            <i class="base-margin-right-5 fa fa-plus-square"></i>添加信息
          </a>
        </div>
        <table class="table table-bordered table-striped ">
          <tbody v-if="list.length > 0">
            <tr>
              <th>机动车所有人</th>
              <th>机动车登记编号</th>
              <th>身份证明代码</th>
              <th>操作</th>
            </tr>
            <tr v-for="(item, index) in list" :key="index">
              <td>{{ item.car_onwer }}</td>
              <td>{{ item.car_no }}</td>
              <td>{{ item.it_member }}</td>
              <td>
                <b-button variant="primary" style="color:white;" @click="openAlert('update', index)">详&nbsp;&nbsp;情</b-button>
                <b-button variant="danger" @click="openDeleteAlert(item.id)">删&nbsp;&nbsp;除</b-button>
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
          style="text-align: right;"
          prev-text="上一页"
          next-text="下一页"
          :current-page="currentPage"
          @current-change="toSearch"
          :total="totalRow"
        ></el-pagination>
        <b-modal id="toAdd" size="xl" title="添加车辆信息" ref="toAdd" hide-footer>
          <div class="row" style="text-align: left;">
            <div class="col-lg-4 mb25">
              <div class="lh44">汽车所属关系:</div>
              <el-select class="marginBot" style="height:40px !important" v-model="form.type" filterable placeholder="请选择汽车所属关系">
                <el-option label="自供" value="0"></el-option>
                <el-option label="供应商" value="1"></el-option>
              </el-select>
            </div>
            <div class="col-lg-4 mb25">
              <div class="lh44">机动车所有人：</div>
              <b-form-input v-model="form.car_onwer" placeholder="机动车所有人"></b-form-input>
            </div>
            <div class="col-lg-4 mb25">
              <div class="lh44">身份证明名称：</div>
              <b-form-input v-model="form.it" placeholder="身份证明名称"></b-form-input>
            </div>
            <div class="col-lg-4 mb20">
              <div class="lh44">身份证明代码：</div>
              <b-form-input v-model="form.it_member" placeholder="身份证明代码"></b-form-input>
            </div>
            <div class="col-lg-4 mb20">
              <div class="lh44">登记机关：</div>
              <b-form-input v-model="form.ro" placeholder="登记机关"></b-form-input>
            </div>
            <div class="col-lg-4 mb20">
              <div class="lh44">选择登记日期：</div>
              <el-date-picker
                style="width:100%; height: 36px;"
                v-model="form.r_time"
                type="date"
                placeholder="选择登记日期"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
              ></el-date-picker>
            </div>
            <div class="col-lg-4 mb20">
              <div class="lh44">机动车登记编号：</div>
              <b-form-input v-model="form.car_no" placeholder="机动车登记编号"></b-form-input>
            </div>
            <div class="col-lg-4 mb20">
              <div class="lh44">机动车类别：</div>
              <b-form-input v-model="form.car_type" placeholder="机动车类别"></b-form-input>
            </div>
            <div class="col-lg-4 mb20">
              <div class="lh44">机动车档案编号：</div>
              <b-form-input v-model="form.cc_no" placeholder="机动车档案编号"></b-form-input>
            </div>
            <div class="col-lg-4 mb20">
              <div class="lh44">机动车整备质量(自重)：</div>
              <b-form-input v-model="form.cc_weight" placeholder="机动车整备质量(自重)"></b-form-input>
            </div>
            <div class="col-lg-4 mb20">
              <div class="lh44">选择机动车强制报废日期：</div>
              <el-date-picker
                style="width:100%;"
                v-model="form.cc_scrap_time"
                type="date"
                placeholder="选择机动车强制报废日期"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
              ></el-date-picker>
            </div>
            <div class="col-lg-4 mb20">
              <div class="lh44">机动车检验有效期：</div>
              <!-- <el-date-picker
                style="width:100%;"
                v-model="form.cc_examine_time"
                type="date"
                placeholder="选择机动车检验有效期"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
              ></el-date-picker> -->
              <b-form-input v-model="form.cc_examine_time" placeholder="机动车检验有效期"></b-form-input>
            </div>
            <div class="col-lg-4 mb20">
              <div class="lh44">道路运输证编号：</div>
              <b-form-input v-model="form.rc_no" placeholder="道路运输证编号"></b-form-input>
            </div>
            <div class="col-lg-4 mb20">
              <div class="lh44">道路检验有效期：</div>
              <b-form-input v-model="form.rc_examine_time" placeholder="道路检验有效期"></b-form-input>
            </div>
            <div class="col-lg-4 mb20">
              <div class="lh44">车辆购置税完税证明编号：</div>
              <b-form-input v-model="form.bcc_no" placeholder="车辆购置税完税证明编号"></b-form-input>
            </div>
            <div class="col-lg-4 mb20">
              <div class="lh44">强制险责任公司：</div>
              <b-form-input v-model="form.fi_name" placeholder="强制险责任公司"></b-form-input>
            </div>
            <div class="col-lg-4 mb20">
              <div class="lh44">强制险责任公司服务电话：</div>
              <b-form-input v-model="form.fi_tel" placeholder="强制险责任公司服务电话"></b-form-input>
            </div>
            <div class="col-lg-4 mb20">
              <div class="lh44">强制险保险单号：</div>
              <b-form-input v-model="form.fi_no" placeholder="强制险保险单号"></b-form-input>
            </div>
            <div class="col-lg-4 mb20">
              <div class="lh44">强制险费用合计：</div>
              <b-form-input v-model="form.fi_cost" placeholder="强制险费用合计"></b-form-input>
            </div>
            <div class="col-lg-4 mb20">
              <div class="lh44">选择强制险起始时间：</div>
              <el-date-picker
                style="width:100%;"
                v-model="form.fi_start_time"
                type="date"
                placeholder="选择强制险起始时间"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
              ></el-date-picker>
            </div>
            <div class="col-lg-4 mb20">
              <div class="lh44">选择强制险截止时间：</div>
              <el-date-picker
                style="width:100%;"
                v-model="form.fi_end_time"
                type="date"
                placeholder="选择强制险截止时间"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
              ></el-date-picker>
            </div>
            <div class="col-lg-4 mb20">
              <div class="lh44">强制险合同争议解决方式：</div>
              <b-form-input v-model="form.fi_dw" placeholder="强制险合同争议解决方式"></b-form-input>
            </div>
            <div class="col-lg-4 mb20">
              <div class="lh44">强制险代收车船使用税：</div>
              <b-form-input v-model="form.fi_vt" placeholder="强制险代收车船使用税"></b-form-input>
            </div>
            <div class="col-lg-4 mb20">
              <div class="lh44">选择强制险签单日期：</div>
              <el-date-picker
                style="width:100%;"
                v-model="form.fi_sign_time"
                type="date"
                placeholder="选择强制险签单日期"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
              ></el-date-picker>
            </div>
            <div class="col-lg-4 mb20">
              <div class="lh44">商业险责任公司名称：</div>
              <b-form-input v-model="form.bi_name" placeholder="商业险责任公司名称"></b-form-input>
            </div>
            <div class="col-lg-4 mb20">
              <div class="lh44">商业险责任公司电话：</div>
              <b-form-input v-model="form.bi_tel" placeholder="商业险责任公司电话"></b-form-input>
            </div>
            <div class="col-lg-4 mb20">
              <div class="lh44">商业险保险单号：</div>
              <b-form-input v-model="form.bi_no" placeholder="商业险保险单号"></b-form-input>
            </div>
            <div class="col-lg-4 mb20">
              <div class="lh44">商业险费用合计：</div>
              <b-form-input v-model="form.bi_cost" placeholder="商业险费用合计"></b-form-input>
            </div>
            <div class="col-lg-4 mb20">
              <div class="lh44">选择商业险起始日期：</div>
              <el-date-picker
                style="width:100%;"
                v-model="form.bi_start_time"
                type="date"
                placeholder="选择商业险起始日期"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
              ></el-date-picker>
            </div>
            <div class="col-lg-4 mb20">
              <div class="lh44">选择商业险截止日期：</div>
              <el-date-picker
                style="width:100%;"
                v-model="form.bi_end_time"
                type="date"
                placeholder="选择商业险截止日期"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
              ></el-date-picker>
            </div>
            <div class="col-lg-4 mb20">
              <div class="lh44">商业险合同争议解决方式：</div>
              <b-form-input v-model="form.bi_dw" placeholder="商业险合同争议解决方式"></b-form-input>
            </div>
            <div class="col-lg-4 mb20">
              <div class="lh44">选择商业险签约日期：</div>
              <el-date-picker
                style="width:100%;"
                v-model="form.bi_sign_time"
                type="date"
                placeholder="选择商业险签约日期"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
              ></el-date-picker>
            </div>
            <div class="col-lg-4 mb20">
              <div class="lh44">最后地点：</div>
              <b-form-input v-model="form.last_place" placeholder="最后地点"></b-form-input>
            </div>
            <div class="col-lg-4 mb20">
              <div class="lh44">备注：</div>
              <textarea v-model="form.remark" class="form-control" rows="3" style="height: 44px !important;" placeholder="备注"></textarea>
            </div>
          </div>
          <b-button variant="primary" @click="toValidate('add')" class="carSaveBtn">
            <i class="base-margin-right-5 fa fa-check-square-o "></i>保&nbsp;存
          </b-button>
          <b-button variant="secondary" @click="form = { p_id: 0 }" class="resBtn">
            <i class="base-margin-right-5 fa fa-refresh "></i>
            重&nbsp;置
          </b-button>
        </b-modal>

        <b-modal id="deleteAlert" title="确认删除" ref="deleteAlert" hide-footer no-close-on-esc no-close-on-backdrop hide-header-close>
          <div class="d-block text-center">
            <b-alert variant="danger" show>确定删除该车辆信息?</b-alert>
          </div>
          <b-button
            variant="danger"
            style="font-size:16px !important; margin-top:25px; padding:6px 80px !important;margin-bottom:30px !important;margin-right:0 !important;"
            @click="toDelete()"
          >
            删&nbsp;&nbsp;除
          </b-button>
          <b-button
            variant="primary"
            style="font-size:16px !important; margin-top:25px; float:right; padding:6px 80px !important;margin-bottom:30px !important;margin-right:0 !important;"
            @click="$refs.deleteAlert.hide(), (deleteItem = '')"
          >
            返&nbsp;&nbsp;回
          </b-button>
        </b-modal>
        <!--修改弹框-->
        <b-modal id="updateAlert" title="车辆信息详情" ref="updateAlert" size="xl" hide-footer no-close-on-esc no-close-on-backdrop hide-header-close>
          <div class="d-block text-center">
            <div class="row" style="text-align: left;">
              <div class="col-lg-4 mb25">
                <div class="lh44">汽车所属关系:</div>
                <el-select
                  class="marginBot"
                  style="height:40px !important"
                  :disabled="is_update"
                  v-model="form.type"
                  filterable
                  placeholder="请选择汽车所属关系"
                >
                  <el-option label="自供" value="0"></el-option>
                  <el-option label="供应商" value="1"></el-option>
                </el-select>
              </div>
              <div class="col-lg-4 mb25">
                <div class="lh44">机动车所有人：</div>
                <b-form-input v-model="form.car_onwer" :disabled="is_update" placeholder="机动车所有人"></b-form-input>
              </div>
              <div class="col-lg-4 mb25">
                <div class="lh44">身份证明名称：</div>
                <b-form-input
                  v-model="form.it"
                  :disabled="is_update"
                  placeholder="身份证明名称"
                  onkeypress="return (/[0-9.:]/.test(String.fromCharCode(event.keyCode)))"
                ></b-form-input>
              </div>
              <div class="col-lg-4 mb20">
                <div class="lh44">身份证明代码：</div>
                <b-form-input
                  v-model="form.it_member"
                  :disabled="is_update"
                  placeholder="身份证明代码"
                  onkeypress="return (/[0-9.:]/.test(String.fromCharCode(event.keyCode)))"
                ></b-form-input>
              </div>
              <div class="col-lg-4 mb20">
                <div class="lh44">登记机关：</div>
                <b-form-input v-model="form.ro" :disabled="is_update" placeholder="登记机关"></b-form-input>
              </div>
              <div class="col-lg-4 mb20">
                <div class="lh44">选择登记日期：</div>
                <el-date-picker
                  style="width:100%; height: 36px;"
                  v-model="form.r_time"
                  type="date"
                  :disabled="is_update"
                  placeholder="选择登记日期"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                ></el-date-picker>
              </div>
              <div class="col-lg-4 mb20">
                <div class="lh44">机动车登记编号：</div>
                <b-form-input v-model="form.car_no" :disabled="is_update" placeholder="机动车登记编号"></b-form-input>
              </div>
              <div class="col-lg-4 mb20">
                <div class="lh44">机动车类别：</div>
                <b-form-input v-model="form.car_type" :disabled="is_update" placeholder="机动车类别"></b-form-input>
              </div>
              <div class="col-lg-4 mb20">
                <div class="lh44">机动车档案编号：</div>
                <b-form-input v-model="form.cc_no" :disabled="is_update" placeholder="机动车档案编号"></b-form-input>
              </div>
              <div class="col-lg-4 mb20">
                <div class="lh44">机动车整备质量(自重)：</div>
                <b-form-input v-model="form.cc_weight" :disabled="is_update" placeholder="机动车整备质量(自重)"></b-form-input>
              </div>
              <div class="col-lg-4 mb20">
                <div class="lh44">选择机动车强制报废日期：</div>
                <el-date-picker
                  style="width:100%;"
                  v-model="form.cc_scrap_time"
                  type="date"
                  :disabled="is_update"
                  placeholder="选择机动车强制报废日期"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                ></el-date-picker>
              </div>
              <div class="col-lg-4 mb20">
                <div class="lh44">机动车检验有效期：</div>
                <!-- <el-date-picker
                  style="width:100%;"
                  v-model="form.cc_examine_time"
                  type="date"
                  :disabled="is_update"
                  placeholder="选择机动车检验有效期"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                ></el-date-picker> -->
                <b-form-input v-model="form.cc_examine_time" :disabled="is_update" placeholder="机动车检验有效期"></b-form-input>
              </div>
              <div class="col-lg-4 mb20">
                <div class="lh44">道路运输证编号：</div>
                <b-form-input v-model="form.rc_no" :disabled="is_update" placeholder="道路运输证编号"></b-form-input>
              </div>
              <div class="col-lg-4 mb20">
                <div class="lh44">道路检验有效期：</div>
                <b-form-input v-model="form.rc_examine_time" :disabled="is_update" placeholder="道路检验有效期"></b-form-input>
              </div>
              <div class="col-lg-4 mb20">
                <div class="lh44">车辆购置税完税证明编号：</div>
                <b-form-input v-model="form.bcc_no" :disabled="is_update" placeholder="车辆购置税完税证明编号"></b-form-input>
              </div>
              <div class="col-lg-4 mb20">
                <div class="lh44">强制险责任公司：</div>
                <b-form-input v-model="form.fi_name" :disabled="is_update" placeholder="强制险责任公司"></b-form-input>
              </div>
              <div class="col-lg-4 mb20">
                <div class="lh44">强制险责任公司服务电话：</div>
                <b-form-input v-model="form.fi_tel" :disabled="is_update" placeholder="强制险责任公司服务电话"></b-form-input>
              </div>
              <div class="col-lg-4 mb20">
                <div class="lh44">强制险保险单号：</div>
                <b-form-input v-model="form.fi_no" :disabled="is_update" placeholder="强制险保险单号"></b-form-input>
              </div>
              <div class="col-lg-4 mb20">
                <div class="lh44">强制险费用合计：</div>
                <b-form-input v-model="form.fi_cost" :disabled="is_update" placeholder="强制险费用合计"></b-form-input>
              </div>
              <div class="col-lg-4 mb20">
                <div class="lh44">选择强制险起始时间：</div>
                <el-date-picker
                  style="width:100%;"
                  v-model="form.fi_start_time"
                  type="date"
                  :disabled="is_update"
                  placeholder="选择强制险起始时间"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                ></el-date-picker>
              </div>
              <div class="col-lg-4 mb20">
                <div class="lh44">选择强制险截止时间：</div>
                <el-date-picker
                  style="width:100%;"
                  v-model="form.fi_end_time"
                  type="date"
                  :disabled="is_update"
                  placeholder="选择强制险截止时间"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                ></el-date-picker>
              </div>
              <div class="col-lg-4 mb20">
                <div class="lh44">强制险合同争议解决方式：</div>
                <b-form-input v-model="form.fi_dw" :disabled="is_update" placeholder="强制险合同争议解决方式"></b-form-input>
              </div>
              <div class="col-lg-4 mb20">
                <div class="lh44">强制险代收车船使用税：</div>
                <b-form-input v-model="form.fi_vt" :disabled="is_update" placeholder="强制险代收车船使用税"></b-form-input>
              </div>
              <div class="col-lg-4 mb20">
                <div class="lh44">选择强制险签单日期：</div>
                <el-date-picker
                  style="width:100%;"
                  v-model="form.fi_sign_time"
                  type="date"
                  :disabled="is_update"
                  placeholder="选择强制险签单日期"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                ></el-date-picker>
              </div>
              <div class="col-lg-4 mb20">
                <div class="lh44">商业险责任公司名称：</div>
                <b-form-input v-model="form.bi_name" :disabled="is_update" placeholder="商业险责任公司名称"></b-form-input>
              </div>
              <div class="col-lg-4 mb20">
                <div class="lh44">商业险责任公司电话：</div>
                <b-form-input v-model="form.bi_tel" :disabled="is_update" placeholder="商业险责任公司电话"></b-form-input>
              </div>
              <div class="col-lg-4 mb20">
                <div class="lh44">商业险保险单号：</div>
                <b-form-input v-model="form.bi_no" :disabled="is_update" placeholder="商业险保险单号"></b-form-input>
              </div>
              <div class="col-lg-4 mb20">
                <div class="lh44">商业险费用合计：</div>
                <b-form-input v-model="form.bi_cost" :disabled="is_update" placeholder="商业险费用合计"></b-form-input>
              </div>
              <div class="col-lg-4 mb20">
                <div class="lh44">选择商业险起始日期：</div>
                <el-date-picker
                  style="width:100%;"
                  v-model="form.bi_start_time"
                  type="date"
                  :disabled="is_update"
                  placeholder="选择商业险起始日期"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                ></el-date-picker>
              </div>
              <div class="col-lg-4 mb20">
                <div class="lh44">选择商业险截止日期：</div>
                <el-date-picker
                  style="width:100%;"
                  v-model="form.bi_end_time"
                  type="date"
                  :disabled="is_update"
                  placeholder="选择商业险截止日期"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                ></el-date-picker>
              </div>
              <div class="col-lg-4 mb20">
                <div class="lh44">商业险合同争议解决方式：</div>
                <b-form-input v-model="form.bi_dw" :disabled="is_update" placeholder="商业险合同争议解决方式"></b-form-input>
              </div>
              <div class="col-lg-4 mb20">
                <div class="lh44">选择商业险签约日期：</div>
                <el-date-picker
                  style="width:100%;"
                  v-model="form.bi_sign_time"
                  type="date"
                  :disabled="is_update"
                  placeholder="选择商业险签约日期"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                ></el-date-picker>
              </div>
              <div class="col-lg-4 mb20">
                <div class="lh44">最后地点：</div>
                <b-form-input v-model="form.last_place" :disabled="is_update" placeholder="最后地点"></b-form-input>
              </div>
              <div class="col-lg-4 mb20">
                <div class="lh44">备注：</div>
                <textarea
                  v-model="form.remark"
                  class="form-control"
                  :disabled="is_update"
                  rows="3"
                  style="height: 44px !important;"
                  placeholder="备注"
                ></textarea>
              </div>
            </div>
          </div>
          <b-button variant="secondary" @click="closeAlert('update')" class="resetButton carSaveBtn"
            ><i class="base-margin-right-5 fa fa-reply "></i>返&nbsp;&nbsp;回</b-button
          >
          <b-button v-if="is_update" variant="primary" @click="is_update = false" class="resetButton resBtn"
            ><i class="base-margin-right-5 fa fa-pencil-square-o "></i>修&nbsp;&nbsp;改</b-button
          >
          <b-button v-if="!is_update" variant="primary" @click="toValidate('update')" class="resetButton resBtn"
            ><i class="base-margin-right-5 fa fa-check-square-o "></i>保&nbsp;&nbsp;存</b-button
          >
        </b-modal>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Validator from 'async-validator';
export default {
  name: 'car',
  metaInfo: {
    title: '车辆管理',
  },
  components: {},
  data() {
    return {
      select_car_nu: '',
      select_car_onwer: '',
      is_title_search: false, //是否是模糊查询： true：是模糊查询； false： 不是模糊查询
      skip: 0,
      countNum: 0,
      currentPage: 1,
      totalRow: 0,
      is_update: true,
      // form: new Array(),
      list: [],
      form: {
        p_id: 0,
      },
      deleteItem: '',
      carValidator: new Validator({
        car_onwer: [{ type: 'string', required: true, message: '请填写机动车所有人' }],
        car_no: { type: 'string', required: true, message: '机动车登记编号' },
        // it_member: [{ type: 'string', required: true, message: '身份证明代码' }],
        // ro: { type: 'string', required: true, message: '登记机关' },
      }),
    };
  },
  computed: {
    ...mapState({
      limit: state => state.publics.limit,
      carList: state => state.self.carList,
    }),
  },
  async created() {
    await this.search();
  },
  watch: {
    is_title_search: {
      handler(nV, oV) {
        this.$set(this, 'currentPage', 1);
        if (nV) {
          this.titlesearch();
        } else {
          this.search();
        }
      },
    },
  },
  methods: {
    ...mapActions(['getCarList', 'carOperation']),
    //分页
    toSearch(currentPage) {
      this.currentPage = currentPage;
      if (this.is_title_search) {
        this.titlesearch();
      } else {
        this.search();
      }
    },
    //查询
    async search() {
      if (this.is_title_search) {
        this.is_title_search = false;
        return;
      }
      let skip = (this.currentPage - 1) * this.limit;
      let totalRow = await this.getCarList({ skip: skip, limit: this.limit });

      this.$set(this, 'list', this.carList);
      this.$set(this, 'totalRow', totalRow);
    },
    //验证,因为添加和修改的验证内容都是一样的,所以用一个方法
    async toValidate(type) {
      this.carValidator.validate(this.form, (errors, fields) => {
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
      await this.carOperation({ type: 'carSave', data: this.form });
      this.form = {};
      this.$refs.toAdd.hide();
      this.search();
    },
    //查询子表
    async searchSubForm(id) {
      let result = await this.$axios.get(`/zhwl/car/car_list?id=${id}`);
      if (result.data.msg === '成功') {
        if (result.jobReportSubList.length > 0) {
          this.$set(this, 'subForm', result.data.jobReportSubList);
          for (let i = 0; i < this.subForm.length; i++) {
            this.$set(this, 'time_quantum', result.data.jobReportSubList[i].is_night);
            this.getKindList(i);
          }
        }
      }
    },
    //jjdjdjddhddh
    openAlert(type, id) {
      if (type === 'update') {
        this.$refs.updateAlert.show();
        this.form = JSON.parse(JSON.stringify(this.list[id]));
      } else if (type === 'delete') {
        this.$refs.deleteAlert.show();
        this.operateId = id;
      } else if (type === 'add') {
        this.temporaryList.splice(0, this.temporaryList.length);
        this.form.dept_id = this.userInfo.dept_id;
        this.form.login_id = this.userInfo.login_id;
        this.addSubForm('open');
        this.$refs.addAlert.show();
      }
    },

    //打开删除提示框
    openDeleteAlert(id) {
      this.$refs.deleteAlert.show();
      this.deleteItem = id;
    },
    //删除
    async toDelete() {
      await this.carOperation({ type: 'carDelete', data: this.deleteItem });
      this.search();
      this.deleteItem = '';
      this.$refs.deleteAlert.hide();
    },
    //打开修改提示框
    openUpdateAlert(index) {
      this.$refs.updateAlert.show();
      this.form = JSON.parse(JSON.stringify(this.list[index]));
    },
    //修改
    async update() {
      await this.carOperation({ type: 'carEdit', data: this.form });
      this.form = {};
      this.search();
      this.$refs.updateAlert.hide();
    },
    //关闭弹框
    closeAlert(type) {
      if (type === 'update') {
        this.$refs.updateAlert.hide();
      } else if (type === 'delete') {
        this.$refs.deleteAlert.hide();
      }
      this.is_update = true;
      this.g_update = true;
      this.operateId = '';
      this.subForm.splice(0, this.subForm.length);
    },
    // closeAlert() {
    //   this.$refs.updateAlert.hide();
    //   this.operateId = '';
    //   this.form = {};
    // },
    //验证错误
    handleErrors(errors, fields) {
      this.$message.error(errors[0].message);
      this.errors = errors.reduce((p, c) => {
        // eslint-disable-next-line no-param-reassign
        p[c.field] = 'error';
        return p;
      }, {});
      // eslint-disable-next-line no-console
      console.debug(errors, fields);
    },
    //模糊查询按钮
    async searchButton() {
      this.currentPage = 1;
      if (!this.is_title_search) {
        this.is_title_search = true;
        return;
      }
      let skip = 0;
      let result = await this.$axios.get(`/zhwl/car/car_list?skip=${skip}&limit=${this.limit}&car_no=${this.select_car_nu}&car_onwer=${this.select_car_onwer}`);
      if (result.msg === '成功') {
        this.$set(this, 'list', result.carList);
        this.$set(this, 'totalRow', result.totalRow);
      }
      if (result.msg === '没有数据') {
        this.list = '';
        this.totalRow = 0;
      }
    },
    //模糊查询的方法
    async titlesearch() {
      if (!this.is_title_search) {
        this.is_title_search = true;
        return;
      }
      let skip = (this.currentPage - 1) * this.limit;
      let result = await this.$axios.get(`/zhwl/car/car_list?skip=${skip}&limit=${this.limit}&car_no=${this.select_car_nu}&car_onwer=${this.select_car_onwer}`);
      if (result.msg === '成功') {
        this.$set(this, 'list', result.carList);
        this.$set(this, 'totalRow', result.totalRow);
      }
      if (result.msg === '没有数据') {
        this.list = '';
        this.totalRow = 0;
      }
    },
  },
};
</script>

<style lang="css" scoped>
.marginBot5{
  margin-bottom: 5px;
}
.marginBot8{
  margin-bottom: 8px;
}
.marginBot20{
  margin-bottom: 20px;
}
.resetButton{
  color:#fff;
  margin-right:20px;
}
.table th, .table td {
    padding: 0.5rem;
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
.table {
    font-size: 14px;
}
.lh44 {
  text-align: left;
  line-height: 35px;
}
.mb25 {
  margin-bottom: 5px;
}
.mb20 {
  margin-bottom: 5px;
}
.resBtn {
  font-size:14px !important;
  margin-top:25px;
  padding:4px 12px !important;
  margin-bottom:30px !important;
  margin-right:18px !important;
  float:right;
}
.carSaveBtn {
  font-size:14px !important;
  margin-top:25px;
  float:right;
  padding:4px 12px !important;
  margin-bottom:30px !important;
  margin-right:0 !important;
}
.ml2Mix{
    max-width: 10% !important;
}
.ml13Mix{
  max-width: 13%;
}
.pll0{
  padding-left: 0 !important;
}
.plr0{
  padding-right: 0 !important;
}
.btn-primary,.btn-info {
  background-color: #5bc0de !important;
}
.btn-primary:hover,.btn-info:hover {
  cursor: pointer !important;
  background-color: #17a2b8 !important;
}
</style>
