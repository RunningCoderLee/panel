import {
  requestGetMerchantList,
} from '-/services/merchant'

const initState = {
  list: [],
  current: null,
  keywords: '',
  pagination: {
    total: 0,
    pageSize: 10,
    current: 1,
  },
}

const merchant = {
  state: initState,
  reducers: {
    getListSuccess(state, payload) {
      return {
        ...state,
        list: payload,
      }
    },
  },
  effects: () => ({
    async getList(id) {
      try {
        const { data: { data } } = await requestGetMerchantList(id)

        this.getListSuccess(data)

        return Promise.resolve()
      } catch (err) {
        return Promise.reject(err)
      }
    },
  }),
}

export default merchant
