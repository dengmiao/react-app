/*
异步请求的函数模块
封装axios库
函数的返回值是promise对象

优化:
1、统一处理请求异常
    在请求外层包一个自己创建的promise对象
    请求出错时, 不reject(error), 而是提示错误信息
2、异步得到的不是response, 而是response.data
    在请求成功resolve时, 不是resolve(response), 而是resolve(response.data)

 */

import axios from 'axios'
import { message } from 'antd'

export default function ajax(url, data, type='GET') {

    return new Promise((resolve, reject) => {
        let promise
        // 1.执行异步ajax
        if('GET' === type || 'get' === type) {
            promise = axios.get(url, {
                params: data
            })
        } else {
            promise =axios.post(url, data)
        }
        // 2.如果成功了, 调用resolve(value)
        promise.then((response) => {
            resolve(response.data)
        })
        // 3.如果失败了, 不调用reject(), 而是提示异常信息
        .catch((error) => {
            // reject(error)
            message.error('请求异常', error.message)
        })
    })

}