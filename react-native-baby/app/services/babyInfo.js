import { delay } from '../utils'
import { stringify } from 'qs';
import request from '../utils/request';

export async function addBaby(params) {
  return request(`/babyInfo/current`, {
    method: 'POST',
    body: params
  });
}
