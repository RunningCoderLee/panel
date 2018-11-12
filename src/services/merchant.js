import qs from 'qs'
import service from './index'

// 新增商户
// http://yapi.int.medlinker.com/project/63/interface/api/515
export const requestAddMerchant = payload => service.post('/login', qs.stringify(payload))

// 删除商户
// http://yapi.int.medlinker.com/project/63/interface/api/512
export const requestDeleteMerchant = id => service.delete(`/user/register/${id}`)

// 修改商户信息
// http://yapi.int.medlinker.com/project/63/interface/api/524
export const requestUpdateMerchant = (id, payload) => service.post(`/logout/${id}`, payload)

// 查询商户列表
// http://yapi.int.medlinker.com/project/63/interface/api/524
export const requestGetMerchantList = payload => service.get('/111', payload)

// 查询商户详情
// http://yapi.int.medlinker.com/project/63/interface/api/524
export const requestGetMerchantDetail = id => service.get(`/111${id}`)
