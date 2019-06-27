import React, { Component } from 'react'
import {
    Card,
    Table,
    Button,
    Modal,
    message,
} from 'antd'
import { formateDate } from "../../utils/dateUtils"
import LinkButton from "../../components/link-button"
import { PAGE_SIZE } from "../../utils/constants"
import { reqAddOUpdateUser, reqDeleteUser, reqUsers } from "../../api"
import UserForm from "./user-form"

/*
用户路由
 */
export default class User extends Component {
    constructor(props) {
        super(props)
        this.state = {
            users: [], // 用户数据数组
            roles: [], // 所有角色的列表
            isShow: false, // 是否显示编辑框
        }
    }

    /*
    根据roles生成包含所有角色名的对象(key:role._id, value:role.name)
     */
    initRoleNames = (roles) => {
        const roleNames = roles.reduce((pre, role) => {
            pre[role._id] = role.name
            return pre
        }, {})
        this.roleNames = roleNames
    }

    initColumns = () => {
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username',
            },
            {
                title: '邮箱',
                dataIndex: 'email',
            },
            {
                title: '电话',
                dataIndex: 'phone',
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                render: formateDate,
            },
            {
                title: '所属角色',
                dataIndex: 'role_id',
                render: (role_id) => this.roleNames[role_id], // this.state.roles.find(role => role._id === role_id).name
            },
            {
                title: '操作',
                render: (user) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
                        <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
                    </span>
                )
            },

        ]
    }

    /*
    添加或更新用户
     */
    addOrUpdateUser = async () => {
        // 收集输入数据
        const user = this.form.getFieldsValue()
        // 更新 需要指定_id
        if(this.user) {
            user._id = this.user._id
        }
        this.form.resetFields()
        this.setState({isShow: false})
        // 提交
        const result = await reqAddOUpdateUser(user)
        if(result.status === 0) {
            message.success(`${this.user ? '修改' : '添加'}用户成功`)
            //更新列表显示
            this.getUsers()
        }
    }

    /*
    请求用户数据
     */
    getUsers = async () => {
        const result = await reqUsers()
        if(result.status === 0) {
            const {users, roles} = result.data
            this.initRoleNames(roles)
            this.setState({
                users,
                roles
            })
        }
    }

    /*
    删除用户
     */
    deleteUser = (user) => {
        Modal.confirm({
            title: `确认删除${user.username}吗?`,
            onOk: async () => {
                const result = await reqDeleteUser(user._id)
                if(result.status === 0) {
                    message.success('删除用户成功')
                    this.getUsers()
                }
            },
        })
    }

    /*
    显示修改界面
     */
    showUpdate = (user) => {
        // 保存user 用于区分添加或修改
        this.user = user
        this.setState({isShow: true})
    }

    componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getUsers()
    }

    render() {
        const {users, isShow, roles} = this.state
        const user = this.user || {}
        const title = (
            <Button type='primary' onClick={() => {
                this.user = undefined
                this.setState({isShow: true})
            }}>创建用户</Button>
        )
        return (
            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={users}
                    columns={this.columns}
                    pagination={
                        {
                            defaultPageSize: PAGE_SIZE,
                            showQuickJumper: true,
                        }
                    }
                />
                <Modal
                    title={this.user ? '修改用户' : "添加用户"}
                    visible={isShow}
                    onOk={this.addOrUpdateUser}
                    onCancel={() => {
                        this.form.resetFields()
                        this.setState({isShow: false})
                    }}
                >
                    <UserForm
                        setForm={form => {this.form = form}}
                        roles={roles}
                        user={user}
                    ></UserForm>
                </Modal>
            </Card>
        )
    }
}