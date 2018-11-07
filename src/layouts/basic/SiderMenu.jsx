import * as React from 'react'
import PropTypes from 'prop-types'
import * as pathToRegexp from 'path-to-regexp'
import { Link, withRouter } from 'react-router-dom'
import { Layout, Menu, Icon } from 'antd'

import logo from '-/assets/antd.svg'
import { check } from '-/components/Authorization'
import { convertUrlToArray } from '-/utils/url'
import { getOpenKeys, getFlatMenuKeys } from './_utils'

import * as styles from './SiderMenu.module.less'

const { Sider } = Layout
const { SubMenu, Item: MenuItem } = Menu

const getMenuMatches = (flatMenuKeys, path) => flatMenuKeys.filter(
  item => item && pathToRegexp(item).test(path),
)


class SiderMenu extends React.PureComponent {
  static propTypes = {
    width: PropTypes.number,
    data: PropTypes.arrayOf(PropTypes.shape({})),
    collapsed: PropTypes.bool,
    onCollapse: PropTypes.func,
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }).isRequired,
  }

  static defaultProps = {
    data: [],
    collapsed: false,
    onCollapse: () => {},
    width: 200,
  }

  constructor(props) {
    super(props)
    this.menuKeys = getFlatMenuKeys(props.data)
    const { location: { pathname } } = props

    this.state = {
      openKeys: getOpenKeys(this.menuKeys, convertUrlToArray(pathname)),
    }
  }

  isMainMenu = (key) => {
    const { data } = this.props
    return data.some(item => !!key && (item.path === key))
  }

  getSelectedMenuKeys = () => {
    const {
      location: { pathname },
    } = this.props

    const urlArr = convertUrlToArray(pathname)
    return urlArr.map(
      itemPath => getMenuMatches(this.menuKeys, itemPath).pop(),
    )
  };

  handleOpenChange = (openKeys) => {
    const lastOpenKey = openKeys[openKeys.length - 1]
    const moreThanOne = openKeys.filter(key => this.isMainMenu(key)).length > 1

    this.setState({
      openKeys: moreThanOne ? [lastOpenKey] : openKeys,
    })
  }


  renderMenuItemTitle = (item) => {
    if (!item.icon) {
      return <span>{item.name}</span>
    }

    return (
      <React.Fragment>
        <Icon type={item.icon} />
        <span>{item.name}</span>
      </React.Fragment>
    )
  }

  renderMenuItemTitleWithLink = (item) => {
    const { location } = this.props
    return (
      <Link
        to={item.path}
        replace={item.path === location.pathname}
      >
        {this.renderMenuItemTitle(item)}
      </Link>
    )
  }

  renderSubMenuOrMenuItem = (data) => {
    const { children } = data
    const hasValidChildren = Array.isArray(children)
      && (children.some(child => !!child.name))

    if (hasValidChildren) {
      const menuItems = this.renderMenuItems(children)

      return (menuItems.length > 0) ? (
        <SubMenu
          key={data.path}
          title={this.renderMenuItemTitle(data)}
        >
          {menuItems}
        </SubMenu>
      ) : null
    }

    return (
      <MenuItem key={data.path}>
        {this.renderMenuItemTitleWithLink(data)}
      </MenuItem>
    )
  }

  renderMenuItems = (data) => {
    if (!data) {
      return []
    }

    return data
      .filter(item => item.name)
      .map((item) => {
        const itemDom = this.renderSubMenuOrMenuItem(item)
        return check(item.authority, itemDom, null)
      })
      .filter(item => item)
  };

  render() {
    const {
      collapsed, data, onCollapse, width,
    } = this.props
    const { openKeys } = this.state

    let selectedKeys = this.getSelectedMenuKeys()
    if (!selectedKeys.length && openKeys) {
      selectedKeys = [openKeys[openKeys.length - 1]]
    }

    return (
      <Sider
        collapsible
        collapsed={collapsed}
        className={styles.container}
        onCollapse={onCollapse}
        width={width}
        trigger={null}
      >
        <div className={styles.logo}>
          <Link to="/">
            <img src={logo} alt="logo" />
            <h1>云 show 管理平台</h1>
          </Link>
        </div>
        <Menu
          className={styles.menu}
          openKeys={collapsed ? [] : openKeys}
          onOpenChange={this.handleOpenChange}
          selectedKeys={selectedKeys}
          mode="inline"
          theme="dark"
        >
          {this.renderMenuItems(data)}
        </Menu>
      </Sider>
    )
  }
}

export default withRouter(SiderMenu)
