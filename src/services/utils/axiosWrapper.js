import axios, { CancelToken } from 'axios'
import { BusinessError, CancelError, NetError } from './errors'

class AxiosCancelabelPromise extends Promise {
  constructor(executor, cancelToken) {
    super(executor)

    this.cancelToken = cancelToken
  }

  cancel() {
    this.cancelToken.cancel()
  }
}

class Wrapper {
  constructor(axiosInstance) {
    this.axiosInstance = axiosInstance
  }

  static wrapRequest(request, cancelTokenSource) {
    return new AxiosCancelabelPromise((resolve, reject) => {
      request
        .then((res) => {
          const { data, status } = res

          if (!(status >= 200 && status < 300)) {
            return reject(new NetError(status))
          }

          if (data.code > 0) {
            return reject(new BusinessError(data.code, data.message))
          }

          return resolve(data, res)
        })
        .catch((error) => {
          if (axios.isCancel(error)) {
            return reject(new CancelError('Request canceled'))
          }

          const status = Number(error.code) || 0

          return reject(new NetError(status))
        })
    }, cancelTokenSource)
  }

  head(url, config) {
    const cancelTokenSource = CancelToken.source()

    return Wrapper.wrapRequest(
      this.axiosInstance.head(url, Object.assign({}, config, {
        cancelToken: cancelTokenSource.token,
      })),
      cancelTokenSource,
    )
  }

  get(url, config) {
    const cancelTokenSource = CancelToken.source()

    return Wrapper.wrapRequest(
      this.axiosInstance.get(url, Object.assign({}, config, {
        cancelToken: cancelTokenSource.token,
      })),
      cancelTokenSource,
    )
  }

  delete(url, config) {
    const cancelTokenSource = CancelToken.source()

    return Wrapper.wrapRequest(
      this.axiosInstance.delete(url, Object.assign({}, config, {
        cancelToken: cancelTokenSource.token,
      })),
      cancelTokenSource,
    )
  }

  post(url, data, config) {
    const cancelTokenSource = CancelToken.source()

    return Wrapper.wrapRequest(
      this.axiosInstance.post(url, data, Object.assign({}, config, {
        cancelToken: cancelTokenSource.token,
      })),
      cancelTokenSource,
    )
  }

  put(url, data, config) {
    const cancelTokenSource = CancelToken.source()

    return Wrapper.wrapRequest(
      this.axiosInstance.put(url, data, Object.assign({}, config, {
        cancelToken: cancelTokenSource.token,
      })),
      cancelTokenSource,
    )
  }

  patch(url, data, config) {
    const cancelTokenSource = CancelToken.source()

    return Wrapper.wrapRequest(
      this.axiosInstance.patch(url, data, Object.assign({}, config, {
        cancelToken: cancelTokenSource.token,
      })),
      cancelTokenSource,
    )
  }
}

export default Wrapper
