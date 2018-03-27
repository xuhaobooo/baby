import React, { Component } from 'react'
import { StyleSheet, View, Text, FlatList,TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'

import { Button, InputItem, TextareaItem, Modal,List, Toast } from 'antd-mobile'

import { NavigationActions, createAction } from '../utils'
import * as ScreenUtil from '../utils/ScreenUtil'
var Platform = require('Platform'); 

const alert = Modal.alert
const Item = List.Item
const Brief = Item.Brief;

@connect(({ evalution,requirement }) => ({ ...evalution,requirement }))
class ApplyDetail extends Component {
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
        接单者
      </Text>
    ),
    headerRight: <View />,
  }

  selectApply = applyInfo => {
    alert('请确定', `是否选择${applyInfo.userName}?`, [
      { text: '取消' },
      {
        text: '确定',
        onPress: () => this.props.dispatch({type:'requirement/selectApply',payload:{
            applyId: applyInfo.id,
            requireCode: applyInfo.requireCode,
          },
          callback:this.afterApply
      })
    }])
  }

  afterApply =() =>{
    Toast.success('已选择接单者')
  }

  componentDidMount = () => {
    const { navigation } = this.props
    const applyInfo = navigation.state.params.applyDetail
    this.props.dispatch(createAction('evalution/findUserEva')({
      userCode: applyInfo.userCode,
    }))

    this.props.dispatch(createAction('requirement/queryAlertDict')({
    }))
  }

  render() {
    const { navigation,userEvaList } = this.props
    const applyInfo = navigation.state.params.applyDetail
    return (
      <View style={styles.container}>
        <InputItem
          style={styles.itemStyle}
          value={applyInfo.userName}
          labelNumber={7}
          editable={false}
        >
          接单者：
        </InputItem>
        <InputItem
          labelNumber={7}
          style={styles.itemStyle}
          value={applyInfo.userRol ==='COMP' ? '机构' : '个人'}
          editable={false}
        >
          类型：
        </InputItem>
        <InputItem
          labelNumber={7}
          style={styles.itemStyle}
          value={applyInfo.tel}
          editable={false}
        >
          电话：
        </InputItem>
        <InputItem
          labelNumber={7}
          style={styles.itemStyle}
          value={`${applyInfo.creditValue}`}
          editable={false}
        >
          信任值：
        </InputItem>
        <InputItem
          labelNumber={7}
          style={styles.itemStyle}
          value={applyInfo.addrName}
          editable={false}
        >
          地点：
        </InputItem>
        <InputItem
          labelNumber={7}
          style={styles.itemStyle}
          value={`${applyInfo.distance} 公里`}
          editable={false}
        >
          距离：
        </InputItem>
        <TextareaItem
          style={{ marginTop: 5,paddingLeft:20 }}
          title="简介"
          autoHeight={true}
          editable={false}
          value={applyInfo.note}
        />
        <View style={styles.actionStyle}>
        <FlatList data={userEvaList} extraData={this.state} keyExtractor={(item, index) => item.userCode} 
          renderItem={({item})=><Item key={item.userCode} onClick={() => this.onItemClick(item)} arrow="horizontal"
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
        <Button
          type="primary"
          style={{ margin: 10 }}
          onClick={() => this.selectApply(applyInfo)}
        >
          选择此接单者
        </Button>
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
    backgroundColor: 'white',
    marginLeft: 0,
    paddingLeft: 20,
    flex:1,
  },
  actionStyle: {
    flex: 10,
    marginTop: 5,
  },
})

export default ApplyDetail
