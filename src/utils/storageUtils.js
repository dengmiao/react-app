/*
进行local数据存储管理的模块
store 兼容更多浏览器
 */

import store from 'store'

export default {
    /*
    保存值
     */
    setItem(key, value) {
        /*if(typeof value === 'string') {
            localStorage.setItem(key, value)
        } else {
            localStorage.setItem(key, JSON.stringify(value))
        }*/
        store.set(key, value)
    },
    /*
    获取值
     */
    getItem(key) {
        /*return JSON.parse(localStorage.getItem(key) || '{}')*/
        return store.get(key) || {}
    },
    /*
    删除值
     */
    removeItem(key) {
        /*localStorage.removeItem(key)*/
        store.remove(key)
    },
}