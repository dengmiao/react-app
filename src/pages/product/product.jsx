import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import ProductHome from './home'
import ProductAddUpdate from './add-update'
import ProductDetail from './detail'
import './product.less'

/*
商品路由
 */
export default class Product extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return (
            <Switch>
                {/*exact bool 完全匹配*/}
                <Route path="/product" component={ ProductHome } exact/>
                <Route path="/product/addUpdate" component={ ProductAddUpdate }/>
                <Route path="/product/detail" component={ ProductDetail }/>
                <Redirect to="/product"/>
            </Switch>
        )
    }
}