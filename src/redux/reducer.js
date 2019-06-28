/*
reducer函数模块: 根据当前state和指定action返回并返回新的state
 */
import { combineReducers } from 'redux'

import storageUtils from "../utils/storageUtils"
import {
    SET_HEAD_TITLE,
    RECEIVE_USER,
    SHOW_ERROR_MSG,
    RESET_USER,
} from './action-types'

const initHeadTitle = '首页'

/*
用来管理头部标题的reducer函数
 */
function headTitle(state=initHeadTitle, action) {
    switch (action.type) {
        case SET_HEAD_TITLE:
            return action.data
        default:
            return state
    }
}

const initUser = storageUtils.getItem('currUser')

/*
用来管理当前登录用户的reducer函数
 */
function user(state=initUser, action) {
    switch (action.type) {
        case RECEIVE_USER:
            return action.user
        case SHOW_ERROR_MSG:
            const errorMsg = action.errorMsg
            // 不要直接修改原来的状态数据
            return {...state, errorMsg}
        case RESET_USER:
            return {}
        default:
            return state
    }
}

/*
向外默认暴露的是合并产生的总的reducer函数
管理的总的state结构
{
    headTitle: '首页',
    user: {},
}
 */
export default combineReducers({
    headTitle,
    user,
})