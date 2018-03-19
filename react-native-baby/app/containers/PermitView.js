import React, { Component } from 'react'
import { StyleSheet, WebView } from 'react-native'
import { connect } from 'react-redux'

import { createAction, NavigationActions } from '../utils'
import { Button } from '../components'

@connect(({ login }) => ({ ...login }))
class PermitView extends Component {
  static navigationOptions = {
    title: '软件许可协议',
  }

  render() {
    return <WebView source={require('./terms.html')} style={styles.container} />
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },
})

export default PermitView
