import { createAction, NavigationActions, Storage } from '../utils'
import * as authService from '../services/auth'
import * as updateService from '../services/update'

export default {
  namespace: 'app',
  state: {
    login: false,
    loading: true,
    fetching: false,
    windowHeight: null,
    windowWidth: null,
    updateFlag:false,
    originVersion:6,
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload }
    },
  },
  effects: {

    *getLastVersion({payload,callback}, { select, call, put }) {
      const originVersion = yield select(state => state.app.originVersion)
      const versionCode = yield call(updateService.getLastVersion)
      if(versionCode && originVersion < versionCode){
        yield put(createAction('updateState')({ updateFlag: true }))
      }
      if(callback) callback()
    },
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'getLastVersion' })
    },
  },
}
