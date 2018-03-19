import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native'
import { connect } from 'react-redux'

import { createAction, NavigationActions } from '../utils'
import {
  Button,
  InputItem,
  Picker,
  List,
  WhiteSpace,
  Toast,
  TextareaItem,
  Checkbox,
} from 'antd-mobile'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import * as ScreenUtil from '../utils/ScreenUtil'

@connect(({ login, app }) => ({ ...login, app }))
class Register extends Component {
  state = {
    mobileError: true,
    mobile: '',
    passwordError: true,
    password: '',
    cathcha: '',
    cathchaError: true,
    nameError: true,
    name: '',
    guest: null,
  }

  static navigationOptions = {
    headerTitle: (
      <Text
        style={{
          fontSize: ScreenUtil.setSpText(20),
          alignSelf: 'center',
          textAlign: 'center',
          flex: 1,
          color: '#FF6600',
        }}
      >
        用户注册
      </Text>
    ),
    headerRight: <View />,
  }

  onLogin = () => {
    if (this.state.mobileError || this.state.passwordError) {
      Toast.info('请输入正确的账号密码')
      return
    }
    this.props.dispatch(
      createAction('login/login')({
        loginName: this.state.mobile.replace(/\s/g, ''),
        password: this.state.password,
      })
    )
  }

  cancel = () => {
    this.props.dispatch(NavigationActions.back())
  }

  onMobileChange = value => {
    if (value.replace(/\s/g, '').length < 11) {
      this.setState({
        mobileError: true,
      })
    } else {
      this.setState({
        mobileError: false,
      })
    }
    this.setState({
      mobile: value,
    })
  }

  onPasswordChange = value => {
    if (value.replace(/\s/g, '').length < 6) {
      this.setState({
        passwordError: true,
      })
    } else {
      this.setState({
        passwordError: false,
      })
    }
    this.setState({
      password: value,
    })
  }

  onGuestChange = value => {
    this.setState({ guest: value })
    this.props.dispatch(
      createAction('login/login')({
        loginName: value[0],
        password: '123456',
      })
    )
  }

  addrClick = () => {
    this.props.dispatch(
      NavigationActions.navigate({
        routeName: 'RegisterBaiduMap',
        params: { showBtn: true, moduleName: login },
      })
    )
  }

  render() {
    const { fetching } = this.props.app
    const guestData = [
      { value: '13312312312', label: '需求方' },
      { value: '13412312312', label: '供应方' },
    ]
    const { windowHeight } = this.props.app
    return (
      <KeyboardAwareScrollView
        resetScrollToCoords={{ x: 0, y: 0 }}
        scrollEnabled={false}
      >
        <View
          style={{
            height: windowHeight,
            alignItems: 'stretch',
            justifyContent: 'flex-start',
            backgroundColor: 'white',
            height: windowHeight - ScreenUtil.setSpText(42),
          }}
        >
          {fetching && <ActivityIndicator style={styles.indecator} />}
          <WhiteSpace />
          <InputItem
            type="phone"
            placeholder="手机号码(登录账号)"
            error={this.state.mobileError}
            value={this.state.mobile}
            onChange={this.onMobileChange}
          />

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'white',
              width: '100%',
              height: 40,
            }}
          >
            <View style={{ flex: 8, backgroundColor: 'white' }}>
              <InputItem
                placeholder="手机验证码"
                error={this.state.cathchaError}
                value={this.state.cathcha}
                maxLength={6}
                onChange={this.onCathchaChange}
                editable={false}
              />
            </View>

            <TouchableOpacity
              onPress={this.getCathcha}
              style={{ marginRight: 10 }}
            >
              <Button type="primary">获取</Button>
            </TouchableOpacity>
          </View>
          <InputItem
            type="text"
            placeholder="手机验证码"
            error={this.state.cathchaError}
            value={this.state.cathcha}
            maxLength={6}
            onChange={this.onCathchaChange}
          />

          <InputItem
            type="text"
            placeholder="姓名"
            maxLength={30}
            error={this.state.nameError}
            value={this.state.name}
            onChange={this.onNameChange}
          />

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'white',
              width: '100%',
              height: 40,
            }}
          >
            <View style={{ flex: 8 }}>
              <InputItem
                labelNumber={7}
                error={this.state.positionError}
                style={{ flex: 8, backgroundColor: 'white' }}
                value={this.state.position && this.state.position.label}
                editable={false}
                placeholder="地点"
              />
            </View>

            <TouchableOpacity
              onPress={this.addrClick}
              style={{ marginRight: 10 }}
            >
              <Image
                style={{
                  marginTop: 3,
                  width: 20,
                  height: 20,
                  paddingLeft: 0,
                  paddingRight: 0,
                }}
                source={require('../images/map.png')}
                resizeMode="stretch"
              />
            </TouchableOpacity>
          </View>

          <InputItem
            type="password"
            placeholder="密码"
            maxLength={30}
            error={this.state.passwordError}
            value={this.state.password}
            onChange={this.onPasswordChange}
          />

          <InputItem
            type="password"
            placeholder="密码"
            error={this.state.passwordError}
            value={this.state.password}
            onChange={this.onPasswordChange}
          />

          <InputItem
            type="phone"
            placeholder="邀请者手机号码(已注册的)"
            value={this.state.name}
            onChange={this.onNameChange}
          />

          <TextareaItem
            placeholder="自我介绍，能让人更好的了解您"
            value={this.state.note}
            rows={6}
            count={100}
            onChange={this.onNoteChange}
          />
          <View style={{ marginTop: 5, marginLeft: 20 }}>
            <Checkbox
              key="viewPermit"
              style={{
                width: ScreenUtil.setSpText(14),
                height: ScreenUtil.setSpText(14),
              }}
              onChange={e => this.setState({ permit: e.target.checked })}
              checked={this.state.permit}
            >
              <View style={{ flexDirection: 'row' }}>
                <Text>我同意 </Text>
                <Text
                  style={{ borderBottomWidth: 1, borderBottomColor: 'blue' }}
                  onPress={() =>
                    this.props.dispatch(
                      NavigationActions.navigate({ routeName: 'ViewPermit' })
                    )
                  }
                >
                  《软件许可及服务协议》
                </Text>
              </View>
            </Checkbox>
          </View>
          <WhiteSpace />
          <Button
            style={styles.registerBtn}
            onClick={this.onRegister}
            type="primary"
          >
            注册
          </Button>
        </View>
      </KeyboardAwareScrollView>
    )
  }
}

const { width: windowWidth, height: windowHeight } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },
  indecator: {
    position: 'absolute',
    top: windowHeight * 0.43,
    left: windowWidth * 0.5 - 10,
    zIndex: 999,
  },

  registerBtn: {
    margin: 10,
    marginTop: 15,
  },
})

export default Register
