import React, { Component } from 'react'
import { Form, Icon, Input, Button, message } from 'antd';

import './login.less'
import logo from './images/logo.png'


// 在import之后
const Item = Form.Item

/*
登录路由组件
 */
class Login extends Component {

    handleSubmit = (event) => {
        // 阻止事件的默认行为
        event.preventDefault()

        this.props.form.validateFields((err, values) => {
            // 校验成功
            if (!err) {
                console.log('Received values of form: ', values);
            } else {
                console.error(`校验失败`, err)
            }
        });
        // form表单对象
        const form = this.props.form;
        // 得到表单数据
        const values = form.getFieldsValue()
        console.log(`form json ${JSON.stringify(values)}`)
        message.error(`登录失败`)
    }

    /*
    密码自定义验证
     */
    validatePwd = (rule, value, callback) => {
        if(!value) {
            callback('请输入密码!')
        } else if(value.length < 4) {
            callback('密码不能小于4位')
        } else if(value.length > 12) {
            callback('密码不能大于12位')
        } else if(!/^[a-zA-Z0-9_]+$/.test(value)) {
            callback('密码不合法(数字字母下划线)')
        } else {
            // 验证通过
            callback()
        }
    }

    render () {
        const form = this.props.form;
        const { getFieldDecorator } = form;

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
                            {getFieldDecorator('username', {
                                rules: [
                                    { required: true, whitespace: true, message: '请输入用户名!' },
                                    { min: 4, message: '用户名至少4位' },
                                    { max: 12, message: '用户名至多12位' },
                                    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名不合法(数字字母下划线)' },
                                ],
                                initialValue: 'admin',
                            })(
                                <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="用户名"
                                />,
                            )}
                        </Item>
                        <Item>
                            {getFieldDecorator('password', {
                                rules: [
                                    { validator: this.validatePwd },
                                ],
                            })(
                                <Input
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="密码"
                                />,
                            )}
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

/*
包装form组件生成新的组件Form(Login)
 */
const WrapLogin = Form.create()(Login)
export default WrapLogin