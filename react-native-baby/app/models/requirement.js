import { createAction, NavigationActions, Storage, delay } from '../utils'
import * as requireService from '../services/requirement'
import * as payUtil from '../utils/payUtil'
import { Toast } from 'antd-mobile'
import * as WeChat from 'react-native-wechat'
import * as DateUtil from '../utils/TimeUtil'

export default {
  namespace: 'requirement',
  state: {
    myRequireList: [],
    pendRequireList: [],
    applies: [],
    requirement: null,
    myBabys: null,
    trustDict: null,
    serviceWithCatalog: null,
    timePrice: null,
    position: null,
    myTaskList: [],
    task: null,
    taskDetail:null,
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload }
    },
  },
  effects: {
    *queryMyRequire({ payload }, { call, put }) {
      yield delay(100)
      yield put(
        createAction('app/updateState')({
          fetching: true,
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
    *findRequire({ payload }, { call, put }) {
      const { requireCode } = payload
      yield put(createAction('updateState')({ requirement:null}))
      const requirement = yield call(requireService.findRequire, requireCode)
      if (requirement) {
        yield put(createAction('updateState')({ requirement }))
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
      Toast.success('已选择')
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
      yield delay(100)
      yield put(createAction('updateState')({ pendRequireList:[] }))
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
      Toast.success('抢单成功，请等待反馈',1)
      yield put(createAction('updateState')({ pendRequireList: newArray }))
      yield put(NavigationActions.back())
    },
    *queryMyTask({ payload }, { call, put }) {
      yield delay(100)
      yield put(createAction('updateState')({ myTaskList:[] }))
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
    *findTaskByTaskCode({ payload }, { call, put }) {
      yield put(createAction('updateState')({ taskDetail: null }))
      const taskDetail = yield call(requireService.findTaskByTaskCode, payload)
      if (taskDetail) {
        yield put(createAction('updateState')({ taskDetail }))
      }
    },
    *arrive({ payload }, { select,call, put }) {
      const { task } = payload
      yield call(requireService.arrive, task)
      task.taskStatus = 'ARRV'
      task.stepList.push({stepContent:'到达目的地',doneTime:DateUtil.formatTimeFull(new Date())})
      yield put(createAction('updateState')({ task }))

      const myTaskList = yield select(state => state.requirement.myTaskList)
      const newArray = myTaskList.map(item => {
        if (item.taskCode === task.taskCode) {
          item.taskStatus = task.taskStatus
        }
        return item
      })
      yield put(createAction('updateState')({ myTaskList: newArray }))

      Toast.success('已到达！')
    },
    *complete({ payload }, { select,call, put }) {
      const { task } = payload
      yield call(requireService.complete, task)
      task.taskStatus = 'PF'
      task.stepList.push({stepContent:'服务已完成',doneTime:DateUtil.formatTimeFull(new Date())})
      yield put(createAction('updateState')({ task }))

      const myTaskList = yield select(state => state.requirement.myTaskList)
      const newArray = myTaskList.map(item => {
        if (item.taskCode === task.taskCode) {
          item.taskStatus = task.taskStatus
        }
        return item
      })
      yield put(createAction('updateState')({ myTaskList: newArray }))

      Toast.success('任务完成！')
    },
    *customerFinish({ payload }, { select,call, put }) {
      const { task } = payload
      yield call(requireService.customerFinish, task.requireCode)
      var status = task.taskStatus
      if (task.paid) {
        status = 'AF'
        task.taskStatus = 'AF'
        task.stepList.push({stepContent:'用户已确认完成',doneTime:DateUtil.formatTimeFull(new Date())})
        task.stepList.push({stepContent:'服务结束',doneTime:DateUtil.formatTimeFull(new Date())})
      } else {
        status = 'CF'
        task.stepList.push({stepContent:'用户已确认完成',doneTime:DateUtil.formatTimeFull(new Date())})
        task.taskStatus = 'CF'
      }
      yield put(createAction('updateState')({ task }))

      const requireList = yield select(state => state.requirement.myRequireList)
      const newArray = requireList.map(item => {
        if (item.requireCode === task.requireCode) {
          item.requireStatus = status
        }
        return item
      })
      yield put(createAction('updateState')({ myRequireList: newArray }))

      Toast.success('确认任务完成！')
    },
    *alipay({ payload, callback }, { select,call, put }) {
      const result = yield call(requireService.alipay, payload)
      yield payUtil.performAlipay(result, callback)
      const requireList = yield select(state => state.requirement.myRequireList)
      const newArray = requireList.map(item => {
        if (item.requireCode === payload.busiCode) {
          item.paid = true
        }
        return item
      })
      yield put(createAction('updateState')({ myRequireList: newArray }))
    },
    *wechatPay({ payload, callback }, { select,call, put }) {
      const flag = yield WeChat.isWXAppInstalled()
      if (true) {
        const result = yield call(requireService.wechatPay, payload)
        payUtil.performWechatPay(result, callback)
        const requireList = yield select(state => state.requirement.myRequireList)
        const newArray = requireList.map(item => {
          if (item.requireCode === payload.busiCode) {
            item.paid = true
          }
          return item
        })
        yield put(createAction('updateState')({ myRequireList: newArray }))
      } else {
        Toast.info('没有安装微信！', 1)
      }
    },
  },
  subscriptions: {
    setup({ dispatch }) {},
  },
}
