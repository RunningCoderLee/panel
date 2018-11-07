import * as React from 'react'
import { Link } from 'react-router-dom'

import * as styles from './Footer.module.less'

const Footer = () => (
  <footer className={styles.container}>
    <div className={styles.links}>
      <Link to="/">帮助</Link>
      <Link to="/">隐私</Link>
      <Link to="/">条款</Link>
    </div>
    <div className={styles.copyright}>
      Copyright &copy; 2018
      {' '}
      <span role="img" aria-label="云">☁️</span>
      {' '}
      show
    </div>
  </footer>
)

export default Footer
