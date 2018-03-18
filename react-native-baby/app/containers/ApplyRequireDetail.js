import React, { Component } from 'react'
import { StyleSheet, View, Image } from 'react-native'
import { connect } from 'react-redux'

import {Button, InputItem,Text } from 'antd-mobile'
import { CompanySelector } from '../components'

import { NavigationActions, createAction } from '../utils'
import * as ScreenUtil from '../utils/ScreenUtil'
import {map} from 'lodash'

@connect()
class AppluRequire extends Component {

  state = {
    
  }

  static navigationOptions = {
    headerTitle: (<Text style={{fontSize:ScreenUtil.setSpText(20),alignSelf:'center', textAlign:'center',flex:1, color:'#FF6600'}}>需求详情</Text>),
    headerRight:<View/>,
  }

  applyRequire = (requireCode) => {
    
    this.props.dispatch(createAction('requirement/applyRequire')({
      requireCode,
    }))
  }

  componentDidMount = () => {
    
  }

  showBaiduMap=(requirement)=>{
    const position ={
      posX:requirement.addrPosX,
      posY:requirement.addrPosY,
      label:requirement.addrName,
    }
    this.props.dispatch(NavigationActions.navigate({ routeName: 'BaiduMapPage',params:{position,showBtn:false} }))
  }

  render() {
    const { navigation } = this.props
    const requirement = navigation.state.params.requirement
    return (
      <View style={styles.container}>
        <InputItem style={styles.itemStyle} value={requirement.babyName} editable={false}>姓名：</InputItem> 
        <InputItem style={styles.itemStyle} value={requirement.startTime} editable={false}>  从：</InputItem> 
        <InputItem style={styles.itemStyle} value={requirement.endTime} editable={false}>  到：</InputItem> 
        <View style={{flex:1,flexDirection:'row',alignItems: 'center',backgroundColor:'white'}}>
          <InputItem style={{flex:8,backgroundColor:'white',height:'99%',marginLeft: 0,paddingLeft:20,}} value={requirement.addrName} onClick={this.showBaiduMap} editable={false}>地点：</InputItem>
          <Button style={{width:22,height:22,borderColor:'white'}} onClick={()=>this.showBaiduMap(requirement)}>
            <Image style={{marginTop:3,width:20,height:20}} source={require('../images/map.png')} resizeMode='stretch'/>
          </Button>
        </View> 
        <InputItem style={styles.itemStyle} value={map(requirement.items,(value) => value.itemName).join(',')} editable={false}>服务：</InputItem> 
        <InputItem style={styles.itemStyle} value={requirement.feeAmount + '元' + '           ' + '附加小费：' + '   ' + requirement.payMore} editable={false}>总费用：</InputItem> 
        <View style={styles.actionStyle}>
          {requirement.applied ? 
          <Button type="primary" style={{margin:10}} disabled={true}>已抢单</Button>
          :
          <Button type="primary" style={{margin:10}} onClick={() =>this.applyRequire(requirement.requireCode)}>抢单</Button>    
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
    flex:7,
    marginTop:5,
  }
})

export default AppluRequire
