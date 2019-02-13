import React, { Component } from 'react';
import ProfileList from './ProfileList';
import ProfileForm from './ProfileForm';
import Facebook from './Facebook';
import socketIOClient from "socket.io-client";
import './ProfileBox.css';

// Configurations for Cloudinary API
var CLOUDINARY_URL = process.env.CLOUDINARY_URL;
var CLOUDINARY_UPLOAD_PRESET = process.env.CLOUDINARY_PRESET;

class ProfileBox extends Component {
  constructor() {
    super();
    this.state = { 
      data: [],     
      error: null,
      name: '',
      description: '',
      selectedFile: null,
      pictureURL: '',
      loggedIn: false
    };
    this.port = process.env.PORT || 3000;
    this.endpoint = `http://localhost:${port}`;
    this.myRef = React.createRef();
    this.socket = socketIOClient(this.state.endpoint);
  };

  componentDidMount() {
    this.socket.on("get_data", (data) => this.setState({ data }));
  }

  componentWillUnmount() {
    this.socket.off("get_data");
  }

  onChangeText = (e) => {
    if (e.target.name === 'name')
      this.setState({ name: e.target.value });
    else
      this.setState({ description: e.target.value });
  }

  onUpdateProfile = (id) => {
    const oldProfile = this.state.data.find(c => c._id === id);
    if (!oldProfile) return;
    window.scrollTo(0, this.myRef);
    this.setState({
        name: oldProfile.name,
        description: oldProfile.description,
        pictureURL: oldProfile.pictureURL,
        loggedIn: false,
        updateId: id
    });
  }

  submitProfile = (e) => {
    e.preventDefault();
    const { name, description, updateId, pictureURL } = this.state;
    if (!name || !description || !pictureURL) return;
    if (updateId) {
      this.submitUpdatedProfile();
    } else {
      this.submitNewProfile();
    }
  }

  submitNewProfile = () => {
    const { name, description, pictureURL } = this.state;
    const data = [
        ...this.state.data,
        {
          name,
          description,
          pictureURL,
          _id: Date.now().toString(),
          updatedAt: new Date(),
          createdAt: new Date()
        },
    ];
    this.setState({ data });
    fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, pictureURL }),
    })
    .then(res => res.json()).then((res) => {
      if (!res.success) this.setState({ error: res.error.message || res.error });
      else this.setState({ name: '', description: '', pictureURL: '', loggedIn: false, error: null });
    })
    .then(() => {
      this.socket.emit('data_changed', 1000);
    })
  }

  submitUpdatedProfile = () => {
    const { name, description, pictureURL, updateId } = this.state;
    fetch(`/api/profiles/${updateId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', "Accept": "application/json" },
      body: JSON.stringify({ name, description, pictureURL }),
    })
    .then(res => res.json()).then((res) => {
      if (!res.success) this.setState({ error: res.error.message || res.error });
      else this.setState({ name: '', description: '', pictureURL: '', loggedIn: false, updateId: null });
    })
    .then(() => {
      this.socket.emit('data_changed', 1000);
    })
  }

  fileSelectedHandler = event => {
    this.setState({
      selectedFile: event.target.files[0]
    }, function() {
      console.log(this.state.selectedFile);
    })
  }

  fileUploadHandler = () => {
    let formData = new FormData();
    formData.append('file', this.state.selectedFile);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    fetch({
      url: CLOUDINARY_URL,
      method: 'POST',
      headers: {
        'Content-Type': 'application/X-WWW-form-urlencoded'
      },
      data: formData
    })
    .then((res) => {
      console.log(res.data.url);
      this.setState({
        pictureURL: res.data.url,
      })
    })
    .catch(function(err){
      console.log(err);
    });
  }

  facebookLoginHandler = response => {
    this.setState({
      loggedIn: true,
      name: response.name,
      pictureURL: response.picture.data.url
    });
  }

  render() {
    return (
      <div className="container">
        <div className="title">
          <h1>Profile Dashboard</h1>
          <h2>A guestbook of profiles</h2>
        </div>
        <div className="form">
          <div id="facebook">
            {this.state.loggedIn ? <h3>You are logged in to Facebook.</h3> : <Facebook handleFacebookLogin={this.facebookLoginHandler} loggedIn={this.state.loggedIn}/>}
          </div>
          <ProfileForm name={this.state.name} description={this.state.description} selectedFile={this.state.selectedFile} pictureURL={this.state.pictureURL} handleChangeText={this.onChangeText}
      handleSubmit={this.submitProfile} fileSelectedHandler={this.fileSelectedHandler} fileUploadHandler={this.fileUploadHandler} />
        </div>
        <div className="profiles">
          <div id="profiletitle"><h2>Profiles</h2></div>
          <ProfileList data={this.state.data} handleUpdateProfile={this.onUpdateProfile}/>
        </div>
        {this.state.error && <p>{this.state.error}</p>}
      </div>
    );
  }
}

export default ProfileBox;