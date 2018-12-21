import React from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { withRouter, NavLink } from 'react-router-dom';
import styles from './forum.css';
import jwt_decode from 'jwt-decode';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import $ from 'jquery';
import qs from 'query-string';

class Forum extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postsList: [],
      inputPostTitle: "",
      inputPostText: "",
      posts_per_page: 5,
      activePage: qs.parse(this.props.location.search).page,
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
    var page = qs.parse(this.props.location.search).page;
    if (page == null) {
      page = 1;
    }
    var query = 'localhost:8000/posts/?page=' + page;
    axios.defaults.headers['Authorization'] = 'JWT ' + localStorage.getItem('jwtToken');
    axios.get(query).then(res => {
      this.setState({
        postsList: res.data.allPosts,
        numberOfPosts: res.data.numberOfPosts,
        activePage: page
      })
    }).catch(function (error) {
      if (error.response.status === 401) {
        this.props.history.push('/error_401');
        setTimeout(this.redirectToLogin, 5000);
      }
    }.bind(this)
    )
  }

  componentWillReceiveProps(nextProps) {
    var page = qs.parse(nextProps.location.search).page;
    if (page == null) {
      page = 1;
    }
    var query = 'localhost:8000/posts/?page=' + page;
    var filterValue = $('#user-filter').val();
    if (filterValue && this.state.filter) {
      query = query + "&original_poster=" + filterValue;
    }
    axios.defaults.headers['Authorization'] = 'JWT ' + localStorage.getItem('jwtToken');
    axios.get(query).then(res => {
      this.setState({
        postsList: res.data.allPosts,
        numberOfPosts: res.data.numberOfPosts,
        activePage: page
      })
    }).catch(function (error) {
      if (error.response.status === 401) {
        this.props.history.push('/error_401');
        setTimeout(this.redirectToLogin, 5000);
      }
    }.bind(this)
    )
  }

  handlePageChange(data) {
    var pageNumber = data.selected + 1;
    var query = 'localhost:8000/posts/?page=' + pageNumber;
    var filterValue = $('#user-filter').val();
    if (filterValue && this.state.filter) {
      query = query + "&original_poster=" + filterValue;
    }
    axios.get(query).then(res => {
      this.setState({
        postsList: res.data.allPosts,
        activePage: pageNumber
      });
      this.props.history.push('/posts/?page=' + pageNumber);
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
    axios.post("localhost:8000/posts/", newPost).then(res => {
      var query = 'localhost:8000/posts/?page=' + this.state.activePage;
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
    var query = 'localhost:8000/posts/?page=1';
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
        activePage: 0,
        filter: filterOn
      })
      this.props.history.push('/posts/?page=' + 1)
    })
  };

  deletePost = (id) => {
    var url = 'localhost:8000/posts/' + id;
    axios.delete(url).then(res => {
      axios.defaults.headers['Authorization'] = 'JWT ' + localStorage.getItem('jwtToken');
      var query = 'localhost:8000/posts/?page=' + this.state.activePage;
      var filterValue = $('#user-filter').val();
      if (this.state.filter && filterValue) {
        query = query + '&original_poster=' + filterValue;
      }
      axios.get(query).then(res => {
        let returnOnePage = 0;
        if (res.data.allPosts.length === 0) {
          let op = "";
          if (this.state.filter) {
            op = '&original_poster=' + filterValue;
          }
          axios.get(`localhost:8000/posts/?page=${this.state.activePage - 1}${op}`).then(res => {
            this.props.history.push('/posts/?page=' + (this.state.activePage - 1));
            this.setState((prevState) => ({
              postsList: res.data.allPosts,
              numberOfPosts: res.data.numberOfPosts,
              activePage: prevState.activePage - 1
            }))
          })
        } else {
          this.props.history.push('/posts/?page=' + this.state.activePage);
          this.setState((prevState) => ({
            postsList: res.data.allPosts,
            numberOfPosts: res.data.numberOfPosts,
            activePage: prevState.activePage - returnOnePage
          }))
        }
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
    TimeAgo.locale(en);
    const timeAgo = new TimeAgo('en-US');
    var thePage = qs.parse(this.props.location.search).page;
    if (thePage == null) {
      thePage = 1;
    }
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
                  <button onClick={() => { this.deletePost(post.id) }}>{'Delete'}</button>
                  <p>{"Posted by "} <span style={{ fontStyle: 'italic' }}><NavLink to={"/profiles/" + post.original_poster}>{post.original_poster}</NavLink>{" " + timeAgo.format(Date.parse(post.date_posted))}</span></p>
                </header>
                <p>{post.post_text}</p>
              </div>
            )
          }
          )}
        </div>
        <ReactPaginate
          pageCount={Math.ceil(this.state.numberOfPosts / this.state.posts_per_page)}
          pageRangeDisplayed={5}
          marginPagesDisplayed={2}
          initialPage={thePage - 1}
          onPageChange={this.handlePageChange}
          disableInitialCallback={true}
          containerClassName={"pagination"}
          subContainerClassName={"pages pagination"}
          activeClassName={"active"}
          breakLabel={<a href="">...</a>}
          forcePage={thePage - 1}
        />
      </div>
    );
  }
}

export default withRouter(Forum);
