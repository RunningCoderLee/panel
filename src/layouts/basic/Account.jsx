import * as React from 'react'
import {
  Spin, Dropdown, Menu, Icon, Avatar,
} from 'antd'
import PropTypes from 'prop-types'

const MenuItem = Menu.Item
// const MenuDivider = Menu.Divider


const Account = (props) => {
  const {
    loading = false,
    className = '',
    avatar = '',
    name = '',
    onLogout = () => {},
  } = props

  const handleClick = ({ key }) => {
    if (key === 'logout') {
      onLogout()
    }
  }

  const menu = (
    <Menu onClick={handleClick}>
      {/* <MenuItem>
        <Link to="/account/center/articles">
          <Icon type="user" />个人中心
        </Link>
      </MenuItem>
      <MenuItem>
        <Link to="account/settings/base">
          <Icon type="setting" />设置
        </Link>
      </MenuItem>
      <MenuItem>
        <Link to="account/settings/base">
          <Icon type="close-circle" />触发报错
        </Link>
      </MenuItem>
      <MenuDivider /> */}
      <MenuItem key="logout">
        <Icon type="logout" />
        退出登录
      </MenuItem>
    </Menu>
  )

  return (
    loading
      ? <Spin size="small" />
      : (
        <Dropdown overlay={menu}>
          <span className={`${className}`}>
            {avatar && <Avatar src={avatar} />}
            <span>{name}</span>
          </span>
        </Dropdown>
      )
  )
}

Account.propTypes = {
  loading: PropTypes.bool,
  className: PropTypes.string,
  avatar: PropTypes.string,
  name: PropTypes.string,
  onLogout: PropTypes.func,
}

Account.defaultProps = {
  loading: false,
  className: '',
  avatar: '',
  name: '',
  onLogout: () => {},
}

export default Account
