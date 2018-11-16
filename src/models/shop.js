import {
  requestGetShopList,
} from '-/services/shop'
import { errorHandler } from '-/services'

const initState = {
  list: [],
  keywords: '',
  total: null,
}

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
  }),
}

export default shop
