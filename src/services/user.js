import qs from 'qs'
import service from './index'

// 用户登录
// http://39.98.50.55:3000/project/12/interface/api/10
export const requestLogin = payload => service.post('/login', qs.stringify(payload))

// 用户登出
// http://yapi.int.medlinker.com/project/63/interface/api/524
export const requestLogout = () => service.post('/logout')

// 用户注册
// http://yapi.int.medlinker.com/project/63/interface/api/512
export const requestRegister = payload => service.post('/user/register', payload)

// 检查用户名
// http://yapi.int.medlinker.com/project/63/interface/api/518
export const requestCheckUsername = payload => service.post('/user/checkusername', payload)

// 获取用户信息
// http://yapi.int.medlinker.com/project/63/interface/api/521
export const requestGetUserInfo = (id) => {
  if (id) {
    return service.get('/user/info', {
      params: {
        id,
      },
      paramsSerializer(params) {
        return qs.stringify(params, { arrayFormat: 'brackets' })
      },
    })
  }

  return service.get('/user/info')
}
