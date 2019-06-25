import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

/*
用于指定商品详情的富文本编辑器
what you see is what you get
 */
export default class RichTextEditor extends Component {

    static propTypes = {
        detail: PropTypes.array
    }

    constructor(props) {
        super(props)

        const { detail } = this.props

        const html = detail
        // 如果有值 根据html创建一个对应的编辑对象
        if(html) {
            const contentBlock = htmlToDraft(html)
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
                const editorState = EditorState.createWithContent(contentState)
                this.state = {
                    editorState,
                }
            }
        }
        // 如果没有值 创建一个没有内容的编辑对象
        else {
            this.state = {
                editorState: EditorState.createEmpty(),
            }
        }
    }

    /*
    输入过程实时回调
     */
    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        })
    }

    /*
    获取美化后的标签文本
     */
    getDetail = () => {
        const { editorState } = this.state
        return draftToHtml(convertToRaw(editorState.getCurrentContent()))
    }

    uploadImageCallBack = (file) => {
        return new Promise(
            (resolve, reject) => {
                const xhr = new XMLHttpRequest()
                xhr.open('POST', '/manage/img/upload')
                const data = new FormData()
                data.append('image', file)
                xhr.send(data)
                xhr.addEventListener('load', () => {
                    const response = JSON.parse(xhr.responseText)
                    const {url} = response.data
                    resolve({data: {link: url}})
                })
                xhr.addEventListener('error', () => {
                    const error = JSON.parse(xhr.responseText)
                    reject(error)
                })
            }
        )
    }

    render() {
        const { editorState } = this.state
        return (
            <div>
                <Editor
                    editorState={editorState}
                    editorStyle={{border: '1px solid black', minHeight: 200, padding: '0px 20px'}}
                    onEditorStateChange={this.onEditorStateChange}
                    toolbar={{
                        inline: { inDropdown: true },
                        list: { inDropdown: true },
                        textAlign: { inDropdown: true },
                        link: { inDropdown: true },
                        history: { inDropdown: true },
                        image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
                    }}
                />
                <textarea
                    disabled
                    style={{display: 'none'}} /*textarea可以不需要*/
                    value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
                />
            </div>
        )
    }
}