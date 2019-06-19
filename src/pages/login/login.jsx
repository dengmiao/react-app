import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Form, Icon, Input, Button, message } from 'antd'

import { reqLogin } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'

import './login.less'
import logo from '../../assets/images/logo.svg'


// 在import之后
const Item = Form.Item

/*
登录路由组件
 */
class Login extends Component {

    handleSubmit = (event) => {
        // 阻止事件的默认行为
        event.preventDefault()

        this.props.form.validateFields(async (err, values) => {
            // 校验成功
            if (!err) {
                //console.log('Received values of form: ', values);
                // 请求登录
                const {username, password} = values
                const result = await reqLogin(username, password)
                if(result.status === 0) {
                    message.success('登录成功')

                    // 保存user
                    const user = result.data
                    memoryUtils.user = user
                    storageUtils.setItem('currUser', user)

                    // 页面跳转至管理页面(不需要回退, 不用push())
                    this.props.history.replace('/')
                } else {
                    message.error(`登录失败, ${result.msg}`)
                }
            } else {
                console.error(`校验失败`, err)
            }
        });
        // form表单对象
        //const form = this.props.form;
        // 得到表单数据
        //const values = form.getFieldsValue()
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
        // 判断用户是否已经登录
        const user = memoryUtils.user
        if(user && user._id) {
            return <Redirect to='/'/>
        }

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

/*
async await简化promise对象的使用
不用再使用.then()或.catch()来指定成功或失败的回调函数
以同步编码方式(消灭回调函数)实现异步流程

在promise表达式左侧写await, 以等待异步执行结果

在await所在函数(最近)定义的左侧
 */