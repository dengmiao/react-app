import React, { Component } from 'react'
import {
    Card,
    Button,
    Table,
    Modal,
    message,
} from 'antd'
import { connect } from 'react-redux'
import { logout } from '../../redux/actions'

import { PAGE_SIZE } from "../../utils/constants"
import { reqRoles, reqAddRole, reqUpdateRole } from '../../api'
import AddForm from "./add-form"
import AuthForm from "./auth-form"
import { formateDate } from '../../utils/dateUtils'

/*
角色路由
 */
class Role extends Component {
    constructor(props) {
        super(props)
        this.state = {
            roles: [], // 所有角色列表
            role: {}, // 选中的行对象
            isShowAdd: false, // 添加角色modal显示状态
            isShowAuth: false, // 设置权限modal显示状态
        }
        this.auth = React.createRef()
    }

    initColumns = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name',
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render: (create_time) => formateDate(create_time),
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: formateDate,
            },
            {
                title: '授权人',
                dataIndex: 'auth_name',
            },
        ]
    }

    getRoles = async () => {
        const result = await reqRoles()
        if(result.status === 0) {
            const roles = result.data
            this.setState({
                roles,
            })
        }
    }

    /*
    表格行点击事件
     */
    onRow = (role) => {
        return {
            // 点击行
            onClick: event => {
                this.setState({
                    role,
                })
            },
        }
    }

    /*
    添加角色
     */
    addRole = () => {
        // 表单验证
        this.form.validateFields(async (error, values) => {
            if(!error) {
                // 收集输入数据
                const {roleName} = values
                this.setState({isShowAdd: false})
                // 表单重置
                this.form.resetFields()

                // 请求
                const result = await reqAddRole(roleName)
                if(result.status === 0) {
                    message.success('添加角色成功')
                    const role = result.data
                    // 更新roles状态
                    /*const roles = this.state.roles
                    roles.push(role)
                    this.setState({roles})*/
                    //const roles = [...this.state.roles]
                    // 更新roles状态： 基于原本状态数据更新
                    this.setState((state, props) => ({
                        roles: [...state.roles, role]
                    }))
                } else {
                    message.error('添加角色失败')
                }
            }
        })
    }

    /*
    更新角色授权
     */
    updateRole = async () => {
        // 隐藏确认框
        this.setState({isShowAuth: false})
        const {role} = this.state
        // 得到最新的menus
        const menus = this.auth.current.getMenus()
        role.menus = menus
        role.auth_time = Date.now()
        role.auth_name = this.props.user.username

        // 请求
        const result = await reqUpdateRole(role)
        const roleName = role.name
        if(result.status === 0) {
            // 如果当前更新的是自己角色的权限 强制退出
            if(role._id === this.props.user.role_id) {
                /*memoryUtils.user = {}
                storageUtils.removeItem('currUser')
                message.info('当前用户角色已修改, 请重新登录')
                this.props.history.replace('/login')*/
                this.props.logout()
            } else {
                this.setState({
                    roles: [...this.state.roles]
                })
                message.success(`角色\`${roleName}\`授权成功`)
            }
        } else {
            message.error(`角色\`${roleName}\`授权失败`)
        }
    }

    componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getRoles()
    }

    render() {
        const {roles, role, isShowAdd, isShowAuth} = this.state
        const title = (
            <span>
                <Button type='primary' onClick={() => this.setState({isShowAdd: true})}>创建角色</Button>&nbsp;&nbsp;
                <Button type='primary' disabled={!(role && role._id)} onClick={() => this.setState({isShowAuth: true})}>设置权限</Button>
            </span>
        )

        return (
            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    loading={false}
                    dataSource={roles}
                    columns={this.columns}
                    pagination={
                        {
                            defaultPageSize: PAGE_SIZE,
                            showQuickJumper: true,
                        }
                    }
                    rowSelection={{
                        type: 'radio',
                        selectedRowKeys: [role._id],
                        onSelect: (role) => { // 选择某个radio的回调
                            this.setState({role})
                        },
                    }}
                    onRow={this.onRow}
                />
                <Modal
                    title="添加角色"
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={() => {
                        this.setState({
                            isShowAdd: false,
                        })
                        this.form.resetFields()
                    }}
                >
                    <AddForm
                        setForm={(form) => {this.form = form}}
                    ></AddForm>
                </Modal>
                <Modal
                    title="设置角色权限"
                    visible={isShowAuth}
                    onOk={this.updateRole}
                    onCancel={() => {
                        this.setState({
                            isShowAuth: false,
                        })
                    }}
                >
                    <AuthForm
                        ref={this.auth}
                        role={role}
                    />
                </Modal>
            </Card>
        )
    }
}

export default connect(
    state => ({user: state.user}),
    {logout}
)(Role)