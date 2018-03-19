import React, { PureComponent } from 'react'
import { BackHandler, Animated, Easing, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {
  StackNavigator,
  TabNavigator,
  TabBarBottom,
  addNavigationHelpers,
  NavigationActions,
} from 'react-navigation'
import {
  createReduxBoundAddListener,
  createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers'
import { connect } from 'react-redux'

import Loading from './containers/Loading'
import Login from './containers/Login'
import Register from './containers/Register'
import ViewPermit from './containers/PermitView'

import Splash from './containers/Splash'
import MyRequire from './containers/MyRequire'
import RequireDetail from './containers/RequireDetail'
import ApplyDetail from './containers/ApplyDetail'
import Account from './containers/Account'
import Detail from './containers/Detail'

import OrderNaigator from './containers/OrderNaigator'
import ApplyRequireDetail from './containers/ApplyRequireDetail'
import TaskDetail from './containers/TaskDetail'

import PublishRequire from './containers/PublishNavigator'
import MyTask from './containers/MyTask'
import BaiduMapPage from './containers/BaiduMap'

const MyRequireNavigator = TabNavigator(
  {
    MyRequire: { screen: MyRequire },
    PublishRequire: { screen: PublishRequire },
    Account: { screen: Account },
    OrderNaigator: { screen: OrderNaigator },
    MyTask: { screen: MyTask },
  },
  {
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    swipeEnabled: false,
    animationEnabled: false,
    lazyLoad: true,
  }
)

const MainNavigator = StackNavigator(
  {
    MyRequireNavigator: { screen: MyRequireNavigator },
    RequireDetail: { screen: RequireDetail },
    ApplyDetail: { screen: ApplyDetail },
    ApplyRequireDetail: { screen: ApplyRequireDetail },
    Detail: { screen: Detail },
    BaiduMapPage: { screen: BaiduMapPage },
    TaskDetail: { screen: TaskDetail },
  },
  {
    headerMode: 'float',
    navigationOptions: {
      headerBackTitle: null,
    },
  }
)

const LoginNavigator = StackNavigator(
  {
    Login: { screen: Login },
    Register: { screen: Register },
    ViewPermit: { screen: ViewPermit },
    RegisterBaiduMap: { screen: BaiduMapPage },
  },
  {
    headerMode: 'float',
    navigationOptions: {
      headerBackTitle: null,
    },
  }
)

const AppNavigator = StackNavigator(
  {
    Splash: { screen: Splash },
    LoginNavigator: { screen: LoginNavigator },
    Main: { screen: MainNavigator },
  },
  {
    headerMode: 'none',
    mode: 'modal',
    navigationOptions: {
      gesturesEnabled: false,
    },
    transitionConfig: () => ({
      transitionSpec: {
        duration: 300,
        easing: Easing.out(Easing.poly(4)),
        timing: Animated.timing,
      },
      screenInterpolator: sceneProps => {
        const { layout, position, scene } = sceneProps
        const { index } = scene

        const height = layout.initHeight
        const translateY = position.interpolate({
          inputRange: [index - 1, index, index + 1],
          outputRange: [height, 0, 0],
        })

        const opacity = position.interpolate({
          inputRange: [index - 1, index - 0.99, index],
          outputRange: [0, 1, 1],
        })

        return { opacity, transform: [{ translateY }] }
      },
    }),
  }
)

function getCurrentScreen(navigationState) {
  if (!navigationState) {
    return null
  }
  const route = navigationState.routes[navigationState.index]
  if (route.routes) {
    return getCurrentScreen(route)
  }
  return route.routeName
}

export const routerMiddleware = createReactNavigationReduxMiddleware(
  'root',
  state => state.router
)
const addListener = createReduxBoundAddListener('root')

@connect(({ app, router }) => ({ app, router }))
class Router extends PureComponent {
  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backHandle)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backHandle)
  }

  onLayout = event => {
    const { x, y, width, height } = event.nativeEvent.layout
    if (this.props.app.windowHeight) {
      return
    }
    this.props.dispatch({
      type: 'app/updateState',
      payload: { windowHeight: height, windowWidth: width },
    })
  }

  backHandle = () => {
    const currentScreen = getCurrentScreen(this.props.router)
    if (currentScreen === 'Login') {
      return true
    }

    if (currentScreen === 'Splash') {
      return true
    }

    if (currentScreen !== 'MyRequire') {
      return true
    }
    return false
  }

  render() {
    const { dispatch, app, router } = this.props
    const navigation = addNavigationHelpers({
      dispatch,
      state: router,
      addListener,
    })
    return (
      <View onLayout={this.onLayout} style={{ flex: 1 }}>
        <AppNavigator navigation={navigation} />
      </View>
    )
  }
}

export function routerReducer(state, action = {}) {
  return AppNavigator.router.getStateForAction(action, state)
}

export default Router
