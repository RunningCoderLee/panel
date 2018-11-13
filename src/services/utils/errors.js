
import { message as Message } from 'antd'

// 业务异常
export class BusinessError extends Error {
  constructor(code, message) {
    super(message)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BusinessError)
    }

    this.code = code
  }

  defaultHandler() {
    Message.error(this.message)
  }
}

// 网络异常
export class NetError extends Error {
  constructor(code, message) {
    super(message)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BusinessError)
    }

    this.code = code
  }

  defaultHandler() {
    let content = ''
    switch (this.code) {
      case 400:
        content = '请求参数错误！'
        break
      case 500:
        content = '服务器内部错误！'
        break
      default:
        content = this.message
    }

    Message.error(content)
  }
}

// 中断异常
export class CancelError extends Error {
  constructor(message) {
    super(message)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CancelError)
    }
  }

  // eslint-disable-next-line
  defaultHandler() {
    console.error('Request canceled')
  }
}
