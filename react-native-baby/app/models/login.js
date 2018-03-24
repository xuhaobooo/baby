import { createAction, NavigationActions, Storage, delay } from '../utils'
import * as authService from '../services/auth'
import {Toast, Modal} from 'antd-mobile'

const alert = Modal.alert

export default {
  namespace: 'login',
  state: {
    userInfo: null,
    position: null,
    websocket:null,
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload }
    },
  },
  effects: {
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
          NavigationActions.navigate({ routeName: 'LoginNavigator' }),
        )
      }
    },
    *getUserInfo({ payload }, { select, call, put }) {
      const { userCode } = payload
      const userInfo = yield call(authService.getUserInfo, userCode)
      if (userInfo) {
        console.log(userInfo)
          var websocket = new WebSocket("ws://192.168.1.192:8080/bgms/ws");
        
        //连接成功建立的回调方法
        websocket.onopen = (event) =>{
          console.log('已连接')
          websocket.send("{'CMD':'hello','VALUE':'"+ userInfo.userCode + "'}")
        }

        websocket.onmessage =(msg) => {
          const data = JSON.parse(msg.data)
          console.log(data.CMD)
          switch(data.CMD){
            case 'apply':
              alert('有人接单了', '是否跳转到需求详情页?', [
                { text: '取消' },
                { text: '确定', onPress: () => { global.app._store.dispatch({type:'app/updateApply', payload:{value:data.VALUE}})},},
              ])
              
              break
            case 'select':
              alert('您抢的单已被确定', '是否跳转到任务详情页?', [
                { text: '取消' },
                { text: '确定', onPress: () => { global.app._store.dispatch({type:'app/updateSelect', payload:{value:data.VALUE}})},},
              ])
              break;
            case 'pay':
              alert('有支付消息', '是否跳转到任务详情页?', [
                { text: '取消' },
                { text: '确定', onPress: () => { global.app._store.dispatch({type:'app/updatePay', payload:{value:data.VALUE}})},},
              ])
              break;
          }
        }
        websocket.onclose = (e) => {
          // 这里会出现 1001 "Stream end encountered" 错误
          console.log(e.code, e.reason);
        }

        yield put(createAction('requirement/queryMyBaby')({
        }))
        
        yield put(createAction('updateState')({ userInfo,websocket }))
        yield put(NavigationActions.navigate({ routeName: 'Main' }))
      }
    },
    *logout(action, { select, call, put }) {
      Storage.clear()
      try{
      const websocket = yield select(state => state.login.websocket)
      websocket && websocket.close()
      }catch(e){
        
      }
      yield put(createAction('updateState')({ websocket:null,userInfo:null }))
      yield put(createAction('requirement/updateState')({ myBabys:null }))
      yield put(
        NavigationActions.navigate({ routeName: 'LoginNavigator' }))
    },
    *getCathcha({payload}, { call, put }) {
      yield call(authService.getCathcha, payload.mobile)
      Toast.info('验证码已通过短信发送，请查收',1)
    },
    *registUser({payload, callback}, { call, put }) {
      const registerInfo = yield call(authService.registUser, payload)
      payload.userCode = registerInfo.userCode
      yield call(authService.addUserInfo, payload)
      if(callback) callback()
    },
    *resetPassword({payload, callback}, { call, put }) {
      yield call(authService.resetPassword, payload)
      if(callback) callback()
    },
    *changePassword({payload, callback}, { call, put }) {
      yield call(authService.changePassword, payload)
      if(callback) callback()
    },
  },
  subscriptions: {
    setup({ dispatch }) {
    },
  },
}
