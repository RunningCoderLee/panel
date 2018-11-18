import {
// requestGetProvinces,
} from '-/services/region'
// import { message } from 'antd'
import { errorHandler } from '-/services'

const initState = {
  provinces: [],
  cityies: [],
  area: [],
  options: [],
}

const asyncDelay = ms => new Promise(r => setTimeout(r, ms))

const merchant = {
  state: initState,
  reducers: {
    getProvincesSuccess(state, provinces) {
      return {
        ...state,
        provinces,
        options: provinces,
      }
    },
    getProvincesFailure(state) {
      return {
        ...state,
        provinces: [],
        options: [],
      }
    },
    getCitiesSuccess(state, cities) {
      return {
        ...state,
        cities,
      }
    },
    getCitieFailure(state) {
      return {
        ...state,
        cities: [],
      }
    },
    getAreaSuccess(state, area) {
      return {
        ...state,
        area,
      }
    },
    getAreaFailure(state) {
      return {
        ...state,
        area: [],
      }
    },
  },
  effects: () => ({
    async getProvinces() {
      try {
        await asyncDelay(1000)
        const provinces = [{
          value: '四川',
          label: '四川',
          isLeaf: false,
          type: 'province',
        }, {
          value: '湖南',
          label: '湖南',
          isLeaf: false,
          type: 'province',
        }]

        this.getProvincesSuccess(provinces)
      } catch (err) {
        errorHandler(err)
        this.getProvincesFailure()
      }
    },
    async getCities(province) {
      try {
        await asyncDelay(1000)
        let cities = []
        if (province === '四川') {
          cities = [{
            value: '成都',
            label: '成都',
            isLeaf: false,
            type: 'city',
          }, {
            value: '乐山',
            label: '乐山',
            isLeaf: true,
            type: 'city',
          }]
        }

        if (province === '湖南') {
          cities = [{
            value: '长沙',
            label: '长沙',
            type: 'city',
          }, {
            value: '衡阳',
            label: '衡阳',
            type: 'city',
          }]
        }

        this.getCitiesSuccess(cities)
      } catch (err) {
        errorHandler(err)
        this.getCitiesFailure()
      }
    },
    async getArea(city) {
      try {
        await asyncDelay(1000)
        let area = []
        if (city === '成都') {
          area = [{
            value: '武侯区',
            label: '武侯区',
            type: 'area',
          }, {
            value: '高新区',
            label: '高新区',
            type: 'area',
          }]
        }

        if (city === '乐山') {
          area = [{
            value: '五通桥区',
            label: '五通桥区',
            type: 'area',
          }, {
            value: '沙湾区',
            label: '沙湾区',
            type: 'area',
          }]
        }

        this.getCitiesSuccess(area)
      } catch (err) {
        errorHandler(err)
        this.getAreaFailure()
      }
    },
  }),
}

export default merchant
