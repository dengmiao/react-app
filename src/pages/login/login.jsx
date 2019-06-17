import React, { Component } from 'react'
import { Form, Icon, Input, Button, message } from 'antd';

import './login.less'
import logo from './images/logo.png'


// 在import之后
const Item = Form.Item

/*
登录路由组件
 */
export default class Login extends Component {

    handleSubmit = (event) => {
        message.error(`登录失败`)
    }

    render () {
        return (
            <div className='login'>
                <header className='login-header'>
                    <img src={ logo } alt='logo' />
                    <h1>React 后台管理系统</h1>
                </header>
                <section className='login-content'>
                    <h2>用户登录</h2>
                    <Form onSubmit={this.handleSubmit} className='login-form'>
                        <Item>
                            <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="用户名"
                            />
                        </Item>
                        <Item>
                            <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="密码"
                            />
                        </Item>
                        <Item>
                            <Button type="primary" htmlType="submit" className='login-form-button'>
                                登录
                            </Button>
                        </Item>
                    </Form>
                </section>
            </div>
        )
    }
    
}