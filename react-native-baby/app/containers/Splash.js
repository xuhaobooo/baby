import React, { Component } from 'react'
import { StyleSheet, View, Image, Dimensions, Linking} from 'react-native'
import { connect } from 'react-redux'
import { Modal } from 'antd-mobile'

import { createAction, NavigationActions } from '../utils'

const alert = Modal.alert
@connect(({ app }) => ({ ...app }))
class Splash extends Component {
  static navigationOptions = {
    title: 'Splash',
  }

  afterUpdate = () => {
    const {updateFlag} = this.props
    if(updateFlag){
      alert('更新提示', '有新的APP需要更新，为了更好的使用请选择更新?', [
        { text: '取消',
          onPress: () => this.props.dispatch(createAction('login/tokenLogin')()),
        },
        {
          text: '确定',
          onPress: () => {
            Linking.openURL("http://www.co-mama.cn/appDownload/index.html")
          }
        },
      ])
    }else{
      this.props.dispatch(createAction('login/tokenLogin')())
    }
  }

  componentDidMount = () => {
    this.props.dispatch({type:'app/getLastVersion',callback:this.afterUpdate,payload:{}})
    
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
