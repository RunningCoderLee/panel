import service from './index'

// 查询商户列表
// http://yapi.int.medlinker.com/project/63/interface/api/58
export const requestGetShopList = payload => service.get(`/biz/company/${payload.companyId}/store`, {
  params: payload.query,
})

// 新增商户
// http://yapi.int.medlinker.com/project/63/interface/api/52
export const requestPostCreateShop = payload => service.post(`/biz/company/${payload.companyId}/store`, payload)

// 新增商户
// http://yapi.int.medlinker.com/project/63/interface/api/52
export const requestPostEditShop = payload => service.post('biz/store', payload)

// 删除商户
// http://yapi.int.medlinker.com/project/63/interface/api/118
export const requestDeleteShop = payload => service.delete(`/biz/company/${payload.companyId}/store/${payload.storeId}`)
