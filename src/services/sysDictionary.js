import service from './index'

// 获取系统字典数据
// http://yapi.int.medlinker.com/project/63/interface/api/28
export const requestGetSysDictionary = payload => service.get('/sys/dict', {
  params: payload,
})

export default null
