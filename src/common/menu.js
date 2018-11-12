const menuData = [
  // {
  //   name: 'dashboard',
  //   icon: 'dashboard',
  //   authority: 'admin',
  //   path: 'dashboard',
  //   children: [
  //     {
  //       name: '分析页',
  //       path: 'analysis',
  //     },
  //     {
  //       name: '监控页',
  //       path: 'monitor',
  //     },
  //     {
  //       name: '工作台',
  //       path: 'workplace',
  //     },
  //   ],
  // },
  {
    name: '商户管理',
    icon: 'shop',
    path: 'merchant',
    children: [
      {
        name: '商户列表',
        path: 'list',
      },
      {
        name: '新增商户',
        path: 'add',
      },
      {
        name: '编辑商户',
        path: 'edit',
        authority: 'user',
      },
    ],
  },
  // {
  //   name: '表单页',
  //   icon: 'form',
  //   path: 'form',
  //   children: [
  //     {
  //       name: '基础表单',
  //       path: 'basic-form',
  //     },
  //     {
  //       name: '分步表单',
  //       path: 'step-form',
  //     },
  //     {
  //       name: '高级表单',
  //       authority: 'admin',
  //       path: 'advanced-form',
  //     },
  //   ],
  // },
  // {
  //   name: '列表页',
  //   icon: 'table',
  //   path: 'list',
  //   children: [
  //     {
  //       name: '查询表格',
  //       path: 'table-list',
  //     },
  //     {
  //       name: '标准列表',
  //       path: 'basic-list',
  //     },
  //     {
  //       name: '卡片列表',
  //       path: 'card-list',
  //     },
  //     {
  //       name: '搜索列表',
  //       path: 'search',
  //       children: [
  //         {
  //           name: '搜索列表（文章）',
  //           path: 'articles',
  //         },
  //         {
  //           name: '搜索列表（项目）',
  //           path: 'projects',
  //         },
  //         {
  //           name: '搜索列表（应用）',
  //           path: 'applications',
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   name: '详情页',
  //   icon: 'profile',
  //   path: 'profile',
  //   children: [
  //     {
  //       name: '基础详情页',
  //       path: 'basic',
  //     },
  //     {
  //       name: '高级详情页',
  //       path: 'advanced',
  //       authority: 'admin',
  //     },
  //   ],
  // },
  // {
  //   name: '结果页',
  //   icon: 'check-circle-o',
  //   path: 'result',
  //   children: [
  //     {
  //       name: '成功',
  //       path: 'success',
  //     },
  //     {
  //       name: '失败',
  //       path: 'fail',
  //     },
  //   ],
  // },
  // {
  //   name: '异常页',
  //   icon: 'warning',
  //   path: 'exception',
  //   hideInMenu: true,
  //   children: [
  //     {
  //       name: '403',
  //       path: '403',
  //     },
  //     {
  //       name: '404',
  //       path: '404',
  //     },
  //     {
  //       name: '500',
  //       path: '500',
  //     },
  //   ],
  // },
  // {
  //   name: '账户',
  //   icon: 'user',
  //   path: 'user',
  //   authority: 'guest',
  //   children: [
  //     {
  //       name: '登录',
  //       path: 'login',
  //     },
  //     {
  //       name: '注册',
  //       path: 'register',
  //     },
  //     {
  //       name: '注册结果',
  //       path: 'register-result',
  //     },
  //   ],
  // },
  // {
  //   name: '普通测试页',
  //   icon: 'star-o',
  //   path: 'test-basic',
  // },
  // {
  //   name: '高级测试页',
  //   icon: 'star',
  //   path: 'test-advanced',
  //   authority: 'admin',
  // },
  {
    name: '账户',
    icon: 'user',
    path: 'user',
    authority: 'guest',
    children: [
      {
        name: '登录',
        path: 'login',
      },
    ],
  },
]

/**
 * 格式化菜单
 *
 * [{                                 [{
 *   name: 'dashboard',                   authority: undefined,
 *   icon: 'dashboard',                   children: [{
 *   path: 'dashboard',                     authority: undefined,
 *   children: [                            name: '分析页',
 *     {                                    path: '/dashboard/analysis',
 *       name: '分析页',                   icon: 'dashboard',
 *       path: 'analysis',    =>          name: 'dashboard',
 *     },                                 path: '/dashboard',
 *   ],                               }, {
 * },                                   authority: undefined,
 * {                                    icon: 'project',
 *   name: '项目构建',                   name: 'project',
 *   icon: 'project',                   path: 'project',
 *   path: 'project',                 }]
 * }]
 *
 * @export
 * @param {*} data 菜单原始数组
 * @param {string} parentPath 分隔符
 * @param {*} parentAuthority 父级菜单的权限
 * @returns {array}
 */
export function formatter(data, parentPath = '/', parentAuthority) {
  return data.map((item) => {
    let { path } = item

    if (!path.startsWith('/')) {
      path = `${parentPath}${path}`
    }

    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    }

    if (item.children) {
      result.children = formatter(result.children, `${result.path}/`, result.authority)
    }

    return result
  })
}

export function getFlatMenuData(menu) {
  let keys = {}

  menu.forEach((item) => {
    if (item.children) {
      keys[item.path] = { ...item }
      keys = { ...keys, ...getFlatMenuData(item.children) }
    } else {
      keys[item.path] = { ...item }
    }
  })

  return keys
}

export default formatter(menuData)
