import React, { Component } from 'react'
/*HashRouter BrowserRouter*/
import { HashRouter, Route, Switch } from 'react-router-dom'

import Login from './pages/login/login'
import Admin from './pages/admin/admin'

/*
应用跟组件
 */
export default class App extends Component {

    render() {
        return (
            <HashRouter>
                {/*只匹配其中一个路由*/}
                <Switch>
                    <Route path='/login' component={ Login }></Route>
                    <Route path='/' component={ Admin }></Route>
                </Switch>
            </HashRouter>
        )
    }
}