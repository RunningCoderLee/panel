import service from './index'

// 查询商户列表
// http://yapi.int.medlinker.com/project/63/interface/api/58
export const requestGetShopList = payload => service.get('/biz/store', {
  params: payload,
})

// 查询商户详情 TODO: delete
// http://yapi.int.medlinker.com/project/63/interface/api/524
export const requestGetMerchantDetail = id => service.get(`/111${id}`)
