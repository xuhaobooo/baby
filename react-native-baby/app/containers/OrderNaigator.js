import React, { Component } from 'react'
import { StyleSheet, View, Image, Text, FlatList,ScrollView} from 'react-native'
import { connect } from 'react-redux'

import {forEach, map} from 'lodash'
import * as ScreenUtil from '../utils/ScreenUtil'

import { NavigationActions, createAction } from '../utils'
import { Tabs, List, WhiteSpace } from 'antd-mobile'

const Item = List.Item;
const Brief = Item.Brief;

@connect(({ requirement }) => ({ ...requirement }))
class OrderNaigator extends Component {

  state = {
    
  }

  static navigationOptions = {
    headerTitle: (<Text style={{fontSize:ScreenUtil.setSpText(20),alignSelf:'center', textAlign:'center',flex:1, color:'#FF6600'}}>附近的需求</Text>),
    tabBarLabel: '接单',
    tabBarIcon: ({ focused, tintColor }) => (
      <Image
        style={[styles.icon, { tintColor: focused ? tintColor : 'gray' }]}
        source={require('../images/house.png')}
      />
    ),
  }

  gotoDetail = () => {
    this.props.dispatch(NavigationActions.navigate({ routeName: 'Detail' }))
  }

  onTabChange = (tab, index) => {
    const date = new Date()
    switch(index){
      case 0:
        this.props.dispatch(createAction('requirement/queryPendMyRequire')({
          startTime:this.getStartOfDate(date),
          endTime:this.getEndOfDate(date),
        }))
        break;
      case 1:
        date.setDate(date.getDate()+1);
        this.props.dispatch(createAction('requirement/queryPendMyRequire')({
          startTime:this.getStartOfDate(date),
          endTime:this.getEndOfDate(date),
        }))
        break;
      case 2:
        date.setDate(date.getDate()+2);
        this.props.dispatch(createAction('requirement/queryPendMyRequire')({
          startTime:this.getStartOfDate(date),
          endTime:this.getEndOfDate(date),
        }))
        break;
      default:
         break;
    }
  }

  onItemClick = (value) => {
    this.props.dispatch(NavigationActions.navigate({ routeName: 'ApplyRequireDetail', params:{requirement:value} }))
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
    this.props.dispatch(createAction('requirement/queryPendMyRequire')({
      startTime:this.getStartOfDate(date),
      endTime:this.getEndOfDate(date),
    }))
  }

  render() {
    const {pendRequireList} = this.props
    
    return (
      <View style={{flex:1}}>
      <Tabs tabs={this.tabs2}
        initialPage={0}
        onChange={this.onTabChange}
        renderTab={tab => <Text>{tab.title}</Text>}
        style={{flex:1,minHeight:16}}
      />
        <View style={{flex:20}}>
        <FlatList data={pendRequireList} extraData={this.state} keyExtractor={(item, index) => item.requireCode} 
          renderItem={({item})=><Item key={item.requireCode} style={item.applied?{backgroundColor:'#cfcfcf'}:{backgroundColor:'white'}}
            onClick={() => this.onItemClick(item)}
            arrow="horizontal"
            thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
            multipleLine>
              {map(item.items,(value) => value.itemName).join(',')}
              <Brief>姓名:{item.babyName}   年龄:{item.babyAge}    性别:{item.babySex}</Brief>
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

export default OrderNaigator
