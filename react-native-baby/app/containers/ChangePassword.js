import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native'
import { connect } from 'react-redux'

import { createAction, NavigationActions } from '../utils'
import {
  Button,
  InputItem,
  List,
  WhiteSpace,
  Toast,
} from 'antd-mobile'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import * as ScreenUtil from '../utils/ScreenUtil'

@connect(({ app }) => ({ ...app }))
class ForgetPassword extends Component {

  state = {
    passwordError: false,
    password: null,
    passwordConfError:false,
    passwordConf:null,
    oldPasswordError: false,
    oldPassword: null,
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
        修改密码
      </Text>
    ),
    headerRight: <View />,
  }

  changePassword = () => {
      if (this.state.oldPasswordError || !this.state.oldPassword) {
        Toast.info('请输入6位以上的旧密码',1)
        return
      }
      if (this.state.passwordError || !this.state.password) {
        Toast.info('请输入6位以上的密码',1)
        return
      }
      if (this.state.passwordConfError || !this.state.passwordConf) {
        Toast.info('两次密码必须相同',1)
        return
      }
    
    this.props.dispatch({
        type:'login/changePassword',
        payload:{
          orderPassword: this.state.oldPassword,
          newPassword: this.state.password,
        },
        callback: this.afterResetPassword
      }
    )
  }

  afterResetPassword =() => {
    Toast.info('密码修改成功',1)
    this.props.dispatch(NavigationActions.back())
  }

  onOldPasswordChange = value => {
    if (value.replace(/\s/g, '').length < 6) {
      this.setState({
        oldPasswordError: true,
      })
    } else {
      this.setState({
        oldPasswordError: false,
      })
    }
    
    this.setState({
      oldPassword: value,
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
    if(value === this.passwordConf){
      this.setState({
        passwordConfError: false,
      })
    }else{
      this.setState({
        passwordConfError: true,
      })
    }
    this.setState({
      password: value,
    })
  }

  onPasswordConfChange = value => {
    if (value.replace(/\s/g, '').length < 6) {
      this.setState({
        passwordConfError: true,
      })
    } else {
      this.setState({
        passwordConfError: false,
      })
    }
    if(value===this.state.password){
      this.setState({
        passwordConfError: false,
      })
    }else{
      this.setState({
        passwordConfError: true,
      })
    }
    this.setState({
      passwordConf: value,
    })
  }

  componentWillUnmount() {  

  }  

  render() {
    const { fetching,windowHeight } = this.props
    return (
      <KeyboardAwareScrollView
        resetScrollToCoords={{ x: 0, y: 0 }}
        scrollEnabled={false}
      >
        <View
          style={{
            alignItems: 'stretch',
            justifyContent: 'flex-start',
            backgroundColor: 'white',
          }}
        >
          <WhiteSpace />

          <InputItem
            type="password"
            placeholder="旧密码"
            maxLength={30}
            error={this.state.oldPasswordError}
            value={this.state.oldPassword}
            onChange={this.onOldPasswordChange}
          />
      
          <InputItem
            type="password"
            placeholder="新密码"
            maxLength={30}
            error={this.state.passwordError}
            value={this.state.password}
            onChange={this.onPasswordChange}
          />

          <InputItem
            type="password"
            placeholder="再输一次密码"
            error={this.state.passwordConfError}
            value={this.state.passwordConf}
            onChange={this.onPasswordConfChange}
          />

          <WhiteSpace />
          <Button style={styles.registerBtn} onClick={this.changePassword} type="primary">确定修改</Button>
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

export default ForgetPassword
