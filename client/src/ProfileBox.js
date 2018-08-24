import React, { Component } from 'react';
import ProfileList from './ProfileList';
import ProfileForm from './ProfileForm';
import 'whatwg-fetch';
import './ProfileBox.css';
import axios from 'axios';

class ProfileBox extends Component {
  constructor() {
    super();
    this.state = { 
      data: [],     
      error: null,
      name: '',
      description: '',
      selectedFile: null
    };
    this.pollInterval = null;
  };

  fileSelectedHandler = event => {
    this.setState({
      selectedFile: event.target.files[0]
    })
  }

  fileUploadHandler = () => {
    
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

  loadProfilesFromServer = () => {
    fetch('/api/profiles')
      .then(data => data.json())
      .then((res) => {
        if (!res.success) this.setState({ error: res.error });
        else this.setState({ data: res.data });
      });
  }

  onChangeText = (e) => {
    const newState = { ...this.state };
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  }

  onUpdateProfile = (id) => {
    const oldProfile = this.state.data.find(c => c._id === id);
    if (!oldProfile) return;
    this.setState({
        name: oldProfile.name,
        description: oldProfile.description,
        updateId: id
    });
  }

  submitProfile = (e) => {
    e.preventDefault();
    const { name, description, updateId } = this.state;
    if (!name || !description) return;
    if (updateId) {
      this.submitUpdatedProfile();
    } else {
      this.submitNewProfile();
    }
  }

  submitNewProfile = () => {
    const { name, description } = this.state;
    const data = [
        ...this.state.data,
        {
          name,
          description,
          _id: Date.now().toString(),
          updatedAt: new Date(),
          createdAt: new Date()
        },
    ];
    this.setState({ data });
    fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
    }).then(res => res.json()).then((res) => {
        if (!res.success) this.setState({ error: res.error.message || res.error });
        else this.setState({ author: '', text: '', error: null });
    });
  }

  submitUpdatedProfile = () => {
    const { name, description, updateId } = this.state;
    fetch(`/api/profiles/${updateId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', "Accept": "application/json" },
      body: JSON.stringify({ name, description }),
    }).then(res => res.json()).then((res) => {
      if (!res.success) this.setState({ error: res.error.message || res.error });
      else this.setState({ name: '', description: '', updateId: null });
    });
  }

  render() {
    return (
      <div className="container">
        <h1>Profile Dashboard</h1>
        <h2>A guestbook of profiles</h2>
        <div className="form">
          <ProfileForm name={this.state.name} description={this.state.description} handleChangeText={this.onChangeText}
      handleSubmit={this.submitProfile}/>
          <input type="file" onChange={this.fileSelectedHandler}/>
        </div>
        <div className="profiles">
          <h2>Profiles:</h2>
          <ProfileList data={this.state.data} handleUpdateProfile={this.onUpdateProfile}/>
        </div>
        {this.state.error && <p>{this.state.error}</p>}
      </div>
    );
  }
}

export default ProfileBox;