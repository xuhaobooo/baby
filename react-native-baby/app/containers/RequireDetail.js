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

@connect(({ userInfo, requirement,evalution }) => ({ ...userInfo, requirement,evalution }))
class RequireDetail extends Component {

  constructor(props){
    super(props)
    _this = this
  }

  state = {showAddModal:false,level:null,evalution:null,initFlag:false}

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
    headerRight: <TouchableOpacity onPress={() => {_this.refresh()}} style={{marginRight:ScreenUtil.setSpText(10)}}>
    <Image style={{width:ScreenUtil.setSpText(20),height:ScreenUtil.setSpText(20),paddingLeft:0,paddingRight:0,}} 
      source={require('../images/refresh.png')} resizeMode='stretch' />
    </TouchableOpacity>,
  }

  selectCompany = value => {
    this.props.dispatch(
      NavigationActions.navigate({
        routeName: 'ApplyDetail',
        params: { applyDetail: value },
      })
    )
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
    task.stepList.push({stepContent:'用户支付',doneTime:DateUtil.formatTimeFull(new Date())})
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
    console.log(task.taskStatus)
    switch (task.taskStatus) {
      case 'CONF':
        return (
          <View>
          <Button
            type="primary"
            style={styles.actionBtn}
            disabled={true}
          >
            支付
          </Button>
          <Text style={{textAlign:'center',color:'pink'}}>等待接单者到达工作地点后您可以进行支付</Text>
          </View>
        )
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
        }else{
          return (
            <Button
              type="primary"
              style={styles.actionBtn}
              disabled={true}
            >
              完成验收
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
            完成验收
          </Button>
        )}

        break
      case 'CF':
        return <Text style={{textAlign:'center',color:'pink'}}>正在获取支付信息，请稍后在查看</Text>
        break
      case 'CC':
        return <Text style={{textAlign:'center',color:'pink'}}>订单已取消</Text>
        break
      case 'AF':
        const {userInfo,evalution} = this.props
        console.log(userInfo)
        console.log(evalution)
        if(!evalution.EvaList || evalution.EvaList.length ===0){
          return (
            <Button
              type="primary"
              style={styles.actionBtn}
              onClick={() => this.comment()}
            >
              发表评论
            </Button>
          )
        }else if(evalution.EvaList.length ===1 && evalution.EvaList[0].sendUserCode !==userInfo.userCode){
          return (
            <Button
              type="primary"
              style={styles.actionBtn}
              onClick={() => this.comment()}
            >
              发表评论
            </Button>
          )
        }else{
          var ev;
          if(evalution.EvaList[0].sendUserCode === userInfo.userCode){
            ev = evalution.EvaList[0]
          }else{
            ev=evalution.EvaList[1]
          }
          return (
            <View style={{height:100,backgroundColor:'#ffffff',paddingLeft:10,paddingRight:10,marginBottom:5,marginTop:5}}>
              <Text>已给评价：{ev.level === 'LOW'? '差评':ev.level==='HIGH'?'好评':'中评'}</Text>
              <Text>{ev.notes}</Text>
            </View>
          )
        }
        break
      default:
        return (<View style={{heigth:50}}>
          <Text>错误状态</Text>
        </View>)
    }
  }

  addEvalution = () => {
    const {
      requirement: { requirement },
    } = this.props
    this.props.dispatch({
      type:'evalution/addEvalution',
      payload:{level:this.state.level,notes:this.state.evalution,receiveUserCode:requirement.companyCode,
        requireCode:requirement.requireCode,sendUserCode:requirement.userCode},
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
        requireCode: requirement.requireCode
      })
    )
  }

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

  refresh =()=>{
    const { requirement } = this.props.requirement
    if(requirement){
      this.props.dispatch(
        createAction('requirement/findRequire')({
          requireCode:requirement.requireCode,
        })
      )
      this.initTaskData(requirement)
    } 
    
  }

  initTaskData = (requirement) => {
    if (requirement.requireStatus === 'NEW') {
      this.props.dispatch(
        createAction('requirement/findApply')({
          requireCode: requirement.requireCode,
        })
      )
    }else if (requirement.requireStatus === 'AF') {
      this.props.dispatch(
        createAction('requirement/findTaskByRequireCode')({
          requireCode: requirement.requireCode,
        })
      )
      this.findEvalution()
    }
    else {
      this.props.dispatch(
        createAction('requirement/findTaskByRequireCode')({
          requireCode: requirement.requireCode,
        })
      )
    }
    
  }

  componentDidMount = () => {
    const { requirement } = this.props.requirement
    if(requirement){
      this.initTaskData(requirement)
      this.setState({initFlag:true})
    }

    this.props.dispatch(createAction('requirement/queryAlertDict')({
    }))
  }

  render() {
    const {
      userInfo,
      requirement: { applies, requirement, task, alertDict },
    } = this.props

    if(!this.state.initFlag && requirement){
      this.initTaskData(requirement)
      this.setState({initFlag:true})
    }

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
            <View style={{flex:1,alignItems:'center'}}>
            <Checkbox style={{width:ScreenUtil.setSpText(14),height:ScreenUtil.setSpText(14)}} key='low' 
              onChange={(e)=>this.setState({level:'LOW'})} checked={this.state.level==='LOW'}>
              <Text>差评</Text>
            </Checkbox>
            </View>
            <View style={{flex:1,alignItems:'center'}}>
            <Checkbox style={{width:ScreenUtil.setSpText(14),height:ScreenUtil.setSpText(14)}} key='mid' 
              onChange={(e)=>this.setState({level:'MID'})} checked={this.state.level==='MID'}>
              <Text>中评</Text>
            </Checkbox>
            </View>
            <View style={{flex:1,alignItems:'center'}}>
            <Checkbox style={{width:ScreenUtil.setSpText(14),height:ScreenUtil.setSpText(14)}} key='high' 
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
            returnKeyType ='done'
            underlineColorAndroid="transparent"
            onChange={(value) => this.setState({evalution:value})}
          />
          <WhiteSpace style={{height:10,backgroundColor:'white',}} />

        </Modal>
        <InputItem
          labelNumber={5}
          style={styles.itemStyle}
          value={requirement && requirement.babyName}
          editable={false}
        >
          姓名：
        </InputItem>
        <InputItem
          labelNumber={5}
          style={styles.itemStyle}
          value={requirement && requirement.startTime}
          editable={false}
        >
          从：
        </InputItem>
        <InputItem
          labelNumber={5}
          style={styles.itemStyle}
          value={requirement && requirement.endTime}
          editable={false}
        >
          到：
        </InputItem>
        <View style={{flexDirection:'row',alignItems: 'center',backgroundColor:'#ffffff',width:'100%',height:ScreenUtil.setSpText(31)}}>
          <View style={{flex:8}}>
            <InputItem labelNumber={5} style={{flex:8,backgroundColor:'#ffffff',height:'99%',marginLeft: 0,paddingLeft:20,}} 
              value={requirement && requirement.addrName} editable={false}>地点：</InputItem>
          </View>

          <TouchableOpacity onPress={() => this.showBaiduMap(requirement)}>
          <Image style={{marginTop:3,width:ScreenUtil.setSpText(20),height:ScreenUtil.setSpText(20),paddingLeft:0,paddingRight:0,}} 
            source={require('../images/map.png')} resizeMode='stretch' />
          </TouchableOpacity>
        </View>

        <InputItem
          labelNumber={5}
          style={styles.itemStyle}
          value={requirement && map(requirement.items, value => value.itemName).join(',')}
          editable={false}
        >
          服务：
        </InputItem>
        <InputItem
          labelNumber={5}
          style={styles.itemStyle}
          value={
            requirement && (
            requirement.feeAmount + '元' + (requirement.paid ? '(已付)':'(未付)'))
          }
          editable={false}
        >
          总费用：
        </InputItem>
        <WhiteSpace size="xs" />
        <View style={styles.actionStyle}>
          {requirement && (requirement.requireStatus === 'NEW' ? (
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
                接单者：
              </InputItem>
              <InputItem
                style={styles.itemStyle}
                labelNumber={7}
                value={requirement.companyTel}
                editable={false}
              >
                电话：
              </InputItem>            
              <WhiteSpace size="xs" />
              <View style={{ flex: 6 }}>
                <Timeline list={task ? task.stepList : []} />
              </View>
              {task && (task.taskStatus ==='CONF' || task.taskStatus ==='ARRV') && alertDict && alertDict.length > 0 && 
                <Text style={{marginLeft:ScreenUtil.setSpText(15),fontSize:18,color:'red',marginTop:20,marginBottom:20}}>{alertDict[0].dicLabel}</Text>}
              <WhiteSpace size="xs" />
              {task && this.renderAction(task)}
            </View>
          ))}
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
    flex: 10,
  },
  actionBtn: {
    margin: 10,
  },
})

export default RequireDetail
