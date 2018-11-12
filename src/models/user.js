import { setCurrentAuthority } from '-/components/Authorization'
import {
  requestLogin, requestGetUserInfo, requestLogout,
} from '-/services/user'
import history from '-/utils/history'
import { setToken, removeToken } from '-/utils/authority'

const initState = {
  currentUser: {
    username: '',
  },
  authority: '',
  isLoginFailed: false,
  errorMessage: '',
}

const user = {
  state: initState,
  reducers: {
    loginSuccess(state) {
      return {
        ...state,
        isLoginFailed: false,
      }
    },
    loginFailure(state, payload) {
      return {
        ...state,
        isLoginFailed: true,
        errorMessage: payload,
      }
    },
    updateCurrentUser(state, payload) {
      return {
        ...state,
        currentUser: {
          ...payload,
        },
      }
    },
  },
  effects: dispatch => ({
    async getUserInfo(id) {
      try {
        const { data: { data } } = await requestGetUserInfo(id)

        dispatch.user.updateCurrentUser(data)

        return Promise.resolve()
      } catch (err) {
        return Promise.reject(err)
      }
    },
    async login(payload) {
      try {
        const { data: { code, data, message } } = await requestLogin(payload)

        if (code !== 0) {
          dispatch.user.loginFailure(message)
          return Promise.reject(message)
        }

        setToken(data.token)

        // TODO: 后续添加权限后再调整
        setCurrentAuthority('admin')

        return Promise.resolve()
      } catch (err) {
        return Promise.reject(err)
      }
    },
    async logout() {
      try {
        await requestLogout()

        history.push('/user/login')

        removeToken()
        // setCurrentAuthority('admin')

        return Promise.resolve()
      } catch (err) {
        return Promise.reject(err)
      }
    },
  }),
}

export default user
