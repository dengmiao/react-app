import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
    Upload,
    Icon,
    Modal,
    message,
} from 'antd'

import { reqDeleteImg } from '../../api'
import {BASE_IMG_URL} from "../../utils/constants"

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
    })
}

/*
用于图片上传的组件
 */
export default class PicturesWall extends Component {

    static propTypes = {
        imgs: PropTypes.array
    }

    constructor(props) {
        super(props)

        let fileList = []

        // 如果传入了imgs属性
        const { imgs } = this.props
        if(imgs && imgs.length > 0) {
            fileList = imgs.map((img, index) => ({
                uid: -index,
                name: img, // 图片文件名
                status: 'done', // 图片状态 done:已上传 uploading: 上传中 removed:已删除
                url: BASE_IMG_URL + img, // 图片预览地址
            }))
        }

        this.state = {
            previewVisible: false, // 标识是否显示预览图
            previewImage: '', // 预览图的url
            fileList, // 所有已上传图片的集合
        }
    }

    /*
    获取所有已上传图片文件名的数组
     */
    getImgs = () => {
        return this.state.fileList.map(file => file.name)
    }

    /*
    隐藏modal
     */
    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj)
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        })
    }

    /*
    file 当前操作的文件对象
    fileList 所有已上传文件的对象数组
    event 上传中的服务端响应内容，包含了上传进度等信息，高级浏览器支持
     */
    handleChange = async ({ file, fileList }) => {
        // 一旦上传成功 将当前上传的file的信息修正
        if(file.status === 'done') {
            const result = file.response
            if(result.status === 0) {
                message.success('上传图片成功')
                const {name, url} = result.data
                file = fileList[fileList.length - 1]
                file.name = name
                file.url = url
            }
            else {
                message.error('上传图片失败')
            }
        }
        // 删除
        else if(file.status === 'removed') {
            const result = await reqDeleteImg(file.name)
            if(result.status === 0) {
                message.success('删除图片成功')
            } else {
                message.error('删除图片失败')
            }
        }
        this.setState({ fileList })
        //console.log(file.status, file)
    }

    render() {
        const { previewVisible, previewImage, fileList } = this.state
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        )
        return (
            <div>
                <Upload
                    action="/manage/img/upload" /*上传图片的接口地址*/
                    accept='image/*' /*限定文件类型*/
                    name='image' /*请求参数名*/
                    listType="picture-card" /*卡片样式*/
                    fileList={fileList} /*所有已上传文件列表*/
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 3 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        )
    }
}
