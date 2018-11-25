import service from './index'

// 获取商户列表
// http://yapi.int.medlinker.com/project/63/interface/api/58
export const requestGetShopList = ({ companyId, ...params }) => service.get(`/biz/company/${companyId}/store`, { params })

// 新增商户
// http://yapi.int.medlinker.com/project/63/interface/api/52
export const requestCreateShop = ({ companyId, ...params }) => service.post(`/biz/company/${companyId}/store`, params)

// 获取商户详情
// http://yapi.int.medlinker.com/project/63/interface/api/106
export const requestGetShopDetail = payload => service.get(`/biz/company/${payload.companyId}/store/${payload.storeId}`)

// 修改商户
// http://yapi.int.medlinker.com/project/63/interface/api/112
export const requestEditShop = ({ companyId, storeId, ...params }) => (
  service.put(`/biz/company/${companyId}/store/${storeId}`, { ...params })
)

// 删除商户
// http://yapi.int.medlinker.com/project/63/interface/api/118
export const requestDeleteShop = ({ companyId, storeId }) => service.delete(`/biz/company/${companyId}/store/${storeId}`)
