import { createAction, NavigationActions, Storage, delay } from '../utils'
import * as moneyService from '../services/money'

export default {
  namespace: 'money',
  state: {
    balance: 0,
    moneyFlow:[],
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload }
    },
  },
  effects: {
    *withdraw({ payload }, { call, put }) {
      yield call(moneyService.withdraw, payload)

    },
    *myBalance({ payload }, { call, put }) {
      const {balance} = yield call(moneyService.myBalance, payload)
      yield put(createAction('updateState')({ balance }))
    },
    *myMoneyFlow({ payload }, { call, put }) {
      
      const moneyFlow = yield call(moneyService.myMoneyFlow, payload)
      console.log(moneyFlow)
      if(moneyFlow){
        yield put(createAction('updateState')({ moneyFlow }))
      }
      
    },
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'loadStorage' })
    },
  },
}
