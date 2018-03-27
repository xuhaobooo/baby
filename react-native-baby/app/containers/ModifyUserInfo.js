import React, { Component } from 'react'
import { StyleSheet, View, Text, ActivityIndicator, Image, Dimensions, KeyboardAvoidingView, TouchableOpacity,} from 'react-native'
import { connect } from 'react-redux'

import { createAction, NavigationActions } from '../utils'
import { Button, InputItem, WhiteSpace, Toast, TextareaItem,} from 'antd-mobile'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import * as ScreenUtil from '../utils/ScreenUtil'

@connect(({ userInfo, app }) => ({ ...userInfo, app }))
class Register extends Component {

  state = {
    nameError: false,
    name: null,
    note:null,
    tel:null,
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
        个人信息
      </Text>
    ),
    headerRight: <View />,
  }

  onModify = () => {
      const {position,userInfo} = this.props

      if (this.state.nameError || !this.state.name) {
        Toast.info('请输入两个字以上的名称',1)
        return
      }
      if (!position) {
        Toast.info('请点右边图标，在地图上选择一个建筑物',2)
        return
      }
    
    this.props.dispatch({
        type:'userInfo/updateUserInfo',
        payload:{
        id:userInfo.id,
        userName:this.state.name,
        addrName:position.label,
        addrPosX:position.posX,
        addrPosY:position.posY,
        note:this.state.note,
        },
        callback: this.afterModify
      }
    )
  }

  afterModify =() => {
    Toast.info('修改成功',1)
    this.props.dispatch(NavigationActions.back())
  }

  cancel = () => {
    this.props.dispatch(NavigationActions.back())
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
    const {position} = this.props
    this.props.dispatch(
      NavigationActions.navigate({
        routeName: 'BaiduMapPage',
        params: { position, showBtn: true,moduleName:'userInfo' },
      })
    )
  }

  componentDidMount() {
    const {userInfo} = this.props
    this.setState({name:userInfo.userName, note:userInfo.note,tel:userInfo.tel})
  }  

  render() {
    const { fetching } = this.props.app
    const {position,userInfo} = this.props

    const { windowHeight } = this.props.app
    return (
        <View
          style={{
            alignItems: 'stretch',
            justifyContent: 'flex-start',
            backgroundColor: 'white',
            flex:1,
          }}
        >
          {fetching && <ActivityIndicator style={styles.indecator} />}
          <WhiteSpace />

          <InputItem
            type="text"
            placeholder="姓名："
            maxLength={30}
            error={this.state.nameError}
            value={this.state.name}
            onChange={this.onNameChange}
          />

          <InputItem
            type="text"
            placeholder="电话："
            maxLength={30}
            value={this.state.tel}
            editable={false}
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
            <View style={{ flex: 8 }}>
              <InputItem
                labelNumber={7}
                style={{ flex: 8, backgroundColor: 'white' }}
                value={position && position.label}
                editable={false}
                placeholder="地点："
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

          <TextareaItem
            placeholder="自我介绍，能让人更好的了解您"
            value={this.state.note}
            rows={6}
            count={100}
            onChange={this.onNoteChange}
            style={{marginLeft:10,marginRight:10}}
          />
          <WhiteSpace />
          <Button style={styles.modifyBtn} onClick={this.onModify} type="primary">确定修改</Button>
        </View>
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

  modifyBtn: {
    margin: 10,
    marginTop: 15,
    
  },
})

export default Register
