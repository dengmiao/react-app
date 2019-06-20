import React, { Component } from 'react'
import {
    Card,
    Table,
    Button,
    Icon,
    Modal,
    message,
} from 'antd'

import LinkButton from '../../components/link-button'
import AddForm from './add-form'
import UpdateForm from './update-form'
import { reqCategorys, reqUpdateCategory } from '../../api'

/*
商品分类路由
 */
export default class Category extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false, // 是否正在获取数据中
            categoryList: [], // 一级分类列表
            subCategoryList: [],
            parentId: '0', // 当前显示分类列表的父分类id
            parentName: '', // 当前显示分类列表的父分类名称
            showVisible: 0, // modal显示状态, 0都不显示 1显示添加 2 显示编辑
        };
    }

    /*
    初始化列数组
     */
    initColumns = () => {
        this.columns = [
            {
                title: '分类名称',
                dataIndex: 'name',
            },
            {
                title: '操作',
                width: 300,
                render: (category) => ( // 返回需要显示的界面标签
                    <span>
                        <LinkButton onClick={ () => this.showUpdateCategory(category) }>修改分类</LinkButton>
                        {/*如何向事件回调函数传递参数: 先定义一个匿名函数 在函数中调用处理的函数并传入数据*/}
                        {
                            this.state.parentId === '0' ? <LinkButton onClick={ () => this.showSubCategoryList(category) }>查询子分类</LinkButton> : null
                        }
                    </span>
                ),
            },
        ]
    }

    /*
    获取表格数据
     */
    getCategoryList = async () => {
        // 请求前显示loading
        this.setState({loading: true})
        const { parentId } = this.state
        const result = await reqCategorys(parentId)
        // 请求完成隐藏loading
        this.setState({loading: false})
        if(result.status === 0) {
            if(parentId === '0') {
                this.setState({categoryList: result.data})
            } else {
                this.setState({subCategoryList: result.data})
            }
        } else {
            message.error('获取分类失败')
        }
    }

    /*
    显示指定一级分类的子分类
     */
    showSubCategoryList = (category) => {
        // 更新状态
        // setState()不能立即获取最新状态, 因为setState()是异步更新状态
        this.setState({
            parentId: category._id,
            parentName: category.name,
        }, () => { // 回调函数, 在状态更新完毕且重新render()后执行
            console.log(`parentId: ${this.state.parentId}`)
            this.getCategoryList()
        })
    }

    /*
    显示一级分类列表
     */
    showFirstCategoryList = () => {
        this.setState({
            parentId: '0',
            parentName: '',
            subCategoryList: [],
        })
    }

    /*
    取消对话框
     */
    handleCancel = () => {
        // 清除输入数据
        this.form && this.form.resetFields()

        this.setState({showVisible: 0})
    }

    /*
    弹出新增框
     */
    showAddCategory = () => {
        this.setState({showVisible: 1})
    }

    /*
    添加分类
     */
    addCategory = () => {
        // 请求

        // 关闭
        this.setState({showVisible: 0})
    }

    /*
    弹出编辑框
     */
    showUpdateCategory = (category) => {
        // 保存分类对象
        this.category = category

        this.setState({showVisible: 2})
    }

    /*
    编辑分类
     */
    updateCategory = async () => {
        // 请求

        // 1.关闭
        this.setState({showVisible: 0})

        const categoryId = this.category._id
        const categoryName = this.form.getFieldValue('categoryName')

        // 清除输入数据
        this.form.resetFields()

        // 2.发起请求保存数据
        const result = await reqUpdateCategory({categoryId, categoryName})
        if(result.status === 0) {
            // 3.重新渲染列表
            this.getCategoryList()
        } else {

        }
    }

    /*
    为第一次render()准备数据
     */
    componentWillMount() {
        this.initColumns()
    }

    /*
    执行异步任务 发起异步ajax
     */
    componentDidMount() {
        this.getCategoryList()
    }

    render() {

        // 读取状态数据
        const {categoryList, subCategoryList, parentId, parentName, loading, showVisible} = this.state

        // 读取分类对象
        const category = this.category || {}

        // title Card左侧
        const title = parentId === '0' ? '一级分类标题' : (
            <span>
                <LinkButton onClick={this.showFirstCategoryList}>一级分类标题</LinkButton>
                <Icon type='arrow-right' style={{marginRight: 10}}></Icon>
                <span>{parentName}</span>
            </span>
        )
        // extra Card右侧
        const extra = (
            <Button type='primary' onClick={this.showAddCategory}>
                <Icon type='plus' />
                添加
            </Button>
        )

        return (
            <Card title={ title } extra={ extra }>
                <Table
                    bordered
                    rowKey='_id'
                    loading={loading}
                    dataSource={parentId === '0' ? categoryList: subCategoryList}
                    columns={this.columns}
                    pagination={
                        {
                            defaultPageSize: 5,
                            showQuickJumper: true,
                        }
                    }
                />
                <Modal
                    title="添加分类"
                    visible={showVisible === 1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                >
                    <AddForm></AddForm>
                </Modal>
                <Modal
                    title="修改分类"
                    visible={showVisible === 2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                >
                    <UpdateForm
                        categoryName={category.name}
                        setForm={(form) => {this.form = form}}
                    ></UpdateForm>
                </Modal>
            </Card>
        )
    }
}