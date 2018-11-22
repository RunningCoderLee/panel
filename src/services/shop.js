import service from './index'

// 获取商户列表
// http://yapi.int.medlinker.com/project/63/interface/api/58
export const requestGetShopList = payload => service.get(`/biz/company/${payload.companyId}/store`, {
  params: payload.query,
})

// 新增商户
// http://yapi.int.medlinker.com/project/63/interface/api/52
export const requestPostCreateShop = ({ companyId, ...params }) => service.post(`/biz/company/${companyId}/store`, params)

// 获取商户详情
// http://yapi.int.medlinker.com/project/63/interface/api/106
export const requestGetShopDetail = payload => service.get(`/biz/company/${payload.companyId}/store/${payload.storeId}`)

// 修改商户
// http://yapi.int.medlinker.com/project/63/interface/api/112
export const requestPostEditShop = ({ companyId, storeId, ...params }) => (
  service.put(`/biz/company/${companyId}/store/${storeId}`, params)
)

// 删除商户
// http://yapi.int.medlinker.com/project/63/interface/api/118
export const requestDeleteShop = payload => service.delete(`/biz/company/${payload.companyId}/store/${payload.storeId}`)
