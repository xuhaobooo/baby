import { delay } from '../utils'
import { stringify } from 'qs'
import request from '../utils/request'

export async function addBaby(params) {
  return request(`/babyEvaluate/current`, {
    method: 'POST',
    body: params,
  })
}

export async function findEvaByBcode(requireCode) {
  return request(`/babyEvaluate/findByRequireCode/${requireCode}`, {
    method: 'GET',
  })
}
