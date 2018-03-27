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
    mobileError: false,
    mobile: null,
    passwordError: false,
    password: null,
    passwordConfError:false,
    passwordConf:null,
    cathcha: null,
    cathchaError: false,
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
        重置密码
      </Text>
    ),
    headerRight: <View />,
  }

  resetPassword = () => {
      if (this.state.mobileError || !this.state.mobile) {
        Toast.info('请输入11位的手机号码',1)
        return
      }
      if (this.state.cathchaError || !this.state.cathcha) {
        Toast.info('请输入六位验证码',1)
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
        type:'login/resetPassword',
        payload:{
        loginName: this.state.mobile.replace(/\s/g, ''),
        captcha:this.state.cathcha,
        password: this.state.password,
        },
        callback: this.afterResetPassword
      }
    )
  }

  afterResetPassword =() => {
    Toast.info('密码重置成功',1)
    this.props.dispatch(NavigationActions.back())
  }

  cancel = () => {
    this.props.dispatch(NavigationActions.back())
  }

  onMobileChange = value => {
    if (value.replace(/\s/g, '').length !== 11) {
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

  onCathchaChange = (value) => {
    if (value.replace(/\s/g, '').length !== 6) {
      this.setState({
        cathchaError: true,
      })
    }else{
      this.setState({
        cathchaError: false,
      })
    }
    this.setState({
      cathcha: value,
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

  getCathcha = () => {
  
    if (this.state.mobile && this.state.mobile.replace(/\s/g, '').length === 11) {
      this.props.dispatch(
        createAction('login/getCathcha')({
          mobile: this.state.mobile.replace(/\s/g, ''),
        })      
      )
      this.setState({
        cathchaTime:30
      })
      this.state.timer = setInterval(  
        () => {
          if(this.state.cathchaTime === 0){
            clearInterval(this.timer);
            return
          }
          this.setState({cathchaTime:this.state.cathchaTime-1})
        },  
        1000 
      );
    } else {
      Toast.info('请输入正确的手机号码',1)
    }
    
  }

  componentWillUnmount() {  
    // 如果存在this.timer，则使用clearTimeout清空。  
    // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear  
    this.state.timer && clearInterval(this.state.timer);  
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
                type="number"
                placeholder="手机验证码"
                error={this.state.cathchaError}
                value={this.state.cathcha}
                maxLength={6}
                onChange={this.onCathchaChange}
                style={{height: '100%'}}
              />
            </View>
              <Button type={this.state.cathchaTime >0 ? 'ghost':'primary'} disabled={this.state.cathchaTime >0} onClick={this.getCathcha} style={{height:'80%',marginRight:10}}>
              {this.state.cathchaTime >0 ? this.state.cathchaTime : '获取'}
              </Button>
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
            placeholder="再输一次密码"
            error={this.state.passwordConfError}
            value={this.state.passwordConf}
            onChange={this.onPasswordConfChange}
          />

          <WhiteSpace />
          <Button style={styles.registerBtn} onClick={this.resetPassword} type="primary">确定重置</Button>
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
