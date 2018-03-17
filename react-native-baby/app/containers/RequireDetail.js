import React, { Component } from 'react'
import { StyleSheet, View,ListView,Image,ImageBackground } from 'react-native'
import { connect } from 'react-redux'

import {Button, InputItem,Text,WhiteSpace,Toast,Modal } from 'antd-mobile'
import { CompanySelector } from '../components'

import { NavigationActions, createAction } from '../utils'
import {map} from 'lodash'

const alert = Modal.alert;
const operation = Modal.operation

@connect(({ login, requirement }) => ({ login, requirement }))
class RequireDetail extends Component {

  state = {
    
  }

  static navigationOptions = {
    title: '需求详情',
  }

  //进行渲染数据
  renderContent=(list) => {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    const dataSource = ds.cloneWithRows(list)

    return (

      <ListView
        initialListSize={1}
        dataSource={dataSource}
        renderRow={this.renderItem}
        style={{flex:1}}
        onEndReachedThreshold={10}
        enableEmptySections={true}
      />
    );
   }
  //渲染每一项的数据
  renderItem=(data)=>{
    return ( 
          <View style={{flex:1}}>
              <ImageBackground source={require('../images/ic_order_status_item_bg.png')} 
                     style={{height:35,marginLeft:10,width:'100%'}}>
                      {this.renderCenterContent(data)}
              </ImageBackground>
              <View style={{height:1}}/>
          </View>
    );
  }
  
  renderCenterContent=(data)=>{
    return (
       <View style={{marginLeft:15,marginTop:10}}>
          <View style={{flexDirection:'row'}}>
          <Text style={{color:'black',fontSize:14}}>{data.stepContent}</Text>
          <View style={{flex:1,alignItems:'flex-end',marginRight:10}}>
          <Text style={{color:'#777',fontSize:12,paddingRight:10}}>{data.doneTime}</Text></View>
          </View>
      </View>
    );
  }

  gotoDetail = (value) => {
    this.props.dispatch(NavigationActions.navigate({ routeName: 'ApplyDetail',params:{ applyDetail: value } }))
  }

  componentDidMount = () => {
    const {requirement} = this.props.requirement
    if(requirement.requireStatus === 'NEW'){
      this.props.dispatch(createAction('requirement/findApply')({
        requireCode : requirement.requireCode
      }))
    }else{
      this.props.dispatch(createAction('requirement/findTaskByRequireCode')({
      requireCode : requirement.requireCode
    }))
    }
  }

  selectPayWay = () => {
    operation([
      {text:'微信支付',onPress:()=>this.pay('wechatPay')},
      {text:'支付宝',onPress:()=>this.pay('alipay')}
    ])
  }

  pay = (payType) => {
    const { requirement: {requirement}} = this.props
    if('alipay' === payType){
      this.props.dispatch({type:'requirement/alipay',payload:{
        busiCode:requirement.requireCode,
        payAmount:requirement.feeAmount,
        busiType:'BZJ'
      },callback:this.payCallback})
    }else if('wechatPay' === payType){
      this.props.dispatch({type:'requirement/wechatPay',payload:{
        busiCode:requirement.requireCode,
        payAmount:requirement.feeAmount,
        busiType:'BZJ'
      },callback:this.payCallback})
    }
  }

  payCallback = () => {
    const { requirement: {task}} = this.props
    task.paid = true
    this.props.dispatch(createAction('requirement/updateState')({
      task
    }))
    Toast.success('支付成功！')
  }

  customerFinish = (task) => {
    this.props.dispatch(createAction('requirement/customerFinish')({
      task
    }))
  }

  comment = (task) => {

  }

  renderAction = (task) => {
    switch(task.taskStatus){
      case 'ARRV':
        if(!task.paid){
          return <Button type='primary' style={styles.actionBtn} onClick={()=>this.selectPayWay()}>支付</Button>
        }
        break;
      case 'PF':
        if(!task.paid){
          return <Button type='primary' style={styles.actionBtn} onClick={()=>this.selectPayWay()}>支付</Button>
        }else{
          return <Button type='primary' style={styles.actionBtn} 
          onClick={() => alert('请确定', '是否确定已完成工作?', [
            { text: '取消'},
            {
              text: '确定',
              onPress: () => this.customerFinish(task)
            },
          ])}
        >验收完成</Button>
        }
        break;
      case 'CF':
        return <Text>后台未收到支付信息，请稍后在查看</Text>
        break;
      case 'AF':
        return <Button type='primary' style={styles.actionBtn} onClick={()=>this.comment()}>发表评论</Button>
        break;
        
        
    }
  }

  render() {
    const {login:{userInfo}, requirement: {applies,requirement,task}} = this.props
    return (
      <View style={styles.container}>
        <InputItem style={styles.itemStyle} value={requirement.babyName} editable={false}>姓    名：</InputItem> 
        <InputItem style={styles.itemStyle} value={requirement.startTime} editable={false}>从：</InputItem> 
        <InputItem style={styles.itemStyle} value={requirement.endTime} editable={false}>到：</InputItem> 
        <InputItem style={styles.itemStyle} value={requirement.addrName} editable={false}>地    点：</InputItem> 
        <InputItem style={styles.itemStyle} value={map(requirement.items,(value) => value.itemName).join(',')} editable={false}>服务：</InputItem> 
        <InputItem style={styles.itemStyle} value={requirement.feeAmount + '元' + '           ' + '附加小费：' + '   ' + requirement.payMore} editable={false}>总费用：</InputItem> 
        <WhiteSpace size="xs" />
        <View style={styles.actionStyle}>
          {
            requirement.requireStatus === 'NEW' ? 
            <CompanySelector list={applies} clickHandle={this.gotoDetail}>客户</CompanySelector> : 
            <View style={{flex:2}}>
              <InputItem style={styles.itemStyle} labelNumber={7} value={requirement.companyName} editable={false}>接单者姓名：</InputItem>
              <InputItem style={styles.itemStyle} labelNumber={7} value={requirement.companyTel} editable={false}>接单者电话：</InputItem>
              <WhiteSpace size="xs" />
              <View style={{flex:6}}>
                {this.renderContent( task ? task.stepList : [] )}
              </View>
              {task && this.renderAction(task)}
            </View>
          }     
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
  itemStyle:{
    flex:1,
    backgroundColor:'white',
    marginLeft: 0,
    paddingLeft:20,
  },
  actionStyle:{
    flex:8,
  },
  actionBtn: {
    margin:10,
  }
})

export default RequireDetail
