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

@connect(({ money }) => ({ ...money }))
class OrderNaigator extends Component {

  state = {
    
  }

  static navigationOptions = {
    headerTitle: (
      <Text
        style={{ fontSize: ScreenUtil.setSpText(20), alignSelf: 'center', textAlign: 'center', flex: 1,color: '#FF6600',
        }}
      >交易记录</Text>
    ),
    headerRight: <View />,
  }

  gotoDetail = () => {
    this.props.dispatch(NavigationActions.navigate({ routeName: 'Detail' }))
  }

  onTabChange = (tab, index) => {
    const date = new Date()
    switch(index){
      case 0:
        date.setDate(date.getDate()-3);
        this.props.dispatch(createAction('money/myMoneyFlow')({
          startDate:this.getStartOfDate(date),
          endDate:this.getEndOfDate(new Date()),
        }))
        break;
      case 1:
        date.setDate(date.getDate()-7);
        this.props.dispatch(createAction('money/myMoneyFlow')({
          startDate:this.getStartOfDate(date),
          endDate:this.getEndOfDate(new Date()),
        }))
        break;
      case 2:
        date.setDate(date.getMonth() - 1);
        this.props.dispatch(createAction('money/myMoneyFlow')({
          startDate:this.getStartOfDate(date),
          endDate:this.getEndOfDate(new Date()),
        }))
        break;
      default:
         break;
    }
  }

  onItemClick = (value) => {
    //this.props.dispatch(NavigationActions.navigate({ routeName: 'MoneyFlowDetail', params:{orderRecord:value.orderRecordCode} }))
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

  convertType = (busiType) => {
    switch (busiType) {
      case "WORK":
          return "业务收入"
          break;
      case "IVT":
          return "邀请收入"
          break;
      case "BZJ":
          return "保证金余额支出"
          break;
      case "TX":
          return "提现支出"
          break;
      case "TK":
          return "退款收入"
          break;
      case "BZJ-WC":
          return "保证金微信支付"
          break;
      case "BZJ-ALI":
          return "保证金支付宝支付"
          break;
      default:
          return "其他"
          break;
  }
  }

  componentDidMount = () => {
    const date = new Date()
    date.setDate(date.getDate()-3);
      this.props.dispatch(createAction('money/myMoneyFlow')({
        startDate:this.getStartOfDate(date),
        endDate:this.getEndOfDate(new Date()),
      }))
  }

  render() {
    const {moneyFlow} = this.props
    console.log(moneyFlow)
    return (
      <View style={{flex:1}}>
      <Tabs tabs={this.tabs2}
        initialPage={0}
        onChange={this.onTabChange}
        renderTab={tab => <Text>{tab.title}</Text>}
        style={{flex:1,minHeight:16}}
      />
        <View style={{flex:20}}>
        <FlatList data={moneyFlow} extraData={this.state} keyExtractor={(item, index) => ''+item.id} 
          renderItem={({item})=><Item key={'item'+item.id} style={{marginBottom:1}}
            onClick={() => this.onItemClick(item)}
            arrow="horizontal"
            thumb={<View style={{alignItems:'center',marginRight:ScreenUtil.setSpText(10)}}>
              <TouchableOpacity disabled={true} style={{width:ScreenUtil.setSpText(32),height:ScreenUtil.setSpText(32),
              backgroundColor:'#336699',color:'#ffffff',alignContent:'center',
              alignItems:'center',borderRadius:5,borderWidth:0,paddingTop:Platform.OS === 'android'?0:ScreenUtil.setSpText(5)}}>
                <Text style={{fontSize:ScreenUtil.setSpText(20),color:'#ffffff'}}>
                  {item.amount>0 ? '入':'出'}
                </Text>
              </TouchableOpacity>
            </View>}
            multipleLine>
              {`${item.amount}        类型:${this.convertType(item.busiType)}`} 
              <Brief>时间:{item.recordTime}</Brief>
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
