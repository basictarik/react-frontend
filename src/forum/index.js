import React from 'react';
import axios from 'axios';
import Pagination from 'react-js-pagination';
import { withRouter, NavLink, Route } from 'react-router-dom';
import styles from './forum.css';
import jwt_decode from 'jwt-decode';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import Post from './post';
import $ from 'jquery';

class Forum extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postsList: [],
      inputPostTitle: "",
      inputPostText: "",
      posts_per_page: 5,
      activePage: 1,
      numberOfPosts: 1,
      filter: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.redirectToLogin = this.redirectToLogin.bind(this);
    this.filterPosts = this.filterPosts.bind(this);
    
  }

  redirectToLogin = () => {
    this.props.history.push('/login');
  }

  componentDidMount() {
    var query = 'http://192.168.131.72:8000/posts/?page=' + this.state.activePage;
    axios.defaults.headers['Authorization'] = 'JWT ' + localStorage.getItem('jwtToken');
    axios.get(query).then(res => {
      this.props.history.push('/posts/?page=' + this.state.activePage)
      this.setState({
        postsList: res.data.allPosts,
        numberOfPosts: res.data.numberOfPosts
      })
    }).catch(function (error) {
      if (error.response.status === 401) {
        this.props.history.push('/error_401');
        setTimeout(this.redirectToLogin, 5000);
      }
    }.bind(this)
    )
  }

  handlePageChange(pageNumber) {
    var query = 'http://192.168.131.72:8000/posts/?page=' + pageNumber;
    var filterValue = $('#user-filter').val();
    if (filterValue && this.state.filter) {
      query = query + "&original_poster=" + filterValue;
    }
    axios.get(query).then(res => {
      this.props.history.push('/posts/?page=' + pageNumber)
      this.setState({
        postsList: res.data.allPosts,
        activePage: pageNumber
      });
    })
  }

  handleChange(e) {
    this.setState({ inputPostTitle: e.target.value });
  }

  handleChange2(e) {
    this.setState({ inputPostText: e.target.value });
  }

  handleClick(e) {
    e.preventDefault();
    if (!this.state.inputPostTitle.length) {
      return;
    }
    const user_information = jwt_decode(localStorage.getItem('jwtToken'));

    const newPost = {
      post_title: this.state.inputPostTitle,
      post_text: this.state.inputPostText,
      original_poster: user_information.username,
    };
    axios.post("http://192.168.131.72:8000/posts/", newPost).then(res => {
      var query = 'http://192.168.131.72:8000/posts/?page=' + this.state.activePage;
      var filterValue = $('#user-filter').val();
      if (this.state.filter && filterValue) {
        query = query + '&original_poster=' + filterValue;
      }
      axios.get(query).then(res => {
        this.setState({
          postsList: res.data.allPosts,
          numberOfPosts: res.data.numberOfPosts
        })
      })
      
    })
  };

  filterPosts = (e) => {
    var query = 'http://192.168.131.72:8000/posts/?page=1';
    var filterValue = $('#user-filter').val();
    var filterOn = true;
    if (filterValue) {
      query = query + "&original_poster=" + filterValue;
    } else {
      filterOn = false;
    }
    axios.get(query).then(res => {
      this.setState({
        postsList: res.data.allPosts,
        numberOfPosts: res.data.numberOfPosts,
        activePage: 1,
        filter: filterOn
      })
    })
  };

  deletePost = (id) => {
    var url = 'http://192.168.131.72:8000/posts/' + id;
    axios.delete(url).then(res => {
      axios.defaults.headers['Authorization'] = 'JWT ' + localStorage.getItem('jwtToken');
      axios.get("http://192.168.131.72:8000/posts/?page=" + this.state.activePage).then(res => {
      this.setState({
        postsList: res.data,
        activePage: 1,
      })
    }).catch(function (error) {
      if (error.response.status === 401) {
        this.props.history.push('/error_401');
        setTimeout(this.redirectToLogin, 5000);
      }
    }.bind(this)
    )
    })
  }

  render() {
    const match = this.props.match.path;
    TimeAgo.locale(en);
    const timeAgo = new TimeAgo('en-US');
    return (
      <div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignContent: 'space-between' }}>
          <div style={{ width: '50%' }}>
            Post Title:
        <input id="new-post" onChange={this.handleChange} value={this.state.text} />
            <br />
            <br />
            Post Text:
        <input id="new-text" onChange={this.handleChange2} value={this.state.text} />
            <button className='btn-danger' onClick={this.handleClick}>
              {'Add new post'}
            </button>
          </div>
          <div style={{ width: '50%' }}>
            Username:
            <input id="user-filter" value={this.state.text} />
            <button className='btn.danger' onClick={this.filterPosts}>
              {'Filter Posts'}
            </button>
          </div>
        </div>
        <div>
          {this.state.postsList.map((post, index) => {
            return (
              <div key={index} >
                <header className={styles.head}>
                  <NavLink to={"/posts/" + post.id}>
                    <h2 className={styles.topic}>{post.post_title}</h2>
                  </NavLink>
                  <button onClick={() => {this.deletePost(post.id)}}>{'Delete'}</button>
                  <p>{"Posted by "} <span style={{ fontStyle: 'italic' }}>{post.original_poster + " " + timeAgo.format(Date.parse(post.date_posted))}</span></p>
                </header>
                <p>{post.post_text}</p>
              </div>
            )
          }
          )}
        </div>
        <div>
          <Pagination
            activePage={this.state.activePage}
            itemsCountPerPage={this.state.posts_per_page}
            totalItemsCount={this.state.numberOfPosts}
            pageRangeDisplayed={5}
            onChange={this.handlePageChange}
          />
        </div>
        <Route path={`${match}/:id`} component={Post} />
      </div>
    );
  }
}

export default withRouter(Forum);
