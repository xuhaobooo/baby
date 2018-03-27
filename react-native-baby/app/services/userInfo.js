import { delay } from '../utils'
import { stringify } from 'qs'
import request from '../utils/request'

export async function updateUserInfo(params) {
  return request(`/babyUserInfo/update/${params.id}`, {
    method: 'PATCH',
    body: params,
  })
}

export async function getUserInfo(userCode) {
  return request(`/babyUserInfo/findByCode/${userCode}`, {
    method: 'GET',
  })
}