import { createAction, NavigationActions, Storage, delay } from '../utils'
import * as moneyService from '../services/money'

export default {
  namespace: 'money',
  state: {
    balance: 0,
    moneyFlow:[],
    bankList:[],
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload }
    },
  },
  effects: {
    *withdraw({ payload, callback }, { call, put }) {
      yield call(moneyService.withdraw, payload)
      if(callback) callback()
    },
    *myBalance({ payload }, { call, put }) {
      yield put(createAction('updateState')({ balance:0 }))
      const {balance} = yield call(moneyService.myBalance, payload)
      yield put(createAction('updateState')({ balance }))
    },
    *myMoneyFlow({ payload }, { call, put }) {
      yield put(createAction('updateState')({ moneyFlow:[] }))
      const moneyFlow = yield call(moneyService.myMoneyFlow, payload)
      if(moneyFlow){
        yield put(createAction('updateState')({ moneyFlow }))
      }
    },
    *listMyBank({ payload }, { call, put }) {
      yield put(createAction('updateState')({ bankList:[] }))
      const bankList = yield call(moneyService.listMyBank, payload)
      yield put(createAction('updateState')({ bankList }))
    },
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'loadStorage' })
    },
  },
}
