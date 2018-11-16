import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Table, Switch } from 'antd'
import ToolBar from './ToolBar'

import * as styles from './list.module.less'

const mapState = state => ({
  list: state.shop.list,
  keywords: state.shop.keywords,
  total: state.shop.total,
})

const mapDispatch = dispatch => dispatch.shop

class List extends Component {
  static propTypes = {
    getList: PropTypes.func.isRequired,
    keywords: PropTypes.string.isRequired,
    list: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    total: PropTypes.oneOfType([PropTypes.number]),
    changeKeywords: PropTypes.func.isRequired,
  }

  static defaultProps = {
    total: null,
  }

  columns = [{
    title: '店铺名称',
    dataIndex: 'name',
  }, {
    title: '店铺地址',
    dataIndex: 'addr',
  }, {
    title: '店铺电话',
    dataIndex: 'tel',
  }, {
    title: '店长',
    dataIndex: 'manager',
  }, {
    title: '店员',
    dataIndex: 'employees',
    render: text => this.renderEmployees(text),
  }, {
    title: '是否启用',
    dataIndex: 'status',
    render: (text, record) => (
      <Switch
        onChange={this.handleChangeStatus(record.id)}
        checkedChildren="营业"
        unCheckedChildren="停业"
        checked={!!text}
      />
    ),
  }, {
    title: '操作',
    dataIndex: 'operator',
    render: () => (
      <>
        <span>修改</span>
        <span>删除</span>
      </>
    ),
  }]

  constructor(props) {
    super(props)
    this.input = React.createRef()
  }

  componentDidMount() {
    const { getList } = this.props

    getList()
  }

  componentDidUpdate(prevProps) {
    const { keywords: prevKeywords } = prevProps
    const { keywords, getList } = this.props

    if (prevKeywords !== keywords) {
      getList()
    }
  }

  handleChangeStatus = id => (value) => {
    console.log(id)
    console.log(value)
  }

  handleSearch = (keywords) => {
    const { changeKeywords } = this.props
    changeKeywords(keywords)
  }

  renderEmployees = (value) => {
    const groupByRole = _.groupBy(value, item => item.role)

    return _.map(groupByRole, (group, groupIndex) => (
      <div key={groupIndex}>
        <span className={styles['employee-label']}>
          {group[0].role}
        </span>
        {
          _.map(group, (item, index) => (
            <span key={item.id}>
              {item.name}
              {index === group.length - 1 ? null : '，'}
            </span>
          ))
        }
      </div>
    ))
  }

  render() {
    const { list, total, keywords } = this.props

    return (
      <div className={styles.container}>
        <ToolBar total={total} onSearch={this.handleSearch} keywords={keywords} />
        <Table
          dataSource={list}
          columns={this.columns}
          rowKey={record => record.id}
          pagination={false}
        />
      </div>
    )
  }
}

export default connect(mapState, mapDispatch)(List)
