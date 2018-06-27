import React from 'react';
import axios from 'axios';
import Pagination from 'react-js-pagination';
import { withRouter } from 'react-router-dom';
import styles from './forum.css';
import jwt_decode from 'jwt-decode';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

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
  }

  redirectToLogin = () => {
    this.props.history.push('/login');
  }

  componentDidMount() {
    axios.defaults.headers['Authorization'] = 'JWT ' + localStorage.getItem('jwtToken');
    axios.get("http://localhost:8000/posts/").then(res => {
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
    axios.post("http://localhost:8000/posts/", newPost).then(res => {
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

  render() {
    TimeAgo.locale(en);
    const timeAgo = new TimeAgo('en-US');
    return (
      <div>
        Post Title:
        <input
          id="new-post"
          onChange={this.handleChange}
          value={this.state.text}
        />
        <br />
        <br />
        Post Text:
        <input
          id="new-text"
          onChange={this.handleChange2}
          value={this.state.text}
        />
        <button className='btn-danger' onClick={this.handleClick}>
          {'Add new post'}
        </button>
        <div>
          {this.state.postsList.slice(this.state.first_post, this.state.last_post).map(function (post, index) {
            return (
              <div key={index} >
                <header className={styles.head}>
                  <h2 className={styles.topic}>{post.post_title}</h2>
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
      </div>
    );
  }
}

export default withRouter(Forum);
