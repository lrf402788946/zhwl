import _ from 'lodash';

/**
 * data:要筛选的数据集 array
 * searchItem: 需要信息的属性名,使用它取出属性要与value进行对比 string
 * value:当前的值 any
 * label:需要显示的信息 string
 */
const filters = {
  getName(object) {
    const { data, searchItem, value, label } = object;
    //1判断要过滤的数据集是否有值
    if (data.length > 0) {
      //2-1判断作为过滤条件的值是否正常
      if (value !== null || value !== undefined) {
        //3声明返回变量
        let returnText = 'undefined';
        //4循环出数据集中的项
        for (const item of data) {
          //5取出数据源中的searchItem和value比较
          if (_.get(item, `${searchItem}`) === value) {
            //6若完全相等,则将数据源中此项名为label属性的值取出,返回,强制结束循环
            returnText = _.get(item, `${label}`);
            break;
          }
        }
        return returnText;
      } else {
        //2-2不正常则返回undefined
        return _.get(data, searchItem) === undefined ? '' : _.get(data, searchItem);
      }
    }
  },
};

export default filters;
