import {
  requestGetSysDictionary,
} from '-/services/sysDictionary'
import { errorHandler } from '-/services'

const mockStoreTypes = [{
  name: '总店',
  code: 'mainStore',
}, {
  name: '分店',
  code: 'subStore',
}, {
  name: '外场',
  code: 'outStore',
}]

const mockRoleTypes = [{
  name: '店长',
  code: 'storeManager',
}, {
  name: '店员',
  code: 'clerk',
}, {
  name: '财务',
  code: 'finance',
}, {
  name: '仓储',
  code: 'warehouse',
}, {
  name: '管理员',
  code: 'admin',
}, {
  name: '品牌管理员',
  code: 'brandAdmin',
}]

const mockPayTypes = [{
  name: '浦发扫码',
  code: 'pufaPay',
}, {
  name: '网银支付',
  code: 'EBankPay',
}, {
  name: '乐惠',
  code: 'lehui',
}, {
  name: '马上分期',
  code: 'installment',
}, {
  name: '现金支付',
  code: 'cashPay',
}, {
  name: '银行卡支付',
  code: 'bankCardPay',
}]

const mockType = {
  STORE: mockStoreTypes,
  ROLE: mockRoleTypes,
  PAY: mockPayTypes,
}


const getTypes = (source) => {
  const types = {}
  if (source.type === 'STORE') {
    types.storeTypeList = source.list
  }
  if (source.type === 'ROLE') {
    types.roleTypeList = source.list
  }
  if (source.type === 'PAY') {
    types.payTypeList = source.list
  }

  return types
}

const initState = {
  storeTypeList: [],
  roleTypeList: [],
  payTypeList: [],
}

const shop = {
  state: initState,
  reducers: {
    getDictionarySuccess(state, payload) {
      const types = getTypes(payload)
      return {
        ...state,
        ...types,
      }
    },
    getDictionaryFailure(state, payload) {
      const types = getTypes(payload)
      return {
        ...state,
        ...types,
      }
    },
  },
  effects: () => ({
    async getDictionaryList(payload) {
      const params = {
        type: payload,
      }

      try {
        await requestGetSysDictionary(params)
        const mockData = mockType[payload]
        this.getDictionarySuccess({ list: mockData, type: payload })
      } catch (err) {
        errorHandler(err)
        this.getDictionaryFailure({ list: [], type: payload })
      }
    },
  }),
}

export default shop
