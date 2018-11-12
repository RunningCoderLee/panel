import React, { Fragment } from 'react'
import { Route, Switch } from 'react-router-dom'
import { AuthorizedRoute } from '-/components/Authorization'
import history from '-/utils/history'
import getRouterData from './router'

const redirect = {
  pathname: '/user/login',
  state: {
    from: history.location.pathname,
  },
}

const Routes = () => {
  const routerData = getRouterData()
  const UserLayout = routerData['/user'].component
  const BasicLayout = routerData['/'].component

  return (
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
}

export default Routes
