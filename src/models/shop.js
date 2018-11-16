import {
  requestGetShopList,
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
        list: payload.list,
        total: payload.total,
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
      let params = {
        query: state.keywords,
        id: 'd278d586-ab51-49b3-858e-e95c71de276c',
      }

      if (payload !== undefined) {
        params = Object.assign({}, params, payload)
      }
      try {
        const { data } = await requestGetShopList(params)
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
  }),
}

export default shop
