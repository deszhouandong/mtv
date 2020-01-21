// const SAAS = '/api-u/api/saas'
let BASE = "http://172.16.85.112:8080/api-price",
  NODE_ENV = process.env.NODE_ENV, // development production
  VUE_APP_CONFIG = process.env.VUE_APP_CONFIG; // test prod
  const environment = process.env.NODE_ENV
// const BASE = 'https://api.apiopen.top'
console.log(environment,'VUE_APP_CONFIG')
if (environment === "test") {
  BASE = 'http://a.fehorizon.com/HXJFwpsTEST/api-price';
} else if (environment === "development") {
  BASE = "http://172.16.85.112:8080/api-price";
} else if (environment === "production") {
  BASE = 'http://hxjf.fehorizon.com/api-price';
}

module.exports = {
  api: {
    /*标准*/
    findStand: `${BASE}/price/standard/queryStandardPrice`, //标准价格查询
    pagingFind: `${BASE}/price/standard/queryPageList`, //分页查询
    selectKey: `${BASE}/price/standard/selectByPrimaryKey`, //根据主键查询详细信息接口
    save: `${BASE}/price/standard/save`, //新增/编辑接口
    standardPrice: `${BASE}/price/standard/fromStandardPrice`, //提交标准价格
    standEffectPrice: `${BASE}/price/standard/updateValid`, //标准价格生效
    standInvalidPrice: `${BASE}/price/standard/updateInValid`, //标准价格失效
    importExcel: `${BASE}/price/standard/importExcel`, //标准价格导入
    getAllUnitErpCode: `${BASE}/price/clusterapi/saas/getAllUnitErpCode`, //事业部列表查询
    getSubShopsErpCode: `${BASE}/price/clusterapi/saas/getSubShopsErpCode`, //事业部下营业店查询
    getSubPersonByErpCode: `${BASE}/price/clusterapi/saas/getSubPersonByErpCode`, //事业部下人员查询
    updateDarft: `${BASE}/price/standard/updateDarft`, //标准价格撤销
    downloadStandard: `${BASE}/price/standard/downloadStandard`, //标准模板下载

    /**区域 */
    regionSave: `${BASE}/price/region/save`, //新增/编辑
    regionPrice: `${BASE}/price/region/fromRegionPrice`, //提交区域价格
    updateValid: `${BASE}/price/region/updateValid`, //区域价格生效
    updateInValid: `${BASE}/price/region/updateInValid`, //区域价格失效
    revokeOrder: `${BASE}/price/region/updateDarft`,  // 区域价格撤销
    queryPrice: `${BASE}/price/region/queryRegionPrice`, //查询接口
    rImportExcel: `${BASE}/price/region/importExcel`, //导入
    selectByPrimaryKey: `${BASE}/price/region/selectByPrimaryKey`, //主键查询
    // queryPageList: `${BASE}/price/region/queryPageList`, //分页查询
    queryPageList: `${BASE}/price/region/queryPageList`, //分页查询
    frontparam: `${BASE}/price/region/frontparams`, // 页面基础数据
    standardUnit: `${BASE}/price/standard/pageFind`, // 根据事业部查询设备
    getDefaultPrice: `${BASE}/price/standard/selectByDeviceModelNoAndTime`,  // 根据设备型号与时间查询标准价
    downloadRegion: `${BASE}/price/region/downloadRegion`, // 区域模板下载

    /*人员*/
    findPerson: `${BASE}/price/mpsStaffDiscount/selectDynamicPageQuery`, //人员列表分页查询
    findStatePer: `${BASE}/price/mpsStaffDiscount/getEnum`, //人员状态，类型查询
    savePer: `${BASE}/price/mpsStaffDiscount/saveStaffDiscount`, //保存修改人员
    findPerId: `${BASE}/price/mpsStaffDiscount/selectByPrimaryKey`, //查询人员折扣(根据id查询详情)
    failDiscount: `${BASE}/price/mpsStaffDiscount/invalidStaffDiscount`, //失效人员折扣(状态改为失效)
    deleter: `${BASE}/price/mpsStaffDiscount/deleteStaffDiscount`, //逻辑删除人员折扣信息
    submit: `${BASE}/price/mpsStaffDiscount/submissionStaffDiscount`, //提交人员折扣信息
    templateDownload: `${BASE}/price/mpsStaffDiscount/downloadStaff`, //模板下载
    dataImport: `${BASE}/price/mpsStaffDiscount/importExcel`, //数据导入
    revoke: `${BASE}/price/mpsStaffDiscount/revokeStaffDiscount`, //撤销人员折扣
  }
}
