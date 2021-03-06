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
  return request(`/babyEvaluate/findByRequireCode/${requireCode}`, {
    method: 'GET',
  })
}

export async function findMyEvalution(params) {
  return request(`/babyEvaluate/findMine?${stringify(params)}`, {
    method: 'GET',
  })
}

export async function findUserEva(params) {
  return request(`/babyEvaluate/findUserEva?${stringify(params)}`, {
    method: 'GET',
  })
}
