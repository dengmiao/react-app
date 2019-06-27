import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {
    Form,
    Input,
    Tree,
} from 'antd'

import menuList from '../../config/menuConfig'

const Item = Form.Item
const { TreeNode } = Tree

/*
添加分类的form组件
 */
export default class AuthForm extends PureComponent {
    constructor(props) {
        super(props)
        // 根据传入角色的menus生成初始状态
        const {menus} = this.props.role
        this.state = {
            checkedKeys: menus
        }
    }

    static propTypes = {
        role: PropTypes.object
    }

    /*
    为父组件提供获取最新menus数据的方法
     */
    getMenus = () => this.state.checkedKeys

    /*
    生成树形菜单
     */
    getTreeNodes = (menuList) => {
        return menuList.reduce((pre, item) => {
            pre.push(
                <TreeNode title={item.title} key={item.key}>
                    {
                        item.children ? this.getTreeNodes(item.children) : null
                    }
                </TreeNode>
            )
            return pre
        },[])
    }

    /*
    tree选中事件
     */
    onCheck = checkedKeys => {
        this.setState({ checkedKeys })
    }

    componentWillMount() {
        this.treeNodes = this.getTreeNodes(menuList)
    }

    /*
    当组件接收到新的属性时自动调用 在render()之前
     */
    componentWillReceiveProps(nextProps, nextContext) {
        console.log('componentWillReceiveProps()', nextProps)
        // 根据新传入的role更新checkedKeys
        const menus = nextProps.role.menus
        this.setState({checkedKeys: menus})
    }

    render() {
        console.log('AuthForm render()')
        const {role} = this.props
        const {checkedKeys} = this.state
        // 指定Item布局的配置对象
        const formItemLayout = {
            labelCol: { span: 4 }, // 左侧label的宽度
            wrapperCol: { span: 16 }, // 指定右侧包裹的宽度
        }

        return (
            <div>
                <Item label='角色名称' {...formItemLayout}>
                    <Input value={role.name} disabled/>
                </Item>

                <Item label='拥有权限' {...formItemLayout}>
                    <Tree
                        checkable
                        defaultExpandAll
                        checkedKeys={checkedKeys}
                        onCheck={this.onCheck}
                    >
                        <TreeNode title="平台权限" key="all">
                            {
                                this.treeNodes
                            }
                        </TreeNode>
                    </Tree>
                </Item>
            </div>
        )
    }
}