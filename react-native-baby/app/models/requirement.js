import { createAction, NavigationActions, Storage, delay } from '../utils'
import * as requireService from '../services/requirement'
import * as payUtil from '../utils/payUtil'
import { Toast } from 'antd-mobile'
import * as WeChat from 'react-native-wechat'

export default {
  namespace: 'requirement',
  state: {
    myRequireList: [],
    pendRequireList: [],
    applies: [],
    requirement: null,
    myBabys: [],
    trustDict: null,
    serviceWithCatalog: null,
    timePrice: null,
    position: null,
    curTab: 0,
    myTaskList: [],
    task: null,
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload }
    },
  },
  effects: {
    *queryMyRequire({ payload }, { call, put }) {
      yield put(
        createAction('app/updateState')({
          fetching: true,
          curTab: payload.curTab,
        })
      )
      yield put(createAction('updateState')({ myRequireList: [] }))
      const data = yield call(requireService.queryMyRequire, payload)
      if (data) {
        yield put(createAction('updateState')({ myRequireList: data }))
        yield put(createAction('app/updateState')({ fetching: false }))
      }
    },
    *findApply({ payload }, { call, put }) {
      yield put(createAction('updateState')({ applies: [] }))
      const applies = yield call(requireService.findApply, payload)
      if (applies) {
        yield put(createAction('updateState')({ applies }))
      }
    },
    *selectApply({ payload }, { select, call, put }) {
      const { applyId, requireCode } = payload
      yield call(requireService.selectApply, applyId)
      const requirement = yield call(requireService.findRequire, requireCode)
      yield put(createAction('updateState')({ requirement }))
      const task = yield call(requireService.findTaskByRequireCode, payload)
      yield put(createAction('updateState')(null))
      if (task) {
        yield put(createAction('updateState')({ task }))
      }
      const requireList = yield select(state => state.requirement.myRequireList)
      const newArray = requireList.map(item => {
        if (item.requireCode === requireCode) {
          item.requireStatus = 'CONF'
        }
        return item
      })
      yield put(createAction('updateState')({ myRequireList: newArray }))
      yield put(NavigationActions.back())
    },
    *queryMyBaby({ payload }, { call, put }) {
      const myBabys = yield call(requireService.queryMyBaby)
      yield put(createAction('updateState')({ myBabys }))
    },
    *queryTrustDict({ payload }, { select, call, put }) {
      const tmp = yield select(state => state.trustDict)
      if (!tmp) {
        const trustDict = yield call(requireService.queryTrustDict)
        yield put(createAction('updateState')({ trustDict }))
      }
    },
    *queryService({ payload }, { select, call, put }) {
      const tmp = yield select(state => state.serviceWithCatalog)
      if (!tmp) {
        const serviceWithCatalog = yield call(requireService.queryService)
        yield put(createAction('updateState')({ serviceWithCatalog }))
      }
    },
    *queryTimePrice({ payload }, { select, call, put }) {
      const tmp = yield select(state => state.timePrice)
      if (!tmp) {
        const timePrice = yield call(requireService.queryTimePrice)
        yield put(createAction('updateState')({ timePrice }))
      }
    },
    *publishRequire({ payload, callback }, { select, call, put }) {
      yield call(requireService.publishRequire, payload)

      yield put(createAction('updateState')({ myRequireList: [] }))
      const date = new Date()
      const startDate = `${date.getFullYear()}-${date.getMonth() +
        1}-${date.getDate()} 00:00:00`
      const endDate = `${date.getFullYear()}-${date.getMonth() +
        1}-${date.getDate()} 23:59:59`

      const data = yield call(requireService.queryMyRequire, {
        startDate,
        endDate,
      })

      if (data) {
        yield put(createAction('updateState')({ myRequireList: data }))
      }
      yield put(createAction('app/updateState')({ fetching: false }))
      if (callback) {
        callback()
      }
    },
    *queryPendMyRequire({ payload }, { call, put }) {
      const pendRequireList = yield call(
        requireService.queryPendMyRequire,
        payload
      )
      if (pendRequireList) {
        yield put(createAction('updateState')({ pendRequireList }))
      }
    },
    *applyRequire({ payload }, { select, call, put }) {
      const { requireCode } = payload
      yield call(requireService.applyRequire, requireCode)

      const requireList = yield select(
        state => state.requirement.pendRequireList
      )
      const newArray = requireList.map(item => {
        if (item.requireCode === requireCode) {
          item.applied = true
        }
        return item
      })
      yield put(createAction('updateState')({ pendRequireList: newArray }))
      yield put(NavigationActions.back())
    },
    *queryMyTask({ payload }, { call, put }) {
      const myTaskList = yield call(requireService.queryMyTask, payload)
      if (myTaskList) {
        yield put(createAction('updateState')({ myTaskList }))
      }
    },
    *findTaskByRequireCode({ payload }, { call, put }) {
      yield put(createAction('updateState')({ task: null }))
      const task = yield call(requireService.findTaskByRequireCode, payload)
      if (task) {
        yield put(createAction('updateState')({ task }))
      }
    },
    *arrive({ payload }, { call, put }) {
      const { task } = payload
      yield call(requireService.arrive, task)
      task.taskStatus = 'ARRV'
      yield put(createAction('updateState')({ task }))
      Toast.success('已到达！')
    },
    *complete({ payload }, { call, put }) {
      const { task } = payload
      yield call(requireService.complete, task)
      task.taskStatus = 'PF'
      yield put(createAction('updateState')({ task }))
      Toast.success('任务完成！')
    },
    *customerFinish({ payload }, { call, put }) {
      const { task } = payload
      yield call(requireService.customerFinish, task.requireCode)
      if (task.paid) {
        task.taskStatus = 'AF'
      } else {
        task.taskStatus = 'CF'
      }
      console.log(task)
      yield put(createAction('updateState')({ task }))
      Toast.success('验收完成！')
    },
    *alipay({ payload, callback }, { call, put }) {
      const result = yield call(requireService.alipay, payload)
      yield payUtil.performAlipay(result, callback)
    },
    *wechatPay({ payload, callback }, { call, put }) {
      const flag = yield WeChat.isWXAppInstalled()
      if (true) {
        const result = yield call(requireService.wechatPay, payload)
        payUtil.performWechatPay(result, callback)
      } else {
        Toast.info('没有安装微信！', 1)
      }
    },
  },
  subscriptions: {
    setup({ dispatch }) {},
  },
}
