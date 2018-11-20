import * as React from 'react'
import PropTypes from 'prop-types'
import { Layout } from 'antd'
import { connect } from 'react-redux'
import { Switch, Redirect, Route } from 'react-router-dom'
import * as Loadable from 'react-loadable'

import menuData from '-/common/menu'
import Header from './Header'
import SiderMenu from './SiderMenu'

import * as styles from './BasicLayout.module.less'
import { getRoutes } from '-/utils/utils'
import { AuthorizedRoute, check } from '-/components/Authorization'

const PageNotFound = Loadable({
  loader: () => import('-/pages/pageNotFound'),
  loading: () => null,
})

const {
  Content, Footer,
} = Layout

/**
 * 根据菜单取得重定向地址.
 */
const redirectData = []
const getRedirect = (item) => {
  if (item && item.children) {
    if (item.children[0] && item.children[0].path) {
      redirectData.push({
        from: `${item.path}`,
        to: `${item.children[0].path}`,
      })
      item.children.forEach((children) => {
        getRedirect(children)
      })
    }
  }
}
menuData.forEach(getRedirect)

const mapState = state => ({
  currentUser: state.user.currentUser,
})

const mapDispatch = dispatch => ({
  getUserInfo: dispatch.user.getUserInfo,
  logout: dispatch.user.logout,
})


class BasicLayout extends React.PureComponent {
  static propTypes = {
    getUserInfo: PropTypes.func,
    logout: PropTypes.func,
    currentUser: PropTypes.shape({}),
    match: PropTypes.shape({
      params: PropTypes.shape({}),
      isExact: PropTypes.bool,
      path: PropTypes.string,
      url: PropTypes.string,
    }).isRequired,
    location: PropTypes.shape({}).isRequired,
    routerData: PropTypes.shape({}).isRequired,
  }

  static defaultProps = {
    getUserInfo: () => {},
    logout: () => {},
    currentUser: {},
  }

  constructor(props) {
    super(props)
    this.state = {
      collapsed: false,
    }
  }

  componentDidMount() {
    const { getUserInfo } = this.props
    getUserInfo()
  }

  getBaseRedirect = () => {
    const { location: { state }, routerData } = this.props

    const redirect = state && state.from

    if (redirect) {
      state.from = '' // TODO: 重点测试
    } else {
      const authorizedPath = Object.keys(routerData).find(
        item => check(routerData[item].authority, item) && (item !== '/'),
      )

      return authorizedPath
    }

    return redirect
  }

  handleCollapse = () => {
    this.setState(prevState => ({ collapsed: !prevState.collapsed }))
  }

  render() {
    const { collapsed } = this.state
    const {
      currentUser, logout, match, routerData,
    } = this.props


    const mainStyle = { paddingLeft: collapsed ? 80 : 256 }

    if (Object.keys(currentUser).length === 0) {
      return null
    }
    // NOTE: 不能放在上面的判断语句之前
    const baseRedirect = this.getBaseRedirect()

    return (
      <Layout className={styles.container}>
        <SiderMenu
          collapsed={collapsed}
          onCollapse={this.handleCollapse}
          width={256}
          data={menuData}
        />
        <Layout className={styles.main} style={mainStyle}>
          <Header
            collapsed={collapsed}
            currentUser={currentUser}
            onCollapse={this.handleCollapse}
            onLogout={logout}
          />
          <Content className={styles.content}>
            <Switch>
              {redirectData.map(item => (
                <Redirect key={item.from} exact from={item.from} to={item.to} />
              ))}
              { getRoutes(match.path, routerData).map(item => (
                <AuthorizedRoute
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                  authority={item.authority}
                  redirectPath="/exception/403"
                />
              ))}
              <Redirect exact from="/" to={baseRedirect} />
              <Route component={PageNotFound} />
            </Switch>
          </Content>
          <Footer className={styles.footer}>
            Copyright &copy; 2018 云 show 出品
          </Footer>
        </Layout>

      </Layout>
    )
  }
}

export default connect(mapState, mapDispatch)(BasicLayout)
