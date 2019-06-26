import React, { Component } from 'react'
import {
    Card,
    Icon,
    Form,
    Input,
    Cascader,
    Button,
    message,
} from 'antd'
import LinkButton from "../../components/link-button"
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'
import { reqCategorys, reqAddOrUpdateProduct } from '../../api'

const { Item } = Form
const { TextArea } = Input

/*
product的编辑路由组件
 */
class ProductAddUpdate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            options: [],
        }
        // 创建用来保存ref标识的标签对象的容器
        this.pw = React.createRef()
        this.editor = React.createRef()
    }

    /*
    用于加载下一级列表的回调
     */
    loadData = async selectedOptions => {
        // 得到选择的option对象
        const targetOption = selectedOptions[selectedOptions.length - 1]
        // loading 显示
        targetOption.loading = true

        // 根据选中的分类 获取二级分类
        const subCategorys = await this.getCategorys(targetOption.value)
        // loading 隐藏
        targetOption.loading = false
        if(subCategorys && subCategorys.length > 0) {
            // 生成二级列表的options
            const childOptions = subCategorys.map(item => ({
                value: item._id,
                label: item.name,
                isLeaf: true,
            }))
            // 关联到当前option
            targetOption.children = childOptions
        }
        // 当前选中项没有二级分类
        else {
            targetOption.isLeaf = true
        }
        this.setState({
            options: [...this.state.options],
        })
    }

    initOptions = async (categorys) => {
        // 根据categorys生成options
        const options = categorys.map(item => ({
            value: item._id,
            label: item.name,
            isLeaf: false,
        }))

        // 如果是一个二级分类商品更新
        const { isUpdate, product } = this
        const { pCategoryId } = product
        if(isUpdate && pCategoryId !== '0') {
            // 获取对应的二级分类列表
            const subCategorys = await this.getCategorys(pCategoryId)
            // 生成二级下拉列表的options
            const childOptions = subCategorys.map(item => ({
                value: item._id,
                label: item.name,
                isLeaf: true,
            }))
            // 过滤当前商品对应的一级option
            const targetOption = options.find(option => option.value === pCategoryId)
            // 关联到对应的一级option上
            targetOption.children = childOptions
        }

        this.setState({options})
    }

    /*
    异步获取一级/二级分类列表
    async 函数的返回值是一个promise对象 promise的结果和值由async的结果决定
     */
    getCategorys = async (parentId) => {
        const result = await reqCategorys(parentId)
        if(result.status === 0) {
            const categorys = result.data
            // 如果是一级分类
            if(parentId === '0') {
                this.initOptions(categorys)
            }
            // 二级分类列表
            else {
                // 返回二级分类列表 当前async函数返回的promise就会成功且value为catgorys
                return categorys
            }
        }
    }

    /*
    验证价格
     */
    validatorPrice = (rule, value, callback) => {
        if(value * 1 > 0) {
            callback() // 验证通过
        } else {
            callback('价格必须大于0') // 验证不通过
        }
    }

    submit = () => {
        // 进行表单验证
        this.props.form.validateFields(async (err, values) => {
            if(!err) {
                // 收集输入数据 封装成product对象
                const {name, desc, price, categoryIds} = values
                let categoryId, pCategoryId
                if(categoryIds.length === 1) {
                    pCategoryId = '0'
                    categoryId = categoryIds[0]
                } else {
                    pCategoryId = categoryIds[0]
                    categoryId = categoryIds[1]
                }
                const imgs = this.pw.current.getImgs()
                const detail = this.editor.current.getDetail()
                const product = {
                    name, desc, price, categoryId, pCategoryId, imgs, detail,
                }
                // 如果是新增
                if(this.isUpdate) {
                    product._id = this.product._id
                }
                // 调用接口请求函数去添加/更新
                const result = await reqAddOrUpdateProduct(product)

                if(result.status === 0) {
                    message.success(`${this.isUpdate ? '更新' : '添加'}商品成功`)
                    this.props.history.goBack()
                } else {
                    message.error(`${this.isUpdate ? '更新' : '添加'}商品失败`)
                }

                //alert(`请求提交${JSON.stringify(values)}`)
                console.log(`图片: ${imgs}, 标签文本: ${detail}`)
            }
        })
    }

    componentDidMount() {
        this.getCategorys('0')
    }

    componentWillMount() {
        // 取出编辑按钮携带的数据
        const product = this.props.location.state
        // 保存是否是更新的标识
        this.isUpdate = !!product
        // 用于修改时的默认显示
        this.product = product || {}
    }

    render() {
        const { isUpdate, product } = this
        const { categoryId, pCategoryId, imgs } = product
        // 用于接收级联分类id的数组
        const categoryIds = []
        if(isUpdate) {
            if(pCategoryId !== '0') {
                categoryIds.push(pCategoryId)
            }
            categoryIds.push(categoryId)
        }

        // 指定Item布局的配置对象
        const formItemLayout = {
            labelCol: { span: 2 }, // 左侧label的宽度
            wrapperCol: { span: 8 }, // 指定右侧包裹的宽度
        }

        // 头部左侧标题
        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.goBack()}>
                    <Icon type="arrow-left" style={{fontSize: 20}}></Icon>
                </LinkButton>
                <span>{ isUpdate ? '修改商品' : '添加商品' }</span>
            </span>
        )

        const { getFieldDecorator } = this.props.form

        return (
            <Card title={title}>
                <Form {...formItemLayout}>
                    <Item label='商品名称'>
                        {
                            getFieldDecorator('name', {
                                initialValue: product.name,
                                rules: [
                                    {required: true, message: '商品名称必须输入'},
                                ],
                            })(
                                <Input placeholder='商品名称'/>
                            )
                        }
                    </Item>
                    <Item label='商品描述'>
                        {
                            getFieldDecorator('desc', {
                                initialValue: product.desc,
                                rules: [
                                    {required: true, message: '商品描述必须输入'},
                                ],
                            })(
                                <TextArea placeholder='商品描述' autosize={{ minRows: 1, maxRows: 6 }} />
                            )
                        }
                    </Item>
                    <Item label='商品价格'>
                        {
                            getFieldDecorator('price', {
                                initialValue: product.price,
                                rules: [
                                    {required: true, message: '商品价格必须输入'},
                                    {validator: this.validatorPrice},
                                ],
                            })(
                                <Input type='number' placeholder='商品价格' addonAfter="元"/>
                            )
                        }
                    </Item>
                    <Item label='商品分类'>
                        {
                            getFieldDecorator('categoryIds', {
                                initialValue: categoryIds,
                                rules: [
                                    {required: true, message: '商品分类必须选择'},
                                ],
                            })(
                                <Cascader
                                    placeholder='商品分类'
                                    options={this.state.options} /*需要显示的列表数据*/
                                    loadData={this.loadData} /*当选择某个列表项 加载下一级列表的监听回调*/
                                    onChange={this.onChange}
                                    changeOnSelect
                                />
                            )
                        }
                    </Item>
                    <Item label='商品图片'>
                        <PicturesWall ref={this.pw} imgs={imgs}/>
                    </Item>
                    {/*labelCol: { span: 2 }, // 左侧label的宽度
                    wrapperCol: { span: 8 }, // 指定右侧包裹的宽度*/}
                    <Item label='商品详情' labelCol={{span: 2}} wrapperCol={{span: 20}}>
                        <RichTextEditor ref={this.editor} detail={product.detail}/>
                    </Item>
                    <Item style={{textAlign: 'center'}}>
                        <Button type='primary' onClick={this.submit}>提交</Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}
export default Form.create()(ProductAddUpdate)

/*
1、子组件调用父组件的方法: 将父组件的方法以函数属性的形式传递给子组件 子组件将可以调用
2、父组件调用子组件的方法: 在父组件中通过ref得到子组件标签对象（亦即组件对象） 调用其方法
 */