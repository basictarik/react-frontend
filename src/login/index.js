import React from 'react';
import axios from 'axios';
import {withRouter} from 'react-router-dom';

class Login extends React.Component {

    handleSubmit = e => {
        e.preventDefault();
        const loginCredentials = {
            username: e.target[0].value,
            password: e.target[1].value,
        }
        axios.post('http://localhost:8000/login/', loginCredentials).
            then(res => {
                window.localStorage.setItem('jwtToken', res.data.token);
                this.props.handler();
                this.props.history.push('/forum');
                var intervalID = setInterval(function () {
                    const oldToken = {
                        'token': localStorage.getItem('jwtToken')
                    }
                    axios.post('http://localhost:8000/token_renew/', oldToken).then(res => {
                        window.localStorage.setItem('jwtToken', res.data.token);
                    }).catch(function (error) {
                        if (error.response) {
                            clearInterval(intervalID);
                        }
                    })
                }, 20 * 59 * 1000);
            });
    }

    render() {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label>Username:</label>
                        <br />
                        <input name="user" type="text" placeholder="Username" required />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <br />
                        <input name="pw" onChange={this.handleChange} type="password" placeholder="Password" required />
                    </div>
                    <button>
                        Submit
                    </button>
                </form>
            </div>
        );
    }
}

export default withRouter(Login);