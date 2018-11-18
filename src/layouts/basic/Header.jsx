import * as React from 'react'
import PropTypes from 'prop-types'
import { Icon, Layout } from 'antd'

import Account from './Account'

import * as styles from './Header.module.less'

const { Header } = Layout


const ContentHeader = (props) => {
  const {
    onCollapse, collapsed, currentUser, onLogout,
  } = props

  const handleCollapse = () => onCollapse(!collapsed)

  return (
    <Header className={styles.container}>
      <button
        type="button"
        className={`${styles.action} ${styles['menu-trigger']}`}
        onClick={handleCollapse}
      >
        <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} />
      </button>
      <div className={styles['action-bar']}>
        <Account
          className={styles.action}
          name={currentUser.username}
          avatar={currentUser.avatar}
          onLogout={onLogout}
        />
      </div>
    </Header>
  )
}

ContentHeader.propTypes = {
  collapsed: PropTypes.bool,
  currentUser: PropTypes.shape({}),
  onCollapse: PropTypes.func,
  onLogout: PropTypes.func,
}

ContentHeader.defaultProps = {
  collapsed: false,
  currentUser: {},
  onCollapse: () => {},
  onLogout: () => {},
}

export default ContentHeader
