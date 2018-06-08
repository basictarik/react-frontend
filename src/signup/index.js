import React from 'react';
import axios from 'axios';

class SignUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            passwordInput: "",
            passwordLength: ""
        };
        this.handleChange = this.handleChange.bind(this);
    };

    handleChange(e) {
        e.preventDefault();
        if (e.target.value.length < 8 && e.target.value.length > 0) {
            this.setState({
                passwordInput: e.target.value,
                passwordLength: "password too short"
            });
        } else {
            this.setState({
                passwordInput: e.target.value,
                passwordLength: ""
            });
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        const newUser = {
            first_name: e.target[0].value,
            last_name: e.target[1].value,
            username: e.target[2].value,
            password: e.target[3].value,
            email: e.target[5].value
        }
        axios.post('http://localhost:8000/signup/', newUser).then(res => {
            console.log(res);
        })
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label>First Name:</label>
                        <br />
                        <input name="first_name" type="text" placeholder="First Name" required />
                    </div>
                    <div className="form-group">
                        <label>Last Name:</label>
                        <br />
                        <input name="last_name" type="text" placeholder="Last Name" required />
                    </div>
                    <div className="form-group">
                        <label>Username:</label>
                        <br />
                        <input name="user" type="text" placeholder="Username" required />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <br />
                        <input name="pw" onChange={this.handleChange} type="password" placeholder="Password" required />
                        <label>{this.state.passwordLength}</label>
                    </div>
                    <div className="form-group">
                        <label>Repeat password:</label>
                        <br />
                        <input name="repeat_pw" type="password" placeholder="Repeat password" required />
                    </div>
                    <div className="form-group">
                        <label>E-mail address:</label>
                        <br />
                        <input name="email-addr" type="e-mail address" placeholder="e-mail address" required />
                    </div>
                    <button>
                        Submit
                    </button>
                </form>
            </div>
        );
    }

}

export default SignUp;