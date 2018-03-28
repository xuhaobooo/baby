import React, { Component } from 'react'
import { StyleSheet, View, Image, ImageBackground, TouchableOpacity} from 'react-native'
import { connect } from 'react-redux'

import { Button, InputItem, Text, WhiteSpace, Toast, Modal,Checkbox,TextareaItem } from 'antd-mobile'
import { CompanySelector } from '../components'
import * as ScreenUtil from '../utils/ScreenUtil'
import Timeline from '../components/Timeline'

import { NavigationActions, createAction } from '../utils'
import { map } from 'lodash'

const alert = Modal.alert
const operation = Modal.operation

@connect()
class EvalutionAdd extends Component {
  state = {level:'HIGH',evalution:null}

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
        发表评价
      </Text>
    ),
    headerRight: <View />,
  }

  addEvalution = () => {
    const { navigation } = this.props
    const requirement = navigation.state.params.requirement
    this.props.dispatch({
      type:'evalution/addEvalution',
      payload:{level:this.state.level,notes:this.state.evalution,receiveUserCode:requirement.companyCode,
        requireCode:requirement.requireCode,sendUserCode:requirement.userCode},
        callback:this.afterEvalutionAdd
      }
    )
  }

  afterEvalutionAdd = () => {
    this.setState({level:null,evalution:null})
    Toast.success('发表成功')
    this.findEvalution()
    this.props.dispatch(NavigationActions.back())
  }

  findEvalution = () =>{
    const { navigation } = this.props
    const requirement = navigation.state.params.requirement
    this.props.dispatch(
      createAction('evalution/findEvaByBcode')({
        requireCode: requirement.requireCode
      })
    )
  }

  componentDidMount = () => {
  }

  render() {
    const { navigation } = this.props
    const requirement = navigation.state.params.requirement

    return (
      <View style={styles.container}>
        <WhiteSpace size="lg" />
        <View style={{flexDirection: 'row',borderBottomWidth:1,borderBottomColor:'#eaeaea',paddingBottom:5}}>
            <View style={{flex:1,alignItems:'center'}}>
            <Checkbox style={{width:ScreenUtil.setSpText(14),height:ScreenUtil.setSpText(14)}} key='low' 
              onChange={(e)=>this.setState({level:'LOW'})} checked={this.state.level==='LOW'}>
              <Text>差评</Text>
            </Checkbox>
            </View>
            <View style={{flex:1,alignItems:'center'}}>
            <Checkbox style={{width:ScreenUtil.setSpText(14),height:ScreenUtil.setSpText(14)}} key='mid' 
              onChange={(e)=>this.setState({level:'MID'})} checked={this.state.level==='MID'}>
              <Text>中评</Text>
            </Checkbox>
            </View>
            <View style={{flex:1,alignItems:'center'}}>
            <Checkbox style={{width:ScreenUtil.setSpText(14),height:ScreenUtil.setSpText(14)}} key='high' 
              onChange={(e)=>this.setState({level:'HIGH'})} checked={this.state.level==='HIGH'}>
              <Text>好评</Text>
            </Checkbox>
            </View>
          </View>
          <WhiteSpace size="xs" />
          <TextareaItem
            placeholder="写点评价吧，您的评价对其他人很重要"
            value={this.state.evalution}
            rows={8}
            count={100}
            underlineColorAndroid="transparent"
            onChange={(value) => this.setState({evalution:value})}
          />
          <WhiteSpace size="xs" />
          <Button type="primary" style={{margin: 5}} onClick={this.addEvalution}>发表</Button>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    backgroundColor:'#ffffff',
    paddingTop:20,
  },
  itemStyle: {
    backgroundColor: 'white',
    height:30,
    marginLeft: 0,
    paddingLeft: 20,
  },
  actionStyle: {
    flex: 10,
  },
  actionBtn: {
    margin: 10,
  },
})

export default EvalutionAdd
