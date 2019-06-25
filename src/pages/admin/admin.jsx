import React, { Component } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Layout } from 'antd';

import LeftNav from '../../components/left-nav/index'
import Header from '../../components/header/index'
import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import User from '../user/user'
import Role from '../role/role'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'
import memoryUtils from '../../utils/memoryUtils'

const { Footer, Sider, Content } = Layout

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
            <Layout style={{ minHeight: '100%' }}>
                <Sider>
                    <LeftNav/>
                </Sider>
                <Layout>
                    <Header>Header</Header>
                    <Content style={{ margin: 20, backgroundColor: '#fff' }}>
                        <Switch>
                            <Route path='/home' component={ Home } />
                            <Route path='/category' component={ Category } />
                            <Route path='/product' component={ Product } />
                            <Route path='/user' component={ User } />
                            <Route path='/role' component={ Role } />
                            <Route path='/charts/bar' component={ Bar } />
                            <Route path='/charts/line' component={ Line } />
                            <Route path='/charts/pie' component={ Pie } />
                            <Redirect to='/home' />
                        </Switch>
                    </Content>
                    <Footer style={{ textAlign: 'center', color: '#ccc' }}>@copy 2019</Footer>
                </Layout>
            </Layout>
        )
    }
}