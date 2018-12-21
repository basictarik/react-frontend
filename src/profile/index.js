import React from 'react';
import axios from 'axios';


class UserProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            first_name: "",
            last_name: "",
            profile_image: "Blank.jpg",
            selected_file: null
        }
    }

    componentDidMount() {
        var username = this.props.match.params.profilename;
        axios.get('localhost:8000/profiles/' + username).then(res => {
            this.setState({
                first_name: res.data.first_name,
                last_name: res.data.last_name,
                profile_image: res.data.profile_image
            });
        });
    }

    selectedFileHandler = (event) => {
        var image = event.target.files[0];
        this.setState({
            selected_file: image
        });
    }

    fileUploadHandler = () => {
        var username = this.props.match.params.profilename;
        const fd = new FormData();
        const config = { headers: { 'Content-Type': 'multipart/form-data' } };
        fd.append('image', this.state.selected_file, this.state.selected_file.name)
        const profileInformation = {
            profile_image: this.state.selected_file.name
        }
        var url = 'localhost:8000/profiles/' + username + '/image_upload';
        axios.post(url, fd, config).then(res => {
            axios.patch('localhost:8000/profiles/' + username + '/profile_update', profileInformation).then(response => {
                this.setState({
                    profile_image: profileInformation.profile_image
                });
            });
        });
    }

    render() {
        return (
            <div>
                <input type="file" onChange={this.selectedFileHandler} />
                <button onClick={this.fileUploadHandler}>Upload</button>
                <h1>{'Profile- ' + this.props.match.params.profilename}</h1>
                <img alt="" src={ 'localhost:8000/media/images/' + this.state.profile_image} height="100" width="100" />
            </div>
        )
    }

}

export default UserProfile;