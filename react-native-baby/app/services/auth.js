import { delay } from '../utils'
import { stringify } from 'qs'
import request from '../utils/request'

export async function fakeAccountLogin(params) {
  return request(`/security/login?${stringify(params)}`, {
    method: 'POST',
  })
}

export async function fakeTokenLogin(params) {
  return request(`/security/tokenLogin?${stringify(params)}`, {
    method: 'POST',
  })
}

export async function getUserInfo(userCode) {
  return request(`/babyUserInfo/findByCode/${userCode}`, {
    method: 'GET',
  })
}

export async function fakeRegister(params) {
  return request('/user/current', {
    method: 'POST',
  })
}

export async function getCathcha(mobile) {
  return request(`/security/captcha/${mobile}`, {
    method: 'POST',
  })
}

export async function registUser(params) {
  const {cathcha,userName:lastName,userName:firstName,loginName,password} = params
  return request('/user/current', {
    method: 'POST',
    body:{
      cathcha,lastName,firstName,loginName,password
    }
  })
}

export async function addUserInfo(params) {
  const {addrName,addrPosX,addrPosY,note,userCode,visitCode,userName,loginName} = params
  return request('/babyUserInfo/addUserInfo', {
    method: 'POST',
    body:{
      addrName,addrPosX,addrPosY,note,userCode,visitCode,userName,tel:loginName,userRole:'DD'
    }
  })
}

export async function resetPassword(params) {
  return request(`/security/forgetChangePassword?${stringify(params)}`, {
    method: 'POST',
  })
}

export const wait = async time => {
  await delay(time)
}
