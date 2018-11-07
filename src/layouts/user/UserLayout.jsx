import * as React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import * as Loadable from 'react-loadable'
import Header from './Header'
import Footer from './Footer'

import * as styles from './UserLayout.module.less'

const Login = Loadable({
  loader: () => import('-/pages/login/Login'),
  loading: () => null,
})

const UserLayout = () => (
  <div className={styles.container}>
    <Header />
    <div className={styles.content}>
      <Switch>
        <Route path="/user/login" component={Login} />
        <Redirect exact from="/user" to="/user/login" />
      </Switch>
    </div>
    <Footer />
  </div>
)

export default UserLayout
