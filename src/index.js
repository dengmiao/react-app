import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import App from './app'
import store from './redux/store'

// 读取local中保存的user, 保存到内存中
/*const user = storageUtils.getItem('currUser')
memoryUtils.user = user*/

ReactDOM.render((
    <Provider store={store}>
        <App />
    </Provider>
), document.getElementById('root'))