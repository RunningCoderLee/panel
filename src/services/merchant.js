// import qs from 'qs'
import service from './index'

// 新增商户
// http://39.98.50.55:3000/project/12/interface/api/34
export const requestAddMerchant = payload => service.post('/biz/company', payload)

// 删除商户
// http://39.98.50.55:3000/project/12/interface/api/70
export const requestDeleteMerchant = id => service.delete(`/biz/company/${id}`)

// 修改商户信息
// http://yapi.int.medlinker.com/project/63/interface/api/524
// export const requestUpdateMerchant = (id, payload) => service.post(`/logout/${id}`, payload)

// 查询商户列表
// http://39.98.50.55:3000/project/12/interface/api/46
export const requestGetMerchantList = payload => service.get('/biz/company', {
  params: payload,
})

// 查询商户详情
// http://39.98.50.55:3000/project/12/interface/api/100
export const requestGetMerchantDetail = id => service.get(`/biz/company/${id}`)
