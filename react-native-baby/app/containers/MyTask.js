import React, { Component } from 'react'
import { StyleSheet, View, Image, Text, FlatList,TouchableOpacity} from 'react-native'
import { connect } from 'react-redux'

import {forEach, map} from 'lodash'
import * as ScreenUtil from '../utils/ScreenUtil'

import { NavigationActions, createAction } from '../utils'
import { Tabs, List, WhiteSpace } from 'antd-mobile'

const Item = List.Item;
const Brief = Item.Brief;
var Platform = require('Platform'); 

@connect(({ requirement }) => ({ ...requirement }))
class MyTask extends Component {

  constructor(props){
    super(props)
    _this = this
  }

  state = {
    
  }

  static navigationOptions = {
    headerTitle: (<Text style={{fontSize:ScreenUtil.setSpText(20),alignSelf:'center', textAlign:'center',flex:1, color:'#FF6600'}}>已接订单</Text>),
    tabBarLabel: '已接订单',
    tabBarIcon: ({ focused, tintColor }) => (
      <Image
        style={[styles.icon, { tintColor: focused ? tintColor : 'gray' }]}
        source={require('../images/task.png')}
      />),
    headerLeft:<View/>,
    headerRight:(<TouchableOpacity onPress={() => {
      global.app._store.dispatch(createAction('requirement/queryMyTask')({
        startDate:global.app._store.getState().requirement.taskQueryStart,
        endDate:global.app._store.getState().requirement.taskQueryEnd,
      }))
    }} style={{marginRight:ScreenUtil.setSpText(10)}}>
      <Image style={{width:ScreenUtil.setSpText(20),height:ScreenUtil.setSpText(20),paddingLeft:0,paddingRight:0,}} 
        source={require('../images/refresh.png')} resizeMode='stretch' />
      </TouchableOpacity>
    )
  }

  onTabChange = (tab, index) => {
    const date = new Date()
    switch(index){
      case 0:
        this.props.dispatch(createAction('requirement/queryMyTask')({
          startDate:this.getStartOfDate(date),
          endDate:this.getEndOfDate(date),
        }))
        this.props.dispatch(createAction('requirement/updateState')({ 
          taskQueryStart:this.getStartOfDate(date),
          taskQueryEnd:this.getEndOfDate(date),
         }))
        break;
      case 1:
        date.setDate(date.getDate()+1);
        this.props.dispatch(createAction('requirement/queryMyTask')({
          startDate:this.getStartOfDate(date),
          endDate:this.getEndOfDate(date),
        }))
        this.props.dispatch(createAction('requirement/updateState')({ 
          taskQueryStart:this.getStartOfDate(date),
          taskQueryEnd:this.getEndOfDate(date),
         }))
        break;
      case 2:
        date.setDate(date.getDate()+7);
        this.props.dispatch(createAction('requirement/queryMyTask')({
          startDate:this.getStartOfDate(new Date()),
          endDate:this.getEndOfDate(date),
        }))
        this.props.dispatch(createAction('requirement/updateState')({ 
          taskQueryStart:this.getStartOfDate(new Date()),
          taskQueryEnd:this.getEndOfDate(date),
         }))
        break;
      case 3:
        date.setMonth(date.getMonth() - 3);
        this.props.dispatch(createAction('requirement/queryMyTask')({
          startDate:this.getStartOfDate(date),
          endDate:this.getEndOfDate(new Date()),
        }))
        this.props.dispatch(createAction('requirement/updateState')({ 
          taskQueryStart:this.getStartOfDate(date),
          taskQueryEnd:this.getEndOfDate(new Date()),
         }))
        break;
      default:
         break;
    }
  }

  onItemClick = (value) => {
    this.props.dispatch(createAction('requirement/updateState')({ taskDetail:value }))
    this.props.dispatch(NavigationActions.navigate({ routeName: 'TaskDetail', params:{ taskCode:value.taskCode } }))
  }

  tabs2 = [
    { title: '今天' },
    { title: '明天'},
    { title: '一周内' },
    { title: '历史记录' },
  ];

  getStartOfDate = (date) => {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' 00:00:00';
  }

  getEndOfDate = (date) => {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' 23:59:59';
  }

  generateStatus = (status) =>{
    switch(status){
      case 'NEW':
        return '新'
      case 'CONF':
        return '确'
      case 'ARRV':
        return '达'
      case 'PF':
        return '完'
      case 'CF':
        return '验'
      case 'AF':
        return '结'
      case 'CC':
        return '消'
      default:
        return '错'
    }
  }

  componentDidMount = () => {
    const date = new Date()
    this.props.dispatch(createAction('requirement/queryMyTask')({
      startDate:this.getStartOfDate(date),
      endDate:this.getEndOfDate(date),
    }))

    this.props.dispatch(createAction('requirement/updateState')({ 
      taskQueryStart:this.getStartOfDate(date),
      taskQueryEnd:this.getEndOfDate(date),
     }))
  }

  render() {
    const {myTaskList} = this.props
    
    return (
      <View style={{flex:1}}>
      <Tabs tabs={this.tabs2}
        initialPage={0}
        onChange={this.onTabChange}
        renderTab={tab => <Text>{tab.title}</Text>}
        style={{flex:1,minHeight:ScreenUtil.setSpText(14)}}
      />
        <View style={{flex:20}}>
        <FlatList data={myTaskList} extraData={this.state} keyExtractor={(item, index) => item.taskCode} 
          renderItem={({item})=><Item key={item.taskCode} style={item.taskStatus==='AF'?{backgroundColor:'#cfcfcf',marginBottom:3}:{backgroundColor:'white',marginBottom:3}}
            onClick={() => this.onItemClick(item)}
            arrow="horizontal"
            thumb={
              <View style={{alignItems:'center',marginRight:ScreenUtil.setSpText(10)}}>
                <TouchableOpacity disabled={true} style={{width:ScreenUtil.setSpText(32),height:ScreenUtil.setSpText(32),
                backgroundColor:'#336699',color:'#ffffff',alignContent:'center',
                alignItems:'center',borderRadius:5,borderWidth:0,paddingTop:Platform.OS === 'android'?0:ScreenUtil.setSpText(5)}}>
                  <Text style={{fontSize:ScreenUtil.setSpText(20),color:'#ffffff'}}>
                    {this.generateStatus(item.taskStatus)}
                  </Text>
                </TouchableOpacity>
                {item.paid?<Text style={{fontSize:ScreenUtil.setSpText(8),color:'#FF9966'}}>已支付</Text>:
                  <Text style={{fontSize:ScreenUtil.setSpText(8),color:'#000000'}}>未支付</Text>
                }
              </View>
            }
            multipleLine>
              {item.requireItems}
              <Brief>姓名:{item.babyName}   年龄:{item.babyAge}    性别:{item.babySex}</Brief>
              <Brief>起始时间:{item.requireStartTime}</Brief>
              <Brief>结束时间:{item.requireEndTime}</Brief>
            </Item>}>
          </FlatList>
          </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: ScreenUtil.setSpText(28),
    height: ScreenUtil.setSpText(28),
  },
  tabView: {
    flex:1,
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'flex-start',
  },
  list: {
    width: '100%'
  }
})

export default MyTask
