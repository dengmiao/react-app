import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom'
import { Menu, Icon } from 'antd';

import menuList from '../../config/menuConfig'
import './index.less'

import logo from '../../assets/images/logo.svg'

const { SubMenu }  = Menu;

/*
左侧导航组件
 */
class LeftNav extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    /*
    根据menu数据数组生成对应的标签数组
    map() + 递归
    */
    getMenuNodesMap = (menuList) => {
        return menuList.map(item => {
            if(item.children && item.children.length > 0) {
                return (
                    <SubMenu
                        key={ item.key }
                        title={
                            <span>
                                <Icon type={ item.icon } />
                                <span>{ item.title }</span>
                            </span>
                        }>
                        {
                            this.getMenuNodesMap(item.children)
                        }
                    </SubMenu>
                )
            }
            else {
                return (
                    <Menu.Item key={ item.key }>
                        <Link to={ item.key }>
                            <Icon type={ item.icon } />
                            <span>{ item.title }</span>
                        </Link>
                    </Menu.Item>
                )
            }
        });
    }

    /*
    根据menu数据数组生成对应的标签数组
    reduce() + 递归
    */
    getMenuNodesReduce = (menuList) => {
        // 得到当前请求的路由路径
        const path = this.props.location.pathname
        return menuList.reduce((pre, item) => {
            // 向pre中添加<SubMenu>
            if(item.children && item.children.length > 0) {
                pre.push((
                    <SubMenu
                        key={ item.key }
                        title={
                            <span>
                                <Icon type={ item.icon } />
                                <span>{ item.title }</span>
                            </span>
                        }>
                        {
                            this.getMenuNodesReduce(item.children)
                        }
                    </SubMenu>
                ))

                // 查找一个与当前路由匹配的子item
                const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
                // 如果存在, 说明当前item所在的子列表需要展开
                if(cItem) {
                    this.openKey = item.key
                }
            }
            // 向pre中添加<Menu.Item>
            else {
                pre.push((
                    <Menu.Item key={ item.key }>
                        <Link to={ item.key }>
                            <Icon type={ item.icon } />
                            <span>{ item.title }</span>
                        </Link>
                    </Menu.Item>
                ))
            }
            return pre
        }, [])
    }

    /*
    第一次render() 之前执行一次
    为第一次渲染准备数据(同步的)
     */
    componentWillMount() {
        this.menuNodes = this.getMenuNodesReduce(menuList)
    }

    render() {
        // 得到当前请求的路由路径
        const path = this.props.location.pathname
        // console.log(`render(${path})`)
        // 得到需要展开的openKey
        const openKey = this.openKey
        return (
            <div className='left-nav'>
                <Link to='/' className='left-nav-header'>
                    <img src={ logo } alt='logo' />
                    <h1>React 后台</h1>
                </Link>
                <Menu
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                    mode="inline"
                    theme="dark"
                    //inlineCollapsed={this.state.collapsed}
                >
                    {
                        this.menuNodes
                    }
                </Menu>
            </div>
        )
    }
}

/*
withRouter 高阶组件
包装非路由组件, 返回一个新的组件
新的组件向非路由组件传递3个属性: history, location, match
 */
export default withRouter(LeftNav)