import { createAction, NavigationActions, Storage } from '../utils'
import * as authService from '../services/auth'
import * as updateService from '../services/update'
import * as requireService from '../services/requirement'

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
    *updateApply({payload}, { call, put }){
      yield put(NavigationActions.navigate({ routeName: 'RequireDetail',params:{requireCode:payload.value} }))
      
    },
    *updateSelect({payload}, { call, put }){
      yield put(NavigationActions.navigate({ routeName: 'TaskDetail',params:{ taskCode:payload.value } }))
    },
    *updatePay({payload}, { call, put }){
      yield put(NavigationActions.navigate({ routeName: 'TaskDetail',params:{ taskCode:payload.value } }))
    },
    *updatePublish({payload}, { call, put }){
      const requirement =yield call(requireService.findRequire, payload.value)
      yield put(NavigationActions.navigate({ routeName: 'ApplyRequireDetail', params:{requirement} }))
    },
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'getLastVersion' })
    },
  },
}
