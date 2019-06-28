import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

/*
redux核心管理对象
 */
import reducer from './reducer'

export default createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))