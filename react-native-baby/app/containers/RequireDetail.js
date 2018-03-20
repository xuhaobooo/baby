import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Image,
  ImageBackground,
} from 'react-native'
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
  state = {showAddModal:false}

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

  selectCompany = value => {
    this.props.dispatch(
      NavigationActions.navigate({
        routeName: 'ApplyDetail',
        params: { applyDetail: value },
      })
    )
  }

  componentDidMount = () => {
    const { requirement } = this.props.requirement
    if (requirement.requireStatus === 'NEW') {
      this.props.dispatch(
        createAction('requirement/findApply')({
          requireCode: requirement.requireCode,
        })
      )
    } else {
      this.props.dispatch(
        createAction('requirement/findTaskByRequireCode')({
          requireCode: requirement.requireCode,
        })
      )
    }
  }

  selectPayWay = () => {
    operation([
      { text: '微信支付', onPress: () => this.pay('wechatPay') },
      { text: '支付宝', onPress: () => this.pay('alipay') },
    ])
  }

  pay = payType => {
    const { requirement: { requirement } } = this.props
    if (payType === 'alipay') {
      this.props.dispatch({
        type: 'requirement/alipay',
        payload: {
          busiCode: requirement.requireCode,
          payAmount: requirement.feeAmount,
          busiType: 'BZJ',
        },
        callback: this.payCallback,
      })
    } else if (payType === 'wechatPay') {
      this.props.dispatch({
        type: 'requirement/wechatPay',
        payload: {
          busiCode: requirement.requireCode,
          payAmount: requirement.feeAmount,
          busiType: 'BZJ',
        },
        callback: this.payCallback,
      })
    }
  }

  payCallback = () => {
    const { requirement: { task } } = this.props
    task.paid = true
    this.props.dispatch(
      createAction('requirement/updateState')({
        task,
      })
    )
    Toast.success('支付成功！')
  }

  customerFinish = task => {
    this.props.dispatch(
      createAction('requirement/customerFinish')({
        task,
      })
    )
  }

  comment = task => {
    this.setState({showAddModal:true})
  }

  renderAction = task => {
    switch (task.taskStatus) {
      case 'CONF':
        return <Text>等待接单者到达工作地点，接单者到达后您可以选择支付或等待接单者完成工作后支付</Text>
        break;
      case 'ARRV':
        if (!task.paid) {
          return (
            <Button
              type="primary"
              style={styles.actionBtn}
              onClick={() => this.selectPayWay()}
            >
              支付
            </Button>
          )
        }
        break
      case 'PF':
        if (!task.paid) {
          return (
            <Button
              type="primary"
              style={styles.actionBtn}
              onClick={() => this.selectPayWay()}
            >
              支付
            </Button>
          )
        }else{
        return (
          <Button
            type="primary"
            style={styles.actionBtn}
            onClick={() =>
              alert('请确定', '是否确定已完成工作?', [
                { text: '取消' },
                {
                  text: '确定',
                  onPress: () => this.customerFinish(task),
                },
              ])
            }
          >
            验收完成
          </Button>
        )}

        break
      case 'CF':
        return <Text>正在获取支付信息，请稍后在查看</Text>
        break
      case 'CC':
        return <Text>订单已取消</Text>
        break
      case 'AF':
        const {login,evalution} = this.props
        if(!evalution || evalution.length ===0){
          return (
            <Button
              type="primary"
              style={styles.actionBtn}
              onClick={() => this.comment()}
            >
              发表评论
            </Button>
          )
        }else(evalution.length ===1 && evalution[0].sendUserCode !==login.)
        
        break
    }
  }

  onEvalutionChange = value => {
    this.setState({evalution:value})
  }

  addEvalution = () => {
    this.props.dispatch({
      type:'evalution/addEvalution',
      payload:{},
      callback:this.afterEvalutionAdd
      }
    )
  }

  afterEvalutionAdd = () => {
    this.setState({showAddModal:false,level:null,evalution:null})
    Toast.success('发表成功',1)
    this.findEvalution()
  }

  findEvalution = () =>{
    const { requirement: { requirement }} = this.props
    this.props.dispatch(
      createAction('evalution/findEvaByBcode')({
        requirementCode: requirement.requireCode
      })
    )
  }

  render() {
    const {
      login: { userInfo },
      requirement: { applies, requirement, task },
    } = this.props
    return (
      <View style={styles.container}>
        <Modal
          style={{width:'90%'}}
          visible={this.state.showAddModal}
          transparent
          maskClosable={false}
          title="发表评论"
          footer={[{ text: '取消', onPress: () => { this.setState({showAddModal:false}) } },
          { text: '确定', onPress: () => { this.addEvalution() } }]}
        >
          <WhiteSpace/>
          <View style={{flexDirection: 'row',borderBottomWidth:1,borderBottomColor:'#eaeaea'}}>
            <View style={{flex:1,alignItems:'center'}}><Checkbox style={{width:ScreenUtil.setSpText(14),height:ScreenUtil.setSpText(14)}} key={requirement.requireCode} 
              onChange={(e)=>this.setState({level:'LOW'})} checked={this.state.level==='LOW'}>
              <Text>差评</Text>
            </Checkbox>
            </View>
            <View style={{flex:1,alignItems:'center'}}>
            <Checkbox style={{width:ScreenUtil.setSpText(14),height:ScreenUtil.setSpText(14)}} key={requirement.requireCode} 
              onChange={(e)=>this.setState({level:'MID'})} checked={this.state.level==='MID'}>
              <Text>中评</Text>
            </Checkbox>
            </View>
            <View style={{flex:1,alignItems:'center'}}>
            <Checkbox style={{width:ScreenUtil.setSpText(14),height:ScreenUtil.setSpText(14)}} key={requirement.requireCode} 
              onChange={(e)=>this.setState({level:'HIGH'})} checked={this.state.level==='HIGH'}>
              <Text>好评</Text>
            </Checkbox>
            </View>
          </View>
          <TextareaItem
            placeholder="写点评价吧，您的评价对其他人很重要"
            value={this.state.evalution}
            rows={6}
            count={100}
            onChange={this.onEvalutionChange}
          />
          <WhiteSpace style={{height:10,backgroundColor:'white',}} />

        </Modal>
        <InputItem
          labelNumber={5}
          style={styles.itemStyle}
          value={requirement.babyName}
          editable={false}
        >
          姓 名：
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
        <InputItem
          labelNumber={5}
          style={styles.itemStyle}
          value={requirement.addrName}
          editable={false}
        >
          地 点：
        </InputItem>
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
        <WhiteSpace size="xs" />
        <View style={styles.actionStyle}>
          {requirement.requireStatus === 'NEW' ? (
            <CompanySelector list={applies} clickHandle={this.selectCompany}>
              客户
            </CompanySelector>
          ) : (
            <View style={{ flex: 2 }}>
              <InputItem
                style={styles.itemStyle}
                labelNumber={7}
                value={requirement.companyName}
                editable={false}
              >
                接单者姓名：
              </InputItem>
              <InputItem
                style={styles.itemStyle}
                labelNumber={7}
                value={requirement.companyTel}
                editable={false}
              >
                接单者电话：
              </InputItem>
              <WhiteSpace size="xs" />
              <View style={{ flex: 6 }}>
                <Timeline list={task ? task.stepList : []} />
              </View>
              {task && this.renderAction(task)}
            </View>
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
    flex: 8,
  },
  actionBtn: {
    margin: 10,
  },
})

export default RequireDetail
