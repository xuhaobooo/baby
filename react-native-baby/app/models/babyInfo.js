import { createAction, NavigationActions, Storage, delay } from '../utils'
import * as babyService from '../services/babyInfo'

export default {
  namespace: 'babyInfo',
  state: {
    babyList:[],
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload }
    },
  },
  effects: {
    
    *addBaby({payload,callback},{call, put}) {
      yield call(babyService.addBaby, payload)
      if(callback) callback()
      yield put(createAction('requirement/queryMyBaby')({ }))
    },
   
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'loadStorage' })
    },
  },
}
