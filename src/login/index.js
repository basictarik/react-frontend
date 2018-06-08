import React from 'react';
import axios from 'axios';


class Login extends React.Component {
    constructor(props) {
        super(props);
    };

    handleSubmit(e) {
        e.preventDefault();
        const loginCredentials = {
            username: e.target[0].value,
            password: e.target[1].value,
        }
        axios.post('http://localhost:8000/login/', loginCredentials).
            then(res =>{
                window.localStorage.setItem('jwtToken', res.data.token);
            })
    }

    render() {
        return (
            <div>
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

export default Login;