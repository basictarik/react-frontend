import React from 'react';
import { Route, NavLink } from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Home from '../Home/index';
import Login from '../login/index';
import SignUp from '../signup/index';
import Forum from '../forum/index';
import Post from '../forum/post';
import UserProfile from '../profile/index';
import ErrorPage401 from '../err_page/err_401';
import isTokenValid from '../utils/utils.js';

class NavigationBar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoggedIn: isTokenValid()
        }

        this.handler = this.handler.bind(this)
    }

    handleLogout = () => {
        if (localStorage.getItem('jwtToken')) {
            localStorage.removeItem('jwtToken')
            this.setState({
                isLoggedIn: false
            })
        }
    }

    handler = () => {
        this.setState({
            isLoggedIn: true
        })
    }

    render() {
        return (
            <div>
                <AppBar position='static' style={{ marginBottom: 20 }}>
                    <Toolbar>
                        <NavLink to="/" style={{ flex: 1 }}>
                            <Typography variant="title" color="inherit" >
                                My Site
                            </Typography>
                        </NavLink>
                        {this.state.isLoggedIn ? (
                            <div>
                                <NavLink to="/posts">
                                    <Button style={{ color: 'white', fontSize: 12, marginRight: 20 }}>Forum</Button>
                                </NavLink>
                                <NavLink to="/">
                                    <Button onClick={this.handleLogout} style={{ color: 'white', fontSize: 12, marginRight: 20 }}>Logout</Button>
                                </NavLink>
                            </div>
                        ) : (
                                <div>
                                    <NavLink to="/login">
                                        <Button style={{ color: 'white', fontSize: 12, marginRight: 20 }}>Login</Button>
                                    </NavLink>
                                    <NavLink to="/signup">
                                        <Button style={{ color: 'white', fontSize: 12, marginRight: 20 }}>SignUp</Button>
                                    </NavLink>
                                </div>
                            )
                        }
                    </Toolbar>
                </AppBar>
                <Route exact path="/login" render={() =>
                    <Login handler={this.handler} />
                } />
                <Route exact path="/signup" component={SignUp} />
                <Route exact path="/posts" render={() =>
                    <Forum handler={this.handler} />
                }>
                </Route>
                <Route path="/posts/:id" component={Post} />
                <Route exact path="/error_401" component={ErrorPage401} />
                <Route exact path="/profiles/:profilename" component={UserProfile} />
                <Route exact path="/" component={Home} />
            </div>
        )
    }
}

export default NavigationBar;
