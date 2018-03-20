import React, { Component } from 'react'
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'

import { Button, InputItem, Text } from 'antd-mobile'
import { CompanySelector } from '../components'

import { NavigationActions, createAction } from '../utils'
import * as ScreenUtil from '../utils/ScreenUtil'
import { map } from 'lodash'

@connect()
class AppluRequire extends Component {
  state = {}

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
        需求详情
      </Text>
    ),
    headerRight: <View />,
  }

  applyRequire = requireCode => {
    this.props.dispatch(
      createAction('requirement/applyRequire')({
        requireCode,
      })
    )
  }

  componentDidMount = () => {}

  showBaiduMap = requirement => {
    const position = {
      posX: requirement.addrPosX,
      posY: requirement.addrPosY,
      label: requirement.addrName,
    }
    this.props.dispatch(
      NavigationActions.navigate({
        routeName: 'BaiduMapPage',
        params: { position, showBtn: false },
      })
    )
  }

  render() {
    const { navigation } = this.props
    const requirement = navigation.state.params.requirement
    return (
      <View style={styles.container}>
        <InputItem
          labelNumber={5}
          style={styles.itemStyle}
          value={requirement.babyName}
          editable={false}
        >
          姓名：
        </InputItem>
        <InputItem
          labelNumber={5}
          style={styles.itemStyle}
          value={requirement.startTime}
          editable={false}
        >
          从：
        </InputItem>
        <InputItem
          labelNumber={5}
          style={styles.itemStyle}
          value={requirement.endTime}
          editable={false}
        >
          到：
        </InputItem>
        <View style={{flexDirection:'row',alignItems: 'center',backgroundColor:'#ffffff',width:'100%',height:ScreenUtil.setSpText(31)}}>
          <View style={{flex:8}}>
            <InputItem labelNumber={5} style={{flex:8,backgroundColor:'#ffffff',height:'99%',marginLeft: 0,paddingLeft:20,}} 
              value={requirement.addrName} editable={false}>地    点</InputItem>
          </View>

          <TouchableOpacity onPress={() => this.showBaiduMap(requirement)}>
          <Image style={{marginTop:3,width:ScreenUtil.setSpText(20),height:ScreenUtil.setSpText(20),paddingLeft:0,paddingRight:0,}} 
            source={require('../images/map.png')} resizeMode='stretch' />
          </TouchableOpacity>
        </View>
        <InputItem
          labelNumber={5}
          style={styles.itemStyle}
          value={map(requirement.items, value => value.itemName).join(',')}
          editable={false}
        >
          服务：
        </InputItem>
        <InputItem
          labelNumber={5}
          style={styles.itemStyle}
          value={
            `${requirement.feeAmount}元` +
            `           ` +
            `附加小费：` +
            `   ${requirement.payMore}`
          }
          editable={false}
        >
          总费用：
        </InputItem>
        <View style={styles.actionStyle}>
          {requirement.applied ? (
            <Button type="primary" style={{ margin: 10 }} disabled>
              已抢单
            </Button>
          ) : (
            <Button
              type="primary"
              style={{ margin: 10 }}
              onClick={() => this.applyRequire(requirement.requireCode)}
            >
              抢单
            </Button>
          )}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  itemStyle: {
    flex: 1,
    backgroundColor: 'white',
    marginLeft: 0,
    paddingLeft: 20,
  },
  actionStyle: {
    flex: 7,
    marginTop: 5,
  },
})

export default AppluRequire
