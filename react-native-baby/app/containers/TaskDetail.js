import React, { Component } from 'react'
import { StyleSheet, View, TouchableOpacity,Image,ImageBackground } from 'react-native'
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
    headerRight: <TouchableOpacity onPress={() => {_this.refreshTask()}} style={{marginRight:ScreenUtil.setSpText(10)}}>
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

  cancelTask = task => {
    alert('请确定', '是否取消此订单，不能恢复?', [
      { text: '取消' },
      {
        text: '确定',
        onPress: () => this.props.dispatch(
          createAction('requirement/cancelTask')({
            task,
          })
        ),
      },
    ])
  }

  renderAction = task => {
    if(task){
    switch (task.taskStatus) {
      case 'CONF':
        return (
          <View style={{flexDirection:'row'}}>
          <Button
            type="primary"
            style={{margin: 5,flex:3}}
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
          <Button style={{margin: 5,flex:1,flexDirection:'row'}} onClick={() => this.cancelTask(task)}>取消</Button>
          </View>
        )
      case 'ARRV':
        return (
          <View style={{flexDirection:'row'}}>
          <Button
            type="primary"
            style={{margin: 5,flex:3}}
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
          {(!task.paid) && <Button style={{margin: 5,flex:1,flexDirection:'row'}} onClick={() => this.cancelTask(task)}>取消</Button>}
          </View>
        )
        case 'PF':
        return (
          <View>
            <View style={{flexDirection:'row'}}>
              <Button type="primary" style={{margin: 5,flex:3}} disabled={true}>
                发表评价
              </Button>
              {(!task.paid) && <Button style={{margin: 5,flex:1,flexDirection:'row'}} onClick={() => this.cancelTask(task)}>取消</Button>}
            </View>
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
              <View style={{height:150,backgroundColor:'#ffffff',padding:5}}>
                <Text>已给评价：{ev.level === 'LOW'? '差评':ev.level==='HIGH'?'好评':'中评'}</Text>
                <ImageBackground
                  resizeMode='stretch'
                  source={require('../images/k.png')}
                  style={{ height:120, width: '100%', padding:5 }}
                >
                <View style={{paddingTop:5}}>
                  <Text>{ev.notes}</Text>
                </View>
                </ImageBackground>
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

  refreshTask =()=>{
    const { taskDetail } = this.props.requirement
    taskDetail && this.initTask(taskDetail)
  }

  initTask = (taskDetail) => {
    this.setState({initFlag:true})
    this.props.dispatch(
      createAction('requirement/findTaskByTaskCode')({
        taskCode:taskDetail.taskCode,
      })
    )
    this.findEvalution(taskDetail)
    
  }

  comment = () => {
    const { taskDetail } = this.props.requirement
    const requirement = {
      companyCode : taskDetail.sendUserCode,
      requireCode: taskDetail.requireCode,
      userCode: taskDetail.getUserCode,
    }
    this.props.dispatch(NavigationActions.navigate({ routeName: 'AddEvalution' ,params:{requirement} }))
  }

  findEvalution = (taskDetail) =>{
    if(taskDetail && taskDetail.taskStatus === 'AF'){
      this.props.dispatch(
        createAction('evalution/findEvaByBcode')({
          requireCode: taskDetail.requireCode
        })
      )
    }
  }

  showBaiduMap = task => {
    const position = {
      posX: task.addrPosX,
      posY: task.addrPosY,
      label: task.addrName,
    }
    this.props.dispatch(
      NavigationActions.navigate({
        routeName: 'BaiduMapPage',
        params: { position, showBtn: false },
      })
    )
  }

  componentDidMount = () => {
    const { taskDetail } = this.props.requirement
    taskDetail && this.initTask(taskDetail)
  }

  render() {
    var { taskDetail } = this.props.requirement
    if(!this.state.initFlag && taskDetail){
      this.initTask(taskDetail)
    }
    return (
      <View style={styles.container}>

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
        <View style={{flexDirection:'row',backgroundColor:'#ffffff',width:'100%',height:ScreenUtil.setSpText(30)}}>
          <View style={{flex:8}}>
            <InputItem labelNumber={5} style={{flex:8,backgroundColor:'#ffffff',height:'99%',marginLeft: 0,paddingLeft:20,}} 
              value={taskDetail && taskDetail.addrName} editable={false}>地点：</InputItem>
          </View>

          <TouchableOpacity onPress={() => this.showBaiduMap(taskDetail)}>
          <Image style={{marginTop:2,width:ScreenUtil.setSpText(20),height:ScreenUtil.setSpText(20),paddingLeft:0,paddingRight:0,}} 
            source={require('../images/map.png')} resizeMode='stretch' />
          </TouchableOpacity>
        </View>
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
        <View style={{ flex: 6,backgroundColor:'#ffffff',paddingTop:5 }}>
          <Timeline list={taskDetail ? taskDetail.stepList : []} />
        </View>
        <WhiteSpace size="xs" />
        {taskDetail && this.renderAction(taskDetail)}
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
    height:ScreenUtil.setSpText(30),
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
