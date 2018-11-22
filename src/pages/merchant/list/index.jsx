import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import PropTypes from 'prop-types'
import {
  Card, Input, Table, Switch, Modal,
} from 'antd'
import history from '-/utils/history'
import { RoleNameMap } from '-/utils/constants'

import styles from './List.module.less'

const { Search } = Input
const { confirm } = Modal

const mapState = state => ({
  ...state.merchant,
  switching: state.loading.effects.merchant.toggleStatus,
})

const mapDispatch = dispatch => dispatch.merchant

class MerchantList extends React.PureComponent {
  static propTypes = {
    switching: PropTypes.bool,
    keywords: PropTypes.string,
    list: PropTypes.arrayOf(PropTypes.shape({})),
    pagination: PropTypes.shape({}),
    getList: PropTypes.func.isRequired,
    changeKeywords: PropTypes.func.isRequired,
    changeTable: PropTypes.func.isRequired,
    toggleStatus: PropTypes.func.isRequired,
    resetState: PropTypes.func.isRequired,
    deleteMerchant: PropTypes.func.isRequired,
    orderBy: PropTypes.oneOf(['ascend', 'descend']),
  }

  static defaultProps = {
    switching: false,
    list: [],
    keywords: '',
    pagination: {},
    orderBy: 'descend',
  }

  constructor(props) {
    super(props)
    this.state = {
      currentSwitchId: '-1',
    }
  }

  componentDidMount() {
    const { getList } = this.props

    getList()
  }

  componentDidUpdate(prevProps) {
    const {
      keywords: prevKeywords,
      pagination: {
        current: prevCurrent,
        pageSize: prevPageSize,
      },
    } = prevProps
    const {
      keywords,
      pagination: { current, pageSize },
      getList,
    } = this.props

    if (
      prevKeywords !== keywords
      || prevCurrent !== current
      || prevPageSize !== pageSize
    ) {
      getList()
    }
  }

  componentWillUnmount() {
    const { resetState } = this.props
    resetState()
  }

  handleSwitchStatus = (checked, id) => {
    const { toggleStatus } = this.props
    toggleStatus({
      id,
      status: checked,
    })
    this.setState({
      currentSwitchId: id,
    })
  }

  handleSearch = (value) => {
    const { changeKeywords } = this.props
    changeKeywords(value)
  }

  handleTableChange = (pagination, filters, sorter) => {
    const { changeTable } = this.props
    changeTable({ pagination, filters, sorter })
  }

  showDeleteConfirm = (merchant) => {
    const { deleteMerchant } = this.props

    confirm({
      title: `你确认要删除 ${merchant.name} 吗？`,
      onOk() {
        deleteMerchant(merchant.id)
      },
      okType: 'danger',
    })
  }

  render() {
    const { list, pagination, orderBy } = this.props
    const columns = [{
      dataIndex: 'name',
      title: '品牌名称',
    }, {
      dataIndex: 'admin.name',
      title: '负责人',
      render: (text, record) => `${text} ${record.admin.tel}`,
    }, {
      dataIndex: 'roles',
      title: '权限分配',
      render: text => `${RoleNameMap[text]}`,
    }, {
      dataIndex: 'createDate',
      title: '创建时间',
      render: text => moment(text).format('YYYY-MM-DD'),
      sortOrder: orderBy,
      sorter: (a, b) => a.createDate - b.createDate,
    }, {
      dataIndex: 'status',
      title: '是否启用',
      render: (text, record) => {
        const { switching } = this.props
        const { currentSwitchId } = this.state

        return (
          <Switch
            onChange={checked => this.handleSwitchStatus(checked, record.id)}
            checkedChildren="是"
            unCheckedChildren="否"
            checked={text === '1'}
            loading={switching && currentSwitchId === record.id}
          />
        )
      },
    }, {
      dataIndex: 'id',
      title: '操作',
      render: (id, record) => (
        <div>
          <button
            type="button"
            className="btn-link"
            onClick={() => history.push(`/merchant/edit/${id}`, {
              merchant: record,
            })}
          >
              修改
          </button>
          {'  '}
          <button
            type="button"
            className="btn-link"
            onClick={() => this.showDeleteConfirm(record)}
          >
              删除
          </button>
        </div>
      ),
    }]
    const finalPagination = Object.assign({}, {
      showQuickJumper: true,
      showSizeChanger: true,
      showTotal: total => `品牌数量：${total}`,
    }, pagination)

    return (
      <Card title="品牌查询">
        <div>
          <Search
            placeholder="请输入品牌名称"
            onSearch={this.handleSearch}
            className={styles.search}
          />
        </div>
        <Table
          columns={columns}
          dataSource={list}
          onChange={this.handleTableChange}
          rowKey={record => record.id}
          pagination={finalPagination}
        />
      </Card>
    )
  }
}

export default connect(mapState, mapDispatch)(MerchantList)
