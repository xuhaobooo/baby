import { startsWith, mapValues } from 'lodash'
import moment from 'moment'

const codeMessage = {
  200: '服务器成功返回请求的数据',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据,的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器',
  502: '网关错误',
  503: '服务不可用，服务器暂时过载或维护',
  504: '网关超时',
}
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  }

  const errortext = codeMessage[response.status] || response.statusText

  const error = "请求服务器失败"
  error.name = "连接错误"
  error.response = response
  throw error
}

function convertDate(date, fmt) {
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'H+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'S+': date.getMilliseconds(),
  }

  // 因位date.getFullYear()出来的结果是number类型的,所以为了让结果变成字符串型，下面有两种方法：
  if (/(y+)/.test(fmt)) {
    // 第一种：利用字符串连接符“+”给date.getFullYear()+""，加一个空字符串便可以将number类型转换成字符串。
    fmt = fmt.replace(
      RegExp.$1,
      `${date.getFullYear()}`.substr(4 - RegExp.$1.length)
    )
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      // 第二种：使用String()类型进行强制数据类型转换String(date.getFullYear())，这种更容易理解。

      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : `00${o[k]}`.substr(String(o[k]).length)
      )
    }
  }
  return fmt
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */

export default function request(url, options) {
  const headers = new Headers()
  headers.append('Content-Type', 'text/plain')
  headers.append('X-My-Custom-Header', 'CustomValue')

  const getCurrentScreen = (navigationState) => {
    if (!navigationState) {
      return null
    }
    const route = navigationState.routes[navigationState.index]
    if (route.routes) {
      return getCurrentScreen(route)
    }
    return route.routeName
  }

  const defaultOptions = {
    credentials: 'include',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
    },
  }
  const newOptions = { ...defaultOptions, ...options }
  if (
    (newOptions.method === 'POST' ||
      newOptions.method === 'PUT' ||
      newOptions.method === 'PATCH') &&
    url !== '/security/login'
  ) {
    newOptions.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      ...newOptions.headers,
    }

    const convertedBody = mapValues(newOptions.body, value => {
      if (value instanceof moment) {
        return value.format('YYYY-MM-DD HH:mm:ss')
      } else if (value instanceof Date) {
        const d = convertDate(value, 'yyyy-MM-dd HH:mm:ss')
        return d
      }
      return value
    })
    console.log(JSON.stringify(convertedBody))
    newOptions.body = JSON.stringify(convertedBody)
  }

  if (!startsWith(url, '/api')) {
    url = `http://www.co-mama.cn/bgms${url}`
    //url = `http://192.168.1.192:8080/bgms${url}`
  }

  let code
  let msg
  let total
  let current
  let pageSize

  console.log(url)
  return fetch(url, newOptions)
    .then(checkStatus)
    .then(response => {
      code = response.headers.get('return_code')
      msg = response.headers.get('return_msg')
      total = response.headers.get('x-total-count')
      current = response.headers.get('x-current-page')
      pageSize = response.headers.get('x-page-size')

      if (code == null) {
        return response.text()
      }
      global.app._store.dispatch({
        type:'app/updateState',
        payload:{fetching:false}
      })
      if (code === '10010000') {
        global.app._store.dispatch({
          type:'login/tokenLogin', 
          payload:{}
        })
        return
      }
      if (code === '10010002' || code === '10010004'||code === '10010005'||code === '10010006') {
        const currentScreen = getCurrentScreen(global.app._store.getState().router)
        console.log(currentScreen)
        if (currentScreen === 'Login') {
          const error = new Error(decodeURI(msg))
          error.name = code
          error.response = response
          throw error

        }else{
          global.app._store.dispatch({
            type:'login/logout', 
            payload:{}
          })
        }
        
      }else{
        const error = new Error(decodeURI(msg))
        error.name = code
        error.response = response
        throw error
      }
    })
    .then(data => {
      if (data) {
        return JSON.parse(data)
      }
      return {}
    })
    .then(data => {
      if (total != null && current != null && pageSize != null) {
        const pagination = {
          total: Number(total),
          pageSize: Number(pageSize),
          current: Number(current),
        }
        data = { list: data, pagination }
      }
      return data
    })
}
