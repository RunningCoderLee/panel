import { setCurrentAuthority } from '-/components/Authorization'
import {
  requestLogin, requestGetUserInfo, requestLogout,
} from '-/services/user'
import { errorHandler } from '-/services'
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
        const { data } = await requestGetUserInfo(id)

        dispatch.user.updateCurrentUser(data)
      } catch (err) {
        errorHandler(err)
      }
    },
    async login(payload) {
      try {
        const { data } = await requestLogin(payload)


        setToken(data.token)

        setCurrentAuthority('admin')
      } catch (err) {
        errorHandler(err, {
          business: (code, message) => {
            dispatch.user.loginFailure(message)
          },
        })
      }
    },
    async logout() {
      try {
        await requestLogout()

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
