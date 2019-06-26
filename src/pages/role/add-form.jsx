import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
    Form,
    Input,
} from 'antd'

const Item = Form.Item

/*
添加分类的form组件
 */
class AddForm extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    static propTypes = {
        setForm: PropTypes.func.isRequired,
    }

    componentWillMount() {
        // 将form对象通过setForm()传递父组件
        this.props.setForm(this.props.form)
    }

    render() {
        const { getFieldDecorator } = this.props.form

        // 指定Item布局的配置对象
        const formItemLayout = {
            labelCol: { span: 4 }, // 左侧label的宽度
            wrapperCol: { span: 16 }, // 指定右侧包裹的宽度
        }

        return (
            <Form {...formItemLayout}>
                <Item label='角色名称'>
                    {
                        getFieldDecorator('roleName', {
                            initialValue: '',
                            rules: [
                                {required: true, message: '角色名称必须输入'},
                            ],
                        })(
                            <Input placeholder='请输入角色名称'/>
                        )
                    }
                </Item>
            </Form>
        )
    }
}

export default Form.create()(AddForm)