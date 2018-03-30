import React, { Component } from 'react'
import { StyleSheet, View, Image, Text, FlatList, ImageBackground, TouchableOpacity} from 'react-native'
import { connect } from 'react-redux'

import {forEach, map} from 'lodash'
import * as ScreenUtil from '../utils/ScreenUtil'

import { NavigationActions, createAction } from '../utils'
import { Tabs, List, WhiteSpace,Button } from 'antd-mobile'

const Item = List.Item;
const Brief = Item.Brief;
var Platform = require('Platform'); 

@connect(({ requirement }) => ({ ...requirement }))
class MyRequire extends Component {

  constructor(props){
    super(props)
    _this = this
  }

  state = {
    curTab : 0,
  }

  static navigationOptions = {
    headerTitle: (<Text style={{fontSize:ScreenUtil.setSpText(20),alignSelf:'center', textAlign:'center',flex:1, color:'#FF6600'}}>已发订单</Text>),
    tabBarLabel: '已发订单',
    tabBarIcon: ({ focused, tintColor }) => (
      <Image
        style={[styles.icon, { tintColor: focused ? tintColor : 'gray' }]}
        source={require('../images/need.png')}
      />),
      headerLeft:<View/>,
      headerRight:(<TouchableOpacity onPress={() => {_this.refreshRequires()}} style={{marginRight:ScreenUtil.setSpText(10)}}>
      <Image style={{width:ScreenUtil.setSpText(20),height:ScreenUtil.setSpText(20),paddingLeft:0,paddingRight:0,}} 
        source={require('../images/refresh.png')} resizeMode='stretch' />
      </TouchableOpacity>
    ),
  }

  gotoDetail = () => {
    this.props.dispatch(NavigationActions.navigate({ routeName: 'Detail' }))
  }

  onTabChange = (tab, index) => {
    this.setState({
      curTab:index
    })
    const date = new Date()
    switch(index){
      case 0:
        this.props.dispatch(createAction('requirement/queryMyRequire')({
          startDate:this.getStartOfDate(date),
          endDate:this.getEndOfDate(date),
        }))
        this.setState({
          startDate:this.getStartOfDate(date),
          endDate:this.getEndOfDate(date),
        })
        break;
      case 1:
        date.setDate(date.getDate()+1);
        this.props.dispatch(createAction('requirement/queryMyRequire')({
          startDate:this.getStartOfDate(date),
          endDate:this.getEndOfDate(date),
        }))
        this.setState({
          startDate:this.getStartOfDate(date),
          endDate:this.getEndOfDate(date),
        })
        break;
      case 2:
        date.setDate(date.getDate()+7);
        this.props.dispatch(createAction('requirement/queryMyRequire')({
          startDate:this.getStartOfDate(new Date()),
          endDate:this.getEndOfDate(date),
        }))
        this.setState({
          startDate:this.getStartOfDate(new Date()),
          endDate:this.getEndOfDate(date),
        })
        break;
      case 3:
        date.setMonth(date.getMonth() - 1);
        this.props.dispatch(createAction('requirement/queryMyRequire')({
          startDate:this.getStartOfDate(date),
          endDate:this.getStartOfDate(new Date()),
        }))
        this.setState({
          startDate:this.getStartOfDate(date),
          endDate:this.getStartOfDate(new Date()),
        })
        break;
      default:
         break;
    }
    
  }

  onItemClick = (value) => {
    this.props.dispatch(createAction('requirement/updateState')({ requirement:value }))
    this.props.dispatch(NavigationActions.navigate({ routeName: 'RequireDetail' }))
  }

  tabs2 = [
    { title: '今天' },
    { title: '明天'},
    { title: '一周內' },
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

  refreshRequires = () =>{
    const {startDate,endDate} = this.state
    this.props.dispatch(createAction('requirement/queryMyRequire')({
      startDate,
      endDate,
    }))
  }

  refreshTasks = () =>{
    const {startDate,endDate} = this.state
    this.props.dispatch(createAction('requirement/queryMyTask')({
      startDate,
      endDate,
    }))
  }

  componentDidMount = () => {
    const date = new Date()
    this.props.dispatch(createAction('requirement/queryMyRequire')({
      startDate:this.getStartOfDate(date),
      endDate:this.getEndOfDate(date),
    }))
    this.setState({
      startDate:this.getStartOfDate(date),
      endDate:this.getEndOfDate(date),
    })
  }

  render() {
    const {myRequireList} = this.props
    return (
      <View style={{flex:1}}>
      <Tabs tabs={this.tabs2}
        onChange={this.onTabChange}
        renderTab={tab => <Text>{tab.title}</Text>}
        style={{flex:1,minHeight:ScreenUtil.setSpText(14)}}
      />
        <View style={{flex:20}}>
        <FlatList data={myRequireList} extraData={this.state} keyExtractor={(item, index) => item.requireCode} 
          renderItem={({item})=><Item key={item.requireCode}
            style={{paddingLeft:10,marginBottom:3}}
            onClick={() => this.onItemClick(item)}
            arrow="horizontal"
            thumb={
              <View style={{alignItems:'center',marginRight:ScreenUtil.setSpText(10)}}>
                <TouchableOpacity disabled={true} style={{width:ScreenUtil.setSpText(32),height:ScreenUtil.setSpText(32),
                backgroundColor:'#336699',color:'#ffffff',alignContent:'center',
                alignItems:'center',borderRadius:5,borderWidth:0,paddingTop:Platform.OS === 'android'?0:ScreenUtil.setSpText(5)}}>
                  <Text style={{fontSize:ScreenUtil.setSpText(20),color:'#ffffff'}}>
                    {this.generateStatus(item.requireStatus)}
                  </Text>
                </TouchableOpacity>
                {item.paid?<Text style={{fontSize:ScreenUtil.setSpText(8),color:'#FF9966'}}>已支付</Text>:
                  <Text style={{fontSize:ScreenUtil.setSpText(8),color:'#000000'}}>未支付</Text>
                }
              </View>    
            }
            multipleLine> 
              {map(item.items,(value) => value.itemName).join(',') + '    总金额：' + item.feeAmount}
              <Brief>姓名:{item.babyName}   年龄:{item.babyAge}    性别:{item.babySex}</Brief>
              <Brief>从{item.startTime.substring(5,16)} 到 {item.endTime.substring(5,16)}</Brief>
              <Brief>接单者:{item.companyName}</Brief>
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

export default MyRequire
