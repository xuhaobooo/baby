import React, { Component } from 'react'
import { StyleSheet, View, Image, Text,ImageBackground } from 'react-native'
import { connect } from 'react-redux'

import * as ScreenUtil from '../utils/ScreenUtil'

import { createAction, NavigationActions } from '../utils'
import { List,Button } from 'antd-mobile'

const Item = List.Item
const Brief = Item.Brief
@connect(({ login }) => ({ ...login }))
class Account extends Component {
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
        我的
      </Text>
    ),
    tabBarLabel: '我的',
    tabBarIcon: ({ focused, tintColor }) => (
      <Image
        style={[styles.icon, { tintColor: focused ? tintColor : 'gray' }]}
        source={require('../images/person.png')}
      />
    ),
  }

  logout = () => {
    this.props.dispatch(createAction('login/logout')())
  }

  render() {
    const { userInfo } = this.props
    return (
      <View style={styles.container}>
        <View style={{flex:5}}>
        <ImageBackground
          source={require('../images/BG_daiwanchengv.png')}
          style={{flex:1,width:'100%',alignItems:'center'}}
        >
          <Image style={{width:ScreenUtil.setSpText(120),height:ScreenUtil.setSpText(120),marginTop:30,borderRadius:ScreenUtil.setSpText(120)/2}} source={require('../images/DefaultAvatarx.png')}/>
          <Text style={{fontSize:28,color:'#ffffff',height:ScreenUtil.setSpText(80),marginTop:10}}>{userInfo.userName}</Text>
        </ImageBackground>
          
        </View>
        <List style={{flex:4}}>
            <Item key='tixian' onClick={() => this.props.dispatch(NavigationActions.navigate({ routeName: 'Balance' }))} arrow="horizontal">
              提取余额
              <Brief></Brief>
            </Item>
            <Item key='money' onClick={() => this.props.dispatch(NavigationActions.navigate({ routeName: 'MoneyFlow' }))} arrow="horizontal">
              交易记录
              <Brief></Brief>
            </Item>
            <Item key='money' onClick={() => this.props.dispatch(NavigationActions.navigate({ routeName: 'EvalutionList' }))} arrow="horizontal">
              评价记录
              <Brief></Brief>
            </Item>
            <Item key='accountInfo' onClick={() => this.props.dispatch(NavigationActions.navigate({ routeName: 'ChangePassword' }))} arrow="horizontal">
              密码修改
              <Brief></Brief>
            </Item>
        </List>
        <Button type="primary" onClick={this.logout} style={{flex:1,margin:10}}>注销</Button>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    //justifyContent: 'center',
  },
  icon: {
    width: ScreenUtil.setSpText(32),
    height: ScreenUtil.setSpText(32),
  },
})

export default Account
