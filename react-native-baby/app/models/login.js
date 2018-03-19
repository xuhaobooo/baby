import { createAction, NavigationActions, Storage, delay } from '../utils'
import * as authService from '../services/auth'
import {Toast} from 'antd-mobile'

export default {
  namespace: 'login',
  state: {
    userInfo: null,
    position: null,
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload }
    },
  },
  effects: {
    *loadStorage(action, { call, put }) {
      const login = yield call(Storage.get, 'login', false)
      yield put(createAction('updateState')({ login, loading: false }))
    },
    *login({ payload }, { call, put }) {
      yield put(createAction('app/updateState')({ fetching: true }))

      const data = yield call(authService.fakeAccountLogin, payload)
      if (data) {
        yield put(createAction('getUserInfo')({ userCode: data.code }))
        Storage.set('token', data.accessCode)
        Storage.set('userCode', data.code)
      }
      yield put(createAction('app/updateState')({ fetching: false }))
    },
    *tokenLogin({ payload }, { call, put }) {
      const token = yield call(Storage.get, 'token', null)
      const userCode = yield call(Storage.get, 'userCode', null)

      if (token && userCode) {
        const login = yield call(authService.fakeTokenLogin, {
          token,
          userCode,
        })
        if (login) {
          yield put(createAction('getUserInfo')({ userCode }))
        }
        yield put(createAction('app/updateState')({ fetching: false }))
      } else {
        yield call(authService.wait, 1000)
        yield put(createAction('app/updateState')({ fetching: false }))
        yield put(
          NavigationActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({ routeName: 'LoginNavigator' }),
            ],
          })
        )
      }
    },
    *getUserInfo({ payload }, { call, put }) {
      const { userCode } = payload
      const userInfo = yield call(authService.getUserInfo, userCode)
      if (userInfo) {
        yield put(createAction('updateState')({ userInfo }))
        yield put(NavigationActions.navigate({ routeName: 'Main' }))
      }
    },
    *logout(action, { call, put }) {
      Storage.clear()
      yield put(NavigationActions.navigate({ routeName: 'LoginNavigator' }))
    },
    *getCathcha({payload}, { call, put }) {
      yield call(authService.getCathcha, payload.mobile)
      Toast.info('验证码已通过短信发送，请查收',1)
    },
    *registUser({payload, callback}, { call, put }) {
      console.log(payload)
      const registerInfo = yield call(authService.registUser, payload)
      console.log(registerInfo)
      payload.userCode = registerInfo.userCode
      yield call(authService.addUserInfo, payload)
      if(callback) callback()
    },
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'loadStorage' })
    },
  },
}
