import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import NavigationBar from './navbar';

class Home extends React.Component {

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
