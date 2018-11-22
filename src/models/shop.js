import {
  requestGetShopList,
  requestPostCreateShop,
  requestGetShopDetail,
  requestPostEditShop,
  requestDeleteShop,
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
        companyId: payload,
      }
      try {
        const { data } = await requestGetShopList(params)
        this.getListSuccess(data || {})
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
    async postCreateShop(payload) {
      try {
        await requestPostCreateShop(payload)
      } catch (error) {
        errorHandler(error)
      }
    },
    async validateEmloyeeAccount() {
      await asyncDelay(3000)
      return Promise.resolve(false)
    },
    async getShopDetail(payload) {
      try {
        const { data } = await requestGetShopDetail(payload)

        return Promise.resolve(data)
      } catch (error) {
        errorHandler(error)
        return Promise.reject()
      }
    },
    async editShop(payload) {
      try {
        await requestPostEditShop(payload)
      } catch (error) {
        errorHandler(error)
      }
    },
    async deleteShop(payload) {
      try {
        await requestDeleteShop(payload)
      } catch (error) {
        errorHandler(error)
      }
    },
  }),
}

export default shop
