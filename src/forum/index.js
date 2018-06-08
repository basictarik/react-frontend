import React from 'react';
import axios from 'axios';
import Pagination from 'react-js-pagination';

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
  }

  componentDidMount() {
    console.log(localStorage.getItem('jwtToken'));
    axios.defaults.headers['Authorization'] = 'JWT ' + localStorage.getItem('jwtToken');
    axios.get("http://localhost:8000/posts/").then(res => {
      this.setState({
        postsList: res.data
      })
    })
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
    const newPost = {
      post_title: this.state.inputPostTitle,
      post_text: this.state.inputPostText
    };
    axios.post("http://localhost:8000/posts/", newPost).then(res => {
      const newPost = {
        post_title: res.data.post_title,
        post_text: res.data.post_text,
        date_posted: new Date().toISOString()
      };
      this.setState(prevState => ({
        postsList: prevState.postsList.concat(newPost)
      }))
    })
  };

  render() {
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
          {this.state.counter}
        </button>
        <div>
          <ul>
            {this.state.postsList.slice(this.state.first_post, this.state.last_post).map(function (post, index) {
              return (
                <li key={index}>
                  <h3>{post.post_title}</h3>
                  <p>{post.post_text}</p>
                  <p>{post.date_posted}</p>
                </li>
              )
            }
            )}
          </ul>
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

export default Forum;
