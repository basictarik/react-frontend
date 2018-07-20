import React from 'react';
import axios from 'axios';


class UserProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            first_name: "",
            last_name: "",
            profile_pic: "",
            selected_file: ""
        }
    }

    componentDidMount() {
        var username = this.props.match.params.profilename;
        console.log(username);
        axios.get('http://192.168.131.72:8000/profiles/' + username).then(res => {
            console.log(res.data.first_name);
            console.log(res.data.last_name);
            console.log(res.data.profile_image);
            this.setState({
                first_name: res.data.first_name,
                last_name: res.data.last_name,
                profile_pic: res.data.profile_image
            });
        })
        
    }

    selectedFileHandler = (event) => {
        this.setState({
            selected_file: event.target.files[0]
        });
    }

    fileUploadHandler = () => {
        axios.put('http://192.168.131.72:8000/')
    }

    render() {
        return (
            <div>
                <input type="file" onChange={this.selectedFileHandler} />
                <button onClick={this.fileUploadHandler}>Upload</button>
                <h1>{'Ovo je profil cim rijesim backend ' + this.props.match.params.profilename}</h1>
                <img alt="" src={ 'http://192.168.131.72:8000/media/images/no-image.jpg' } height="100" width="100" />
            </div>
        )
    }


}

export default UserProfile;