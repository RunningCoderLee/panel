import * as React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  Form, Input, Icon, Button, Alert,
} from 'antd'

import * as styles from './Login.module.less'

const FormItem = Form.Item

const mapState = state => ({
  isLoginFailed: state.user.isLoginFailed,
  errorMessage: state.user.errorMessage,
  loading: state.loading.effects.user.submit,
})

const mapDispatch = dispatch => ({
  login: dispatch.user.login,
  resetState: dispatch.user.resetState,
})

class Login extends React.PureComponent {
  static propTypes = {
    form: PropTypes.shape({}).isRequired,
    login: PropTypes.func,
    history: PropTypes.shape({}).isRequired,
    loading: PropTypes.bool,
    errorMessage: PropTypes.string,
    resetState: PropTypes.func,
  }

  static defaultProps = {
    login: () => {},
    resetState: () => {},
    loading: false,
    errorMessage: '',
  }

  componentWillUnmount() {
    const { resetState } = this.props

    resetState()
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { form: { validateFields }, login, history } = this.props

    validateFields({ force: true }, (errors, values) => {
      if (errors) return

      login(values)
        .then(() => {
          if (history.location.state && history.location.state.from) {
            history.replace(history.location.state.from)
          } else {
            history.replace('/')
          }
        })
    })
  }

  renderMessage = content => content && (<Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />);

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      errorMessage,
    } = this.props

    return (
      <Form onSubmit={this.handleSubmit} className={styles.container}>
        {this.renderMessage(errorMessage)}
        <FormItem>
          {getFieldDecorator('account', {
            rules: [{
              required: true,
              message: '请输入登录账号！',
            }],
          })(
            <Input
              placeholder="用户名"
              prefix={<Icon type="user" className={styles['prefix-icon']} />}
              size="large"
            />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{
              required: true,
              message: '请输入密码！',
            }, {
              min: 6,
              max: 15,
              message: '密码必须是6至15位字符组合！',
            }],
          })(
            <Input
              placeholder="密码"
              prefix={<Icon type="lock" className={styles['prefix-icon']} />}
              type="password"
              size="large"
            />,
          )}
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            className={styles.submit}
            size="large"
            loading={loading}
          >
            登录
          </Button>
        </FormItem>
      </Form>
    )
  }
}

export default connect(mapState, mapDispatch)(Form.create()(Login))
