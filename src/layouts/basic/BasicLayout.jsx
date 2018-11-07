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

const PageNotFound = Loadable({
  loader: () => import('-/pages/pageNotFound'),
  loading: () => null,
})

const {
  Content, Footer,
} = Layout

// const Projects = Loadable({
//   loader: () => import('-/pages/projects/Projects'),
//   loading: () => null,
// })

// const ProjectDetail = Loadable({
//   loader: () => import('-/pages/projectDetail/ProjectDetail'),
//   loading: () => null,
// })

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

  handleCollapse = () => {
    this.setState(prevState => ({ collapsed: !prevState.collapsed }))
  }

  render() {
    const { collapsed } = this.state
    const { currentUser, logout } = this.props

    const mainStyle = { paddingLeft: collapsed ? 80 : 256 }

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
              {/* <Route path="/project/detail/:id" component={ProjectDetail} />
              <Route path="/project" component={Projects} /> */}
              <Redirect exact from="/" to="/brand-management" />
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
