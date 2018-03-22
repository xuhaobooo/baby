import React, { Component } from 'react'
import { StyleSheet, View, Image, ImageBackground, TouchableOpacity} from 'react-native'
import { connect } from 'react-redux'

import { Button, InputItem, Text, WhiteSpace, Toast, Modal,Checkbox,TextareaItem } from 'antd-mobile'
import { CompanySelector } from '../components'
import * as ScreenUtil from '../utils/ScreenUtil'
import Timeline from '../components/Timeline'

import { NavigationActions, createAction } from '../utils'
import { map } from 'lodash'

const alert = Modal.alert
const operation = Modal.operation

@connect(({ login, requirement,evalution }) => ({ login, requirement,evalution }))
class RequireDetail extends Component {
  state = {showAddModal:false,level:null,evalution:null}

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
        评价详情
      </Text>
    ),
    headerRight: <View />,
  }

  componentDidMount = () => {
  }

  render() {
    const { navigation } = this.props
    const evalutionInfo = navigation.state.params.evalutionInfo

    return (
      <View style={styles.container}>
        <InputItem labelNumber={5} style={styles.itemStyle} value={evalutionInfo.babyName} editable={false} >姓 名：</InputItem>
        <InputItem labelNumber={5} style={styles.itemStyle} value={evalutionInfo.requireStartTime} editable={false} >从：</InputItem>
        <InputItem labelNumber={5} style={styles.itemStyle} value={evalutionInfo.requireEndTime} editable={false} >到：</InputItem>
        <InputItem labelNumber={5} style={styles.itemStyle} value={evalutionInfo.addrName} editable={false}>地点：</InputItem>
        <InputItem labelNumber={5} style={styles.itemStyle} value={evalutionInfo.requireItems} editable={false}>服务：</InputItem>
        <InputItem labelNumber={5} style={styles.itemStyle} value={''+evalutionInfo.feeAmount} editable={false}>总费用：</InputItem>
        <WhiteSpace size="xs" />
        <TextareaItem
            placeholder=""
            value={evalutionInfo.notes}
            rows={6}
            editable={false}
          />
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
    flex: 10,
  },
  actionBtn: {
    margin: 10,
  },
})

export default RequireDetail
