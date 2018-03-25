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
        var websocket = new WebSocket("ws://www.co-mama.cn/bgms/ws");
        var heartCheck = {
          timeout: 600000,//60ms
          timeoutObj: null,
          serverTimeoutObj: null,
          reset: function(){
              clearTimeout(this.timeoutObj);
              clearTimeout(this.serverTimeoutObj);
      　　　　 this.start();
          },
          start: function(){
              var self = this;
              this.timeoutObj = setTimeout(function(){
                websocket.send("{'CMD':'heart','VALUE':'none'}")
                  self.serverTimeoutObj = setTimeout(function(){
                    websocket.close();//如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
                  }, self.timeout)
              }, this.timeout)
          },
        }

        

        //连接成功建立的回调方法
        websocket.onopen = (event) =>{
          console.log('已连接')
          heartCheck.start();
          websocket.send("{'CMD':'hello','VALUE':'"+ userInfo.userCode + "'}")
        }

        websocket.onmessage =(msg) => {
          heartCheck.reset();
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
            case 'publish':
              alert('有新的需求', '是否跳转到接单详情页?', [
                { text: '取消' },
                { text: '确定', onPress: () => { global.app._store.dispatch({type:'app/updatePublish', payload:{value:data.VALUE}})},},
              ])
              break;
          }
          websocket.send("{'CMD':'callback','VALUE':'msg'}")
        }
        websocket.onclose = (e) => {
          // 这里会出现 1001 "Stream end encountered" 错误

        }

        WebSocket.onerror = () => {

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
