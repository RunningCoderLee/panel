import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  Card, Input, Table, Switch,
} from 'antd'
import styles from './style.module.less'

const { Search } = Input

const mapState = state => ({
  ...state.merchant,
  switching: state.loading.effects.merchant.switchStatus,
})

const mapDispatch = dispatch => dispatch.merchant

class MerchantList extends React.Component {
  static propTypes = {
    switching: PropTypes.bool,
    keywords: PropTypes.string,
    list: PropTypes.arrayOf(PropTypes.shape({})),
    pagination: PropTypes.shape({}),
    getList: PropTypes.func.isRequired,
    changeKeywords: PropTypes.func.isRequired,
    changeTable: PropTypes.func.isRequired,
    switchStatus: PropTypes.func.isRequired,
    // changeSortOrder: PropTypes.func.isRequired,
  }

  static defaultProps = {
    switching: false,
    list: [],
    keywords: '',
    pagination: {},
  }

  columns = [{
    dataIndex: 'name',
    title: '品牌名称',
  }, {
    dataIndex: 'admin.name',
    title: '负责人',
    render: (text, record) => `${text} ${record.admin.tel}`,
  }, {
    dataIndex: 'roles',
    title: '权限分配',
  }, {
    dataIndex: 'createDate',
    title: '创建时间',
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
    dataIndex: 'action',
    title: '操作',
    render: () => (
      <div>
        <button type="button" className="btn-link">修改</button>
        <button type="button" className="btn-link">删除</button>
      </div>
    ),
  }]

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

  handleSwitchStatus = (checked, id) => {
    const { switchStatus } = this.props
    switchStatus({
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

  // handleShowSizeChange = (current, size) => {
  //   const { changePagination } = this.props
  //   changePagination({ current, pageSize: size })
  // }

  // handlePageChange = (pagination, size) => {
  //   const { changePagination } = this.props
  //   changePagination({ current, pageSize: size })
  // }

  render() {
    const { list, pagination, changeTable } = this.props
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
          columns={this.columns}
          dataSource={list}
          onChange={changeTable}
          rowKey={record => record.id}
          pagination={finalPagination}
        />
      </Card>
    )
  }
}

export default connect(mapState, mapDispatch)(MerchantList)
