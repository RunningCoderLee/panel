import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Table, Switch, message } from 'antd'
import ToolBar from './ToolBar'

import * as styles from './list.module.less'

const mapState = state => ({
  ...state.shop,
  ...state.user,
  switching: state.loading.effects.shop.switchStatus,
})

const mapDispatch = dispatch => dispatch.shop

class List extends Component {
  static propTypes = {
    getList: PropTypes.func.isRequired,
    keywords: PropTypes.string.isRequired,
    list: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    total: PropTypes.oneOfType([PropTypes.number]),
    changeKeywords: PropTypes.func.isRequired,
    switchStatus: PropTypes.func.isRequired,
    switching: PropTypes.bool,
    resetState: PropTypes.func.isRequired,
    deleteShop: PropTypes.func.isRequired,
    currentUser: PropTypes.shape({
      companyId: PropTypes.string,
    }),
  }

  static defaultProps = {
    total: null,
    switching: false,
    currentUser: {
      companyId: '',
    },
  }

  columns = [{
    title: '店铺名称',
    dataIndex: 'name',
    width: 100,
  }, {
    title: '店铺地址',
    dataIndex: 'addr',
    width: 180,
  }, {
    title: '店铺电话',
    dataIndex: 'tel',
    width: 100,
  }, {
    title: '店长',
    dataIndex: 'manager',
    width: 60,
  }, {
    title: '店员',
    dataIndex: 'employees',
    width: 200,
    render: text => this.renderEmployees(text),
  }, {
    title: '是否启用',
    dataIndex: 'status',
    width: 80,
    render: (text, record) => {
      const { switching } = this.props
      const { currentSwitchId } = this.state
      return (
        <Switch
          onChange={this.handleChangeStatus(record.id)}
          checkedChildren="营业"
          unCheckedChildren="停业"
          checked={!!text}
          loading={switching && currentSwitchId === record.id}
        />
      )
    },
  }, {
    title: '操作',
    width: 80,
    dataIndex: 'operator',
    render: (text, record) => (
      <>
        <span className={styles['edit-btn']}>修改</span>
        {/* eslint-disable-next-line */}
        <span className={styles['delete-btn']} onClick={this.handleDelete(record.id)}>删除</span>
      </>
    ),
  }]

  constructor(props) {
    super(props)
    this.state = {
      currentSwitchId: null,
    }
  }

  componentDidMount() {
    const { getList } = this.props

    getList(this.companyId)
  }

  componentDidUpdate(prevProps) {
    const { keywords: prevKeywords } = prevProps
    const { keywords, getList } = this.props

    if (prevKeywords !== keywords) {
      getList(this.companyId)
    }
  }

  componentWillUnmount() {
    const { resetState } = this.props

    resetState()
  }

  get companyId() {
    const { currentUser = {} } = this.props
    const { companyId = '' } = currentUser

    return companyId
  }

  handleChangeStatus = id => (checked) => {
    const { switchStatus } = this.props
    switchStatus({
      id,
      status: checked,
    })
    this.setState({
      currentSwitchId: id,
    })
  }

  handleSearch = (keywords) => {
    const { changeKeywords } = this.props
    changeKeywords(keywords)
  }

  handleDelete = storeId => () => {
    const { deleteShop, getList } = this.props
    const params = { storeId, companyId: this.companyId }

    deleteShop(params)
      .then(() => {
        message.success('删除成功')
        getList(this.companyId)
      })
      .catch(() => message.error('删除失败'))
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
