import * as React from 'react'
import { Redirect, Route } from 'react-router-dom'
import Authorization from './Authorization'

const AuthorizedRoute = ({ authority, redirectPath, ...rest }) => (
  <Authorization authority={authority} noMatch={<Redirect to={redirectPath} />}>
    <Route {...rest} />
  </Authorization>
)

export default AuthorizedRoute
