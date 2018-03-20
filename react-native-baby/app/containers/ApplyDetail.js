import React, { Component } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { connect } from 'react-redux'

import { Button, InputItem, TextareaItem, Modal } from 'antd-mobile'

import { NavigationActions, createAction } from '../utils'
import * as ScreenUtil from '../utils/ScreenUtil'

const alert = Modal.alert
@connect()
class ApplyDetail extends Component {
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
        接单者
      </Text>
    ),
    headerRight: <View />,
  }

  selectApply = applyInfo => {
    alert('请确定', `是否选择${applyInfo.userName}?`, [
      { text: '取消' },
      {
        text: '确定',
        onPress: () => this.props.dispatch(
          createAction('requirement/selectApply')({
            applyId: applyInfo.id,
            requireCode: applyInfo.requireCode,
          })
        ),
      },
    ]) 
    
  }

  render() {
    const { navigation } = this.props
    const applyInfo = navigation.state.params.applyDetail
    return (
      <View style={styles.container}>
        <InputItem
          style={styles.itemStyle}
          value={applyInfo.userName}
          editable={false}
        >
          接单者：
        </InputItem>
        <InputItem
          style={styles.itemStyle}
          value={applyInfo.userRole}
          editable={false}
        >
          类 型：
        </InputItem>
        <InputItem
          style={styles.itemStyle}
          value={applyInfo.tel}
          editable={false}
        >
          电 话：
        </InputItem>
        <InputItem
          style={styles.itemStyle}
          value={`${applyInfo.creditValue}`}
          editable={false}
        >
          信任值：
        </InputItem>
        <InputItem
          style={styles.itemStyle}
          value={applyInfo.addrName}
          editable={false}
        >
          地 点：
        </InputItem>
        <InputItem
          style={styles.itemStyle}
          value={`${applyInfo.distance} 公里`}
          editable={false}
        >
          距 离：
        </InputItem>
        <TextareaItem
          style={{ marginTop: 5 }}
          title="简介"
          placeholder="click the button below to focus"
          editable={false}
          value={applyInfo.note}
        />
        <Button
          type="primary"
          style={{ margin: 10 }}
          onClick={() => this.selectApply(applyInfo)}
        >
          选择此接单者
        </Button>
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
    backgroundColor: 'white',
    marginLeft: 0,
    paddingLeft: 20,
  },
  actionStyle: {
    flex: 7,
    marginTop: 5,
  },
})

export default ApplyDetail
