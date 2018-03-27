import { createAction, NavigationActions, Storage, delay } from '../utils'
import * as userService from '../services/userInfo'
import {Modal} from 'antd-mobile'

const alert = Modal.alert

export default {
  namespace: 'userInfo',
  state: {
    position: null,
    websocket:null,
    userInfo: null,
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload }
    },
  },
  effects: {
    *updateUserInfo({ payload, callback }, { select, call, put }) {
      yield call(userService.updateUserInfo, payload)
      const userInfo = yield select(state => state.userInfo.userInfo)
      userInfo.userName = payload.userName
      userInfo.addrName = payload.addrName
      userInfo.addrPosX = payload.addrPosX
      userInfo.addrPosY = payload.addrPosY
      userInfo.note = payload.note
      yield put(createAction('updateState')({ userInfo }))
      if (callback) callback()
    },
    *getUserInfo({ payload }, { select, call, put }) {
      const { userCode } = payload
      const userInfo = yield call(userService.getUserInfo, userCode)

      if (userInfo) {
        var websocket = new WebSocket("ws://www.co-mama.cn/bgms/ws");
        var heartCheck = {
          timeout: 600000,//60ms
          timeoutObj: null,
          reset: function(){
              clearTimeout(this.timeoutObj);
      　　　　 this.start();
          },
          start: function(){
              var self = this;
              this.timeoutObj = setTimeout(() =>{
                websocket.send("{'CMD':'heart','VALUE':'none'}")
                this.start()
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
        const position = {posX:userInfo.addrPosX, posY:userInfo.addrPosY, label:userInfo.addrName}
        yield put(createAction('updateState')({ userInfo,websocket,position }))
      }
    },
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'loadStorage' })
    },
  },
}
