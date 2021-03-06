import React, { Component } from 'react'
import { StyleSheet, View, Image, Text, FlatList,TouchableOpacity} from 'react-native'
import { connect } from 'react-redux'

import {forEach, map} from 'lodash'
import * as ScreenUtil from '../utils/ScreenUtil'

import { NavigationActions, createAction } from '../utils'
import { Tabs, List, WhiteSpace } from 'antd-mobile'
var Platform = require('Platform'); 

const Item = List.Item;
const Brief = Item.Brief;

@connect(({ evalution }) => ({ ...evalution }))
class OrderNaigator extends Component {

  state = {
    
  }

  static navigationOptions = {
    headerTitle: (
      <Text
        style={{ fontSize: ScreenUtil.setSpText(20), alignSelf: 'center', textAlign: 'center', flex: 1,color: '#FF6600',
        }}
      >评价记录</Text>
    ),
    headerRight: <View />,
  }

  gotoDetail = (value) => {
    this.props.dispatch(NavigationActions.navigate({ routeName: 'Detail',params:{evalutionInfo:value} }))
  }

  onTabChange = (tab, index) => {
    const date = new Date()
    switch(index){
      case 0:
        date.setDate(date.getDate()-3);
        this.props.dispatch(createAction('evalution/findMyEvalution')({
          startDate:this.getStartOfDate(date),
          endDate:this.getEndOfDate(new Date()),
        }))
        break;
      case 1:
        date.setDate(date.getDate()-7);
        this.props.dispatch(createAction('evalution/findMyEvalution')({
          startDate:this.getStartOfDate(date),
          endDate:this.getEndOfDate(new Date()),
        }))
        break;
      case 2:
        date.setDate(date.getMonth() - 1);
        this.props.dispatch(createAction('evalution/findMyEvalution')({
          startDate:this.getStartOfDate(date),
          endDate:this.getEndOfDate(new Date()),
        }))
        break;
      default:
         break;
    }
  }

  onItemClick = (value) => {
    this.props.dispatch(NavigationActions.navigate({ routeName: 'EvalutionDetail', params:{evalutionInfo:value} }))
  }

  tabs2 = [
    { title: '近三天' },
    { title: '一周内'},
    { title: '一月内' },
  ];

  getStartOfDate = (date) => {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' 00:00:00';
  }

  getEndOfDate = (date) => {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' 23:59:59';
  }

  componentDidMount = () => {
    const date = new Date()
    date.setDate(date.getDate()-3);
      this.props.dispatch(createAction('evalution/findMyEvalution')({
        startDate:this.getStartOfDate(date),
        endDate:this.getEndOfDate(new Date()),
      }))
  }

  render() {
    const {myEvalutionList} = this.props
    
    return (
      <View style={{flex:1}}>
      <Tabs tabs={this.tabs2}
        initialPage={0}
        onChange={this.onTabChange}
        renderTab={tab => <Text>{tab.title}</Text>}
        style={{flex:1,minHeight:16}}
      />
        <View style={{flex:20}}>
        <FlatList data={myEvalutionList} extraData={this.state} keyExtractor={(item, index) => 'list'+item.id} 
          renderItem={({item})=><Item key={'item'+item.id} style={{marginBottom:3}}
            onClick={() => this.onItemClick(item)}
            arrow="horizontal"
            thumb={
              <View style={{alignItems:'center',marginRight:ScreenUtil.setSpText(10)}}>
                <TouchableOpacity disabled={true} style={{width:ScreenUtil.setSpText(32),height:ScreenUtil.setSpText(32),
                backgroundColor:'#336699',color:'#ffffff',alignContent:'center',
                alignItems:'center',borderRadius:5,borderWidth:0,paddingTop:Platform.OS === 'android'?0:ScreenUtil.setSpText(5)}}>
                  <Text style={{fontSize:ScreenUtil.setSpText(20),color:'#ffffff'}}>
                    {item.level === 'LOW' ? '差' : item.level ==='MID' ? '中' : '好'}
                  </Text>
                </TouchableOpacity>
              </View>
            }
            multipleLine>
              {`姓名:${item.babyName}     年龄:${item.babyAge}      性别:${item.babySex==='M'?'男':'女'}`}
              <Brief>开始时间:{item.requireStartTime}</Brief>
              <Brief>{item.notes}</Brief>
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
