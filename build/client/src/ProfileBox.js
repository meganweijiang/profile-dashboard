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

    this.loadProfilesFromServer = () => {
      fetch('/api/profiles').then(data => data.json()).then(res => {
        if (!res.success) this.setState({ error: res.error });else this.setState({ data: res.data });
      });
    };

    this.onChangeText = e => {
      const { name, description } = this.state;
      if (e.target.name === 'name') this.setState({ name: e.target.value });else this.setState({ description: e.target.value });
    };

    this.onUpdateProfile = id => {
      const oldProfile = this.state.data.find(c => c._id === id);
      if (!oldProfile) return;
      window.scrollTo(0, this.myRef);
      this.setState({
        name: oldProfile.name,
        description: oldProfile.description,
        pictureURL: oldProfile.pictureURL,
        updateId: id
      });
    };

    this.submitProfile = e => {
      e.preventDefault();
      const { name, description, updateId, pictureURL } = this.state;
      if (!name || !description || !pictureURL) return;
      if (updateId) {
        this.submitUpdatedProfile();
      } else {
        this.submitNewProfile();
      }
    };

    this.submitNewProfile = () => {
      const { name, description, pictureURL } = this.state;
      const data = [this.state.data, {
        name,
        description,
        pictureURL,
        _id: Date.now().toString(),
        updatedAt: new Date(),
        createdAt: new Date()
      }];
      this.setState({ data });
      fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, pictureURL })
      }).then(res => res.json()).then(res => {
        if (!res.success) this.setState({ error: res.error.message || res.error });else this.setState({ name: '', description: '', pictureURL: '', error: null });
      });
    };

    this.submitUpdatedProfile = () => {
      const { name, description, pictureURL, updateId } = this.state;
      fetch(`/api/profiles/${updateId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', "Accept": "application/json" },
        body: JSON.stringify({ name, description, pictureURL })
      }).then(res => res.json()).then(res => {
        if (!res.success) this.setState({ error: res.error.message || res.error });else this.setState({ name: '', description: '', pictureURL: '', updateId: null });
      });
    };

    this.fileSelectedHandler = event => {
      this.setState({
        selectedFile: event.target.files[0]
      }, function () {
        console.log(this.state.selectedFile);
      });
    };

    this.fileUploadHandler = () => {
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
      }).then(res => {
        console.log(res.data.url);
        this.setState({
          pictureURL: res.data.url
        });
      }).catch(function (err) {
        console.log(err);
      });
    };

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
  }

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

  render() {
    return React.createElement(
      'div',
      { className: 'container' },
      React.createElement(
        'div',
        { className: 'title' },
        React.createElement(
          'h1',
          null,
          'Profile Dashboard'
        ),
        React.createElement(
          'h2',
          null,
          'A guestbook of profiles'
        )
      ),
      React.createElement(
        'div',
        { className: 'form' },
        React.createElement(ProfileForm, { name: this.state.name, description: this.state.description, selectedFile: this.state.selectedFile, pictureURL: this.state.pictureURL, handleChangeText: this.onChangeText,
          handleSubmit: this.submitProfile, fileSelectedHandler: this.fileSelectedHandler, fileUploadHandler: this.fileUploadHandler })
      ),
      React.createElement(
        'div',
        { className: 'profiles' },
        React.createElement(
          'div',
          { id: 'profiletitle' },
          React.createElement(
            'h2',
            null,
            'Profiles'
          )
        ),
        React.createElement(ProfileList, { data: this.state.data, handleUpdateProfile: this.onUpdateProfile })
      ),
      this.state.error && React.createElement(
        'p',
        null,
        this.state.error
      )
    );
  }
}

export default ProfileBox;