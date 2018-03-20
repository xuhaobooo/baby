import { delay } from '../utils'
import { stringify } from 'qs'
import request from '../utils/request'

export async function addEvalution(params) {
  return request(`/babyEvaluate/current`, {
    method: 'POST',
    body: params,
  })
}

export async function findEvaByBcode(requireCode) {
  console.log(requireCode)
  return request(`/babyEvaluate/findByRequireCode/${requireCode}`, {
    method: 'GET',
  })
}
