/*
包含应用中所有请求函数的模块
 */

import ajax from './ajax'

const BASE = ''

/*export function reqLogin(username, password) {
    ajax('/login', {username, password})
}*/
// 登录
export const reqLogin = (username, password) => ajax(BASE + '/login', {username, password}, 'POST')

// 注册
export const reqAddUser = (user) => ajax(BASE + '/manager/user/add', user, 'POST')