import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import NavigationBar from './navbar';

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
          <NavigationBar />
        </BrowserRouter>
      </div >
    );
  }
}

ReactDOM.render(<Home />, document.getElementById('root'));
