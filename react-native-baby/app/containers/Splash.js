import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native'
import { connect } from 'react-redux'

import { createAction, NavigationActions } from '../utils'

@connect(({ login }) => ({ ...login }))
class Splash extends Component {
  static navigationOptions = {
    title: 'Splash',
  }

  componentDidMount = () => {
    this.props.dispatch(createAction('login/tokenLogin')())
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.img}
          source={require('../images/splash.png')}
          resizeMode="stretch"
        />
      </View>
    )
  }
}

const { width: windowWidth, height: windowHeight } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    height: windowHeight,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },
  img: {
    width: windowWidth,
    height: windowHeight,
  },
})

export default Splash
