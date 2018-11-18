import axios from 'axios'
import AxiosWrapper from './utils/axiosWrapper'

export { default as errorHandler } from './utils/errorHandler'

const isProd = process.env.NODE_ENV === 'production'

// TODO: 修改生产环境地址
export const baseURL = isProd ? '//127.0.0.1:8080' : '//39.98.50.55:3000/mock/12'

const service = axios.create({
  baseURL,
  timeout: 50000,
})

// Add a request interceptor
service.interceptors.request.use(config => config, error => Promise.reject(error))

// Add a response interceptor
service.interceptors.response.use(response => response, error => Promise.reject(error))

export default new AxiosWrapper(service)
