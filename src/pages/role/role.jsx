import React, { Component } from 'react'
import {
    Card,
    Button,
    Table,
    Modal,
    message,
} from 'antd'
import { PAGE_SIZE } from "../../utils/constants"
import { reqRoles, reqAddRole } from '../../api'
import AddForm from "./add-form"

/*
角色路由
 */
export default class Role extends Component {
    constructor(props) {
        super(props)
        this.state = {
            roles: [], // 所有角色列表
            role: {}, // 选中的行对象
            isShowAdd: false, // 添加角色modal显示状态
            isShowAuth: false,
        }
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
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
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

    componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getRoles()
    }

    render() {
        const {roles, role, isShowAdd} = this.state
        const title = (
            <span>
                <Button type='primary' onClick={() => this.setState({isShowAdd: true})}>创建角色</Button>&nbsp;&nbsp;
                <Button type='primary' disabled={!(role && role._id)}>设置权限</Button>
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
                        selectedRowKeys: role._id,
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
            </Card>
        )
    }
}