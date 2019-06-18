import React from 'react'
import ReactDOM from 'react-dom'

import App from './app'
import memoryUtils from './utils/memoryUtils'
import storageUtils from './utils/storageUtils'

// 读取local中保存的user, 保存到内存中
const user = storageUtils.getItem('currUser')
memoryUtils.user = user

ReactDOM.render(<App />, document.getElementById('root'))