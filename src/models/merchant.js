import {
  requestGetMerchantList, requestAddMerchant,
} from '-/services/merchant'
import { message } from 'antd'
import { errorHandler } from '-/services'

const initState = {
  list: [],
  current: null,
  keywords: '',
  orderBy: 'descend',
  pagination: {
    total: 0,
    pageSize: 10,
    current: 1,
  },
}

const asyncDelay = ms => new Promise(r => setTimeout(r, ms))

const merchant = {
  state: initState,
  reducers: {
    getListSuccess(state, payload) {
      return {
        ...state,
        list: payload.list,
        orderBy: payload.sortOrder,
        pagination: {
          ...state.pagination,
          total: payload.total,
        },
      }
    },
    getListFailure(state) {
      return {
        ...state,
        list: [],
      }
    },
    changeKeywords(state, payload) {
      return {
        ...state,
        keywords: payload,
      }
    },
    changeTable(state, payload) {
      return {
        ...state,
        orderBy: payload.sorter.order,
        total: payload.pagination.total,
        pagination: {
          ...state.pagination,
          current: payload.pagination.current,
          pageSize: payload.pagination.pageSize,
        },
      }
    },
    changePagination(state, payload) {
      return {
        ...state,
        pagination: {
          ...payload,
        },
      }
    },
    changeSortOrder(state, payload) {
      return {
        ...state,
        sortOrder: payload,
      }
    },
    updateStatus(state, payload) {
      const newList = [
        ...state.list.slice(0, payload.id),
        payload,
        ...state.list.slice(Number(payload.id) + 1, state.list.length),
      ]

      return {
        ...state,
        list: newList,
      }
    },
    resetState() {
      return initState
    },
  },
  effects: () => ({
    async getList(payload, rootState) {
      const state = rootState.merchant
      let params = {
        page: state.pagination.current,
        size: state.pagination.pageSize,
        query: state.keywords,
        sortOrder: state.orderBy,
      }

      if (payload !== undefined) {
        params = Object.assign({}, params, payload)
      }

      try {
        const { data } = await requestGetMerchantList(params)

        this.getListSuccess(data)
      } catch (err) {
        errorHandler(err)
        this.getListFailure()
      }
    },
    async addMerchant(payload) {
      try {
        const { data } = await requestAddMerchant(payload)

        console.log(data)

        message.success('新增成功！')
      } catch (err) {
        errorHandler(err)
      }
    },
    async modifyMerchant() {
      console.log(111)
    },
    async deleteMerchant() {
      console.log(22)
    },
    async switchStatus(payload, rootState) {
      await asyncDelay(3000)
      const target = rootState.merchant.list.find(item => item.id === payload.id)

      const result = {
        ...target,
        status: payload.status ? '1' : '0',
      }

      this.updateStatus(result)
    },
  }),
}

export default merchant
