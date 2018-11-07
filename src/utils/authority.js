/**
 * 存储权限
 *
 * @export
 * @param {Authority} authority 权限
 */
export function setAuthority(authority) {
  localStorage.setItem('authority', authority)
}

/**
 * 存储 token
 *
 * @export
 * @param {string} token 令牌
 */
export function setToken(token) {
  localStorage.setItem('token', token)
}

/**
 * 获取 token
 *
 * @export
 * @returns {(string | null)} 令牌
 */
export function getToken() {
  return localStorage.getItem('token')
}

/**
 * 移除 token
 *
 * @export
 */
export function removeToken() {
  localStorage.removeItem('token')
}

/**
 * 获取权限
 *
 * @export
 * @returns {Authority} 权限
 */
export function getAuthority() {
  const token = getToken()

  if (token) {
    return 'admin'
  }

  return ''
}
