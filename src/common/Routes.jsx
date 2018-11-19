import React, { Fragment } from 'react'
import { Route, Switch } from 'react-router-dom'
import { AuthorizedRoute } from '-/components/Authorization'
import history from '-/utils/history'
import { Roles } from '-/utils/constants'
import getRouterData from './router'

const redirect = {
  pathname: '/user/login',
  state: {
    from: history.location.pathname,
  },
}

const roles = Object.values(Roles)

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
          authority={roles}
          redirectPath={redirect}
          component={BasicLayout}
        />
      </Switch>
    </Fragment>
  )
}

export default Routes
