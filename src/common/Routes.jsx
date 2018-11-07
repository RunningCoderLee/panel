import React, { Fragment } from 'react'
import { Route, Switch } from 'react-router-dom'
import Loadable from 'react-loadable'
import { AuthorizedRoute } from '-/components/Authorization'
import history from '-/utils/history'

const UserLayout = Loadable({
  loader: () => import('-/layouts/user/UserLayout'),
  loading: () => null,
})

const BasicLayout = Loadable({
  loader: () => import('-/layouts/basic/BasicLayout'),
  loading: () => null,
})

const redirect = {
  pathname: '/user/login',
  state: {
    from: history.location.pathname,
  },
}

const Routes = () => (
  <Fragment>
    <Switch>
      <Route path="/user" component={UserLayout} />
      <AuthorizedRoute
        path="/"
        authority={['admin', 'user']}
        redirectPath={redirect}
        component={BasicLayout}
      />
    </Switch>
  </Fragment>
)

export default Routes
