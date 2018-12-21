import React from 'react';
import axios from 'axios';
import styles from './post.css';

class Post extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            post_title : "",
            post_text : "",
            OP : ""
        }
    }

    componentDidMount() {
        const id = this.props.match.params.id;
        axios.defaults.headers['Authorization'] = 'JWT ' + localStorage.getItem('jwtToken');
        axios.get('localhost:8000/posts/' + id).then(res => {
            this.setState({
                post_text : res.data.post_text,
                post_title : res.data.post_title,
                OP : res.data.original_poster
            })
        })
    }

    render() {
        return (
            <div>
                <h1>{this.state.post_title}</h1>
                <h1 className={styles.body}>{this.state.post_text}</h1>
                <h1 className={styles.poster}>{this.state.OP}</h1>
            </div>
        )
    }
}

export default Post;