import React, { Component } from 'react'
import { StyleSheet, View, Image, Text, FlatList,TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'

import {forEach, map} from 'lodash'
import * as ScreenUtil from '../utils/ScreenUtil'

import { NavigationActions, createAction } from '../utils'
import { InputItem, DatePicker,List, WhiteSpace, Button, Picker, Checkbox, Modal, Toast } from 'antd-mobile'

const Item = List.Item
const Brief = Item.Brief
const alert = Modal.alert
const prompt = Modal.prompt

@connect(({ requirement,app, login }) => ({ ...requirement,app,login }))
class PublishRequire extends Component {

  state = {
      startTime: null,
      endTime:null,
      babyName:null,
      babyAge:null,
      babySex:null,
      payMore:0,
      trustCode:null,
      babyCode:null,
      servicePay:0,
      serviceItems:{},
      showAddModal:false,
      addBabyName:null,
      addBabySex:null,
      addBabyBirthday:null,
      addBabyNameError:false,
  }

  static navigationOptions = {
    headerTitle: (<Text style={{fontSize:ScreenUtil.setSpText(20),alignSelf:'center', textAlign:'center',flex:1, color:'#FF6600'}}>发布需求</Text>),
    tabBarLabel: '发单',
    tabBarIcon: ({ focused, tintColor }) => (
      <Image
        style={[styles.icon, { tintColor: focused ? tintColor : 'gray' }]}
        source={require('../images/house.png')}
      />
    ),
  }

  publishRequirement = () => {
    const {startTime,endTime,babyName,babyAge,babySex,payMore,trustCode,servicePay,serviceItems} = this.state
    const {posX:addrPosX,posY:addrPosY,label:addrName} = this.props.position

    const feeAmount = payMore + this.getTimeFee() + servicePay
    const items = map(serviceItems,(value,key)=>{return {itemCode:value.itemCode,itemName:value.itemName,itemPrice:value.itemPrice,}})
    const requirement = {addrName,addrPosX,addrPosY,babyAge,babyName,babySex,creditCode:trustCode[0],
      startTime,endTime,feeAmount:Math.round(feeAmount*100)/100,payMore,
      items}
    //console.log(requirement)
    this.props.dispatch({
      type:'requirement/publishRequire',
      payload: requirement,
      callback: this.publishCallBack,
    })
    this.props.dispatch(createAction('requirement/updateState')({
      curTab:0
    }))
  }

  publishCallBack = () => {
    this.clearData()
    this.props.dispatch(NavigationActions.navigate({ routeName: 'MyRequire' }))
  }

  serviceChanged = (e,value) => {
    if(e.target.checked){
      this.setState(
        {
          servicePay: this.state.servicePay + value.itemPrice,
        }
      )
      this.state.serviceItems[value.itemCode] = value
    }else{
      this.setState(
        {
          servicePay: this.state.servicePay - value.itemPrice,
        }
      )
      delete this.state.serviceItems[value.itemCode]
    }
  }

  trustChanged = (value) => {
    this.setState(
      {trustCode:value}
    )
  }

  babyChanged =(value)=>{
    this.setState(
      {babyCode:value}
    )
    const {myBabys} = this.props
    forEach(myBabys,(item)=>{
      if(value[0] === item.babyCode){
        const {babyName, babySex, babyBirthday} = item
        const now = new Date();
        
        const birthday = new Date(babyBirthday.replace(/-/g,"/"))
        
        const babyAge = now.getFullYear() - birthday.getFullYear()
        this.setState({
          babyName:babyName,
          babyAge:''+babyAge,
          babySex,
        })
        
        return
      }
    })
  }

  onAddBabyClose =() => {
    this.setState({
      addBabyName:null,
      addBabySex:null,
      addBabyBirthday:null,
      showAddModal:false,
      addBabyNameError:false,
    })
  }

  onAddBaby =() => {
    const {addBabyName,addBabySex,addBabyBirthday} = this.state
    if(!addBabyName || !addBabySex || !addBabyBirthday){
      this.setState({
        addBabyNameError:true,
      })
      return
    }else{
      this.setState({
        addBabyNameError:false,
      })
    }
    this.props.dispatch({
      type:'babyInfo/addBaby',
      payload:{babyName:addBabyName,babySex:addBabySex[0],babyBirthday:addBabyBirthday},
      callback:this.afterBabyAdd
    })
  }

  afterBabyAdd = () => {
    // this.setState({
    //   babyCode:'tempCode',
    //   babyName:this.state.addBabyName,
    //   babySex:this.state.addBabySex,
    //   babyAge: new Date().getFullYear - this.state.addBabyBirthday.getFullYear,
    // })
    this.onAddBabyClose()
  }

  addrClick = () => {
    const {position} = this.props
    this.props.dispatch(NavigationActions.navigate({ routeName: 'BaiduMapPage',params:{position,showBtn:true, moduleName:'requirement'} }))
  }

  componentDidMount = () => {
    const startTime = new Date()
    const endTime = new Date()
    startTime.setHours(startTime.getHours()+2);
    endTime.setHours(endTime.getHours()+3);
    this.setState({
      startTime,
      endTime,
    })

    this.props.dispatch(createAction('requirement/queryTrustDict')({
    }))

    this.props.dispatch(createAction('requirement/queryService')({
    }))

    this.props.dispatch(createAction('requirement/queryTimePrice')({
    }))

    const {userInfo} = this.props.login
    if(userInfo){
      const position ={
        posX:userInfo.addrPosX,
        posY:userInfo.addrPosY,
        label:userInfo.addrName,
      }
      this.props.dispatch(createAction('requirement/updateState')({
        position
      }))
    }
  }

  validateData = () => {
    
    const {startTime,endTime,babyCode, trustCode, serviceItems, payMore,babyName,babySex,babyAge } = this.state
    if((endTime - startTime) < 0){
      Toast.info('结束时间不能小于起始时间',1);
      return false
    }
    if(!babyCode || !babyName || !babySex || !babyAge){
      Toast.info('请选择宝贝，如果没有一个添加一个',1);
      return false
    }
    if(!trustCode){
      Toast.info('请选择【信任期待】项',1);
      return false
    }

    if(!this.props.position){
      Toast.info('请选择【地点】项',1);
      return false
    }

    if(Number.isNaN(Number(payMore))){
      Toast.info('请输入正确的数字【附加小费】',1)
      return false
    }

    if(Object.keys(serviceItems).length ===0){
      Toast.info('请选择【服务项目】',1);
      return false
    }

    return true
  }

  getDays = () => {
    return parseInt(this.state.endTime - this.state.startTime) / 1000 / 60 / 60
  }

  getTimeFee= ()=>{
    const {timePrice} = this.props
    var days = this.getDays()
    days = Math.ceil(days)
    return (days-1)*timePrice.price
  }

  generateMsg = () => {
    var msg=''
    const timeFee = this.getTimeFee()
    var days = this.getDays()
    msg = msg + '时间费用：' + days + '小时，' + timeFee + '元\n'
    map(this.state.serviceItems,(value,key)=> {msg = msg + value.itemName + ': \t' + value.itemPrice + '\n'})
    msg = msg + '附加小费：' + this.state.payMore + '元\n'
    const totalFee = this.state.servicePay + timeFee + this.state.payMore
    msg = msg + '总  费  用：' + (Math.round(totalFee*100)/100) + '元\n'
    return <Text style={{fontSize:ScreenUtil.setSpText(12)}}>{msg}</Text>
  }

  clearData =() => {
    const startTime = new Date()
    const endTime = new Date()
    startTime.setHours(startTime.getHours()+2);
    endTime.setHours(endTime.getHours()+3);
    this.setState({
      startTime,
      endTime,
      babyName:null,
      babyAge:null,
      babySex:null,
      payMore:0,
      trustCode:null,
      babyCode:null,
      servicePay:0,
      serviceItems:{},
    })
    
  }

  render() {
    
    const {serviceItems} = this.state
    const {myBabys, trustDict, serviceWithCatalog, position} = this.props
    !this.state.babyCode && myBabys && myBabys.length>0 && this.babyChanged([myBabys[0].babyCode])
    !this.state.trustCode && trustDict && trustDict.length>0 && this.setState({trustCode:[trustDict[0].dicCode]})
    const babyData=myBabys && map(myBabys,(item)=>{return {value:item.babyCode,label:item.babyName}})
    const trustData = map(trustDict,(item)=>{return {value:item.dicCode,label:item.dicLabel}})
    
    return (
      
      <View style={styles.container}>
        <Modal
          visible={this.state.showAddModal}
          transparent
          maskClosable={false}
          title="添加宝贝"
          footer={[{ text: '取消', onPress: () => { this.onAddBabyClose() } },
          { text: '确定', onPress: () => { this.onAddBaby() } }]}
        >
          <WhiteSpace/>
          <InputItem style={styles.itemStyle} labelNumber={7} value={this.state.addBabyName} 
          onChange={(value) => this.setState({addBabyName:value,addBabyNameError:false})} >
          姓名:</InputItem>

          <Picker data={[{value:'M',label:'男'},{value:'F',label:'女'}]} cols={1} title="选择性别" 
            onChange={(value) => this.setState({addBabySex:value,addBabyNameError:false})} value={this.state.addBabySex}>
            <Item style={styles.selectItem} arraw="horizontal">性别</Item>
          </Picker>
          <DatePicker
            mode='date'
            minDate={new Date('1990-01-01')}
            maxDate={new Date('2999-12-31')}
            value={this.state.addBabyBirthday}
            title='出生年月'
            onChange={date => this.setState({ addBabyBirthday:date,addBabyNameError:false })} >
            <Item style={styles.selectItem} arrow="horizontal">出生年月</Item>
          </DatePicker>
        
          <WhiteSpace style={{height:10,backgroundColor:'white',}} />
          {this.state.addBabyNameError && <Text style={{color:'red',textAlign:'center'}}>请输入所有数据</Text>}

        </Modal>
        <DatePicker
          value={this.state.startTime}
          title='选择起始时间'
          onChange={date => this.setState({ startTime:date })} >
          <Item style={styles.selectItem} arrow="horizontal">起始时间</Item>
        </DatePicker>
        <DatePicker 
          value={this.state.endTime}
          title='选择结束时间'
          onChange={date => this.setState({ endTime:date })} >
          <Item style={styles.selectItem} arrow="horizontal">结束时间</Item>
        </DatePicker>
        <View style={{flexDirection:'row',alignItems: 'center',backgroundColor:'white',width:'100%',height:ScreenUtil.setSpText(31),}}>
          <View style={{flex:8}}>
            <Picker data={babyData} cols={1} title="选择宝贝" 
              onChange={this.babyChanged} value={this.state.babyCode}>
              <Item style={styles.selectItem} arraw="horizontal">宝        贝</Item>
            </Picker>
          </View>
          <TouchableOpacity onPress={() => this.setState({showAddModal:true})}>
          <Image style={{marginTop:3,width:ScreenUtil.setSpText(20),height:ScreenUtil.setSpText(20),paddingLeft:0,paddingRight:0,}} 
            source={require('../images/user-add.png')} resizeMode='stretch' />
          </TouchableOpacity>
        </View> 
        
        <InputItem style={styles.itemStyle} labelNumber={7} value={this.state.babyAge} editable={false}>年    龄</InputItem>
        <InputItem style={styles.itemStyle} labelNumber={7} value={this.state.babySex==='M'?'男':'女'} editable={false}>性    别</InputItem> 
        <Picker data={trustData} cols={1} title="信任期待" 
          onChange={this.trustChanged} value={this.state.trustCode}>
          <List.Item style={styles.selectItem} arraw="horizontal">信任期待</List.Item>
        </Picker>
        <View style={{flexDirection:'row',alignItems: 'center',backgroundColor:'white',width:'100%',height:ScreenUtil.setSpText(31)}}>
          <View style={{flex:8}}>
            <InputItem labelNumber={7} style={{flex:8,backgroundColor:'white',height:'99%',marginLeft: 0,paddingLeft:20,}} 
              value={position && position.label} editable={false}>地    点</InputItem>
          </View>

          <TouchableOpacity onPress={this.addrClick}><Image style={{marginTop:3,width:ScreenUtil.setSpText(20),height:ScreenUtil.setSpText(20),paddingLeft:0,paddingRight:0,}} 
            source={require('../images/map.png')} resizeMode='stretch' />
          </TouchableOpacity>
        </View>

        <InputItem type='number' labelNumber={7} style={styles.itemStyle} value={''+this.state.payMore}
          onChange={(value) => Number.isNaN(Number(value)) ? Toast.info('请输入数字',1) : this.setState({payMore:Number(value)})}
        >附加小费</InputItem>
        <View style={{flex:10,backgroundColor:'white',marginTop:ScreenUtil.setSpText(5)}}>
      
            <FlatList data={serviceWithCatalog} extraData={this.state} keyExtractor={(item, index) => item.cataCode} 
            renderItem={({item})=><View>
                <Text style={{fontSize:ScreenUtil.setSpText(18), textAlign:'center',marginTop:ScreenUtil.setSpText(10),
                marginBottom:ScreenUtil.setSpText(10)}}>{item.cataName}</Text>
                <View style={styles.serviceContainer}>
                  {item.list.map(serv => (
                    <Checkbox style={{width:ScreenUtil.setSpText(14),height:ScreenUtil.setSpText(14), 
                      marginLeft:ScreenUtil.setSpText(5),marginBottom:ScreenUtil.setSpText(5)}} key={serv.itemCode}
                    onChange={(e)=>this.serviceChanged(e,serv)} checked={this.state.serviceItems.hasOwnProperty(serv.itemCode)}>
                      <Text style={{width:this.props.app.windowWidth/3-ScreenUtil.setSpText(20),fontSize:ScreenUtil.setSpText(14),
                        marginBottom:ScreenUtil.setSpText(5)}}>{ serv.itemName }</Text>
                    </Checkbox>))}
                </View>
                </View>}>
            </FlatList>
      
        </View>

        <Button type='primary' style={{margin:5,height:ScreenUtil.setSpText(35)}} onClick={() => this.validateData() && alert('请确认',   this.generateMsg(), [
          { text: '取消' },
          { text: '确定', onPress: () => this.publishRequirement() },
        ])}
        >发    布</Button>
        
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
  icon: {
    width: ScreenUtil.setSpText(28),
    height: ScreenUtil.setSpText(28),
  },
  itemStyle: {
    height:ScreenUtil.setSpText(30),
    backgroundColor:'white',
    marginLeft:0,
    paddingLeft:15,
  },
  serviceContainer:{
    flexDirection:'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    borderBottomWidth:1,
    borderBottomColor:'#eaeaea',
  },
  selectItem : {
    height:ScreenUtil.setSpText(30),
    borderBottomWidth: 1,
    borderBottomColor:'#eaeaea',
  }
})

export default PublishRequire
