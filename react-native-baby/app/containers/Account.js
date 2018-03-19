import React, { Component } from 'react'
import { StyleSheet, View, Image, Text } from 'react-native'
import { connect } from 'react-redux'

import { Button } from '../components'
import * as ScreenUtil from '../utils/ScreenUtil'

import { createAction, NavigationActions } from '../utils'

@connect()
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

  gotoLogin = () => {
    this.props.dispatch(NavigationActions.navigate({ routeName: 'Login' }))
  }

  logout = () => {
    this.props.dispatch(createAction('login/logout')())
  }

  render() {
    const { login } = this.props
    return (
      <View style={styles.container}>
        <Button text="Logout" onPress={this.logout} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: ScreenUtil.setSpText(32),
    height: ScreenUtil.setSpText(32),
  },
})

export default Account
