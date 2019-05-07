import React, {Component} from 'react'

export default class Login extends Component {

    render () {
        return (
            <div className="box">
                <h2>Login</h2>
                <form action="login">
                    <div className="inputBox">
                        <input type="text" name="username" required />
                        <label>Username</label>
                    </div>
                    <div className="inputBox">
                        <input type="password" name="password" required />
                        <label>Password</label>
                    </div>
                    <input type="submit" value="Submit" />
                </form>
            </div>
        )
    }
    
}