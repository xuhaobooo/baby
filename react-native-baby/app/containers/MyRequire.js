import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Image,
  Text,
  FlatList,
  ImageBackground,
  TouchableOpacity,
} from 'react-native'
import { connect } from 'react-redux'

import { forEach, map } from 'lodash'
import * as ScreenUtil from '../utils/ScreenUtil'

import { NavigationActions, createAction } from '../utils'
import { Tabs, List, WhiteSpace, Button } from 'antd-mobile'

const Item = List.Item
const Brief = Item.Brief

@connect(({ requirement }) => ({ ...requirement }))
class MyRequire extends Component {
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
        我的发布
      </Text>
    ),
    tabBarLabel: '需求',
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
    const { curTab } = this.props
    if (curTab === index) {
      return
    }
    const date = new Date()
    switch (index) {
      case 0:
        this.props.dispatch(
          createAction('requirement/queryMyRequire')({
            startDate: this.getStartOfDate(date),
            endDate: this.getEndOfDate(date),
            curTab: 0,
          })
        )
        break
      case 1:
        date.setDate(date.getDate() + 1)
        this.props.dispatch(
          createAction('requirement/queryMyRequire')({
            startDate: this.getStartOfDate(date),
            endDate: this.getEndOfDate(date),
            curTab: 1,
          })
        )
        break
      case 2:
        date.setDate(date.getDate() + 2)
        this.props.dispatch(
          createAction('requirement/queryMyRequire')({
            startDate: this.getStartOfDate(date),
            endDate: this.getEndOfDate(date),
            curTab: 1,
          })
        )
        break
      case 3:
        date.setDate(date.getDate() + 7)
        this.props.dispatch(
          createAction('requirement/queryMyRequire')({
            startDate: this.getStartOfDate(new Date()),
            endDate: this.getEndOfDate(date),
            curTab: 2,
          })
        )
        break
      case 4:
        date.setDate(date.getMonth() - 1)
        this.props.dispatch(
          createAction('requirement/queryMyRequire')({
            startDate: this.getStartOfDate(date),
            endDate: this.getStartOfDate(new Date()),
            curTab: 4,
          })
        )
        break
      default:
        break
    }
    this.props.dispatch(
      createAction('requirement/updateState')({
        curTab: index,
      })
    )
  }

  onItemClick = value => {
    this.props.dispatch(
      createAction('requirement/updateState')({ requirement: value })
    )
    this.props.dispatch(
      NavigationActions.navigate({ routeName: 'RequireDetail' })
    )
  }

  tabs2 = [
    { title: '今天' },
    { title: '明天' },
    { title: '后天' },
    { title: '一周內' },
    { title: '前一月' },
  ]

  getStartOfDate = date =>
    `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 00:00:00`

  getEndOfDate = date =>
    `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 23:59:59`

  componentDidMount = () => {
    const date = new Date()
    this.props.dispatch(
      createAction('requirement/queryMyRequire')({
        startDate: this.getStartOfDate(date),
        endDate: this.getEndOfDate(date),
      })
    )
  }

  render() {
    const { myRequireList, curTab } = this.props
    return (
      <View style={{ flex: 1 }}>
        <Tabs
          tabs={this.tabs2}
          page={curTab}
          onChange={this.onTabChange}
          renderTab={tab => <Text>{tab.title}</Text>}
          style={{ flex: 1, minHeight: 16 }}
        />
        <View style={{ flex: 20 }}>
          <FlatList
            data={myRequireList}
            extraData={this.state}
            keyExtractor={(item, index) => item.requireCode}
            renderItem={({ item }) => (
              <Item
                key={item.requireCode}
                style={{ paddingLeft: 10 }}
                onClick={() => this.onItemClick(item)}
                arrow="horizontal"
                thumb={
                  <View
                    style={{
                      alignItems: 'center',
                      marginRight: ScreenUtil.setSpText(10),
                    }}
                  >
                    <TouchableOpacity
                      disabled
                      style={{
                        width: ScreenUtil.setSpText(32),
                        height: ScreenUtil.setSpText(32),
                        backgroundColor: '#336699',
                        color: '#ffffff',
                        alignItems: 'center',
                        borderRadius: 5,
                        borderWidth: 0,
                        paddingTop: ScreenUtil.setSpText(5),
                      }}
                    >
                      <Text
                        style={{
                          fontSize: ScreenUtil.setSpText(20),
                          color: '#ffffff',
                        }}
                      >
                        新
                      </Text>
                    </TouchableOpacity>
                    {item.paid ? (
                      <Text
                        style={{
                          fontSize: ScreenUtil.setSpText(8),
                          color: '#FF9966',
                        }}
                      >
                        已支付
                      </Text>
                    ) : (
                      <Text
                        style={{
                          fontSize: ScreenUtil.setSpText(8),
                          color: '#000000',
                        }}
                      >
                        未支付
                      </Text>
                    )}
                  </View>
                }
                multipleLine
              >
                {map(item.items, value => value.itemName).join(',')}
                <Brief>
                  姓名:{item.babyName} 年龄:{item.babyAge} 性别:{item.babySex}
                </Brief>
                <Brief>接单者:{item.companyName}</Brief>
              </Item>
            )}
          />
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
    width: ScreenUtil.setSpText(32),
    height: ScreenUtil.setSpText(32),
  },
  tabView: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  list: {
    width: '100%',
  },
})

export default MyRequire
