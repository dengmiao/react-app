import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Modal } from 'antd'
import { connect } from 'react-redux'

import LinkButton from '../link-button'
import { reqWeather } from "../../api"
import { formateDate } from '../../utils/dateUtils'
import menuList from '../../config/menuConfig'
import { logout } from '../../redux/actions'
import './index.less'

/*
头部
 */
class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // 当前时间的字符串
            currentTime: formateDate(Date.now()),
            // 天气图片url
            dayPictureUrl: '',
            // 天气文本
            weather: '',
        };
    }

    getTime = () => {
        // 每隔1秒 获取当前时间 更新currentTime
        this.intervalIndex = setInterval(() => {
            const currentTime = formateDate(Date.now())
            this.setState({currentTime})
        },1000)
    }

    getWeather = async () => {
        // 调用接口请求异步获取数据
        const {dayPictureUrl, weather} = await reqWeather('成都')
        // 更新状态
        this.setState({dayPictureUrl, weather})
    }

    getTitle = () => {
        // 得到当前请求路径
        const path = this.props.location.pathname
        let title = ''
        menuList.forEach((item) => {
            if(item.key === path) {
                title = item.title
            } else if(item.children) {
                const cItem = item.children.find(cItem =>  path.indexOf(cItem.key) === 0)
                if(cItem) {
                    title = cItem.title
                }
            }
        })
        return title
    }

    logout = () => {
        // 弹出提示对话框
        Modal.confirm({
            title: '您确定要退出登录吗?',
            content: '',
            onOk: () => {
                /*// 删除保存的user数据
                storageUtils.removeItem('currUser')
                memoryUtils.user = {}*/
                this.props.logout()
                // 跳转登录页面
                /*this.props.history.replace('/login')*/
            },
        })
    }

    /*
    第一次render()之后执行一次
    一般在此执行异步操作: 发ajax请求/启动定时器
     */
    componentDidMount() {
        // 获取当前时间
        this.getTime()
        // 获取天气
        // 40节
        this.getWeather()
    }

    /*
    当前组件卸载之前调用
     */
    componentWillUnmount() {
        // 清除定时器
        clearInterval(this.intervalIndex)
    }

    render() {
        const { currentTime, dayPictureUrl, weather } = this.state
        //const { username } = memoryUtils.user
        const { username } = this.props.user

        //const title = this.getTitle()
        const title = this.props.headTitle

        return (
            <div className='header'>
                <div className="header-top">
                    <span>欢迎, { username }</span>
                    <LinkButton onClick={ this.logout }>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{ title }</div>
                    <div className="header-bottom-right">
                        <span>{ currentTime }</span>
                        <img src={ dayPictureUrl } alt="weather" />
                        <span>{ weather }</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(
    state => ({headTitle: state.headTitle, user: state.user}),
    {logout}
)(withRouter(Header))