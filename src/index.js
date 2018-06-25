import React from 'react';
import ReactDOM from 'react-dom';
import { Route, NavLink, BrowserRouter } from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Login from '../src/login/index';
import SignUp from '../src/signup/index';
import Forum from '../src/forum/index';

class Home extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: Boolean(localStorage.getItem('jwtToken'))
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
    console.log(this.isLoggedIn);
    this.setState({
      isLoggedIn: true
    })
  }

  render() {
    return (
      <div>
        <BrowserRouter>
          <div>
            <AppBar position='static' style={{ marginBottom: 20 }}>
              <Toolbar>
                <Typography variant="title" color="inherit" style={{ flex: 1 }}>
                  My Site
                </Typography>
                {this.isLoggedIn ? (
                  <div>
                    <NavLink to="/forum">
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
              <Login handler = {this.handler} />
            }/>
            {/*component={Login}*/}  
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/forum" component={Forum}  />
          </div>
        </BrowserRouter >
      </div >
    );
  }
}

ReactDOM.render(<Home />, document.getElementById('root'));
