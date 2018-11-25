import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import history from '-/utils/history'
import {
  Form, Input, Select, Radio, Button, Icon, message,
} from 'antd'

import Upload from './Upload'

import * as styles from './add.module.less'

const FormItem = Form.Item

const mapState = state => ({
  ...state.sysDictionary,
  ...state.user,
})

const mapDispatch = dispatch => ({
  ...dispatch.sysDictionary,
  ...dispatch.shop,
})

const INITIAL_PASSWORD = '8888888'

class Add extends Component {
  static propTypes = {
    form: PropTypes.shape({
      getFieldDecorator: PropTypes.func.isRequired,
      validateFields: PropTypes.func.isRequired,
      setFieldsValue: PropTypes.func.isRequired,
    }).isRequired,
    getDictionaryList: PropTypes.func.isRequired,
    storeTypeList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    roleTypeList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    payTypeList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    postCreateShop: PropTypes.func.isRequired,
    validateEmloyeeAccount: PropTypes.func.isRequired,
    currentUser: PropTypes.shape({
      companyId: PropTypes.string,
    }),
  }

  static defaultProps = {
    currentUser: {
      companyId: '',
    },
  }

  constructor(props) {
    super(props)
    this.state = {
      employeeList: [{
        account: {
          value: '',
          validateStatus: undefined,
          help: undefined,
        },
        name: '',
        sex: '',
        password: INITIAL_PASSWORD,
        roleId: '',
      }],
      payWayList: [{
        payName: '',
        payUrl: '',
      }],
    }
  }

  componentDidMount() {
    const { getDictionaryList } = this.props
    Promise.all([
      getDictionaryList('STORE'),
      getDictionaryList('ROLE'),
      getDictionaryList('PAY'),
    ])
  }

  get companyId() {
    const { currentUser = {} } = this.props
    const { companyId = '' } = currentUser

    return companyId
  }

  handleAddPayWay = () => {
    const { payWayList } = this.state
    payWayList.push({
      payName: '',
      payUrl: '',
    })
    this.setState({ payWayList })
  }

  handleRemovePayWay = index => () => {
    const { payWayList } = this.state
    payWayList.splice(index, 1)

    this.setState({ payWayList }, () => {
      this.handleResetPayWayFieldsValue()
    })
  }

  handleResetPayWayFieldsValue = () => {
    const { form } = this.props
    const { setFieldsValue } = form
    const { payWayList } = this.state

    payWayList.forEach((item, index) => {
      setFieldsValue({
        [`payName${index}`]: item.payName,
      })
    })
  }

  handleUpload = index => (url) => {
    const { payWayList } = this.state
    payWayList[index].payUrl = url

    this.setState({ payWayList })
  }

  handleChangePayWay = index => (value) => {
    const { payWayList } = this.state
    payWayList[index].payName = value

    this.setState({ payWayList })
  }

  handleAddEmployee = () => {
    const { employeeList } = this.state
    employeeList.push({
      account: '',
      name: '',
      sex: '',
      password: INITIAL_PASSWORD,
      roleId: '',
    })

    this.setState({ employeeList })
  }

  handleRemoveEmployee = index => () => {
    const { employeeList } = this.state
    employeeList.splice(index, 1)

    this.setState({ employeeList }, () => {
      this.handleResetEmloyeeFieldsValue()
    })
  }

  handleChangeEmloyeeAccount = index => (e) => {
    const { employeeList } = this.state
    const { value } = e.target
    employeeList[index].account.value = value
    employeeList[index].account.validateStatus = undefined
    employeeList[index].account.help = undefined

    this.setState({ employeeList })
  }

  handleChangeEmloyeeValue = (index, key) => (e) => {
    const { employeeList } = this.state
    const { value } = e.target
    employeeList[index][key] = value

    this.setState({ employeeList })
  }

  handleValidateEmloyeeAccount = index => (e) => {
    const { value = {} } = e.target

    if (value.trim() === '') {
      return
    }

    const { validateEmloyeeAccount } = this.props
    const { employeeList } = this.state
    employeeList[index].account.validateStatus = 'validating'

    this.setState({ employeeList }, () => {
      validateEmloyeeAccount(value)
        .then((isValid) => {
          employeeList[index].account.validateStatus = isValid ? 'success' : 'error'
          employeeList[index].account.help = isValid ? null : '账号校验没有通过'
          this.setState({ employeeList })
        })
    })
  }

  handleResetEmloyeeFieldsValue = () => {
    const { form } = this.props
    const { setFieldsValue } = form
    const { employeeList } = this.state

    employeeList.forEach((item, index) => {
      setFieldsValue({
        [`account${index}`]: item.account,
        [`password${index}`]: item.password,
        [`emloyeeName${index}`]: item.name,
        [`sex${index}`]: item.sex,
        [`roleId${index}`]: item.roleId,
      })
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { form, postCreateShop } = this.props
    const { validateFields } = form
    validateFields((err, values) => {
      if (!err) {
        const { employeeList, payWayList } = this.state
        const employees = employeeList.map(item => ({
          ...item,
          account: item.account.value,
        }))
        const params = {
          companyId: this.companyId,
          name: values.name,
          tel: values.tel,
          storeType: values.storeType,
          addr: values.addr,
          employees,
          pays: payWayList,
        }
        postCreateShop(params)
          .then(() => {
            message.success('新增成功')
            history.push('/shop/list')
          })
          .catch(() => message.error('新增失败'))
      }
    })
  }

  render() {
    const { employeeList, payWayList } = this.state
    const {
      form, storeTypeList, roleTypeList, payTypeList,
    } = this.props
    const { getFieldDecorator } = form
    return (
      <Form className={styles['store-form']} onSubmit={this.handleSubmit}>
        <div className={styles['store-container']}>
          <h3>新增门店</h3>
          <div className={styles['store-form-row']}>
            <FormItem label="门店名称" className={styles['store-name']}>
              {getFieldDecorator('name', {
                rules: [{
                  required: true, message: '请输入门店名称',
                }, {
                  min: 2, max: 10, message: '只能为2-10个字符',
                }],
              })(
                <Input placeholder="请输入门店名称" />,
              )}
            </FormItem>
            <FormItem label="电话" className={styles['store-telephone']}>
              {getFieldDecorator('tel', {
                rules: [{ required: true, message: '请输入电话' }],
              })(
                <Input placeholder="请输入电话" />,
              )}
            </FormItem>
            <FormItem label="门店类型" className={styles['store-type']}>
              {getFieldDecorator('storeType', {
                rules: [{
                  required: true, message: '请选择门店类型',
                }],
              })(
                <Select placeholder="选择门店类型">
                  {
                    storeTypeList.map(store => (
                      <Select.Option
                        key={store.code}
                        value={store.code}
                      >
                        {store.name}
                      </Select.Option>
                    ))
                  }
                </Select>,
              )}
            </FormItem>
          </div>
          <FormItem label="门店地址">
            {getFieldDecorator('addr', {
              rules: [{
                required: true, message: '请输入门店地址',
              }, {
                min: 2, max: 45, message: '只能为2-50个字符',
              }],
            })(
              <Input placeholder="请输入门店地址" />,
            )}
          </FormItem>
          <div className={styles['store-pay-way-row']}>
            <div className={styles['store-pay-way-label']}>
              门店支付
            </div>
            <div className={styles['store-pay-way-container']}>
              {
                payWayList.map((payWay, index) => (
                  <FormItem
                    key={index} // eslint-disable-line react/no-array-index-key
                    className={styles['store-pay-way-item']}
                  >
                    {getFieldDecorator(`payName${index}`, {
                      rules: [{
                        required: true, message: '请选择门店支付方式',
                      }],
                    })(
                      <Select onChange={this.handleChangePayWay(index)} style={{ width: 120 }} placeholder="请选择支付">
                        {
                          payTypeList.map(item => (
                            <Select.Option
                              value={item.name}
                              key={item.code}
                            >
                              {item.name}
                            </Select.Option>
                          ))
                        }
                      </Select>,
                    )}
                    <Upload imgUrl={payWay.payUrl} onChange={this.handleUpload(index)} />
                    {
                      payWayList.length > 1 ? (
                        <Icon
                          type="close-circle"
                          className={styles['store-pay-way-remove-icon']}
                          theme="filled"
                          onClick={this.handleRemovePayWay(index)}
                        />
                      ) : null
                    }
                  </FormItem>
                ))
              }
              <Button className={styles['store-pay-way-add-icon']} onClick={this.handleAddPayWay}>新增</Button>
            </div>
          </div>
        </div>
        <div className={styles['employee-container']}>
          {
            employeeList.map((employee, index) => (
              /* eslint-disable-next-line react/no-array-index-key */
              <div className={styles['employee-item']} key={index}>
                <h3>
                  <span>店员</span>
                  {
                    employeeList.length > 1 ? (
                      <Icon type="delete" className={styles['employee-delete-icon']} onClick={this.handleRemoveEmployee(index)} />
                    ) : null
                  }
                </h3>
                <div className={styles['emloyee-form-row']}>
                  <FormItem
                    label="登录账号"
                    className={styles['employee-form-item']}
                    validateStatus={employee.account.validateStatus}
                    hasFeedback={!!employee.account.validateStatus}
                    help={employee.account.help}
                  >
                    {getFieldDecorator(`account${index}`, {
                      rules: [{ required: true, message: '请输入登录账号' }],
                    })(
                      <Input
                        placeholder="建议输入手机号"
                        onChange={this.handleChangeEmloyeeAccount(index)}
                        onBlur={this.handleValidateEmloyeeAccount(index)}
                      />,
                    )}
                  </FormItem>
                  <FormItem label="初始密码" className={styles['employee-form-item']}>
                    {getFieldDecorator(`password${index}`, {
                      rules: [{ required: true, message: '请输入初始密码' }],
                      initialValue: '88888888',
                    })(
                      <Input
                        placeholder="请输入初始密码"
                        onChange={this.handleChangeEmloyeeValue(index, 'password')}
                      />,
                    )}
                  </FormItem>
                </div>
                <div className={styles['emloyee-form-row']}>
                  <FormItem label="姓名" className={styles['employee-form-item']}>
                    {getFieldDecorator(`emloyeeName${index}`, {
                      rules: [{ required: true, message: '请输入姓名' }],
                    })(
                      <Input
                        placeholder="输入真实姓名"
                        onChange={this.handleChangeEmloyeeValue(index, 'name')}
                      />,
                    )}
                  </FormItem>
                  <FormItem label="性别" className={styles['employee-form-item']}>
                    {getFieldDecorator(`sex${index}`, {
                      rules: [{ required: true, message: '请选择性别' }],
                    })(
                      <Radio.Group onChange={this.handleChangeEmloyeeValue(index, 'sex')}>
                        <Radio value={1}>男</Radio>
                        <Radio value={0}>女</Radio>
                      </Radio.Group>,
                    )}
                  </FormItem>
                </div>
                <FormItem label="门店职位">
                  {getFieldDecorator(`roleId${index}`, {
                    rules: [{ required: true, message: '请选择门店职位' }],
                  })(
                    <Radio.Group onChange={this.handleChangeEmloyeeValue(index, 'roleId')}>
                      {roleTypeList.map(item => (
                        <Radio.Button value={item.code} key={item.code}>{item.name}</Radio.Button>
                      ))}
                    </Radio.Group>,
                  )}
                </FormItem>
                {
                  index === employeeList.length - 1 ? (
                    <div className={styles['add-employee-btn-container']}>
                      <Button type="primary" onClick={this.handleAddEmployee}>+添加新店员</Button>
                    </div>
                  ) : null
                }
              </div>
            ))
          }
          <div className={styles['submit-btn-container']}>
            <Button type="primary" htmlType="submit" size="large" onClick={this.handleSubmit}>保存并提交</Button>
          </div>
        </div>
      </Form>
    )
  }
}

export default connect(mapState, mapDispatch)(Form.create()(Add))
