import React from 'react';
import ReactPasswordStrength from 'react-password-strength';

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
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label>First Name:</label>
                        <br />
                        <input type="text" placeholder="First Name" required />
                    </div>
                    <div className="form-group">
                        <label>Last Name:</label>
                        <br />
                        <input type="text" placeholder="Last Name" required />
                    </div>
                    <div className="form-group">
                        <label>Username:</label>
                        <br />
                        <input type="text" placeholder="Username" required />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <br />
                        <input onChange={this.handleChange} type="password" placeholder="Password" required />
                        <label>{this.state.passwordLength}</label>
                    </div>
                    <div className="form-group">
                        <label>Repeat password:</label>
                        <br />
                        <input type="password" placeholder="Repeat password" required />
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