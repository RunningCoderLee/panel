import * as React from 'react'
import { Link } from 'react-router-dom'
// import logo from '-/assets/antd.svg'

import * as styles from './Header.module.less'

const Header = () => (
  <header className={styles.container}>
    <Link to="/">
      {/* <img className={styles.logo} src={logo} alt="logo" /> */}
      <h1 className={styles.title}>
        <span role="img" aria-label="云"> ☁️ </span>
        ️show
      </h1>
      <div className={styles.subtitle}>云 show 管理平台</div>
    </Link>
  </header>
)

export default Header
