import axios from 'axios'
import Vue from 'vue'
// import qs from 'qs'
import lodash from 'lodash'
// const { pathToRegexp, match, parse, compile } = require("path-to-regexp");
import {
  setCookie,
  getCookie,
  delCookie,
} from '@/utils/cookie.js'
import { Message, Loading } from "element-ui";
 // 从localStorage中获取token
function getLocalToken() {
  let access_token = getCookie('access_token')
  return access_token
}





let loading
let needLoadingRequestCount = 0 // 声明一个对象用于存储请求个数
function startLoading () {
  loading = Vue.prototype.$loading({
    lock: true,
    text: '努力加载中...',
    background: 'rgba(0,0,0,0.5)',
    target: document.querySelector('.loading-area') // 设置加载动画区域
  })
}
function endLoading () {
  loading.close()
}
function showFullScreenLoading () {
  console.log(needLoadingRequestCount,'needLoadingRequestCount')
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
}
function hideFullScreenLoading () {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    endLoading()
  }
}




const fetch = (options) => {
  let {
    method = 'get',
    data,
    fetchType,
    url,
    headers = {
      'Content-Type': 'application/json',
      // 'Authorization': 'Bearer f7ed7124-5357-4f46-820f-c094d6a0f960' // headers塞token
      'Authorization': `Bearer ${getLocalToken()}` // headers塞token
    },
  } = options

 

  const cloneData = lodash.cloneDeep(data)
  showFullScreenLoading()
  console.log(cloneData, "=====cloneData=====")
  switch (method.toLowerCase()) {
    case 'get':
      return axios.get(url, {
        params: cloneData,
      })
    case 'delete':
      return axios.delete(url, {
        data: cloneData,
      })
    case 'post':
      return axios.post(url, cloneData,{headers})
    case 'put':
      return axios.put(url, cloneData)
    case 'patch':
      return axios.patch(url, cloneData)
    default:
      return axios(options)
  }
}

export default function request (options) {
  console.log(options, "======options======")
  return fetch(options).then((response) => {
    const { statusText, status } = response
    let data = response.data
    hideFullScreenLoading() // 响应成功关闭loading
    return {
      success: true,
      message: statusText,
      status,
      ...data,
    }
  }).catch((error) => {
    hideFullScreenLoading() // 响应成功关闭loading
    const { response } = error
    let msg
    let status
    let otherData = {}
    if (response) {
      const { data, statusText } = response
      otherData = data
      status = response.status
      msg = data.message || statusText
    } else {
      status = 600
      msg = 'Network Error'
    }
    Message.error(`${msg}`);
    return { success: false, status, message: msg, ...otherData }
  })
}
