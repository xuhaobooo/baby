import React, { Component } from 'react'
import { StyleSheet, View, Image, Text, FlatList,ScrollView} from 'react-native'
import { connect } from 'react-redux'

import {forEach, map} from 'lodash'

import { NavigationActions, createAction } from '../utils'
import { Tabs, List, WhiteSpace } from 'antd-mobile'

const Item = List.Item;
const Brief = Item.Brief;

@connect(({ requirement }) => ({ ...requirement }))
class MyTask extends Component {

  state = {
    
  }

  static navigationOptions = {
    title: '我的任务',
    tabBarLabel: '任务',
    tabBarIcon: ({ focused, tintColor }) => (
      <Image
        style={[styles.icon, { tintColor: focused ? tintColor : 'gray' }]}
        source={require('../images/house.png')}
      />
    ),
  }

  onTabChange = (tab, index) => {
    const date = new Date()
    switch(index){
      case 0:
        this.props.dispatch(createAction('requirement/queryMyTask')({
          startDate:this.getStartOfDate(date),
          endDate:this.getEndOfDate(date),
        }))
        break;
      case 1:
        date.setDate(date.getDate()+1);
        this.props.dispatch(createAction('requirement/queryMyTask')({
          startDate:this.getStartOfDate(date),
          endDate:this.getEndOfDate(date),
        }))
        break;
      case 2:
        date.setDate(date.getDate()+2);
        this.props.dispatch(createAction('requirement/queryMyTask')({
          startDate:this.getStartOfDate(date),
          endDate:this.getEndOfDate(date),
        }))
        break;
      default:
         break;
    }
  }

  onItemClick = (value) => {
    this.props.dispatch(NavigationActions.navigate({ routeName: 'TaskDetail', params:{task:value} }))
  }

  tabs2 = [
    { title: '今天' },
    { title: '明天'},
    { title: '后天' },
  ];

  getStartOfDate = (date) => {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' 00:00:00';
  }

  getEndOfDate = (date) => {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' 23:59:59';
  }

  componentDidMount = () => {
    const date = new Date()
    this.props.dispatch(createAction('requirement/queryMyTask')({
      startDate:this.getStartOfDate(date),
      endDate:this.getEndOfDate(date),
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
        style={{flex:1}}
      />
        <View style={{flex:10}}>
        <FlatList data={myTaskList} extraData={this.state} keyExtractor={(item, index) => item.taskCode} 
          renderItem={({item})=><Item key={item.taskCode} style={item.taskStatus==='AF'?{backgroundColor:'#cfcfcf'}:{backgroundColor:'white'}}
            onClick={() => this.onItemClick(item)}
            arrow="horizontal"
            thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
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
    width: 32,
    height: 32,
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
