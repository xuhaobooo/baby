import React, { Component } from 'react'
import { StyleSheet, View, Text, ActivityIndicator, Image, Dimensions, KeyboardAvoidingView  } from 'react-native'
import { connect } from 'react-redux'

import { createAction, NavigationActions } from '../utils'
import {Button, InputItem, Picker, List, WhiteSpace, Toast } from 'antd-mobile'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

@connect(({ login, app }) => ({ ...login, app }))
class Login extends Component {

  state = {
    mobileError:true,
    mobile:'',
    passwordError:true,
    password:'',
    guest:null,
  }

  static navigationOptions = {
    title: 'Login',
  }

  onLogin = () => {
    if(this.state.mobileError || this.state.passwordError){
      Toast.info('请输入正确的账号密码');
      return;
    }
    this.props.dispatch(createAction('login/login')({
      loginName:this.state.mobile.replace(/\s/g, ''),
      password:this.state.password,
    }))
  }

  onClose = () => {
    this.props.dispatch(NavigationActions.back())
  }

  onChange = (value) => {
    if (value.replace(/\s/g, '').length < 11) {
      this.setState({
        mobileError: true,
      });
    } else {
      this.setState({
        mobileError: false,
      });
    }
    this.setState({
      mobile:value,
    });
  }

  onPasswordChange = (value) => {
    if (value.replace(/\s/g, '').length < 6) {
      this.setState({
        passwordError: true,
      });
    } else {
      this.setState({
        passwordError: false,
      });
    }
    this.setState({
      password:value,
    });
  }

  onGuestChange = (value) => {
    this.setState(
      {guest:value}
    )
    this.props.dispatch(createAction('login/login')({
      loginName:value[0],
      password:'123456',
    }))
  }


  render() {
    const { fetching } = this.props.app
    const guestData=[{value:'13312312312',label:'需求方'},{value:'13412312312',label:'供应方'}]
    const {windowHeight} = this.props.app
    return (
      <KeyboardAwareScrollView 
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled={false}>
      <View style={{
        height:windowHeight, 
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        backgroundColor:'white'}} >
        {fetching && <ActivityIndicator style={styles.indecator}/>}
            <View style={styles.imgContainer}>
            <Image style={styles.img} source={require('../images/1024.png')} resizeMode='stretch'/>
            </View>

            <InputItem type="phone"
            placeholder="手机号码" 
            style={{flex:1.5}}
            error={this.state.mobileError} 
            value={this.state.mobile} 
            onChange={this.onChange} ></InputItem>

            <InputItem type="password" 
              placeholder="密码" 
              style={{flex:1.5}}
              error={this.state.passwordError} 
              value={this.state.password} 
              onChange={this.onPasswordChange}></InputItem>

            <Button style={styles.loginBtn} onClick={this.onLogin} type="primary">登录</Button>
            <View style={styles.actionBar}>
              <Text style={{flex:1,marginLeft:20}} type="ghost">注册</Text>
              <Text style={{flex:1, textAlign:'right', marginRight:20}}>找回密码</Text>
            </View>
            <WhiteSpace style={{flex:2,flexBasis:0}}/>           
            <Picker style={styles.guest} data={guestData} cols={1} title="选择类型" onChange={this.onGuestChange} value={this.state.guest}>
              <List.Item arraw="horizontal">游客登录</List.Item>
            </Picker>
          </View>
        </KeyboardAwareScrollView>
    )
  }
}

const {width:windowWidth, height:windowHeight} = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flex:1,
    alignItems: 'stretch',
        justifyContent: 'flex-start',
        backgroundColor:'white'
  },
  indecator:{
    position:'absolute', 
    top:windowHeight*0.43, 
    left: windowWidth*0.5-10,
    zIndex:999,
  },
  imgContainer: {
    flex:8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  img:{
    width:windowWidth*0.4,
    height:windowWidth*0.4,
  },
  loginBtn: {
    margin:10,
    marginTop:15,
    flex:1.5
  },
  actionBar : {
    flexDirection:'row',
    flex:1
  },
  guest:{
    flex:1,
  }
})

export default Login
