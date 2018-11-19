import {
  requestGetShopList,
  requestPostShop,
} from '-/services/shop'
import { errorHandler } from '-/services'

const initState = {
  list: [],
  keywords: '',
  total: null,
}

const asyncDelay = ms => new Promise(r => setTimeout(r, ms))

const shop = {
  state: initState,
  reducers: {
    getListSuccess(state, payload) {
      return {
        ...state,
        list: payload.list || [],
        total: payload.total || null,
      }
    },
    getListFailure(state) {
      return {
        ...state,
        list: [],
        total: null,
      }
    },
    changeKeywords(state, payload) {
      return {
        ...state,
        keywords: payload,
      }
    },
    resetState() {
      return {
        ...initState,
      }
    },
    updateStatus(state, payload) {
      const newList = state.list.map((item) => {
        let temp = item
        if (temp.id === payload.id) {
          temp = payload
        }

        return temp
      })

      return {
        ...state,
        list: newList,
      }
    },
  },
  effects: () => ({
    async getList(payload, rootState) {
      const state = rootState.shop
      const params = {
        query: state.keywords,
        id: 'd278d586-ab51-49b3-858e-e95c71de276c',
      }
      try {
        const { data = {} } = await requestGetShopList(params)
        this.getListSuccess(data)
      } catch (err) {
        errorHandler(err)
        this.getListFailure()
      }
    },
    async switchStatus(payload, rootState) {
      await asyncDelay(3000)
      const target = rootState.shop.list.find(item => item.id === payload.id)

      const result = {
        ...target,
        status: payload.status ? 1 : 0,
      }
      this.updateStatus(result)
    },
    async deleteShop(payload, rootState) {
      const list = [...rootState.shop.list]
      const targetIndex = list.findIndex(item => item.id === payload)
      list.splice(targetIndex, 1)
      const result = { list, total: list.length }

      this.getListSuccess(result)
    },
    async postShop(payload) {
      try {
        await requestPostShop(payload)
      } catch (error) {
        errorHandler(error)
      }
    },
    async validateEmloyeeAccount() {
      await asyncDelay(3000)
      return Promise.resolve(false)
    },
    async getShop() {
      const mockData = {
        name: 'name',
        tel: '12324',
        storeType: 'mainStore',
        addr: 'xxxxx',
        employees: [{
          account: '11',
          password: '12324',
          name: '张三',
          sex: 1,
          roleId: 'admin',
        }],
        pays: [{
          payName: '网银支付',
          payUrl: '',
        }],
      }

      return Promise.resolve(mockData)
    },
    async editShop(payload) {
      try {
        await requestPostShop(payload)
      } catch (error) {
        errorHandler(error)
      }
    },
  }),
}

export default shop
