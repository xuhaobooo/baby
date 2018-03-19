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

export const wait = async time => {
  await delay(time)
}
