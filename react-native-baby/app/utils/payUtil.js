import Alipay from 'react-native-yunpeng-alipay'
import * as WeChat from 'react-native-wechat';
import {Toast } from 'antd-mobile'

export async function performAlipay(result,callback) {
    if(result && result.signedString){
        Alipay.pay(result.signedString).then((value) => {
            console.log(value)
            if(value.length && value[0].resultStatus){
                switch(value[0].resultStatus){
                    case "9000":
                        return {flag:true, msg:'支付完成！'};
                    case "8000":
                        return {flag:true, msg:'支付结果未知,请查询订单状态'};
                    case "4000":
                        return {flag:false, msg:'订单支付失败'};
                    case "5000":
                        return {flag:false, msg:'重复请求'};
                    case "6001":
                        return {flag:false, msg:'用户已取消'};
                    case "6002":
                        return {flag:false, msg:'网络连接出错'};
                    case "6004":
                        return {flag:false, msg:'支付结果未知,请查询订单状态'};
                    default:
                        return {flag:false, msg:'未知原因，支付失败！'};
                }
            }else{
                return {flag:false, msg:'未知原因，支付失败！'};
            }
          
        }).then(({flag,msg})=>{
          if(flag){
            if(callback) callback()
          }else{
            Toast.fail(msg,1)
          }
        })
        .catch((e)=>{
          return {flag:false, msg:'支付失败！'};
        })
      }else{
        Toast.fail('支付宝验证失败！',1)
      }
  }

export async function performWechatPay(result,callback) {
    
    if(result && result.sign){
        const requestParam = {
            appid : ""+result.appid,
            nonceStr : ""+result.noncestr,
            package : ""+result.package,
            partnerId : ""+result.partnerid,
            prepayId : ""+result.prepayid,
            sign : ""+result.sign,
            timeStamp : result.timestamp-0
        }
        console.log(requestParam)
        await WeChat.pay(requestParam).then((value) => {
            if (value.errCode === 0) {
                return {flag:true, msg:'支付成功'};
            }else{
                return {flag:false, msg:'支付失败！'};
            }
        }).then(({flag,msg})=>{
            if(flag){
                if(callback) callback()
            }else{
                Toast.fail(msg,1)
            }
        })
        .catch((e)=>{
            return {flag:false, msg:'支付失败！'};
        })
    }else{
        Toast.fail('微信支付验证失败！',1)
    }
}
  