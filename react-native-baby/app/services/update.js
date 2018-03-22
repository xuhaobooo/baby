import { delay } from '../utils'
import { stringify } from 'qs'
import request from '../utils/request'

export async function getLastVersion(params) {
  return request(`/onlineUpdate/getLastVersion/BABY`, {
    method: 'GET',
  })
}
