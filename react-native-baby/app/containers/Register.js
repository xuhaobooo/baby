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
    mobileError: false,
    mobile: null,
    passwordError: false,
    password: null,
    passwordConfError:false,
    passwordConf:null,
    cathcha: null,
    cathchaError: false,
    nameError: false,
    name: null,
    inviteError:false,
    invite:null,
    note:null,
    agree:false,
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

  onRegister = () => {
      const {position} = this.props
      if (this.state.mobileError || !this.state.mobile) {
        Toast.info('请输入11位的手机号码',1)
        return
      }
      if (this.state.cathchaError || !this.state.cathcha) {
        Toast.info('请输入六位验证码',1)
        return
      }
      if (this.state.nameError || !this.state.name) {
        Toast.info('请输入两个字以上的名称',1)
        return
      }
      if (!position) {
        Toast.info('请点右边图标，在地图上选择一个建筑物',2)
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
      if(!this.state.agree){
        Toast.info('您必须同意软件许可，才可以使用本软件',1)
        return
      }
    
    this.props.dispatch({
        type:'login/registUser',
        payload:{
        loginName: this.state.mobile.replace(/\s/g, ''),
        cathcha:this.state.cathcha,
        userName:this.state.name,
        password: this.state.password,
        addrName:position.label,
        addrPosX:position.posX,
        addrPosY:position.posY,
        note:this.state.note,
        visitCode:this.state.invite.replace(/\s/g, ''),
        },
        callback: this.afterRegister
      }
    )
  }

  afterRegister =() => {
    Toast.info('注册成功,请登录',1)
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

  onInviteChange = value => {
    if (value.replace(/\s/g, '').length === 11 || value.replace(/\s/g, '').length === 0) {
      this.setState({
        inviteError: false,
      })
    } else {
      this.setState({
        inviteError: true,
      })
    }
    this.setState({
      invite: value,
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

  onNameChange = value => {
    if (value.replace(/\s/g, '').length < 2) {
      this.setState({
        nameError: true,
      })
    }else{
      this.setState({
        nameError: false,
      })
    }
    this.setState({ name: value })
  }

  onNoteChange = value => {
    this.setState({
      note:value
    })
  }

  addrClick = () => {
    this.props.dispatch(
      NavigationActions.navigate({
        routeName: 'RegisterBaiduMap',
        params: { showBtn: true, moduleName: 'login' },
      })
    )
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
    const { fetching } = this.props.app
    const {position} = this.props
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
            style={styles.inputStyle}
          />

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'white',
              width: '100%',
              height:ScreenUtil.setSpText(32)
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
            type="text"
            placeholder="姓名"
            maxLength={30}
            error={this.state.nameError}
            value={this.state.name}
            onChange={this.onNameChange}
            style={styles.inputStyle}
          />

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'white',
              width: '100%',
              height:ScreenUtil.setSpText(32)
            }}
          >
            <View style={{ flex: 8 }}>
              <InputItem
                labelNumber={7}
                error={this.state.positionError}
                style={{ flex: 8, backgroundColor: 'white' }}
                value={position && position.label}
                editable={false}
                style={styles.inputStyle}
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
            style={styles.inputStyle}
          />

          <InputItem
            type="password"
            placeholder="再输一次密码"
            error={this.state.passwordConfError}
            value={this.state.passwordConf}
            onChange={this.onPasswordConfChange}
            style={styles.inputStyle}
          />

          <InputItem
            type="phone"
            placeholder="邀请者手机号码(已注册的)"
            value={this.state.invite}
            error={this.state.inviteError}
            onChange={this.onInviteChange}
            style={styles.inputStyle}
          />

          <TextareaItem
            placeholder="自我介绍，能让人更好的了解您"
            value={this.state.note}
            rows={6}
            count={100}
            blurOnSubmit={true}
            underlineColorAndroid="transparent"
            onChange={this.onNoteChange}
            style={{marginLeft:10,marginRight:10}}
          />
          <View style={{ marginTop: 5, marginLeft: 20 }}>
            <Checkbox
              key="viewPermit"
              style={{
                width: ScreenUtil.setSpText(14),
                height: ScreenUtil.setSpText(14),
              }}
              onChange={e => this.setState({ agree: e.target.checked })}
              checked={this.state.agree}
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
          <Button style={styles.registerBtn} onClick={this.onRegister} type="primary">注册</Button>
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
  inputStyle : {
    height:ScreenUtil.setSpText(32),
  }
})

export default Register
