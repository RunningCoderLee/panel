// 错误处理函数

import { BusinessError, NetError, CancelError } from './errors'


export default function errorHandler(error, config) {
  let type = ''
  let handler = error.defaultHandler

  if (error instanceof BusinessError) {
    type = 'business'
  } else if (error instanceof CancelError) {
    type = 'cancel'
  } else if (error instanceof NetError) {
    type = 'net'
  }

  if (!type) {
    throw error
  }

  if (config && typeof config[type] === 'function') {
    handler = config[type]
  }

  handler()
}
