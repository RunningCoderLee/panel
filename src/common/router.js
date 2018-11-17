import React, { createElement } from 'react'
import Loadable from 'react-loadable'
import { Spin } from 'antd'
import pathToRegexp from 'path-to-regexp'
import formatedMenuData, { getFlatMenuData } from './menu'


const dynamicWrapper = component => Loadable({
  loader: () => component().then((raw) => {
    const Component = raw.default || raw

    return props => createElement(Component, {
      ...props,
      routerData: getRouterData(),
    })
  }),
  loading: () => <Spin size="large" className="global-spin" />, // eslint-disable-line
})

const routerConfig = {
  '/': {
    component: dynamicWrapper(() => import('-/layouts/basic/BasicLayout')),
  },
  '/merchant/list': {
    component: dynamicWrapper(() => import('-/pages/merchant/list')),
  },
  '/merchant/add': {
    component: dynamicWrapper(() => import('-/pages/merchant/add')),
  },
  '/merchant/edit': {
    component: dynamicWrapper(() => import('-/pages/merchant/edit')),
  },
  '/exception/403': {
    component: dynamicWrapper(() => import('-/pages/exception/403')),
  },
  '/exception/404': {
    component: dynamicWrapper(() => import('-/pages/exception/404')),
  },
  '/exception/500': {
    component: dynamicWrapper(() => import('-/pages/exception/500')),
  },
  '/user': {
    component: dynamicWrapper(() => import('-/layouts/user/UserLayout')),
  },
  '/user/login': {
    component: dynamicWrapper(() => import('-/pages/login/Login')),
  },
  '/shop/list': {
    component: dynamicWrapper(() => import('-/pages/shop/list')),
  },
  '/shop/add': {
    component: dynamicWrapper(() => import('-/pages/shop/add')),
  },
  '/shop/edit': {
    component: dynamicWrapper(() => import('-/pages/shop/edit')),
  },
}

function findMenuKey(menuData, path) {
  const menuKey = Object.keys(menuData).find(key => pathToRegexp(path).test(key))

  if (menuKey === undefined) {
    if (path === '/') {
      return null
    }
    const lastIndex = path.lastIndexOf('/')
    if (lastIndex < 0) {
      return null
    }
    if (lastIndex === 0) {
      return findMenuKey(menuData, '/')
    }

    return findMenuKey(menuData, path.substr(0, lastIndex))
  }

  return menuKey
}

function getRouterData() {
  const flatMenuData = getFlatMenuData(formatedMenuData)

  const routerData = {}

  Object.keys(routerConfig).forEach((path) => {
    let menuKey = Object.keys(flatMenuData).find(key => pathToRegexp(path).test(`${key}`))
    const inherited = menuKey === undefined

    if (inherited) {
      menuKey = findMenuKey(flatMenuData, path)
    }

    let menuItem = {}
    if (menuKey) {
      menuItem = flatMenuData[menuKey]
    }

    let router = routerConfig[path]

    router = {
      ...router,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
      hideInBreadCrumb: router.hideInBreadCrumb || menuItem.hideInBreadCrumb,
      inherited,
    }

    routerData[path] = router
  })

  return routerData
}

export default getRouterData
