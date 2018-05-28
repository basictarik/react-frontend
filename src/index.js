import React from 'react';
import ReactDOM from 'react-dom';
import { Route, NavLink, HashRouter } from "react-router-dom";
import Login from '../src/login/index';
import SignUp from '../src/signup/index';
import Forum from '../src/forum/index';

class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <HashRouter>
          <div>
            <NavLink to="/login">Login</NavLink>
            <br />
            <NavLink to="/signup">SignUp</NavLink>
            <br />
            <NavLink to="/forum">Forum</NavLink>
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/forum" component={Forum} />
          </div>
        </HashRouter>
      </div>
    );
  }
}

ReactDOM.render(<Home />, document.getElementById('root'));
