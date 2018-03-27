import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native'
import { connect } from 'react-redux'

import { createAction, NavigationActions } from '../utils'
import {
  Button,
  InputItem,
  List,
  WhiteSpace,
  Toast,
} from 'antd-mobile'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import * as ScreenUtil from '../utils/ScreenUtil'

@connect(({ money,app  }) => ({ ...money, app  }))
class ForgetPassword extends Component {

  state = {
    nameError: false,
    name: null,
    bankError: false,
    bank: null,
    accountError:false,
    account:null,
    amount: null,
    amountError: false,
  }

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
        余额管理
      </Text>
    ),
    headerRight: <View />,
  }

  withdraw = () => {
      const {position} = this.props
      if (this.state.nameError || !this.state.name) {
        Toast.info('请输入两位以上的开户姓名',1)
        return
      }
      if (this.state.bankError || !this.state.bank) {
        Toast.info('请输入开户行',1)
        return
      }
      
      if (this.state.accountError || !this.state.account) {
        Toast.info('请输入16位以上的银行账号',1)
        return
      }
      if (this.state.amountError || !this.state.amount) {
        Toast.info('单次提现金额需100元以上',1)
        return
      }
    
    this.props.dispatch({
        type:'money/withdraw',
        payload:{
        wdAccountNo: this.state.account.replace(/\s/g, ''),
        wdBank:this.state.bank,
        wdAccountName: this.state.name,
        wdAmount:this.state.amount,
        },
        callback:this.afterWithdraw
      }
    )
  }

  afterWithdraw =()=>{
    Toast.info('提现成功，预计三个工作日内到账',3)
    this.props.dispatch(NavigationActions.back())
  }

  onNameChange = value => {
    if (value.replace(/\s/g, '').length < 2) {
      this.setState({
        nameError: true,
      })
    } else {
      this.setState({
        nameError: false,
      })
    }
    this.setState({
      name: value,
    })
  }

  onAmountChange = (value) => {
    if (value-0 < 100) {
      this.setState({
        amountError: true,
      })
    }else{
      this.setState({
        amountError: false,
      })
    }
    this.setState({
      amount: value,
    })
  }

  onBankChange = value => {
    if (value.replace(/\s/g, '').length < 5) {
      this.setState({
        bankError: true,
      })
    } else {
      this.setState({
        bankError: false,
      })
    }
    
    this.setState({
      bank: value,
    })
  }

  onAccountChange = value => {
    if (value.replace(/\s/g, '').length < 6) {
      this.setState({
        accountError: true,
      })
    } else {
      this.setState({
        accountError: false,
      })
    }

    this.setState({
      account: value,
    })
  }

  componentDidMount() {  
    this.props.dispatch(
      createAction('money/myBalance')({
      })
    )
  }  

  render() {
    const { fetching } = this.props.app
    const { windowHeight } = this.props.app
    const {balance} = this.props
    return (
        
        <View
          style={{
            alignItems: 'stretch',
            justifyContent: 'flex-start',
            backgroundColor: 'white',
          }}
        >
          <WhiteSpace size="md"/>
          <Text style={{fontSize:40,textAlign:'center'}}>{balance}</Text>
          <WhiteSpace />
          <WhiteSpace />
          <InputItem
            maxLength={30}
            placeholder="开户名称"
            error={this.state.nameError}
            value={this.state.name}
            onChange={this.onNameChange}
          />

          <InputItem
            placeholder="开户银行"
            maxLength={50}
            error={this.state.bankError}
            value={this.state.bank}
            onChange={this.onBankChange}
          />

          <InputItem
            type="bankCard"
            placeholder="账号"
            maxLength={30}
            error={this.state.accountError}
            value={this.state.account}
            onChange={this.onAccountChange}
          />

          <InputItem
            type="number"
            placeholder="提现金额"
            error={this.state.amountError}
            value={this.state.amount}
            onChange={this.onAmountChange}
          />

          <WhiteSpace />
          <Button style={styles.registerBtn} onClick={this.withdraw} type="primary">提现</Button>
        </View>
    )
  }
}

const { width: windowWidth, height: windowHeight } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },
  indecator: {
    position: 'absolute',
    top: windowHeight * 0.43,
    left: windowWidth * 0.5 - 10,
    zIndex: 999,
  },

  registerBtn: {
    margin: 10,
    marginTop: 15,
    
  },
})

export default ForgetPassword
