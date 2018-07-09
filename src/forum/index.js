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
      counter: 1,
      postsList: [],
      inputPostTitle: "",
      inputPostText: "",
      posts_per_page: 5,
      activePage: 1,
      last_post: 5,
      first_post: 0
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
    axios.defaults.headers['Authorization'] = 'JWT ' + localStorage.getItem('jwtToken');
    axios.get("http://192.168.131.72:8000/posts/").then(res => {
      this.setState({
        postsList: res.data
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
    this.setState({
      activePage: pageNumber,
      last_post: this.state.posts_per_page * pageNumber,
      first_post: this.state.posts_per_page * pageNumber - this.state.posts_per_page
    });
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
      const newPost = {
        post_title: res.data.post_title,
        post_text: res.data.post_text,
        original_poster: res.data.original_poster,
        date_posted: new Date().toISOString(),
      };
      this.setState(prevState => ({
        postsList: prevState.postsList.concat(newPost)
      }))
    })
  };

  filterPosts = (e) => {
    var queryUrl = 'http://192.168.131.72:8000/posts/';
    var filterValue = $('#user-filter').val();
    if (filterValue) {
      queryUrl = queryUrl + "?original_poster=" + filterValue;
    }
    axios.get(queryUrl).then(res => {
      this.setState({
        postsList: res.data,
        activePage: 1,
        last_post: this.state.posts_per_page,
        first_post: this.state.posts_per_page - this.state.posts_per_page
      })
    })
  };

  deletePost = (id) => {
    var url = 'http://192.168.131.72:8000/posts/' + id;
    axios.delete(url).then(res => {
      axios.defaults.headers['Authorization'] = 'JWT ' + localStorage.getItem('jwtToken');
    axios.get("http://192.168.131.72:8000/posts/").then(res => {
      this.setState({
        postsList: res.data,
        activePage: 1,
        last_post: this.state.posts_per_page,
        first_post: this.state.posts_per_page - this.state.posts_per_page
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
          {this.state.postsList.slice(this.state.first_post, this.state.last_post).map((post, index) => {
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
            totalItemsCount={this.state.postsList.length}
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
