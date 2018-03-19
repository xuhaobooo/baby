import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'

import { Button, InputItem, Text, Modal } from 'antd-mobile'
import { CompanySelector } from '../components'

import { NavigationActions, createAction } from '../utils'
import { map } from 'lodash'
import * as ScreenUtil from '../utils/ScreenUtil'

const alert = Modal.alert

@connect(({ login, requirement }) => ({ login, requirement }))
class TaskDetail extends Component {
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
        任务详情
      </Text>
    ),
    headerRight: <View />,
  }

  arrive = task => {
    this.props.dispatch(
      createAction('requirement/arrive')({
        task,
      })
    )
  }

  complete = task => {
    this.props.dispatch(
      createAction('requirement/complete')({
        task,
      })
    )
  }

  renderAction = task => {
    switch (task.taskStatus) {
      case 'CONF':
        return (
          <Button
            type="primary"
            style={styles.actionBtn}
            onClick={() =>
              alert('请确定', '是否确定到达目的地?', [
                { text: '取消' },
                {
                  text: '确定',
                  onPress: () => this.arrive(task),
                },
              ])
            }
          >
            到达
          </Button>
        )
      case 'ARRV':
        return (
          <Button
            type="primary"
            style={styles.actionBtn}
            onClick={() =>
              alert('请确定', '是否确定已完成工作?', [
                { text: '取消' },
                {
                  text: '确定',
                  onPress: () => this.complete(task),
                },
              ])
            }
          >
            完成
          </Button>
        )
    }
  }

  componentDidMount = () => {}

  render() {
    const { navigation } = this.props
    const task = navigation.state.params.task
    return (
      <View style={styles.container}>
        <InputItem
          style={styles.itemStyle}
          value={task.babyName}
          editable={false}
        >
          姓名：
        </InputItem>
        <InputItem
          style={styles.itemStyle}
          value={task.requireStartTime}
          editable={false}
        >
          {' '}
          从：
        </InputItem>
        <InputItem
          style={styles.itemStyle}
          value={task.requireEndTime}
          editable={false}
        >
          {' '}
          到：
        </InputItem>
        <InputItem
          style={styles.itemStyle}
          value={task.addrName}
          editable={false}
        >
          地点：
        </InputItem>
        <InputItem
          style={styles.itemStyle}
          value={task.requireItems}
          editable={false}
        >
          服务：
        </InputItem>
        <InputItem
          style={styles.itemStyle}
          value={
            `${task.feeAmount}元` +
            `           ` +
            `附加小费：` +
            `   ${task.payMore}`
          }
          editable={false}
        >
          总费用：
        </InputItem>
        <View style={styles.actionStyle}>{this.renderAction(task)}</View>
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
    backgroundColor: 'white',
  },
  actionBtn: {
    margin: 10,
  },
})

export default TaskDetail
