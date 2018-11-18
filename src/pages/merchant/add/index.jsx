// /* eslint-disable */
import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  Card, Form, Row, Col, Input, Upload, message, Icon, Checkbox, Button,
} from 'antd'
import { Roles } from '-/utils/constants'
import RegionPicker from '-/components/RegionPicker'
import Uploader from '-/components/Uploader'
import List from '../list'

const FormItem = Form.Item
const CheckboxGroup = Checkbox.Group

function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg'
  if (!isJPG) {
    message.error('You can only upload JPG file!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!')
  }
  return isJPG && isLt2M
}

const roleOptions = [
  { label: '店长', value: Roles.STORE_MANAGER },
  { label: '店员', value: Roles.CLERK },
  { label: '财务用户', value: Roles.FINANCE },
]

const mapState = state => state.merchant

const mapDispatch = dispatch => dispatch.merchant

class MerchantEdit extends React.PureComponent {
  static propTypes = {
    form: PropTypes.shape({}).isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      imageUrl: '',
    }
  }

  handleClick = () => {
    console.log(1111)
  }

  handleSubmit = (e) => {
    const { form: { validateFields } } = this.props
    let params = {}
    e.preventDefault()

    validateFields((err, values) => {
      console.log(values)

      const {
        name, tel, roles, region, adminAccount, adminName, adminPassword, adminTel,
      } = values
      const [provinceId, cityId, areaId] = region

      params = {
        name,
        tel,
        provinceId,
        cityId,
        areaId,
        admin: {
          name: adminName,
          account: adminAccount,
          password: adminPassword,
          tel: adminTel,
        },
        roles,
      }

      console.log(params)
      // TODO: 添加发送请求
    })
  }

  validatePhone = (rule, value, callback) => {
    const isMobile = /^1[3|4|5|8][0-9]\d{4,8}$/
    const isLandline = /^0\d{2,3}-?\d{7,8}$/
    if (isMobile.test(value) || isLandline.test(value)) {
      callback()
    }

    callback('不是正确的手机号或座机号格式！')
  }

  selectAllRoles = () => {
    const { form: { setFieldsValue } } = this.props

    setFieldsValue({
      roles: roleOptions.map(options => options.value),
    })
  }

  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true })
      return
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => this.setState({
        imageUrl,
        loading: false,
      }))
    }
  }

  render() {
    const { loading, imageUrl } = this.state
    const { form } = this.props
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18,
      },
    }
    const uploadButton = (
      <div>
        <Icon type={loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    )

    return (
      <div>
        <Form layout="inline" onSubmit={this.handleSubmit}>
          <Card title="建立品牌">
            <Row>
              <Col span={12}>
                <FormItem
                  label="品牌名称"
                  {...formItemLayout}
                  style={{ width: '100%' }}
                >
                  {getFieldDecorator('name', {
                    rules: [{
                      required: true,
                      message: '请输入品牌名称！',
                    }, {
                      max: 20,
                      message: '最多输入20个字！',
                    }],
                  })(<Input placeholder="请输入品牌名称" />)}
                </FormItem>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <FormItem
                  label="品牌电话"
                  {...formItemLayout}
                  style={{ width: '100%' }}
                >
                  {getFieldDecorator('tel', {
                    rules: [{
                      validator: this.validatePhone,
                    }],
                  })(<Input placeholder="请输入手机号/座机" />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem
                  label="地区"
                  {...formItemLayout}
                  style={{ width: '50%' }}
                >
                  {getFieldDecorator('region', {
                    rules: [],
                  })(<RegionPicker />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem
                  label="品牌 LOGO"
                  {...formItemLayout}
                  style={{ width: '100%' }}
                >
                  <Uploader />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="公众号二维码"
                  {...formItemLayout}
                  style={{ width: '100%' }}
                >
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action="//jsonplaceholder.typicode.com/posts/"
                    beforeUpload={beforeUpload}
                    onChange={this.handleChange}
                  >
                    {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
                  </Upload>
                </FormItem>
              </Col>
            </Row>
          </Card>
          <Card title="品牌管理员">
            <Row>
              <Col span={12}>
                <FormItem label="登录账号">
                  {getFieldDecorator('adminAccount', {
                    rules: [],
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="主负责人">
                  {getFieldDecorator('adminName', {
                    rules: [],
                  })(<Input placeholder="请输入真实姓名" />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem label="初始密码">
                  {getFieldDecorator('adminPassword', {
                    initialValue: '88888888',
                    rules: [],
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="联系电话">
                  {getFieldDecorator('adminTel', {
                    rules: [],
                  })(<Input placeholder="必须输入手机号" />)}
                </FormItem>
              </Col>
            </Row>

          </Card>
          <Card
            title="角色分配"
            extra={(
              <button
                type="button"
                className="btn-link"
                onClick={this.selectAllRoles}
              >
                全选
              </button>
            )}
          >
            <FormItem>
              {getFieldDecorator('roles', {
                rules: [],
              })(<CheckboxGroup options={roleOptions} />)}
            </FormItem>
          </Card>
          <FormItem>
            <Button type="primary" htmlType="submit" size="large">保存</Button>
          </FormItem>
        </Form>
        <br />
        <br />
        <br />
        <List />
      </div>
    )
  }
}

export default connect(mapState, mapDispatch)(Form.create()(MerchantEdit))
