import Alipay from 'react-native-yunpeng-alipay'
import * as WeChat from 'react-native-wechat'
import { Toast } from 'antd-mobile'

const Platform = require('Platform')

export async function performAlipay(result, callback) {
  if (result && result.signedString) {
    Alipay.pay(result.signedString)
      .then(value => {
        console.log(value)
        if (value.length && value[0].resultStatus) {
          switch (value[0].resultStatus) {
            case '9000':
              return { flag: true, msg: '支付完成！' }
            case '8000':
              return { flag: true, msg: '支付结果未知,请查询订单状态' }
            case '4000':
              return { flag: false, msg: '订单支付失败' }
            case '5000':
              return { flag: false, msg: '重复请求' }
            case '6001':
              return { flag: false, msg: '用户已取消' }
            case '6002':
              return { flag: false, msg: '网络连接出错' }
            case '6004':
              return { flag: false, msg: '支付结果未知,请查询订单状态' }
            default:
              return { flag: false, msg: '未知原因，支付失败！' }
          }
        } else if (value.indexOf('{9000}')) {
          return { flag: true, msg: '支付完成！' }
        } else if (value.indexOf('{8000}')) {
          return { flag: true, msg: '支付结果未知,请查询订单状态' }
        } else if (value.indexOf('{4000}')) {
          return { flag: true, msg: '订单支付失败' }
        } else if (value.indexOf('{5000}')) {
          return { flag: true, msg: '重复请求' }
        } else if (value.indexOf('{6001}')) {
          return { flag: true, msg: '用户已取消' }
        } else if (value.indexOf('{6002}')) {
          return { flag: true, msg: '网络连接出错' }
        } else if (value.indexOf('{6004}')) {
          return { flag: true, msg: '支付结果未知,请查询订单状态' }
        } else {
          return { flag: false, msg: '未知原因，支付失败！' }
        }
      })
      .then(({ flag, msg }) => {
        if (flag) {
          if (callback) callback()
        } else {
          Toast.fail(msg, 1)
        }
      })
      .catch(e => ({ flag: false, msg: '支付失败！' }))
  } else {
    Toast.fail('支付宝验证失败！', 1)
  }
}

export async function performWechatPay(result, callback) {
  if (result && result.sign) {
    const requestParam = {}
    if (Platform.OS === 'android') {
      requestParam.appid = `${result.appid}`
      requestParam.nonceStr = `${result.noncestr}`
      requestParam.package = `${result.package}`
      requestParam.partnerId = `${result.partnerid}`
      requestParam.prepayId = `${result.prepayid}`
      requestParam.sign = `${result.sign}`
      requestParam.timeStamp = `${result.timestamp}`
    } else {
      requestParam.appid = `${result.appid}`
      requestParam.nonceStr = `${result.noncestr}`
      requestParam.package = `${result.package}`
      requestParam.partnerId = `${result.partnerid}`
      requestParam.prepayId = `${result.prepayid}`
      requestParam.sign = `${result.sign}`
      requestParam.timeStamp = result.timestamp - 0
    }

    await WeChat.pay(requestParam)
      .then(value => {
        console.log(value)
        if (value.errCode === 0) {
          return { flag: true, msg: '支付成功' }
        }
        return { flag: false, msg: '支付失败！' }
      })
      .then(({ flag, msg }) => {
        if (flag) {
          if (callback) callback()
        } else {
          Toast.fail(msg, 1)
        }
      })
      .catch(e => ({ flag: false, msg: '支付失败！' }))
  } else {
    Toast.fail('微信支付验证失败！', 1)
  }
}
