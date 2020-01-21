
import { request, config } from '../utils'

const { api } = config

const { /**标准 */findStand, selectKey, save, standardPrice, standEffectPrice, standInvalidPrice, importExcel, pagingFind, getAllUnitErpCode, getSubShopsErpCode,getSubPersonByErpCode,updateDarft,downloadStandard,
  /**区域 */regionPrice, updateValid, updateInValid, queryPrice, rImportExcel, selectByPrimaryKey, queryPageList,regionSave,frontparam,standardUnit,revokeOrder,getDefaultPrice,downloadRegion,
  /**人员 */ findPerson, findStatePer, savePer, findPerId, failDiscount, deleter, submit, templateDownload, dataImport, revoke } = api

/*标准 */
export function standListFind(param){//标准价格列表查询
  return request({
    url: findStand,
    method: 'post',
    data: param,
  })
}
export function standpagingFind(param){//分页查询
  return request({
    url: pagingFind,
    method: 'post',
    data: param,
  })
}
export function standSelectKey(param){//根据主键查询详细信息接口
  return request({
    url: selectKey,
    method: 'post',
    data: param,
  })
}
export function standSave(param){//新增/编辑接口
  return request({
    url: save,
    method: 'post',
    data: param,
  })
}
export function submitStandardPrice(param){//提交标准价格
  return request({
    url: standardPrice,
    method: 'post',
    data: param,
  })
}
export function standadEffectPrice(param){//标准价格生效
  return request({
    url: standEffectPrice,
    method: 'post',
    data: param,
  })
}
export function standadInvalidPrice(param){//标准价格失效
  return request({
    url: standInvalidPrice,
    method: 'post',
    data: param,
  })
}
export function standimportExcel(param){//标准价格导入
  return request({
    url: importExcel,
    method: 'post',
    data: param,
  })
}
export function getAllUnitErpCodes(param){//事业部列表查询
  return request({
    url: getAllUnitErpCode,
    method: 'post',
    data: param,
  })
}
export function getSubShopsErpCodes(param){//事业部下营业店查询
  return request({
    url: getSubShopsErpCode,
    method: 'post',
    data: param,
  })
}
export function getSubPersonByErpCodes(param){//事业部下人员查询
  return request({
    url: getSubPersonByErpCode,
    method: 'post',
    data: param,
  })
}

export function updateDarfts(param){//标准价格撤销
  return request({
    url: updateDarft,
    method: 'post',
    data: param,
  })
}

export function downloadStandards(param){//模板下载
  return request({
    url: downloadStandard,
    method: 'post',
    data: param,
  })
}


/*区域*/
export function regionPriceSubmit(param){//提交区域价格
  return request({
    url: regionPrice,
    method: 'post',
    data: param,
  })
}
export function regionUpdateValid(param){//区域价格生效
  return request({
    url: updateValid,
    method: 'post',
    data: param,
  })
}
export function regionUpdateInValid(param){//区域价格失效
  return request({
    url: updateInValid,
    method: 'post',
    data: param,
  })
}
export function regionQueryPrice(param){//查询接口
  return request({
    url: queryPrice,
    method: 'post',
    data: param,
  })
}
export function regionImportExcel(param){//导入
  return request({
    url: rImportExcel,
    method: 'post',
    data: param,
  })
}
export function regionSelectByPrimaryKey(param){//主键查询
  return request({
    url: selectByPrimaryKey,
    method: 'post',
    data: param,
  })
}
export function regionQueryPageList(param){//分页查询
  return request({
    url: queryPageList,
    method: 'post',
    data: param,
  })
}
export function bindRegionSave(param){//区域价格保存
  return request({
    url: regionSave,
    method: 'post',
    data: param,
  })
}

export function frontparams(param){//基础数据封装接口
  return request({
    url: frontparam,
    method: 'post',
    data: param,
  })
}

export function getStandardUnit(param){//根据事业部获取设备
  return request({
    url: standardUnit,
    method: 'post',
    data: param,
  })
}

export function revokeOrderInfo(param){//区域价格撤销
  return request({
    url: revokeOrder,
    method: 'post',
    data: param,
  })
}

export function getDefaultPriceInfo(param){// 根据设备型号及时间查询标准价
  return request({
    url: getDefaultPrice,
    method: 'post',
    data: param,
  })
}

export function downloadRegions(param){// 模板下载
  return request({
    url: downloadRegion,
    method: 'post',
    data: param,
  })
}

/*人员*/
export function personListFind(param){//人员列表分页查询
  return request({
    url: findPerson,
    method: 'post',
    data: param,
  })
}
export function perListStateFind(param){//人员状态，类型查询
  return request({
    url: findStatePer,
    method: 'post',
    data: param,
  })
}
export function perListSave(param){ //保存修改人员
  return request({
    url: savePer,
    method: 'post',
    data: param,
  })
}
export function perListIdFind(param){ //查询人员折扣(根据id查询详情)
  return request({
    url: findPerId,
    method: 'post',
    data: param,
  })
}
export function failDiscountPer(param){ //失效人员折扣(状态改为失效)
  return request({
    url: failDiscount,
    method: 'post',
    data: param,
  })
}
export function deletePer(param){ //逻辑删除人员折扣信息
  return request({
    url: deleter,
    method: 'post',
    data: param,
  })
}
export function submitPer(param){ //提交人员折扣信息
  return request({
    url: submit,
    method: 'post',
    data: param,
  })
}
export function templateDownloadPer(param){ //模板下载
  return request({
    url: templateDownload,
    method: 'post',
    data: param,
  })
}
export function dataImportPer(param){ //数据导入
  return request({
    url: dataImport,
    method: 'post',
    data: param,
  })
}
export function revokeStaffDiscount(param){ //撤销人员折扣
  return request({
    url: revoke,
    method: 'post',
    data: param,
  })
}
