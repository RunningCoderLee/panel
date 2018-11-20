import { setCurrentAuthority } from '-/components/Authorization'
import {
  requestLogin, requestGetUserInfo,
} from '-/services/user'
import { errorHandler } from '-/services'
import history from '-/utils/history'
import { setToken, removeToken } from '-/utils/authority'

const initState = {
  currentUser: {},
  authority: '',
  isLoginFailed: false,
  errorMessage: '',
}

const user = {
  state: initState,
  reducers: {
    loginSuccess(state, userInfo) {
      return {
        ...state,
        currentUser: {
          ...userInfo,
        },
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
    logoutSuccess() {
      return { ...initState }
    },
    updateCurrentUser(state, payload) {
      return {
        ...state,
        currentUser: {
          ...payload,
        },
      }
    },
    resetState(state) {
      return {
        ...initState,
        currentUser: {
          ...state.currentUser,
        },
      }
    },
  },
  effects: dispatch => ({
    async getUserInfo() {
      try {
        const { data } = await requestGetUserInfo()

        setCurrentAuthority(data.roleCode)

        dispatch.user.updateCurrentUser(data)
      } catch (err) {
        errorHandler(err)
      }
    },
    async login(payload) {
      try {
        const { data } = await requestLogin(payload)
        const { token, ...userInfo } = data

        setToken(token)

        setCurrentAuthority(userInfo.roleCode)

        this.loginSuccess(userInfo)

        return Promise.resolve()
      } catch (err) {
        errorHandler(err, {
          business: (code, message) => {
            dispatch.user.loginFailure(message)
          },
        })
        return Promise.reject()
      }
    },
    async logout() {
      try {
        this.logoutSuccess()

        setCurrentAuthority('guest')

        history.push('/user/login')

        removeToken()
        // setCurrentAuthority('admin')
      } catch (err) {
        errorHandler(err)
      }
    },
  }),
}

export default user
