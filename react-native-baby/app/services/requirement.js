import { delay } from '../utils'
import { stringify } from 'qs'
import request from '../utils/request'

export async function queryMyRequire(params) {
  return request(`/babyRequire/listMine?${stringify(params)}`, {
    method: 'GET',
  })
}

export async function findApply(params) {
  return request(`/babyRequire/findApply/${params.requireCode}`, {
    method: 'GET',
  })
}

export async function selectApply(applyId) {
  return request(`/babyRequire/select/${applyId}`, {
    method: 'POST',
  })
}

export async function findRequire(requireCode) {
  return request(`/babyRequire/findOne/${requireCode}`, {
    method: 'GET',
  })
}

export async function queryMyBaby() {
  return request(`/babyInfo/findByUserCode`, {
    method: 'GET',
  })
}

export async function queryTrustDict() {
  return request(`/common/dictOption/getDictByClassName/trust`, {
    method: 'GET',
  })
}

export async function queryAlertDict() {
  return request(`/common/dictOption/getDictByClassName/alert_msg`, {
    method: 'GET',
  })
}

export async function queryService() {
  return request(`/babyRequire/listServiceWithCatalog`, {
    method: 'GET',
  })
}

export async function queryTimePrice() {
  return request(`/babyRequire/timePrice`, {
    method: 'GET',
  })
}

export async function publishRequire(params) {
  return request(`/babyRequire/publish`, {
    method: 'POST',
    body: params,
  })
}

export async function queryPendMyRequire(params) {
  return request(`/babyRequire/listRequire?${stringify(params)}`, {
    method: 'GET',
  })
}

export async function applyRequire(requireCode) {
  return request(`/babyRequire/apply/${requireCode}`, {
    method: 'POST',
  })
}

export async function queryMyTask(params) {
  return request(`/babyRequire/listTasks?${stringify(params)}`, {
    method: 'GET',
  })
}

export async function findTaskByRequireCode(params) {
  return request(`/babyRequire/findTaskByRequireCode/${params.requireCode}`, {
    method: 'GET',
  })
}

export async function findTaskByTaskCode(params) {
  return request(`/babyRequire/findTaskByRequireCode/${params.taskCode}`, {
    method: 'GET',
  })
}

export async function arrive(task) {
  return request(`/babyRequire/arrive/${task.taskCode}`, {
    method: 'POST',
  })
}

export async function complete(task) {
  return request(`/babyRequire/provideFinish/${task.taskCode}`, {
    method: 'POST',
  })
}

export async function customerFinish(requireCode) {
  return request(`/babyRequire/customerFinish/${requireCode}`, {
    method: 'POST',
  })
}

export async function alipay(params) {
  return request(`/alipay/pay`, {
    method: 'POST',
    body: params,
  })
}

export async function wechatPay(params) {
  return request(`/wxpay/pay`, {
    method: 'POST',
    body: params,
  })
}
