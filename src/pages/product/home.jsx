import React, { Component } from 'react'
import {
    Card,
    Select,
    Input,
    Button,
    Icon,
    Table,
    message
} from 'antd'

import LinkButton from '../../components/link-button'
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../api'
import { PAGE_SIZE } from '../../utils/constants'

const Option = Select.Option

/*
product的默认子路由组件
 */
export default class ProductHome extends Component {
    constructor(props) {
        super(props)
        this.state = {
            total: 0, // 商品总数量
            productList: [], // 商品数据数组
            loading: false, // 是否正在加载中
            searchName: '', // 搜索的关键字
            searchType: 'productName', // 根据哪个字段搜索
        }
    }

    /*
    初始化表格列的数组
     */
    initColumns = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
            },
            {
                title: '价格',
                dataIndex: 'price',
                render: (price) => "¥" + price, // 当前指定了队形属性dataIndex, 传入的是对应的属性值, 否则行对象
            },
            {
                width: 150,
                title: '状态',
                render: (product) => {
                    const {status, _id} = product
                    return (
                        <span>
                            <Button
                                type="primary"
                                onClick={() => {this.updateStatus(_id, 1-status)}}
                            >
                                {status === 1 ? '下架' : '上架'}
                            </Button>
                            <span>{status === 1 ? '在售' : '已下架'}</span>
                        </span>
                    )
                },
            },
            {
                width: 150,
                title: '操作',
                render: (product) => {
                    return (
                        <span>
                            <LinkButton>修改</LinkButton>
                            {/*将product对象使用state传递给目标路由组件*/}
                            <LinkButton onClick={() => this.props.history.push('/product/detail', {product})}>详情</LinkButton>
                        </span>
                    )
                }
            },
        ]
    }

    getProductList = async (pageNum) => {
        // 页码存储
        this.pageNum = pageNum
        // 显示loading
        this.setState({loading: true})

        const {searchName, searchType} = this.state
        let result
        // 如果有关键字 说明是搜索分页
        if(searchName) {
            result = await reqSearchProducts({pageNum, pageSize: PAGE_SIZE, searchType, searchName})
        }
        // 一般分页
        else {
            result = await reqProducts({pageNum, pageSize: PAGE_SIZE})
        }

        // 隐藏loading
        this.setState({loading: false})
        if(result.status === 0) {
            // 取出分页数据 更新状态 显示分页列表
            const {total, list} = result.data
            this.setState({
                total,
                productList: list
            })
        }
    }

    updateStatus = async (productId, status) => {
        const result = await reqUpdateStatus({productId, status})
        if(result.status === 0) {
            message.success('更新商品成功')
            // 刷新列表
            this.getProductList(this.pageNum)
        }
    }

    componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getProductList()
    }

    render() {
        // 取出状态数据
        const { productList, total, loading, searchType, searchName } = this.state
        const title = (
            <span>
                <Select
                    value={searchType}
                    style={{width: 150}}
                    onChange={value => this.setState({searchType: value})}
                >
                    <Option value="productName">按名称搜索</Option>
                    <Option value="productDesc">按描述搜索</Option>
                </Select>
                <Input
                    placeholder="请输入关键字"
                    style={{width: 150, margin: '0 15px'}}
                    value={searchName}
                    onChange={event => this.setState({searchName: event.target.value})}
                />
                <Button type="primary" onClick={() => this.getProductList(1)}>搜索</Button>
            </span>
        )
        const extra = (
            <Button type="primary">
                <Icon type="plus"></Icon>
                添加商品
            </Button>
        )

        return (
            <Card title={title} extra={extra}>
                <Table
                    bordered
                    rowKey='_id'
                    loading={loading}
                    dataSource={productList}
                    columns={this.columns}
                    pagination={
                        {
                            total,
                            defaultPageSize: PAGE_SIZE,
                            showQuickJumper: true,
                            onChange: this.getProductList,
                        }
                    }
                />
            </Card>
        )
    }
}