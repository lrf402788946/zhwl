export const SYSTEM = {
  name: '系统管理',
  menu: [
    {
      name: '用户管理',
      uri: '/system.html#/user',
    },
    {
      name: '角色管理',
      uri: '/system.html#/role',
    },
    {
      name: '权限分配',
      uri: '/system.html#/user_role',
    },
    {
      name: '部门管理',
      uri: '/personnel.html#/dept',
    },
    {
      name: '岗位管理',
      uri: '/personnel.html#/post',
    },
  ],
};
export const PERSONNEL = {
  name: '人员管理',
  menu: [
    // {
    //   name: '员工管理',
    //   uri: '/personnel.html#/staff',
    // },
    {
      name: '司机管理',
      uri: '/personnel.html#/driver',
    },
    {
      name: '客户管理',
      uri: '/personnel.html#/client',
    },
    {
      name: '客户合同管理',
      uri: '/personnel.html#/contract',
    },
    {
      name: '供应商管理',
      uri: '/personnel.html#/supplier',
    },
    {
      name: '供应商合同管理',
      uri: '/personnel.html#/supplier_contract',
    },
  ],
};
export const CAR = {
  name: '车辆管理',
  menu: [
    {
      name: '车辆管理',
      uri: '/car.html#/car',
    },
    {
      name: '车辆日常维修记录',
      uri: '/car.html#/car_daily_detail',
    },
    {
      name: '车辆支出管理',
      uri: '/car.html#/car_transport',
    },
    {
      name: '单车核算',
      uri: '/car.html#/car_cost',
    },
  ],
};

export const BUSINESS = {
  name: '业务管理',
  menu: [
    {
      name: '收/支项管理',
      uri: '/business.html#/cost',
    },
    // {
    //   name: '收入单管理',
    //   uri: '/business.html#/in_page',
    // },
    {
      name: '订单管理',
      uri: '/business.html#/order',
    },
    {
      name: '收入管理',
      uri: '/business.html#/split_cargo',
    },
    {
      name: '装车',
      uri: '/business.html#/car_loading',
    },
    {
      name: '支出单管理',
      uri: '/business.html#/out',
    },
    {
      name: '运输管理',
      uri: '/business.html#/transport',
    },
    {
      name: '线路管理',
      uri: '/business.html#/dly_way',
    },
    // {
    //   name: '货物管理',
    //   uri: '/business.html#/goods',
    // },
  ],
};

export const SETTLEMENT = {
  name: '结算单管理',
  menu: [
    {
      name: '客户结算单',
      uri: '/settlement.html#/customerStatement',
    },
    {
      name: '客户已结算的结算单',
      uri: '/settlement.html#/cus_already',
    },
    {
      name: '供应商结算单',
      uri: '/settlement.html#/vendorStatement',
    },
    {
      name: '供应商已结算的结算单',
      uri: '/settlement.html#/vendor_already',
    },
  ],
};

export const SEARCH = {
  name: '综合查询',
  menu: [
    {
      name: '客户结算单',
      uri: '/settlement.html#/customerStatement',
    },
    {
      name: '供应商结算单',
      uri: '/settlement.html#/vendorStatement',
    },
  ],
};
