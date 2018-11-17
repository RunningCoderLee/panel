import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types'
import { Cascader } from 'antd'
import provinces from 'china-division/dist/provinces.json'
import cities from 'china-division/dist/cities.json'
import areas from 'china-division/dist/areas.json'


class RegionPicker extends PureComponent {
  constructor(props) {
    super(props)

    areas.forEach((area) => {
      const matchCity = cities.filter(city => city.code === area.cityCode)[0]
      if (matchCity) {
        matchCity.children = matchCity.children || []
        matchCity.children.push({
          label: area.name,
          value: area.code,
        })
      }
    })

    cities.forEach((city) => {
      const matchProvince = provinces.filter(
        province => province.code === city.provinceCode,
      )[0]
      if (matchProvince) {
        matchProvince.children = matchProvince.children || []
        matchProvince.children.push({
          label: city.name,
          value: city.code,
          children: city.children,
        })
      }
    })

    const options = provinces.map(province => ({
      label: province.name,
      value: province.code,
      children: province.children,
    }))

    this.state = {
      options,
    }
  }

  render() {
    const { options } = this.state
    return (
      <Cascader
        options={options}
        showSearch
        placeholder="请选择地址"
        {...this.props}
      />
    )
  }
}


export default RegionPicker
