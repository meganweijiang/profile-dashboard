import React, { Component } from 'react';
import ProfileList from './ProfileList';
import ProfileForm from './ProfileForm';
import 'whatwg-fetch';
import './ProfileBox.css';
import axios from 'axios';

// Configurations for Cloudinary API
var CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dhcvymchj/upload';
var CLOUDINARY_UPLOAD_PRESET = 'w0kr9wl9';

class ProfileBox extends Component {
  constructor() {
    super();
    this.state = { 
      data: [],     
      error: null,
      name: '',
      description: '',
      selectedFile: null,
      pictureURL: ''
    };
    this.pollInterval = null;
    this.myRef = React.createRef();
  };

  componentDidMount() {
    this.loadProfilesFromServer();
    if (!this.pollInterval) {
      this.pollInterval = setInterval(this.loadProfilesFromServer, 2000);
    }
  }

  componentWillUnmount() {
    if (this.pollInterval) clearInterval(this.pollInterval);
    this.pollInterval = null;
  }

  loadProfilesFromServer = () => {
    fetch('/api/profiles')
      .then(data => data.json())
      .then((res) => {
        if (!res.success) this.setState({ error: res.error });
        else this.setState({ data: res.data });
      });
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
        this.state.data,
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
    }).then(res => res.json()).then((res) => {
        if (!res.success) this.setState({ error: res.error.message || res.error });
        else this.setState({ name: '', description: '', pictureURL: '', error: null });
    });
  }

  submitUpdatedProfile = () => {
    const { name, description, pictureURL, updateId } = this.state;
    fetch(`/api/profiles/${updateId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', "Accept": "application/json" },
      body: JSON.stringify({ name, description, pictureURL }),
    }).then(res => res.json()).then((res) => {
      if (!res.success) this.setState({ error: res.error.message || res.error });
      else this.setState({ name: '', description: '', pictureURL: '', updateId: null });
    });
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
    axios({
      url: CLOUDINARY_URL,
      method: 'POST',
      headers: {
        'Content-Type': 'application/X-WWW-form-urlencoded'
      },
      data: formData
    }).then((res) => {
      console.log(res.data.url);
      this.setState({
        pictureURL: res.data.url,
      })

    }).catch(function(err){
      console.log(err);
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