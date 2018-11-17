import service from './index'

// 查询商户列表
// http://yapi.int.medlinker.com/project/63/interface/api/58
export const requestGetShopList = payload => service.get('/biz/store', {
  params: payload,
})

// 新增商户
// http://yapi.int.medlinker.com/project/63/interface/api/52
export const requestPostShop = payload => service.post('biz/store', payload)
