import React, { Component } from 'react'
import { StyleSheet, View, TouchableOpacity,Image } from 'react-native'
import { connect } from 'react-redux'

import { Button, InputItem, Text, Modal,WhiteSpace,Checkbox,TextareaItem,Toast } from 'antd-mobile'
import { CompanySelector } from '../components'

import { NavigationActions, createAction } from '../utils'
import { map } from 'lodash'
import * as ScreenUtil from '../utils/ScreenUtil'
import Timeline from '../components/Timeline'

const alert = Modal.alert

@connect(({ userInfo, requirement,evalution }) => ({ ...userInfo, requirement,evalution }))
class TaskDetail extends Component {

  constructor(props){
    super(props)
    _this = this
  }

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
        任务详情
      </Text>
    ),
    headerRight: <TouchableOpacity onPress={() => {_this.refresh()}} style={{marginRight:ScreenUtil.setSpText(10)}}>
    <Image style={{width:ScreenUtil.setSpText(20),height:ScreenUtil.setSpText(20),paddingLeft:0,paddingRight:0,}} 
      source={require('../images/refresh.png')} resizeMode='stretch' />
    </TouchableOpacity>,
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
    if(task){
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
        case 'PF':
        return (
          <View>
          <Button
            type="primary"
            style={styles.actionBtn}
            disabled={true}
          >
            发表评价
          </Button>
          <Text style={{textAlign:'center',color:'pink'}}>等待用户支付并确认后，您可进行评价</Text>
          </View>
        )
          break
        case 'CF':
          return <Text style={{textAlign:'center',color:'pink'}}>正在获取支付信息，请稍后在查看</Text>
          break
        case 'CC':
          return <Text style={{textAlign:'center',color:'pink'}}>订单已取消</Text>
          break
          case 'AF':
          const {userInfo,evalution} = this.props
          
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
              <View style={{height:100,backgroundColor:'#ffffff',paddingLeft:10,paddingRight:10}}>
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
    }}
  }

  refresh =()=>{
    const { taskDetail } = this.props.requirement
    this.props.dispatch(
      createAction('requirement/findTaskByTaskCode')({
        taskCode:taskDetail.taskCode,
      })
    )
    
  }

  comment = task => {
    this.setState({showAddModal:true})
  }

  addEvalution = () => {
    const { taskDetail } = this.props.requirement
    this.props.dispatch({
      type:'evalution/addEvalution',
      payload:{level:this.state.level,notes:this.state.evalution,receiveUserCode:taskDetail.sendUserCode,
        requireCode:taskDetail.requireCode,sendUserCode:taskDetail.getUserCode},
      callback:this.afterEvalutionAdd
      }
    )
  }

  afterEvalutionAdd = () => {
    this.setState({showAddModal:false,level:null,evalution:null})
    Toast.success('发表成功',2)
    this.findEvalution()
  }

  findEvalution = () =>{
    const { taskDetail } = this.props.requirement
    if(taskDetail && taskDetail.taskStatus === 'AF'){
      this.props.dispatch(
        createAction('evalution/findEvaByBcode')({
          requireCode: taskDetail.requireCode
        })
      )
    }
  }

  componentDidMount = () => {
    const { taskDetail } = this.props.requirement
    taskDetail.taskStatus === 'AF' && this.findEvalution()  
  }

  render() {
    var { taskDetail } = this.props.requirement
  
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
            <View style={{flex:1,alignItems:'center'}}><Checkbox style={{width:ScreenUtil.setSpText(14),height:ScreenUtil.setSpText(14)}} key='low' 
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
          value={taskDetail && taskDetail.babyName}
          editable={false}
        >
          姓名：
        </InputItem>
        <InputItem
          labelNumber={5}
          style={styles.itemStyle}
          value={taskDetail && taskDetail.requireStartTime}
          editable={false}
        >
          从：
        </InputItem>
        <InputItem
          labelNumber={5}
          style={styles.itemStyle}
          value={taskDetail && taskDetail.requireEndTime}
          editable={false}
        >
          到：
        </InputItem>
        <InputItem
          labelNumber={5}
          style={styles.itemStyle}
          value={taskDetail && taskDetail.addrName}
          editable={false}
        >
          地点：
        </InputItem>
        <InputItem
          labelNumber={5}
          style={styles.itemStyle}
          value={taskDetail && taskDetail.requireItems}
          editable={false}
        >
          服务：
        </InputItem>
        <InputItem
          labelNumber={5}
          style={styles.itemStyle}
          value={
            taskDetail && (taskDetail.feeAmount + '元' + (taskDetail.paid ? '(已付)':'(未付)'))
          }
          editable={false}
        >
          总费用：
        </InputItem>
        <WhiteSpace size="xs" />
        <View style={{ flex: 6 }}>
          <Timeline list={taskDetail ? taskDetail.stepList : []} />
        </View>
        {this.renderAction(taskDetail)}
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
    marginTop: 5,
    backgroundColor: 'white',
  },
  actionBtn: {
    margin: 10,
  },
})

export default TaskDetail
