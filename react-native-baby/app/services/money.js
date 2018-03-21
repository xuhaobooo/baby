import { delay } from '../utils'
import { stringify } from 'qs'
import request from '../utils/request'

export async function withdraw(params) {
  return request(`/money/withdraw`, {
    method: 'POST',
    body: params,
  })
}

export async function myBalance(params) {
  return request(`/money/myBalance`, {
    method: 'GET',
  })
}

export async function myMoneyFlow(params) {
  return request(`/money/findMine`, {
    method: 'GET',
  })
}
