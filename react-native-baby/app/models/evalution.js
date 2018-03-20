import { createAction, NavigationActions, Storage, delay } from '../utils'
import * as evalutionService from '../services/evalution'

export default {
  namespace: 'evalution',
  state: {
    EvaList: [],
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload }
    },
  },
  effects: {
    *addEvalution({ payload, callback }, { call, put }) {
      yield call(evalutionService.addEvalution, payload)
      if (callback) callback()
    },
    *findEvaByBcode({ payload, callback }, { call, put }) {
      const EvaList = yield call(evalutionService.findEvaByBcode, payload.requireCode)
      yield put(createAction('updateState')({ EvaList }))
      if (callback) callback()
    },
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'loadStorage' })
    },
  },
}
