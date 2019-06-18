import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import memoryUtils from '../../utils/memoryUtils'

/*
后台管理路由组件
 */
export default class Admin extends Component {

    render() {
        const user = memoryUtils.user;
        // 当前没有登录
        if(!user || !user._id) {
            // 自动跳转登录
            return <Redirect to='/login'></Redirect>
        }
        return (
            <div>Hello, {user.username}</div>
        )
    }
}