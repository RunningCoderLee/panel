// import qs from 'qs'
// import service from './index'


const asyncDelay = ms => new Promise(r => setTimeout(r, ms))

// 获取省份
// http://39.98.50.55:3000/project/12/interface/api/34
// export const requestGetProvinces = payload => service.get('/login', payload)
export const requestGetProvinces = async () => {
  await asyncDelay(1000)

  return [{
    value: '四川',
    label: '四川',
    type: 'province',
  }, {
    value: '湖南',
    label: '湖南',
    type: 'province',
  }]
}

// export const requestGetCities = province => service.get('/login', { province })
export const requestGetCities = async (province) => {
  await asyncDelay(1000)

  if (province === '四川') {
    return [{
      value: '成都',
      label: '成都',
      type: 'city',
    }, {
      value: '乐山',
      label: '乐山',
      type: 'city',
    }]
  }

  if (province === '湖南') {
    return [{
      value: '长沙',
      label: '长沙',
      type: 'city',
    }, {
      value: '衡阳',
      label: '衡阳',
      type: 'city',
    }]
  }

  return []
}

// export const requestGetArea = city => service.get('/login', { city })
export const requestGetArea = async (city) => {
  await asyncDelay(1000)

  if (city === '成都') {
    return [{
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
    return [{
      value: '五通桥区',
      label: '五通桥区',
      type: 'area',
    }, {
      value: '沙湾区',
      label: '沙湾区',
      type: 'area',
    }]
  }

  return []
}
