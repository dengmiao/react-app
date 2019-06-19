import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import { reqWeather } from "../../api"
import { formateDate } from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import menuList from '../../config/menuConfig'
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
        setInterval(() => {
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
                const cItem = item.children.find(cItem => cItem.key === path)
                if(cItem) {
                    title = cItem.title
                }
            }
        })
        return title
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

    render() {
        const { currentTime, dayPictureUrl, weather } = this.state
        const { username } = memoryUtils.user

        const title = this.getTitle()

        return (
            <div className='header'>
                <div className="header-top">
                    <span>欢迎, { username }</span>
                    {/*<a href="javascript: alert(11)">退出</a>*/}
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

export default withRouter(Header)