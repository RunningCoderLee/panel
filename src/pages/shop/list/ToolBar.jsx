import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Input } from 'antd'
import history from '-/utils/history'

import * as styles from './ToolBar.module.less'

class ToolBar extends Component {
  static propTypes = {
    keywords: PropTypes.string,
    total: PropTypes.oneOfType([PropTypes.number]),
    onSearch: PropTypes.func,
  }

  static defaultProps = {
    total: null,
    onSearch: () => {},
    keywords: '',
  }

  constructor(props) {
    super(props)
    this.state = {
      value: props.keywords,
    }
  }

  componentWillReceiveProps(nextProps) {
    const { value } = this.state
    if (nextProps.keywords !== value) {
      this.setState({
        value: nextProps.keywords,
      })
    }
  }

  handleChange = (e) => {
    const { value = '' } = e.target

    this.setState({ value })
  }

  handleSearch = () => {
    const { onSearch } = this.props
    const { value } = this.state

    onSearch(value)
  }

  handleGotoCreatePage = () => {
    history.push('/shop/add')
  }

  render() {
    const { total } = this.props
    const { value } = this.state

    return (
      <div className={styles['tool-bar']}>
        <div className={styles['search-container']}>
          <Input
            value={value}
            className={styles['search-input']}
            placeholder="请输入店铺/用户名/角色等关键字搜索"
            onChange={this.handleChange}
          />
          <Button type="primary" onClick={this.handleSearch}>搜索</Button>
        </div>
        <div>
          <Button type="primary" onClick={this.handleGotoCreatePage}>新增</Button>
          <span className={styles.total}>
            门店数量：
            {total}
          </span>
        </div>
      </div>
    )
  }
}

export default ToolBar
