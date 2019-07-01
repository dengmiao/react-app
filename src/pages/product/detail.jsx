import React, { Component } from 'react'
import {
    Card,
    Icon,
    List
} from 'antd'
import LinkButton from "../../components/link-button"
import { BASE_IMG_URL } from '../../utils/constants'
import { reqCategory } from '../../api'
import memoryUtils from "../../utils/memoryUtils"

const Item = List.Item

/*
product的详情路由组件
 */
export default class ProductDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            categoryNameFirst: '', // 一级分类名称
            categoryNameSecond: '', // 二级分类名称
        }
    }

    async componentDidMount() {
        // 得到当前商品的分类id
        // hashRouter 不适用
        // const {categoryId, pCategoryId} = this.props.location.state.product
        const {categoryId, pCategoryId} = memoryUtils.product
        // 一级分类下的商品
        if(pCategoryId === '0') {
            const result = await reqCategory(categoryId)
            const categoryNameFirst = result.data.name
            this.setState({categoryNameFirst})
        }
        // 二级分类下的商品
        else {
            /*
            // 通过多个await方式发送请求 后一个请求是在前一个请求发送成功才发送
            const resultFirst = await reqCategory(pCategoryId)
            const categoryNameFirst = resultFirst.data.name
            const resultSecond = await reqCategory(categoryId)
            const categoryNameSecond = resultSecond.data.name
            */

            // 一次发送多个请求 只有都成功 才处理
            const results = await Promise.all([
                reqCategory(pCategoryId),
                reqCategory(categoryId)
            ])
            const categoryNameFirst = results[0].data.name
            const categoryNameSecond = results[1].data.name
            this.setState({
                categoryNameFirst,
                categoryNameSecond
            })
        }
    }

    /*
    组件卸载之前调用
     */
    componentWillUnmount() {
        // 清除保存数据
        memoryUtils.product = {}
    }

    render() {
        // 读取携带过来的状态数据
        const {name, desc, price, detail, imgs} = memoryUtils.product
        // 取出状态数据
        const {categoryNameFirst, categoryNameSecond} = this.state


        const title = (
            <span>
                <LinkButton>
                    <Icon type='arrow-left' style={{marginRight: 15, fontSize: 20}} onClick={() => this.props.history.goBack()}></Icon>
                </LinkButton>
                <span>商品详情</span>
            </span>
        )
        return (
            <Card title={title} className="product-detail">
                <List>
                    <Item>
                        <span className="left">商品名称:</span>
                        <span>{name}</span>
                    </Item>
                    <Item>
                        <span className="left">商品描述:</span>
                        <span>{desc}</span>
                    </Item>
                    <Item>
                        <span className="left">商品价格:</span>
                        <span>{price}</span>
                    </Item>
                    <Item>
                        <span className="left">所属分类:</span>
                        <span>{categoryNameFirst} {categoryNameSecond !== '' ? ' --> ' + categoryNameSecond : ''}</span>
                    </Item>
                    <Item>
                        <span className="left">商品图片:</span>
                        <span>
                            {
                                imgs.map(img => (
                                    <img key={img} className="product-img" src={BASE_IMG_URL + img} alt=''/>
                                ))
                            }

                        </span>
                    </Item>
                    <Item>
                        <span className="left">商品详情:</span>
                        <span dangerouslySetInnerHTML={{__html: detail}}></span>
                    </Item>
                </List>
            </Card>
        )
    }
}