import * as React from 'react'
import PropTypes from 'prop-types'
import CheckPermissions from './CheckPermissions'
import { Roles } from '-/utils/constants'

class Authorization extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node,
    authority: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func,
      PropTypes.arrayOf(PropTypes.oneOf(Object.values(Roles))),
    ]),
    noMatch: PropTypes.node,
  }

  static defaultProps = {
    children: undefined,
    noMatch: null,
    authority: undefined,
  }

  render() {
    const { children, authority, noMatch } = this.props
    const childrenRender = typeof children === 'undefined' ? null : children

    return CheckPermissions(authority, childrenRender, noMatch)
  }
}

export default Authorization
