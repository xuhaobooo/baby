import React from 'react'
import { AppRegistry } from 'react-native'
import * as WeChat from 'react-native-wechat';

import dva from './utils/dva'
import Router, { routerMiddleware } from './router'

import { Toast } from 'antd-mobile'

import appModel from './models/app'
import routerModel from './models/router'
import loginModel from './models/login'
import requireModel from './models/requirement'
import babyModel from './models/babyInfo'

console.disableYellowBox = true
const app = dva({
  initialState: {},
  models: [appModel, routerModel, loginModel, requireModel,babyModel],
  onAction: [routerMiddleware],
  onError(e) {
    Toast.fail(e.message)
    
  },
})

const App = app.start(<Router />)
WeChat.registerApp('wx1751ba892d97acaf');

AppRegistry.registerComponent('DvaStarter', () => App)
